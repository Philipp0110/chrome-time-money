# Time Money Chrome Extension

A minimalist Chrome extension that converts product prices into required working time, aiming for an Apple-inspired design and automatic localization.

## Features

- Automatic price detection on websites with intelligent parsing (e.g., handling superscripts, various currency formats like `€ 3,69` and `3,69€`).
- Convert prices to working hours based on your income (hourly, weekly, monthly).
- Support for different income input methods, including weekly working hours.
- Clean, Apple-inspired UI (in Popup).
- Dark/Light mode support (in Popup).
- Efficient DOM observation and price processing to minimize performance impact.

## Technology Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Browser API:** Chrome Extension API (Manifest V3)
- **Build Tool:** Vite (`@samrum/vite-plugin-web-extension` for extension-specific bundling)
- **Core Logic:** Custom calculation engine for time conversion

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the extension:
   ```bash
   npm run build
   ```

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` directory from this project

## Project Structure

```
src/
  ├── components/          # Reusable React components (e.g., PriceBadge.tsx)
  │   └── PriceBadge.tsx
  ├── content.tsx          # Main content script for price detection and badge injection
  ├── content-entry.ts     # Entry point for content script (handles CSS import)
  ├── background.ts        # Background service worker for extension logic (e.g., settings initialization)
  └── popup/               # Components and assets for the extension popup
      ├── Popup.tsx        # Main React component for the popup UI
      ├── index.tsx        # Entry point for the popup's React rendering
      ├── popup.html       # HTML file for the extension popup
      └── index.css        # Tailwind CSS entry point for the popup

```

## Implemented Tasks & Progress

- [x] Initial project setup (package.json, manifest.json, README.md, basic source files).
- [x] Fix TypeScript errors (unused parameters, missing `chrome` types).
- [x] Ensure `manifest.json` and `icons` are copied to `dist`.
- [x] Resolve content script `import` errors (switched to `@samrum/vite-plugin-web-extension`).
- [x] Update `manifest.json` to reference source files (e.g., `src/content.tsx`, `src/popup/popup.html`).
- [x] Add post-build scripts to `package.json` to copy `popup.html` and `icons` to `dist`.
- [x] Implement income type selection and settings storage in `src/popup/Popup.tsx`.
- [x] Implement working time calculation in `src/components/PriceBadge.tsx`.
- [x] Apply Tailwind CSS classes for an Apple-inspired design in `src/popup/Popup.tsx`.
- [x] Add an `enabled` toggle in `src/popup/Popup.tsx` and initialize its state in `src/background.ts`.
- [x] Update `src/content.tsx` to read the `enabled` status and re-enable React rendering for `PriceBadge`.
- [x] Implement `MutationObserver` in `src/content.tsx` for more efficient DOM updates, addressing `HierarchyRequestError`.
- [x] Fix TypeScript error (`'calculateWorkingTime' is declared but its value is never read`).
- [x] Fix type error in `PriceBadge.tsx` (expecting `string` for `price` but receiving `number`; adjust `useEffect` to use `settings` from props).
- [x] Adjust `priceRegex` in `src/content.tsx` to handle superscripts and improve parsing logic for main prices (e.g., Amazon).
- [x] Introduce `processAmazonPriceElement` in `src/content.tsx` to specifically handle Amazon's fragmented price DOM structure, including exclusion rules.
- [x] Ensure working time is always displayed in "Tagen" (days) and add "Wochenarbeitszeit (Stunden)" input to `src/popup/Popup.tsx`.
- [x] Resolve linter error "Parameter 'result' implicitly has an 'any' type" in `src/popup/Popup.tsx`.
- [x] Enhance `priceRegex` to detect currency symbols before the price (e.g., `€ 3,69`) and handle `&nbsp;`.
- [x] Implement performance optimizations in `processAmazonPriceElement` and `processTextNode` (e.g., reusing React root, using `DocumentFragment`).

## Open Issues

- The UI/design (colors) are still not applied to the content script, despite efforts to inject CSS. (Note: This is a known issue but not being actively worked on based on user's last request).

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
