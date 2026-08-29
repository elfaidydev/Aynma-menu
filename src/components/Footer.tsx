import { ShineText } from "@/components/ShineText";
import { BRAND_TAGLINE } from "@/data/brand";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <ShineText as="h2" className="footer-logo">
            AYNMA
          </ShineText>
          <p className="footer-tagline">{BRAND_TAGLINE}</p>
        </div>
        <div className="footer-meta">
          <span>&copy; 2026 كوفي اينما</span>
          <span className="footer-sep">•</span>
          <span>تجربة قائمة رقمية فاخرة</span>
        </div>
      </div>
    </footer>
  );
}
