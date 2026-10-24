import { ArrowUpRight } from "lucide-react";
import LandingVisual from "./LandingVisual";
import styles from "./landing.module.css";

export default function NeighborhoodSection() {
  return (
    <section
      className={styles.section + " " + styles.neighborhood}
      aria-labelledby="neighborhood-heading"
    >
      <div className={styles.map}>
        <LandingVisual
          slot="neighborhoodMap"
          label="Neighborhood illustration"
          alt="An illustrative neighborhood map, not a real location"
          sizes="(max-width: 700px) 90vw, 45vw"
        />
      </div>
      <div className={styles.neighborhoodCopy}>
        <span className={styles.badge}>LOCATION INSPIRATION</span>
        <h2 id="neighborhood-heading">
          Start with
          <br />
          the neighborhood.
        </h2>
        <p>
          Think about your commute, nearby essentials, and the places that make
          daily life easier.
        </p>
        <a href="#rental-guide" className={styles.textLink}>
          Explore the rental guide <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
