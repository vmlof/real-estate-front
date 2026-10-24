# Landing page

## Scope and structure

The implemented page is `/landing`; `/` redirects there. The layout follows the approved English concept, with the **Rental guide** carousel instead of testimonials. All photography and the neighborhood illustration remain placeholders at the user's request. No generated photo is used in the application.

`src/app/(nondashboard)/landing/page.tsx` composes the existing hero, about, inspiration, closing banner and footer components, plus `NeighborhoodSection`, `FaqSection` and `RentalGuide`. The page reads the existing server session and passes only the public user to the navigation. Authenticated account links use the existing Manager/Tenant destination map.

The non-dashboard layout no longer inserts a fixed navigation and top offset: the landing hero owns the navigation placement. `NavBar` has an opt-in `landing` variant, while its default dashboard layout and account menu remain intact. No auth endpoint, token storage, cookie, Redux slice or RTK Query endpoint was changed.

## Why these choices

- **Server-rendered sections:** most of the page is content. Removing the former animation wrappers avoids sending unnecessary interactive code for static sections.
- **Local carousel state:** only the selected tip needs state. React `useState` is enough; Redux, an external carousel library and new APIs would add no value here. Previous/next buttons wrap through three tips, pagination selects a tip directly, and left/right keys work while focus is inside the carousel. A polite live region announces changes. There is no autoplay.
- **Native FAQ:** `details`/`summary` provides keyboard-operable disclosure without a new dependency. Multiple answers may stay open so visitors can compare them.
- **Scoped CSS:** `landing.module.css` keeps the sage/lime palette and responsive layout local, without changing dashboard theme tokens. Layouts adapt at 1050px and 700px; photos stack with text on narrow screens. Reduced-motion preferences disable transitions.
- **Existing components:** the navigation preserves its account menu, the carousel reuses the project's Button, and icons use the installed Lucide package.
- **Honest feature boundaries:** search controls are disabled and explicitly marked “Search coming soon”. Inspiration cards are not listings; the map is not live. FAQ and links explain the current scope instead of sending visitors to nonexistent business routes.

## Replacing placeholders

1. Put your image files in `public/landing/` (create that folder when adding the files).
2. In `src/app/(nondashboard)/landing/landing-images.ts`, replace a slot's `null` with a public URL such as `"/landing/home.webp"`. Do not include `public` or a Windows filesystem path in the URL.
3. Review the corresponding `alt` text in its section or in the `RentalGuide` slide data so it describes the actual selected photo. The closing banner's photo is decorative and uses empty alt text.

Slots: `hero`, `home`, `interior`, `neighborhoodMap`, `apartment`, `familyHome`, `retreat`, `budget`, `neighborhood`, `viewing`, and `closing`.

`LandingVisual` renders an accessible CSS placeholder when a slot is null and a `next/image` element when it contains a path. The containers reserve image space, use `object-fit: cover`, and specify responsive `sizes`. Only the hero is prioritized. Local image files avoid external image-host configuration and remote requests. A non-null path must point to a real file; missing files are not silently replaced.

Suggested dimensions: wide landscape photos of at least 1600px for hero/closing, and at least 800px for section/carousel photos. The layout crops to fit its containers; check the subject positioning in desktop and mobile after supplying the photos. These are guidelines, not required image dimensions.

## Validation and limitations

- `pnpm lint`: passes with two pre-existing unused-prop warnings in `src/components/FormField.tsx`.
- `pnpm exec tsc --noEmit`: passes. The first attempt could not write the TypeScript cache; rerunning with the required filesystem permission succeeded.
- `pnpm build`: passes.
- `pnpm test:smoke`: passed before the test files were removed, including the home redirect, public landing content, account destinations for both roles, and existing protected-route/session checks. Sessions were fixtures, not real ASP.NET logins. The user subsequently confirmed that the four test files should remain deleted. The final smoke command cannot run because `tests/smoke.mjs` no longer exists.
- `pnpm test:auth`: before removal, failed before executing tests because its environment did not configure `SECRET_KEY`. This was reproduced before the landing edits. The test file is now intentionally absent, and no authentication code was changed to work around the failure.
- Browser review: desktop (1440px), narrow tablet (710px), and mobile (390px); no horizontal overflow observed on desktop/mobile. Verified next, keyboard navigation, last-to-first wrapping, pagination selection, and FAQ expansion.
- No real backend login/refresh/logout validation was performed. Final imagery still requires a visual pass after replacement.

## Study references

The implementation uses the established project stack rather than introducing a new architecture. Useful official references for further study:

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
- [React useState](https://react.dev/reference/react/useState)
- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
- [WAI carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)

The approved visual concepts and copy are preserved in `design/landing-prototypes/`. Those files describe earlier concept stages; this document describes the implemented behavior.
