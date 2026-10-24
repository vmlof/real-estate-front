import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { landingImages, type LandingImageSlot } from "./landing-images";
import styles from "./landing.module.css";

export default function LandingVisual({
  slot,
  label,
  alt,
  sizes,
  priority = false,
  dark = false,
}: {
  slot: LandingImageSlot;
  label: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  dark?: boolean;
}) {
  const src = landingImages[slot];
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={styles.photo}
      />
    );
  }
  return (
    <div
      className={
        styles.placeholder + (dark ? " " + styles.placeholderDark : "")
      }
      role="img"
      aria-label={label + " — image placeholder"}
    >
      <ImageIcon size={30} strokeWidth={1} aria-hidden="true" />
      <span>{label}</span>
      <span className={styles.placeholderNote}>IMAGE PLACEHOLDER</span>
    </div>
  );
}
