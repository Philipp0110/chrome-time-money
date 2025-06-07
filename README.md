# Time Money Chrome Extension

A Chrome extension that converts product prices into working hours, helping users understand the real time cost of purchases.

## Features

- Automatic price detection on websites
- Convert prices to working hours based on your income
- Support for different income input methods
- Clean, Apple-inspired design
- Dark/Light mode support

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
  ├── components/     # React components
  ├── content.tsx     # Content script for price detection
  ├── background.ts   # Background service worker
  ├── popup/         # Popup UI components
  └── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
