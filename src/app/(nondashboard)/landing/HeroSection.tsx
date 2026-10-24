import { Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import type { SessionUser } from "@/lib/auth";
import LandingVisual from "./LandingVisual";
import styles from "./landing.module.css";

export default function HeroSection({ user }: { user: SessionUser | null }) {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroVisual}>
        <LandingVisual
          slot="hero"
          label="Your next chapter"
          alt="A contemporary home surrounded by trees in warm afternoon light"
          priority
          dark
          sizes="(max-width: 1440px) 100vw, 1440px"
        />
      </div>
      <div className={styles.heroShade} />
      <NavBar user={user} variant="landing" />
      <div className={styles.heroCopy}>
        <span className={styles.heroEyebrow}>A PLACE TO CALL YOUR OWN</span>
        <h1 id="hero-heading">
          Find your place.
          <br />
          Make it home.
        </h1>
        <p>Space for your routines, your people, and your next chapter.</p>
      </div>
      <div className={styles.searchPanel}>
        <div className={styles.searchHeading}>
          <h2>Find your next home</h2>
          <span className={styles.badge} id="search-status">
            Search coming soon
          </span>
        </div>
        <fieldset
          disabled
          aria-describedby="search-status"
          className={styles.searchFields}
        >
          <legend className={styles.srOnly}>
            Preview of future rental search filters
          </legend>
          <label>
            City or neighborhood
            <input placeholder="Enter a city or neighborhood" type="text" />
          </label>
          <label>
            Home type
            <select defaultValue="">
              <option value="">Any type</option>
            </select>
          </label>
          <label>
            Monthly budget
            <select defaultValue="">
              <option value="">Any budget</option>
            </select>
          </label>
          <label>
            Bedrooms
            <select defaultValue="">
              <option value="">Any number</option>
            </select>
          </label>
          <button type="button">
            <Search size={16} aria-hidden="true" /> Search rentals
          </button>
        </fieldset>
      </div>
    </section>
  );
}
