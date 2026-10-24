import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { roleHome } from "@/lib/auth";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DiscoverSection from "./DiscoverSection";
import NeighborhoodSection from "./NeighborhoodSection";
import FaqSection from "./FaqSection";
import RentalGuide from "./RentalGuide";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Homely | A place to call your own",
  description:
    "Find inspiration for your next home. Explore different ways to live and prepare for your next move with Homely's rental guide.",
};

export default async function LandingPage() {
  const session = await getSession();
  const accountHref = session ? roleHome[session.user.role] : "/login";
  const accountLabel = session ? "Go to dashboard" : "Log in";

  return (
    <div className={styles.landing}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <div className={styles.page}>
        <HeroSection user={session?.user ?? null} />
        <main id="main-content" tabIndex={-1}>
          <FeaturesSection />
          <NeighborhoodSection />
          <DiscoverSection />
          <FaqSection />
          <RentalGuide />
          <CallToActionSection href={accountHref} label={accountLabel} />
        </main>
        <FooterSection href={accountHref} label={accountLabel} />
      </div>
    </div>
  );
}
