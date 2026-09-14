import { useReverbFaq } from "@/hooks/use-reverb-faq";

/** Neon corridor backdrop, served from the public `images` bucket. */
const FAQ_BG_URL =
  "https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/images/reverb/faq-bg.webp";

/**
 * Visible, quotable Q&A block for the Reverb landing page.
 * Content comes from the Supabase `reverb_faq` table. The matching FAQPage
 * JSON-LD lives in the page's Helmet block (and in the pre-rendered HTML),
 * both driven by the same data.
 */
const ReverbFAQ = () => {
  const faq = useReverbFaq();

  if (!faq.length) return null;

  return (
    <section
      aria-labelledby="reverb-faq-title"
      className="reverb-noise relative isolate overflow-hidden border-t border-border bg-background py-10 transition-colors md:py-14"
    >
      <img
        src={faqBgAsset.url}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-[0.34] grayscale transition-opacity duration-500 dark:opacity-[0.46] dark:grayscale-0"
      />
      <div className="absolute inset-0 -z-10 bg-background/65 dark:bg-background/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-transparent to-background/[0.16] dark:to-background/[0.22]" />

      <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
        <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Reverb // Questions
        </p>
        <h2 id="reverb-faq-title" className="reverb-section-title mt-2">
          Frequently Asked
        </h2>

        <dl className="mt-8 grid gap-x-12 gap-y-8 md:mt-10 md:grid-cols-2">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-roc text-sm font-medium uppercase tracking-[0.08em] text-foreground md:text-base">
                {item.q}
              </dt>
              <dd className="mt-2 max-w-[62ch] font-roc text-sm leading-7 text-foreground/80">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default ReverbFAQ;
