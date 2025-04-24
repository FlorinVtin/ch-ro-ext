// Function to scrape price and packaging details
function scrapePriceAndPackagingDetails() {
    let data = {
      priceDetails: [],
      packagingDetails: {},
      volumetricCalc: '',
      grossWeight: '',
      title: ''
    };

    // getting the product title
    let title = document.querySelector('h1').innerText
    data.title = title

    // scrapping the principal div element of price's
    let priceDiv = document.querySelector('.price-list')

    if (priceDiv === null) {
      priceDiv = document.querySelector('.price-range')
    }
   
    if (priceDiv === null) {
      priceDiv = document.querySelector('.price-item')

    }

    if (priceDiv === null) {
      priceDiv = document.querySelector('[data-testid="fixed-price"]')
    }

  
    // Scrape pricing details as before
    let priceItems = priceDiv.querySelector('.price');

    if (priceItems === null) {
      priceItems = priceDiv.querySelector('span')
    }

    if (priceItems === null) {
      priceItems = priceDiv.querySelector('strong')
    }

    let priceText = priceItems.innerText.trim().replace('$', '');
    if ( priceText ){
      if (priceText.includes('-')){
        priceText = priceText.split('-')[0]
      }
      else if (priceText.includes('\n')){
        priceText = priceText.split('\n')[0]
      }
    }
    data.priceDetails.push(priceText);
  
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
        } else if (leftElement.innerText.includes('gross weight:') || leftElement.innerText.includes('Weight')) {
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
            // transportCalc += "/5000";
            transportCalc = transportCalc.split('*')
            transportCalc = (calculateTransport(transportCalc)/5000).toFixed(3)

            
            // console.log('transportCalc', transportCalc)
            // console.log('type', typeof(transportCalc))

            // let volumetricSize = (+transportCalc/5000).toFixed(3);
            data.volumetricCalc = transportCalc;
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

  function calculateTransport(list){
    let x = 1;
    for (let y of list){
      x *= y
    }
    return x
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

  