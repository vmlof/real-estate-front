# Homely — revised landing direction

## Approved direction

All new interface copy is in English. The user's `prototipo_2.webp` is now the primary visual reference: architectural photography, white backgrounds, black typography, pale green accents, rounded panels, generous spacing, and an image-and-text carousel between the FAQ and closing banner. Earlier Portuguese concepts remain historical alternatives, not the current language direction.

The requested replacement concerns the carousel's content. Keep previous/next controls and pagination; remove testimonial portraits, quotes, names, review counts, ratings, and social-proof avatars. These are static visual prototypes, not an implemented interactive carousel.

## 01 — Lifestyle inspiration

Section title: **Find a home that fits your life.**

Section subtitle: Different spaces. Different ways to feel at home.

1. **Room for your everyday.** A quiet corner for focused mornings. A comfortable living area for everything after.
2. **Space to grow together.** Shared meals, slow weekends, and room for the people who matter.
3. **A little closer to calm.** A green view and an outdoor corner to make time for yourself.

Use photographs of a home-office nook, dining area, and balcony. This is the recommended direction: it preserves the original section's emotional role while focusing on the visitor's needs. Its limitation is that it supplies inspiration rather than concrete property information.

## 02 — Rental guidance

Section title: **A smarter start to your next move.**

Section subtitle: Small checks that make a big difference.

1. **Look beyond the monthly rent.** Consider utilities, transport, and recurring fees when planning your monthly budget.
2. **Try the neighborhood on for size.** Explore your commute, nearby essentials, and the area at different times of day.
3. **Make every viewing count.** Check natural light, storage, water pressure, and the condition of the space.

Use photographs of a simple planning desk, neighborhood street, and bright interior. This offers practical value without needing a property API. Keep the FAQ focused on the product so this advice does not duplicate it. These are general planning tips, not legal or financial recommendations.

## 03 — Space and design inspiration

Section title: **See the possibilities in every space.**

Section subtitle: A fresh perspective on feeling at home.

1. **Small space. More possibilities.** Flexible furniture and a thoughtful layout can make a compact room feel more useful.
2. **Let the light lead.** Notice how daylight moves through a room and imagine where your daily routines could fit.
3. **Bring the outside closer.** A balcony, a window, or a few plants can create a welcome pause in your day.

Use photographs of a compact living room, sunlit dining area, and planted balcony. This fits the architectural reference and avoids repeating the property catalog. It is less directly connected to choosing a rental than the first two options.

## Shared implementation guidance for a later phase

These concepts need only a small local content array and existing UI controls; Redux and backend endpoints are unnecessary for editorial slides. The current application and authentication remain unchanged. Do not infer new API routes from these designs.

A later implementation should keep manual controls, use accessible button names, support keyboard navigation and reduced motion, and stack image above text on mobile. The generated images do not verify those behaviors or actual contrast ratios. Use the existing project logo rather than treating a generated symbol as a new brand asset.

Property search, maps, and catalog content in a full-page concept are future features. Illustrative photos are not actual inventory. Avoid the reference's unsupported satisfaction statistics, customer reviews, prices, investment claims, and sign-up flow.

## Delivery and validation

- [Lifestyle carousel](03-slider-lifestyle.png): three slides about everyday living.
- [Rental guide carousel](04-slider-rental-guide.png): three slides about preparing for a rental.
- [Space inspiration carousel](05-slider-space-inspiration.png): three slides about making use of a home.
- [Full English landing concept](06-landing-english.png): the new reference direction with the lifestyle carousel in context.

Created with the built-in ImageGen tool, using the user's attached reference. The project structure and authentication boundaries were reviewed during the first prototype pass; this iteration only adds design artifacts and updates their documentation. No application source was changed and no runtime tests were run. The pre-existing change in the login page is outside this work.

Exact generation prompts are saved alongside the final images in `SLIDER-PROMPTS.md`.
