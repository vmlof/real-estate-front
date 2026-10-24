import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export default function FooterSection({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBrand}>
        <Link href="/" aria-label="Homely home">
          <Image src="/logo.svg" alt="" width={25} height={25} />
          HOMELY
        </Link>
        <p>A place to call your own.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="#home">Home</a>
        <a href="#inspiration">Inspiration</a>
        <Link href={href}>{label}</Link>
      </nav>
    </footer>
  );
}
