"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingVisual from "./LandingVisual";
import type { LandingImageSlot } from "./landing-images";
import styles from "./landing.module.css";

const slides: {
  label: string;
  title: string;
  description: string;
  tags: string[];
  slot: LandingImageSlot;
  alt: string;
}[] = [
  {
    label: "PLAN YOUR BUDGET",
    title: "Look beyond the monthly rent.",
    description:
      "Consider utilities, transport, and recurring fees when planning your monthly budget.",
    tags: ["Rent", "Utilities", "Transport"],
    slot: "budget",
    alt: "Notebook and calculator on a sunlit desk, ready to plan a move",
  },
  {
    label: "EXPLORE THE AREA",
    title: "Try the neighborhood on for size.",
    description:
      "Explore your commute, nearby essentials, and the area at different times of day.",
    tags: ["Commute", "Essentials", "Daily routine"],
    slot: "neighborhood",
    alt: "A leafy residential street with walkable sidewalks",
  },
  {
    label: "VIEW WITH PURPOSE",
    title: "Make every viewing count.",
    description:
      "Check natural light, storage, water pressure, and the condition of the space.",
    tags: ["Light", "Storage", "Condition"],
    slot: "viewing",
    alt: "Bright apartment with large windows and practical storage",
  },
];

export default function RentalGuide() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const move = (offset: number) =>
    setIndex((current) => (current + offset + slides.length) % slides.length);

  return (
    <section
      id="rental-guide"
      className={styles.section + " " + styles.guide}
      aria-labelledby="guide-heading"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <span className={styles.eyebrow}>THE RENTAL GUIDE</span>
      <h2 id="guide-heading">A smarter start to your next move.</h2>
      <p className={styles.sectionIntro}>
        Small checks that make a big difference.
      </p>
      <div className={styles.carousel}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={styles.arrow + " " + styles.previous}
          aria-label="Previous rental tip"
          aria-controls="rental-tip"
          onClick={() => move(-1)}
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <div
          id="rental-tip"
          className={styles.slide}
          role="group"
          aria-roledescription="slide"
          aria-label={index + 1 + " of " + slides.length}
        >
          <div className={styles.slidePhoto}>
            <LandingVisual
              slot={slide.slot}
              label={slide.label}
              alt={slide.alt}
              sizes="(max-width: 700px) 90vw, 45vw"
            />
          </div>
          <div className={styles.slideCopy}>
            <span className={styles.badge}>{slide.label}</span>
            <h3>{slide.title}</h3>
            <p>{slide.description}</p>
            <ul className={styles.tags}>
              {slide.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={styles.arrow + " " + styles.next}
          aria-label="Next rental tip"
          aria-controls="rental-tip"
          onClick={() => move(1)}
        >
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      <div className={styles.pagination}>
        <div role="group" aria-label="Choose a rental tip">
          {slides.map((item, itemIndex) => (
            <button
              key={item.title}
              type="button"
              aria-label={"Show tip " + (itemIndex + 1) + ": " + item.title}
              aria-current={itemIndex === index ? "true" : undefined}
              aria-controls="rental-tip"
              onClick={() => setIndex(itemIndex)}
            >
              <span />
            </button>
          ))}
        </div>
        <p aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">0{index + 1} / 03</span>
          <span className={styles.srOnly}>
            Tip {index + 1} of 3: {slide.title}
          </span>
        </p>
      </div>
    </section>
  );
}
