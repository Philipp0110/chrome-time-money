# Time Money Chrome Extension - Project Plan

## Project Overview
A Chrome extension that converts product prices into working hours, helping users understand the real time cost of purchases.

## Core Features
1. Price Detection
   - Automatic price detection on websites
   - Support for multiple price formats (€19.99, $1,500, etc.)
   - Initial focus on Amazon product pages

2. Time Calculation
   - Convert prices to working hours based on user's income
   - Support different income input methods (hourly/weekly/monthly)
   - Simple household income calculation

3. User Interface
   - Clean, Apple-inspired design
   - Price badges showing working hours next to prices
   - Simple popup for income configuration
   - Dark/Light mode support

## Technical Stack
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Chrome Extension API (Manifest V3)

## Task List

### 1. Project Setup
- [ ] Initialize Chrome extension project with React + TypeScript
- [ ] Set up Tailwind CSS and shadcn/ui
- [ ] Configure basic extension manifest
- [ ] Set up development environment

### 2. Core Price Detection
- [ ] Create price detection service
- [ ] Implement regex patterns for different price formats
- [ ] Test price detection on sample pages

### 3. Basic UI Components
- [ ] Design and implement popup interface
- [ ] Create income input form
- [ ] Implement price badge component
- [ ] Set up dark/light mode

### 4. Calculation Engine
- [ ] Create basic time calculation service
- [ ] Implement income conversion (hourly/weekly/monthly)
- [ ] Add simple household income calculation

### 5. Extension Integration
- [ ] Implement content script for price detection
- [ ] Create background service worker
- [ ] Set up popup communication

### 6. Testing & Refinement
- [ ] Test on various websites
- [ ] Optimize price detection
- [ ] Refine UI/UX
- [ ] Performance optimization

## Future Enhancements
- Tax calculation integration
- More detailed household income calculations
- Support for additional e-commerce platforms
- Price history tracking
- Custom currency support
- Export/Import settings
- Price alerts based on working hours 