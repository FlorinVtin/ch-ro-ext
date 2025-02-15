// Function to scrape price and packaging details
function scrapePriceAndPackagingDetails() {
    let data = {
      priceDetails: [],
      packagingDetails: {},
      volumetricCalc: '',
      grossWeight: ''
    };
  
    // Scrape pricing details as before
    const priceItems = document.querySelectorAll('.price-item');
    priceItems.forEach(item => {
      const quality = item.querySelector('.quality')?.innerText.trim();
      const priceText = item.querySelector('.price span')?.innerText.trim();
      
      if (quality && priceText) {
        const price = parseFloat(priceText.replace('$', '').trim());
        const modifiedPrice = (price + 1).toFixed(2);  // Just for example, $1 added
        data.priceDetails.push({ quality, originalPrice: priceText, modifiedPrice: `$${modifiedPrice}` });
      }
    });
  
    // Scrape the "Packaging and Delivery" information (look for div.left followed by div.right)
    const leftElements = document.querySelectorAll('div.left');
    leftElements.forEach(leftElement => {
      const nextElement = leftElement.nextElementSibling;
  
      if (nextElement && nextElement.classList.contains('right')) {
        // Extract the text from the <div class="right">
        const rightText = nextElement.innerText.trim();
  
        // Based on the text in the left div, we can store this information accordingly
        if (leftElement.innerText.includes('Single package size:')) {
          data.packagingDetails.singlePackageSize = rightText;
        } else if (leftElement.innerText.includes('gross weight:')) {
          data.packagingDetails.grossWeight = rightText;
        } else if (leftElement.innerText.includes('Net weight:')) {
          data.packagingDetails.netWeight = rightText;
        } else if (leftElement.innerText.includes('Package type:')) {
          data.packagingDetails.packageType = rightText;
        } else if (leftElement.innerText.includes('Delivery time:')) {
          data.packagingDetails.deliveryTime = rightText;
        }
        
        // calculate the volumetric weigth based on single package size
        if(data.packagingDetails.singlePackageSize){
            let transportCalc = data.packagingDetails.singlePackageSize;
            transportCalc = transportCalc.replace(" cm", "");
            transportCalc = transportCalc.replace(/X/g, "*");
            transportCalc += "/5000";
            // console.log('math', eval(transportCalc))
            // let volumetricSize = roundTransportNumber(eval(transportCalc));
            let volumetricSize = eval(transportCalc).toFixed(3);
            data.volumetricCalc = volumetricSize;
        }

        // calculate the weight based on gross weight
        if (data.packagingDetails.grossWeight){
          // let grossWeight = data.packagingDetails.grossWeight;
          let grossWeight = data.packagingDetails.grossWeight.replace('kg', '');
          data.grossWeight = grossWeight;
        }

      }
    });
    
  
    return data;
  }

  function roundTransportNumber(number){
    if (number){
        if (number < 0.5){
            return 0.5;
        } else{
            let integerPart = Math.floor(number);
            let decimalPart = number - integerPart;
            if (decimalPart < 0.5){
                return integerPart+0.5
            } else {
                return Math.round(number)
            }
        }
    }
  }

  // Run the function and return the data
  scrapePriceAndPackagingDetails();
  