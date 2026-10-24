import Link from "next/link";
import { ChevronDown } from "lucide-react";
import styles from "./landing.module.css";

export default function FaqSection() {
  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.sectionHeading}>
        <h2 id="faq-heading">Frequently asked questions</h2>
        <p>
          A few things to know
          <br />
          before your next chapter.
        </p>
      </div>
      <div className={styles.faq}>
        <details open>
          <summary>
            What is Homely?
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>
            Homely is a rental housing project designed around finding a place
            that fits everyday life. Start with inspiration and practical
            guidance for your next move.
          </p>
        </details>
        <details>
          <summary>
            Can I search for homes yet?
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>
            Property search is coming soon. The homes shown here are
            inspiration, not available rental listings. In the meantime, explore
            our <a href="#rental-guide">rental guide</a> to plan your next move.
          </p>
        </details>
        <details>
          <summary>
            How can I access my account?
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <p>
            If you already have an account,{" "}
            <Link href="/login">log in to Homely</Link> to access your
            dashboard. Public account registration is not available yet.
          </p>
        </details>
      </div>
    </section>
  );
}
