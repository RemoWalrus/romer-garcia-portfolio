import { Helmet } from 'react-helmet-async';

interface Project {
  title: string;
  description: string;
  category: string;
  hero_image_url: string;
  tech_stack?: string[];
  project_url?: string;
}

interface PersonSchemaProps {
  projects?: Project[];
}

export const PersonSchema = ({ projects = [] }: PersonSchemaProps) => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Romer Garcia",
    "url": "https://romergarcia.com",
    "image": "https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/profile/RomerSelfPortrait.jpg",
    "jobTitle": "Design Lead & Multimedia Designer",
    "description": "Strategic Thinker, Design Innovator, and Digital Media Leader with a proven track record of leading high-impact digital campaigns and brand transformations.",
    "alumniOf": {
      "@type": "Organization",
      "name": "United States Army"
    },
    "knowsAbout": [
      "AI-Assisted Design",
      "Multimedia Strategy",
      "Digital Media Production",
      "Brand Transformation",
      "Creative Direction",
      "UI/UX Design",
      "Motion Graphics",
      "Visual Storytelling"
    ],
    "sameAs": [],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://romergarcia.com"
    }
  };

  const projectSchemas = projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.hero_image_url,
    "creator": {
      "@type": "Person",
      "name": "Romer Garcia"
    },
    "keywords": [project.category, ...(project.tech_stack || [])].join(", "),
    "genre": project.category,
    ...(project.project_url ? { "url": project.project_url } : {})
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does Romer Garcia specialize in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Romer Garcia is a Design Lead and Multimedia Designer specializing in AI-assisted design, multimedia strategy, digital media production, and brand transformation. He has a proven track record leading high-impact digital campaigns."
        }
      },
      {
        "@type": "Question",
        "name": "What is Romer Garcia's professional background?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Romer Garcia is a U.S. Army veteran who transitioned into design leadership. He seamlessly blends strategy, creativity, and technology to craft compelling visual narratives for brands and organizations."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies and tools does Romer Garcia use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Romer Garcia works with AI-powered design tools, Adobe Creative Suite, Figma, React, TypeScript, motion graphics software, and emerging generative AI models to deliver cutting-edge digital experiences."
        }
      },
      {
        "@type": "Question",
        "name": "How can I work with Romer Garcia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can reach Romer Garcia through the contact form on his portfolio website at romergarcia.com. He is available for design leadership, multimedia production, brand strategy, and creative consulting projects."
        }
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Romer Garcia Portfolio",
    "url": "https://romergarcia.com",
    "description": "Portfolio of Romer Garcia — Design Lead, Multimedia Designer, and Digital Media Leader.",
    "author": {
      "@type": "Person",
      "name": "Romer Garcia"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      {projectSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export const ProjectCaseStudySchema = ({ project }: { project: Project }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.hero_image_url,
    "creator": {
      "@type": "Person",
      "name": "Romer Garcia",
      "url": "https://romergarcia.com"
    },
    "keywords": [project.category, ...(project.tech_stack || [])].join(", "),
    "genre": project.category
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
