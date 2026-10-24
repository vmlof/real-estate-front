import LandingVisual from "./LandingVisual";
import type { LandingImageSlot } from "./landing-images";
import styles from "./landing.module.css";

const inspiration: {
  slot: LandingImageSlot;
  title: string;
  description: string;
  alt: string;
}[] = [
  {
    slot: "apartment",
    title: "City apartment",
    description: "Modern living close to work, dining, and culture.",
    alt: "Sunlit apartment with a comfortable living area",
  },
  {
    slot: "familyHome",
    title: "Room to grow",
    description: "Extra space for new routines and big plans.",
    alt: "Spacious home with a garden and warm wood details",
  },
  {
    slot: "retreat",
    title: "A quieter retreat",
    description: "Peaceful settings to slow down and recharge.",
    alt: "Quiet courtyard with plants and lounge chairs",
  },
];

export default function DiscoverSection() {
  return (
    <section
      id="inspiration"
      className={styles.section}
      aria-labelledby="inspiration-heading"
    >
      <span className={styles.eyebrow}>MAKE YOURSELF AT HOME</span>
      <h2 id="inspiration-heading">Explore different ways to feel at home.</h2>
      <p className={styles.sectionIntro}>
        A little inspiration for your next chapter.
      </p>
      <div className={styles.inspirationGrid}>
        {inspiration.map((item) => (
          <article key={item.slot}>
            <div className={styles.inspirationPhoto}>
              <LandingVisual
                slot={item.slot}
                label={item.title}
                alt={item.alt}
                sizes="(max-width: 700px) 90vw, 30vw"
              />
              <span className={styles.inspirationBadge}>INSPIRATION</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
