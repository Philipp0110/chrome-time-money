// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with default values
  chrome.storage.sync.set({
    hourlyRate: 0,
    currency: 'EUR',
    darkMode: false
  });

  chrome.storage.sync.get('enabled', (result) => {
    if (typeof result.enabled === 'undefined') {
      chrome.storage.sync.set({ enabled: true });
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['hourlyRate', 'currency', 'darkMode'], (result) => {
      sendResponse(result);
    });
    return true; // Required for async sendResponse
  }
}); 