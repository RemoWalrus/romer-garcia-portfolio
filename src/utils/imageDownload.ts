import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Media } from "@capacitor-community/media";
import { toast } from "sonner";

const toBase64 = async (src: string): Promise<string> => {
  if (src.startsWith("data:")) return src.split(",")[1];
  const blob = await (await fetch(src)).blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/** Saves an image to Photos on native, or triggers a browser download on web. */
export const downloadImage = async (src: string, fileName: string) => {
  try {
    if (!src) return;

    if (Capacitor.isNativePlatform()) {
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: await toBase64(src),
        directory: Directory.Cache,
      });
      await Media.savePhoto({ path: savedFile.uri });
      toast.success("Saved to Photos");
      return;
    }

    const href = src.startsWith("data:") ? src : URL.createObjectURL(await (await fetch(src)).blob());
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (!src.startsWith("data:")) URL.revokeObjectURL(href);
    toast.success("Downloaded!");
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to save image");
  }
};
