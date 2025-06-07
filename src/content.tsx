import React from 'react';
import ReactDOM from 'react-dom/client';
import { PriceBadge } from './components/PriceBadge';
// CSS import will be handled via content-entry.ts

interface Settings {
  incomeType: 'hourly' | 'weekly' | 'monthly';
  incomeValue: number;
  currency: string;
  darkMode: boolean;
  enabled: boolean;
  weeklyHours: number; // Neu: Wochenarbeitszeit
}

// Regex to detect prices (e.g., $10.00, 10,00€, 1.234,56€, 363⁰⁰€, € 3,69 with &nbsp;)
const priceRegex = /(?:(€|EUR|£|GBP|\$|USD)(?:\s|&nbsp;)*)?([\d\.,\s⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?:(?:\s|&nbsp;)*(€|EUR|£|GBP|\$|USD))?/g;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          processNode(node as HTMLElement, currentSettings);
        }
      });
    } else if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
      processTextNode(mutation.target as Text, currentSettings);
    }
  });
});

// Store processed nodes to avoid reprocessing
let processedNodes = new WeakSet<Node>();

// Function to process Amazon-specific price elements
const processAmazonPriceElement = (priceElement: HTMLElement, settings: Settings) => {
  if (processedNodes.has(priceElement)) return;

  // Skip strike-through prices (usually old prices)
  if (priceElement.classList.contains('a-text-strike')) {
    console.log('[TimeMoney] Skipping strike-through price (a-text-strike):', priceElement);
    return;
  }
  // Also skip prices that are visually hidden or not primary (e.g. for quantity selectors, etc.)
  // This is a heuristic, may need adjustment
  if (priceElement.closest('.a-size-mini') || priceElement.closest('.a-color-secondary')) {
     console.log('[TimeMoney] Skipping secondary/mini price:', priceElement);
     return;
  }
  // Check if it's part of a quantity selection or similar non-primary price display
  // This is a common pattern for "per unit" prices on Amazon
  if (priceElement.closest('[data-a-input-type="price-selector"]')) {
      console.log('[TimeMoney] Skipping price selector price:', priceElement);
      return;
  }

  const wholeElement = priceElement.querySelector('.a-price-whole');
  const decimalElement = priceElement.querySelector('.a-price-decimal');
  const fractionElement = priceElement.querySelector('.a-price-fraction');
  const symbolElement = priceElement.querySelector('.a-price-symbol');

  if (!wholeElement || !symbolElement) {
    // A price must at least have a whole part and a symbol
    console.log('[TimeMoney] Amazon Price Element missing whole or symbol:', priceElement);
    return;
  }

  const whole = wholeElement.textContent || '';
  const decimal = decimalElement?.textContent || ''; // This is usually ',' or '.'
  const fraction = fractionElement?.textContent || ''; // This is the '00' part

  // Construct the raw price string by concatenating the parts
  let rawPriceString = '';
  // Always try to combine whole, decimal, fraction in order
  if (whole) rawPriceString += whole;
  if (decimal) rawPriceString += decimal;
  if (fraction) rawPriceString += fraction;


  // Clean the raw price string for parsing:
  // 1. Remove all non-numeric characters except for the last comma/dot (which is the decimal separator)
  // 2. Replace the decimal comma with a dot for parseFloat
  let cleanedPriceString = rawPriceString.replace(/[^\d,.]/g, '');
  
  // If there's a comma, assume it's a decimal separator and remove all dots (thousand separators)
  // If there's no comma, but there are dots, assume last dot is decimal separator and remove others
  if (cleanedPriceString.includes(',')) {
    cleanedPriceString = cleanedPriceString.replace(/\./g, '').replace(/,/g, '.');
  } else {
    // No comma, handle dot as decimal or thousand separator
    const parts = cleanedPriceString.split('.');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
        // If last part has 3 digits after a dot, assume it's a thousand separator
        cleanedPriceString = cleanedPriceString.replace(/\./g, '');
    } else if (parts.length > 1 && parts[parts.length - 1].length <= 2) {
        // If last part has 1 or 2 digits after a dot, assume it's a decimal separator
        const lastDotIndex = cleanedPriceString.lastIndexOf('.');
        cleanedPriceString = cleanedPriceString.substring(0, lastDotIndex).replace(/\./g, '') + '.' + cleanedPriceString.substring(lastDotIndex + 1);
    }
  }
  
  const price = parseFloat(cleanedPriceString);
  const currencySymbol = symbolElement.textContent || '';


  if (!isNaN(price) && price > 0) {
    console.log('[TimeMoney] Amazon Price Detected (Revised):', { whole, decimal, fraction, rawPriceString, cleanedPriceString, price, currencySymbol, priceElement });
    
    // Check if a badge already exists for this price element
    const existingBadgeContainer = priceElement.nextElementSibling;
    if (existingBadgeContainer && existingBadgeContainer.classList.contains('time-money-badge-container')) {
      // If badge already exists, update its props
      ReactDOM.createRoot(existingBadgeContainer).render(
        <React.StrictMode>
          <PriceBadge price={price} settings={settings} />
        </React.StrictMode>
      );
      // No need to add to processedNodes again if it's already there
      return; 
    }

    const badgeContainer = document.createElement('span');
    badgeContainer.className = 'time-money-badge-container';
    badgeContainer.style.display = 'inline-block'; // Or 'inline-flex'
    badgeContainer.style.marginLeft = '0.5rem'; // Small margin for spacing

    // Insert the badge container immediately after the price element
    priceElement.parentNode?.insertBefore(badgeContainer, priceElement.nextSibling);

    ReactDOM.createRoot(badgeContainer).render(
      <React.StrictMode>
        <PriceBadge price={price} settings={settings} />
      </React.StrictMode>
    );
    processedNodes.add(priceElement); // Mark the original price element as processed
  } else {
    console.log('[TimeMoney] Amazon Price Not Parsed (NaN or <=0) (Revised): ', { whole, decimal, fraction, rawPriceString, cleanedPriceString, price, currencySymbol, priceElement });
  }
};

const processTextNode = (textNode: Text, settings: Settings) => {
  if (processedNodes.has(textNode)) return;

  const parentElement = textNode.parentElement;
  if (!parentElement || parentElement.tagName === 'SCRIPT' || parentElement.tagName === 'STYLE' || parentElement.tagName === 'NOSCRIPT') {
    return;
  }

  const text = textNode.nodeValue;
  if (!text) return;

  console.log('[TimeMoney] Processing text node (raw):', text);

  let match;
  const matches: { value: number, index: number, length: number }[] = [];
  // Reset lastIndex for global regex
  priceRegex.lastIndex = 0; // Important for global regex in a loop
  while ((match = priceRegex.exec(text)) !== null) {
    // Ensure a currency symbol was matched either before or after the number
    if (!match[1] && !match[3]) {
        continue; // Skip if no currency symbol found
    }

    const priceStringRaw = match[2]; // The number part is now in match[2]
    let cleanedPriceString = priceStringRaw.replace(/[^\\d,.]/g, ''); // Remove non-numeric except , and .
    
    // Handle European vs. US decimal/thousand separators
    if (cleanedPriceString.includes(',')) {
      // European format: comma is decimal, dot is thousand separator
      cleanedPriceString = cleanedPriceString.replace(/\\./g, '').replace(/,/g, '.');
    } else if (cleanedPriceString.includes('.')) {
      // US format: dot is decimal, comma is thousand separator (or only dot for decimal)
      const parts = cleanedPriceString.split('.');
      if (parts.length > 1 && parts[parts.length - 1].length === 3) {
          // If last part after dot has 3 digits, assume dots are thousand separators
          cleanedPriceString = cleanedPriceString.replace(/\\./g, '');
      } else if (parts.length > 1 && parts[parts.length - 1].length <= 2) {
          // If last part after dot has 1 or 2 digits, assume last dot is decimal separator
          const lastDotIndex = cleanedPriceString.lastIndexOf('.');
          cleanedPriceString = cleanedPriceString.substring(0, lastDotIndex).replace(/\\./g, '') + '.' + cleanedPriceString.substring(lastDotIndex + 1);
      }
    }
    
    const price = parseFloat(cleanedPriceString);
    if (!isNaN(price) && price > 0) {
      matches.push({ value: price, index: match.index, length: match[0].length });
    }
  }

  if (matches.length > 0) {
    console.log('[TimeMoney] Text Node Price Detected:', { text, matches, parentElement });
    
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    matches.forEach(m => {
      // Append text before the price
      fragment.appendChild(document.createTextNode(text.substring(lastIndex, m.index)));

      const priceSpan = document.createElement('span');
      priceSpan.textContent = text.substring(m.index, m.index + m.length);
      priceSpan.className = 'time-money-original-price'; // Add a class for potential styling if needed
      fragment.appendChild(priceSpan);

      const badgeContainer = document.createElement('span');
      badgeContainer.className = 'time-money-badge-container';
      badgeContainer.style.display = 'inline-block';
      badgeContainer.style.marginLeft = '0.5rem';
      fragment.appendChild(badgeContainer);

      ReactDOM.createRoot(badgeContainer).render(
        <React.StrictMode>
          <PriceBadge price={m.value} settings={settings} />
        </React.StrictMode>
      );
      lastIndex = m.index + m.length;
    });

    // Append any remaining text after the last price
    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));

    // Replace the original text node with the new fragment
    parentElement.replaceChild(fragment, textNode);
    // Mark the original textNode as processed, and the new parentElement as processed implicitly by its children
    processedNodes.add(textNode);
  }
};

let currentSettings: Settings;

const processNode = (node: HTMLElement, settings: Settings) => {
  if (processedNodes.has(node)) return;

  // Check for Amazon-specific price elements first
  if (node.classList.contains('a-price') && node.querySelector('.a-price-whole')) {
    processAmazonPriceElement(node, settings);
    return; // Don't process children individually if it's an Amazon price container
  }

  if (node.shadowRoot) {
    processNode(node.shadowRoot as any, settings); // Recursively process shadow DOM
  }

  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      processTextNode(child as Text, settings);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      processNode(child as HTMLElement, settings);
    }
  });
  processedNodes.add(node);
};

const init = () => {
  chrome.storage.sync.get(['incomeType', 'incomeValue', 'currency', 'darkMode', 'enabled', 'weeklyHours'], (result) => {
    currentSettings = {
      incomeType: result.incomeType || 'monthly',
      incomeValue: result.incomeValue || 0,
      currency: result.currency || 'EUR',
      darkMode: result.darkMode || false,
      enabled: typeof result.enabled === 'boolean' ? result.enabled : true,
      weeklyHours: result.weeklyHours || 40 // Lade Wert oder setze Standard
    };

    if (currentSettings.enabled) {
      console.log('Time Money Extension: Enabled. Starting price detection.', currentSettings);
      // Initial scan of the document
      processNode(document.body, currentSettings);

      // Observe DOM changes
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });

      // Listen for setting changes from popup
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.enabled) {
          if (!changes.enabled.newValue) {
            console.log('Time Money Extension: Disabled. Removing badges.');
            observer.disconnect();
            document.querySelectorAll('.time-money-badge-container').forEach(badge => badge.remove());
            processedNodes = new WeakSet<Node>();
          } else {
            console.log('Time Money Extension: Enabled. Restarting price detection.');
            init(); // Re-initialize when enabled
          }
        } else if (namespace === 'sync') {
          // If other settings change, re-process (simple for now, can optimize later)
          console.log('Time Money Extension: Settings changed. Re-processing.');
          observer.disconnect();
          document.querySelectorAll('.time-money-badge-container').forEach(badge => badge.remove());
          processedNodes = new WeakSet<Node>();
          init();
        }
      });
    } else {
      console.log('Time Money Extension: Disabled. Not starting price detection.', currentSettings);
      observer.disconnect(); // Ensure observer is disconnected if disabled on load
      document.querySelectorAll('.time-money-badge-container').forEach(badge => badge.remove());
    }
  });
};

// Start the extension logic
init(); 