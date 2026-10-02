import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Helmet } from 'react-helmet-async';
import { Move3D } from 'lucide-react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { getProxyUrl } from '@/utils/supabaseProxy';

type MotionPermission = 'automatic' | 'required' | 'denied';

interface PermissionedOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

const IMAGE_ASPECT = 1752 / 1920;
const PORTRAIT_URL = '/dualshadow.jpg';
const DEPTH_URL = '/dualshadow-depth.webp';
// Fixed light variant — the themed SVG resolves to dark fills on phones in
// light mode, but this scene is always dark.
const LOGO_URL = '/romergarcialogo-light.svg';

const vertexShader = /* glsl */ `
  uniform sampler2D uDepth;
  uniform vec2 uDepthTexel;
  uniform float uStrength;
  varying vec2 vUv;

  float smoothDepth(vec2 uv) {
    vec2 radius = uDepthTexel * 5.0;
    return texture2D(uDepth, uv).r * 0.28
      + texture2D(uDepth, uv + vec2(radius.x, 0.0)).r * 0.12
      + texture2D(uDepth, uv - vec2(radius.x, 0.0)).r * 0.12
      + texture2D(uDepth, uv + vec2(0.0, radius.y)).r * 0.12
      + texture2D(uDepth, uv - vec2(0.0, radius.y)).r * 0.12
      + texture2D(uDepth, uv + radius).r * 0.06
      + texture2D(uDepth, uv - radius).r * 0.06
      + texture2D(uDepth, uv + vec2(radius.x, -radius.y)).r * 0.06
      + texture2D(uDepth, uv + vec2(-radius.x, radius.y)).r * 0.06;
  }

  void main() {
    vUv = uv;
    float depth = smoothDepth(uv);
    vec3 displaced = position;
    displaced.z += (1.0 - depth) * uStrength;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform vec2 uDepthTexel;
  uniform vec2 uMotion;
  varying vec2 vUv;

  float smoothDepth(vec2 uv) {
    vec2 radius = uDepthTexel * 5.0;
    return texture2D(uDepth, uv).r * 0.28
      + texture2D(uDepth, uv + vec2(radius.x, 0.0)).r * 0.12
      + texture2D(uDepth, uv - vec2(radius.x, 0.0)).r * 0.12
      + texture2D(uDepth, uv + vec2(0.0, radius.y)).r * 0.12
      + texture2D(uDepth, uv - vec2(0.0, radius.y)).r * 0.12
      + texture2D(uDepth, uv + radius).r * 0.06
      + texture2D(uDepth, uv - radius).r * 0.06
      + texture2D(uDepth, uv + vec2(radius.x, -radius.y)).r * 0.06
      + texture2D(uDepth, uv + vec2(-radius.x, radius.y)).r * 0.06;
  }

  void main() {
    // Keep a small hidden border around the source so parallax never samples
    // the outermost texels and stretches them into jagged edge artifacts.
    vec2 safeUv = mix(vec2(0.035), vec2(0.965), vUv);
    float depth = smoothDepth(safeUv);
    float relief = (1.0 - depth) - 0.38;
    vec2 shiftedUv = clamp(safeUv + uMotion * relief * 0.021, 0.004, 0.996);
    gl_FragColor = texture2D(uImage, shiftedUv);
    #include <colorspace_fragment>
  }
`;

const DepthPortrait = ({ motion }: { motion: React.MutableRefObject<{ x: number; y: number }> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const current = useRef({ x: 0, y: 0 });
  const [image, depth] = useTexture([PORTRAIT_URL, DEPTH_URL]);
  const { viewport } = useThree();

  const scale = useMemo<[number, number, number]>(() => {
    const viewportAspect = viewport.width / viewport.height;
    const overscan = 1.16;
    return viewportAspect > IMAGE_ASPECT
      ? [viewport.width * overscan, (viewport.width / IMAGE_ASPECT) * overscan, 1]
      : [viewport.height * IMAGE_ASPECT * overscan, viewport.height * overscan, 1];
  }, [viewport.height, viewport.width]);

  const uniforms = useMemo(
    () => ({
      uImage: { value: image },
      uDepth: { value: depth },
      uDepthTexel: { value: new THREE.Vector2(1 / 700, 1 / 767) },
      uMotion: { value: new THREE.Vector2() },
      uStrength: { value: 0.34 },
    }),
    [depth, image],
  );

  useEffect(() => {
    image.colorSpace = THREE.SRGBColorSpace;
    image.anisotropy = 8;
    image.needsUpdate = true;
    depth.colorSpace = THREE.NoColorSpace;
    depth.minFilter = THREE.LinearFilter;
    depth.magFilter = THREE.LinearFilter;
    depth.needsUpdate = true;
  }, [depth, image]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const smoothing = 1 - Math.exp(-7 * dt);
    current.current.x += (motion.current.x - current.current.x) * smoothing;
    current.current.y += (motion.current.y - current.current.y) * smoothing;

    if (groupRef.current) {
      groupRef.current.rotation.y = current.current.x * 0.065;
      groupRef.current.rotation.x = -current.current.y * 0.05;
    }
    materialRef.current?.uniforms.uMotion.value.set(current.current.x, current.current.y);
  });

  return (
    <group ref={groupRef}>
      <mesh scale={scale}>
        <planeGeometry args={[1, 1, 160, 160]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const DepthEffect = () => {
  const motion = useRef({ x: 0, y: 0 });
  const baseline = useRef<{ beta: number; gamma: number }>();
  const [listening, setListening] = useState(false);
  const [permission, setPermission] = useState<MotionPermission>('automatic');

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      motion.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    const onPointerLeave = () => {
      motion.current = { x: 0, y: 0 };
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);

    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      const orientation = DeviceOrientationEvent as unknown as PermissionedOrientationEvent;
      if (typeof orientation.requestPermission === 'function') setPermission('required');
      else setListening(true);
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
    };
  }, []);

  useEffect(() => {
    if (!listening) return;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      if (!baseline.current) baseline.current = { beta: event.beta, gamma: event.gamma };
      const x = THREE.MathUtils.clamp((event.gamma - baseline.current.gamma) / 24, -1, 1);
      const y = THREE.MathUtils.clamp((event.beta - baseline.current.beta) / 28, -1, 1);
      motion.current = { x, y };
    };
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [listening]);

  const enableMotion = async () => {
    const orientation = DeviceOrientationEvent as unknown as PermissionedOrientationEvent;
    try {
      const result = await orientation.requestPermission?.();
      if (result === 'granted') {
        setPermission('automatic');
        setListening(true);
      } else setPermission('denied');
    } catch {
      setPermission('denied');
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      <Helmet>
        <title>Dual Shadows — Interactive 3D Portrait | Romer Garcia</title>
        <meta name="description" content="An interactive depth-mapped portrait by Romer Garcia, responding to cursor movement and mobile device tilt." />
        <link rel="canonical" href="https://romergarcia.com/3deffect" />
        <meta property="og:title" content="Dual Shadows — Interactive 3D Portrait" />
        <meta property="og:description" content="Explore an interactive depth-mapped portrait that responds to movement." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romergarcia.com/3deffect" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 100 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <DepthPortrait motion={motion} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[80vw] max-w-[960px] -translate-x-1/2 -translate-y-1/2">
        <img
          src={LOGO_URL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-auto w-full translate-x-[2px] opacity-45 mix-blend-screen brightness-0 saturate-[8] [filter:invert(16%)_sepia(98%)_saturate(5967%)_hue-rotate(357deg)_brightness(104%)_contrast(119%)]"
        />
        <img
          src={LOGO_URL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-auto w-full -translate-x-[2px] opacity-40 mix-blend-screen brightness-0 saturate-[8] [filter:invert(88%)_sepia(94%)_saturate(3263%)_hue-rotate(105deg)_brightness(106%)_contrast(104%)]"
        />
        <img
          src={LOGO_URL}
          alt="Romer Garcia"
          className="relative h-auto w-full [filter:drop-shadow(0_3px_5px_rgb(0_0_0_/_0.16))]"
        />
      </div>

      {permission === 'required' && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={enableMotion}
          className="fixed bottom-4 left-4 z-20 border-border bg-background/80 backdrop-blur-sm md:hidden"
          aria-label="Enable device motion"
          title="Enable device motion"
        >
          <Move3D className="h-5 w-5" />
        </Button>
      )}
    </main>
  );
};

export default DepthEffect;