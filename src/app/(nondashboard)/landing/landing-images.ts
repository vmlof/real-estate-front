// Add files to public/landing/ and replace null with their public paths.
// Example: hero: "/landing/home.webp". Never use a filesystem path here.
export const landingImages: Record<string, string | null> = {
  hero: null,
  home: null,
  interior: null,
  neighborhoodMap: null,
  apartment: null,
  familyHome: null,
  retreat: null,
  budget: null,
  neighborhood: null,
  viewing: null,
  closing: null,
};

export type LandingImageSlot =
  | "hero"
  | "home"
  | "interior"
  | "neighborhoodMap"
  | "apartment"
  | "familyHome"
  | "retreat"
  | "budget"
  | "neighborhood"
  | "viewing"
  | "closing";
