import { REVERB_FAQ } from "../../../scripts/reverb-faq.mjs";

/**
 * Visible, quotable Q&A block for the Reverb landing page.
 * The matching FAQPage JSON-LD lives in the page's Helmet block (and in the
 * pre-rendered HTML), both driven by the same REVERB_FAQ data.
 */
const ReverbFAQ = () => (
  <section
    aria-labelledby="reverb-faq-title"
    className="reverb-noise border-t border-border bg-background py-10 transition-colors md:py-14"
  >
    <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
      <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Reverb // Questions
      </p>
      <h2 id="reverb-faq-title" className="reverb-section-title mt-2">
        Frequently Asked
      </h2>

      <dl className="mt-8 grid gap-x-12 gap-y-8 md:mt-10 md:grid-cols-2">
        {REVERB_FAQ.map((item) => (
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

export default ReverbFAQ;
