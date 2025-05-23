// background.js
importScripts('ExtPay.js')

chrome.storage.local.get('foo', function() {
  const extpay = ExtPay('calculator-profit-import-china-romania')
  extpay.startBackground();
  // ...
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'scrapePriceAndPackagingDetails') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['content.js']
        },
        function(injectionResults) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            sendResponse({ error: chrome.runtime.lastError.message });
          } else if (injectionResults && injectionResults.length > 0) {
            sendResponse(injectionResults[0].result);
          } else {
            sendResponse({ result: "No result returned from content script" });
          }
        }
      );
    });
    return true; // Keep the message channel open for sendResponse
  }
});
