export const landingImages: Record<string, string | null> = {
  hero: "/landing/hero.jpg",
  home: "/landing/home.jpg",
  interior: "/landing/interior.jpg",
  neighborhoodMap: "/landing/neighborhood-map.png",
  apartment: "/landing/apartment.jpg",
  familyHome: "/landing/kitchen.jpg",
  retreat: "/landing/retreat.jpg",
  budget: "/landing/budget.jpg",
  neighborhood: "/landing/neighborhood.jpg",
  viewing: "/landing/viewing.jpg",
  closing: "/landing/closing.jpg",
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
