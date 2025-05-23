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

    if (priceDiv === null) {
      priceDiv = document.querySelector('[data-testid="range-price"]')
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
  
    // Single package size
    const singlePackageSize = document.querySelector('div[title="Single package size"] + div div').textContent.trim();

    // Single gross weight
    const singleGrossWeight = document.querySelector('div[title="Single gross weight"] + div div').textContent.trim();

    data.packagingDetails.singlePackageSize = singlePackageSize
    data.packagingDetails.grossWeight = singleGrossWeight

        
    // calculate the volumetric weigth based on single package size
    if(data.packagingDetails.singlePackageSize){
        let transportCalc = data.packagingDetails.singlePackageSize;
        transportCalc = transportCalc.replace(" cm", "");
        transportCalc = transportCalc.replace(/X/g, "*");
        // transportCalc += "/5000";
        transportCalc = transportCalc.split('*')
        transportCalc = (calculateTransport(transportCalc)/5000).toFixed(3)

        // let volumetricSize = (+transportCalc/5000).toFixed(3);
        data.volumetricCalc = transportCalc;
    }

    // calculate the weight based on gross weight
    if (data.packagingDetails.grossWeight){
      // let grossWeight = data.packagingDetails.grossWeight;
      let grossWeight = data.packagingDetails.grossWeight
      if (grossWeight.includes('kg')){
        grossWeight = grossWeight.replace('kg', '').trim()
      }
      else if (grossWeight.includes('KG')){
        grossWeight = grossWeight.replace('KG', '').trim()
      }

      data.grossWeight = grossWeight;
    }
    
  
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

  