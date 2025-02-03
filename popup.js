import { loadVariables }  from './comission.js';

const {var1, var2, var3, var4, var5, var6, var7, var8, var9, var10, var11} = loadVariables();


const cAgent            = var1;
const costTrspAer       = var2;
const costTrspTren      = var3;
const costTrspFabAgent  = var4;
const tva               = var5;
const taxeVamale        = var6;
const impozitProfit     = var7;
const consImpProd       = var8;
const costTrspContr     = var9;
const costTrspFacClient = var10;
const cmsEmag =           var11;

let transportWeight = undefined;




document.getElementById('scrapeButton').addEventListener('click', function() {

    // Send a message to the background to scrape the price and packaging details
    chrome.runtime.sendMessage({ action: 'scrapePriceAndPackagingDetails' }, function(response) {
      const headingsDiv = document.getElementById('headings');
      headingsDiv.innerHTML = ''; // Clear previous results
  
      // // Display price details if available
      // if (response && response.priceDetails.length > 0) {
      //   const priceList = document.createElement('ul');
  
      //   // Loop through the price data and display it
      //   response.priceDetails.forEach(item => {
      //     const li = document.createElement('li');
      //     li.innerHTML = `<strong>${item.quality}</strong>: <span style="text-decoration: line-through;">${item.originalPrice}</span> → ${item.modifiedPrice}`;
      //     priceList.appendChild(li);
      //   });
      
      
      //   headingsDiv.appendChild(priceList);
      // } else {
      //   headingsDiv.innerHTML = 'No price data found.';
      // }
  
      // // Display packaging details if available
      // if (response.packagingDetails && Object.keys(response.packagingDetails).length > 0) {
      //   const packagingDiv = document.createElement('div');
      //   const packagingTitle = document.createElement('h4');
      //   packagingTitle.textContent = 'Packaging and Delivery Details';
      //   packagingDiv.appendChild(packagingTitle);

  
      //   // // Loop through the packaging details and display them
        // Object.keys(response.packagingDetails).forEach(key => {
        //   const p = document.createElement('p');
        //   p.innerHTML = `<strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${response.packagingDetails[key]}`;
        //   packagingDiv.appendChild(p);
        // });
  
      //   headingsDiv.appendChild(packagingDiv);
      // }

      // establishing the weigth value
      if (response.volumetricCalc && response.grossWeight){
        if (response.volumetricCalc > response.grossWeight){
          transportWeight = response.volumetricCalc;
        } else {
          transportWeight = response.grossWeight;
        }
      } else if (response.volumetricCalc && !response.grossWeight) {
        transportWeight = response.volumetricCalc;
      } else if (!response.volumetricCalc && response.grossWeight){
        transportWeight = response.grossWeight;
      } else {
        transportWeight = 'No data found about size or weigth package!'
      }

      // Display the volumetric weight if available
      const transportCostDiv = document.createElement('div');
      const transportCostTitle = document.createElement('h4');
      transportCostTitle.textContent = 'Marime si greutate per pachet';
      transportCostDiv.appendChild(transportCostTitle);

      // show calculation for volumetric weigth 
      const volumetricValue = document.createElement('p');
      volumetricValue.innerHTML = `<strong>Calcul volumetric:</strong> ${response.volumetricCalc} kg`;
      
      const packSize = document.createElement('p');
      packSize.innerHTML = `<strong>Dimensiuni per colet: </strong> ${response.packagingDetails.singlePackageSize}`;
      // show gross weight
      const grossWeight = response.grossWeight;
      const gWeight = document.createElement('p');
      gWeight.innerHTML = `<strong>Greutate per colet:</strong> ${grossWeight} kg`;

      // show the weigth for cost calculation
      const transport = document.createElement('p')
      transport.innerHTML = `<strong>Greutate considerata: <span style=color:#850025;"> ${transportWeight} kg </span></strong>`

      // adding transport details
      transportCostDiv.append(packSize);
      transportCostDiv.append(volumetricValue);
      transportCostDiv.append(gWeight);
      transportCostDiv.append(transport)

   
      const keys = Object.entries(response.priceDetails[0]);
      const firstPrice = keys[1][1].replace('$', '')
      // firstPrice = parseInt(firstPrice)
      // const k = Object.entries(keys)

      const finalCostsDiv = document.createElement('div');
      const finalCostsTitle = document.createElement('h4');
      finalCostsTitle.textContent = 'Costuri achizitie adaugand toate comisioanele + transport'
      finalCostsDiv.appendChild(finalCostsTitle)

      // adding the final cost 
      const showFinalCost_aer = document.createElement('p');
      const showFinalCost_tren = document.createElement('p');

      showFinalCost_aer.innerHTML = `<strong>Cost Transport Aer: <span style="color: #850025;"> ${costFinalAchAer()} $</span></strong>`;
      // <span style="color: #850025;">word</span> 
      showFinalCost_tren.innerHTML = `<strong>Cost Transport Tren: <span style="color: #850025;"> ${costFinalAchTren()} $ </span></strong>`;

      finalCostsDiv.append(showFinalCost_aer);
      finalCostsDiv.append(showFinalCost_tren);

      
      headingsDiv.appendChild(transportCostDiv)
      headingsDiv.appendChild(finalCostsDiv)


      function costTransportAer(){
        // comision transport aer * greutate
        return costTrspAer * transportWeight
      }


      function costTransportTren(){
        // comision tranport tren * greutate
        return costTrspTren * transportWeight
      }

      function costTaxeVamaleAer(){
        // (cost achizitie china + cost transport) * taxa vamala
        const cTrspAer = costTransportAer()
        return (+firstPrice + cTrspAer) * taxeVamale/100
      }

      function costTaxeVamaleTren(){
        // (cost achizitie china + cost transport) * taxa vamala
        const cTrspTren = costTransportTren()
        return (+firstPrice + cTrspTren) * taxeVamale/100
      }

      function calculTVA_aer(){
        // (pret ach China + cost trans aer + taxe vam) * tva
        const costTrspAer = costTransportAer();
        const cTaxVamAer = costTaxeVamaleAer();
        const calculTVA = 0 + '.' + tva

        return (+firstPrice + costTrspAer + cTaxVamAer) * calculTVA
      }

      function calculTVA_tren(){
        // (pret ach China + cost trans aer + taxe vam) * tva
        const cTrspTren = costTransportTren();
        const cTaxVamTren = costTaxeVamaleTren();
        const calculTVA = 0 + '.' + tva

        return (+firstPrice + cTrspTren + cTaxVamTren) * calculTVA
      }


      function costFinalAchAer(){
        // pret ach China + cost trans aer + taxe vam aer + tva
        const costTrspAer = costTransportAer();
        const cTaxVamAer = costTaxeVamaleAer();
        const calculTVAaer = calculTVA_aer()

        return (+firstPrice + costTrspAer + cTaxVamAer + calculTVAaer).toFixed(2)
      }

      function costFinalAchTren(){
        // pret ach China + cost trans aer + taxe vam aer + tva
        const cTrspTren = costTransportTren();
        const cTaxVamTren = costTaxeVamaleTren();
        const calculTVAtren = calculTVA_tren()

        return (+firstPrice + cTrspTren + cTaxVamTren + calculTVAtren).toFixed(2)
      }

    });
  });
  