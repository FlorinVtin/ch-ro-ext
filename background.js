chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'scrapePriceAndPackagingDetails') {
      // Execute content.js script to scrape price and packaging details
      chrome.tabs.executeScript({
        file: 'content.js'
      }, function(results) {
        // Send back the scraped data to the popup
        sendResponse(results[0]);
      });
      return true;  // Ensure the response is sent asynchronously
    }
  });
  