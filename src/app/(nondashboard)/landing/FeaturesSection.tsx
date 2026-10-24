import { ArrowUpRight } from "lucide-react";
import LandingVisual from "./LandingVisual";
import styles from "./landing.module.css";

export default function FeaturesSection() {
  return (
    <section
      id="about"
      className={styles.section + " " + styles.about}
      aria-labelledby="about-heading"
    >
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>MORE THAN AN ADDRESS</span>
          <h2 id="about-heading">A home that feels like you.</h2>
        </div>
        <p>
          The best place to live is the one
          <br className={styles.desktopBreak} /> that fits the way you live.
        </p>
      </div>
      <div className={styles.collage}>
        <div className={styles.collageMain}>
          <LandingVisual
            slot="home"
            label="A home that feels like you"
            alt="A welcoming home opening onto a green garden"
            sizes="(max-width: 700px) 90vw, 45vw"
          />
        </div>
        <div className={styles.collageCopy}>
          <span className={styles.eyebrow}>MADE FOR REAL LIFE</span>
          <h3>
            More room for
            <br />
            everyday life.
          </h3>
          <p>Think beyond the floor plan. Imagine how you want to live.</p>
          <a href="#rental-guide" className={styles.textLink}>
            A little guidance <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.collageSide}>
          <LandingVisual
            slot="interior"
            label="Everyday comfort"
            alt="A bright, welcoming living room with natural wood and greenery"
            sizes="(max-width: 700px) 45vw, 24vw"
          />
        </div>
      </div>
      <div className={styles.values}>
        <div>
          <h3>Your neighborhood</h3>
          <p>
            Be close to the places
            <br />
            that matter most.
          </p>
        </div>
        <div>
          <h3>Your space</h3>
          <p>
            Find a home that fits
            <br />
            your lifestyle.
          </p>
        </div>
        <div>
          <h3>Your budget</h3>
          <p>
            Make room for where you are
            <br />
            and where you’re headed.
          </p>
        </div>
      </div>
    </section>
  );
}
