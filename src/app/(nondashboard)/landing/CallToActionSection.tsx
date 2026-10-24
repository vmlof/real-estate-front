import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LandingVisual from "./LandingVisual";
import styles from "./landing.module.css";

export default function CallToActionSection({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <section className={styles.cta} aria-labelledby="cta-heading">
      <LandingVisual
        slot="closing"
        label="A place to call your own"
        alt=""
        dark
        sizes="(max-width: 1440px) 100vw, 1440px"
      />
      <div className={styles.ctaShade} />
      <div className={styles.ctaCopy}>
        <span className={styles.heroEyebrow}>HERE’S TO WHAT COMES NEXT</span>
        <h2 id="cta-heading">
          Your next chapter
          <br />
          starts at home.
        </h2>
        <Link href={href}>
          {label}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
