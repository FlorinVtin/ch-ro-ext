import { loadVariables }  from './comission.js';

const {cAgent, cstTransport, tva, taxeVamale, impozitProfit, consumabileImp, costCurierTrspContract, costCurierTrspFactura} = loadVariables()

console.log(var1)


document.getElementById('scrapeButton').addEventListener('click', function() {

    // Send a message to the background to scrape the price and packaging details
    chrome.runtime.sendMessage({ action: 'scrapePriceAndPackagingDetails' }, function(response) {
      const headingsDiv = document.getElementById('headings');
      headingsDiv.innerHTML = ''; // Clear previous results
  
      // Display price details if available
      if (response && response.priceDetails.length > 0) {
        const priceList = document.createElement('ul');
  
        // Loop through the price data and display it
        response.priceDetails.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${item.quality}</strong>: <span style="text-decoration: line-through;">${item.originalPrice}</span> → ${item.modifiedPrice}`;
          priceList.appendChild(li);
        });
      
      
        headingsDiv.appendChild(priceList);
      } else {
        headingsDiv.innerHTML = 'No price data found.';
      }
  
      // Display packaging details if available
      if (response.packagingDetails && Object.keys(response.packagingDetails).length > 0) {
        const packagingDiv = document.createElement('div');
        const packagingTitle = document.createElement('h4');
        packagingTitle.textContent = 'Packaging and Delivery Details';
        packagingDiv.appendChild(packagingTitle);

  
        // Loop through the packaging details and display them
        Object.keys(response.packagingDetails).forEach(key => {
          const p = document.createElement('p');
          p.innerHTML = `<strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${response.packagingDetails[key]}`;
          packagingDiv.appendChild(p);
        });
  
        headingsDiv.appendChild(packagingDiv);
      }

      // Display the volumetric weight if available
      const transportCostDiv = document.createElement('div');
      const transportCostTitle = document.createElement('h4');
      transportCostTitle.textContent = 'Volumetric size';
      transportCostDiv.appendChild(transportCostTitle);
      const t = document.createElement('p');
      t.innerHTML = `<strong>Volumetric calculation:</strong> ${response.volumetricCalc} kg`;
      
      transportCostDiv.append(t);

      
      headingsDiv.appendChild(transportCostDiv)
    });
  });



  
  