import { loadVariables }  from './comission.js';
// import { saveComissions } from './comission.js';

let cAgent            = undefined;
let costTrspAer       = undefined;
let costTrspTren      = undefined;
let costTrspFabAgent  = undefined;
let tva               = undefined;
let taxeVamale        = undefined;
let impozitProfit     = undefined;
let consImpProd       = undefined;
let costTrspContr     = undefined;
let costTrspFacClient = undefined;
let cmsEmag =           undefined;

let transportWeight = undefined;
let firstPrice = undefined;

function checkComissions(){
  let {var1, var2, var3, var4, var5, var6, var7, var8, var9, var10, var11} = loadVariables();
  // cAgent            = parseFloat(var1);
  cAgent            = parseFloat(document.getElementById('var1').value);
  // costTrspAer       = parseFloat(var2);
  costTrspAer       = parseFloat(document.getElementById('var2').value);
  // costTrspTren      = parseFloat(var3);
  costTrspTren      = parseFloat(document.getElementById('var3').value);
  // costTrspFabAgent  = parseFloat(var4);
  costTrspFabAgent  = parseFloat(document.getElementById('var4').value);
  // tva               = parseFloat(var5);
  tva               = parseFloat(document.getElementById('var5').value);
  // taxeVamale        = parseFloat(var6);
  taxeVamale        = parseFloat(document.getElementById('var6').value);
  // impozitProfit     = parseFloat(var7);
  impozitProfit     = parseFloat(document.getElementById('var7').value);
  // consImpProd       = parseFloat(var8);
  consImpProd       = parseFloat(document.getElementById('var8').value);
  // costTrspContr     = parseFloat(var9);
  costTrspContr     = parseFloat(document.getElementById('var9').value);
  // costTrspFacClient = parseFloat(var10);
  costTrspFacClient = parseFloat(document.getElementById('var10').value);
  // cmsEmag           = parseFloat(var11);
  cmsEmag           = parseFloat(document.getElementById('var11').value);
}


document.getElementById('scrapeButton').addEventListener('click', function() {
    // Send a message to the background to scrape the price and packaging details
    chrome.runtime.sendMessage({ action: 'scrapePriceAndPackagingDetails' }, function(response) {
      const headingsDiv = document.getElementById('headings');
      headingsDiv.innerHTML = ''; // Clear previous results

      let calculVolumetric = null
      if (response.volumetricCalc){
        calculVolumetric = roundVolumetricSize(response.volumetricCalc)
      } 
      console.log(response.volumetricCalc)
      // establishing the weigth value
      if (calculVolumetric && response.grossWeight){

        if (calculVolumetric > response.grossWeight){
          transportWeight = calculVolumetric;
        } else {
          transportWeight = response.grossWeight;
        }
      } else if (calculVolumetric && !response.grossWeight) {
        transportWeight = calculVolumetric;
      } else if (!calculVolumetric && response.grossWeight){
        transportWeight = response.grossWeight;
      } else {
        transportWeight = 'No data found about size or weigth package!'
      }

      // Display the volumetric weight if available
      const transportCostDiv = document.createElement('div');
      const transportCostTitle = document.createElement('h4');
      transportCostTitle.textContent = 'Marime si greutate per buc.';
      transportCostDiv.appendChild(transportCostTitle);

      // show calculation for volumetric weigth 
      const volumetricValue = document.createElement('p');
      volumetricValue.innerHTML = `<strong>Calcul volumetric:</strong> ${response.volumetricCalc} kg`;
      
      const packSize = document.createElement('p');
      packSize.innerHTML = `<strong>Dimensiuni per buc.: </strong> ${response.packagingDetails.singlePackageSize}`;
      // show gross weight
      const grossWeight = response.grossWeight;
      const gWeight = document.createElement('p');
      gWeight.innerHTML = `<strong>Greutate per buc.:</strong> ${grossWeight} kg`;

      // show the weigth for cost calculation
      const transport = document.createElement('p')
      transport.innerHTML = `<strong>Greutate considerata: <span style=color:#850025;"> ${transportWeight} kg </span></strong>`

      // adding transport details
      transportCostDiv.append(packSize);
      transportCostDiv.append(volumetricValue);
      transportCostDiv.append(gWeight);
      transportCostDiv.append(transport);

      firstPrice = response.priceDetails[0]
 
      const finalCostsDiv = document.createElement('div');
      const finalCostsTitle = document.createElement('h4');
      finalCostsTitle.textContent = 'Cost final import per buc.'
      finalCostsDiv.appendChild(finalCostsTitle)

      // adding the final cost 
      const showFinalCost_aer = document.createElement('p');
      const showFinalCost_tren = document.createElement('p');
      
      // load comissions
      checkComissions()
      const {calculComisionAgent, calculTransportFabAg} = costAchizitieChina();

      firstPrice = +firstPrice * calculComisionAgent * calculTransportFabAg;

      // show the total costs
      let costFinalAch_Aer = costFinalAchAer();
      let costFinalAch_Tren = costFinalAchTren();

      showFinalCost_aer.innerHTML = `<strong>Cost Transport Aer: <span style="color: #850025;"> ${costFinalAch_Aer} $</span></strong>`;
      showFinalCost_tren.innerHTML = `<strong>Cost Transport Tren: <span style="color: #850025;"> ${costFinalAch_Tren} $ </span></strong>`;

      finalCostsDiv.append(showFinalCost_aer);
      finalCostsDiv.append(showFinalCost_tren);

      headingsDiv.appendChild(transportCostDiv);
      headingsDiv.appendChild(finalCostsDiv);

      // creating the display for User Custom Price
      const prefferedPriceDiv = document.createElement('div');
      const prefferedPriceTitle = document.createElement('h4');
      prefferedPriceTitle.textContent = 'Pret preferential? ';
      addArrowToHeading(prefferedPriceTitle);
      prefferedPriceDiv.appendChild(prefferedPriceTitle);
      headingsDiv.appendChild(prefferedPriceDiv)
      // add the paragraphs to show the new costs
      const newShowPretFinal_Aer  = document.createElement('p')
      const newShowPretFinal_Tren = document.createElement('p')
      // make them hidden
      newShowPretFinal_Aer.style.display = 'none'
      newShowPretFinal_Tren.style.display = 'none'
      prefferedPriceDiv.appendChild(newShowPretFinal_Aer)
      prefferedPriceDiv.appendChild(newShowPretFinal_Tren)

      // Parsing the User Costum Price
      const priceInput = document.getElementById("arrowBtnPrice")

      if (priceInput){
        // show the input box for user costum price
        addPrefferedPrice()

        let userPrice = document.getElementById('userPrice')
        // checking if user entered a new price
        if (userPrice.value){
          firstPrice = parseFloat(userPrice.value).toFixed(2)
          firstPrice = +firstPrice * calculComisionAgent * calculTransportFabAg;

          // calculate new cost including shippement comissions
          const newCalcFinalPret_Aer = costFinalAchAer()
          const newCalcFinalPret_Tren = costFinalAchTren()
          
          if (newCalcFinalPret_Aer && newCalcFinalPret_Tren) {
            // display new costs
            newShowPretFinal_Aer.innerHTML = `<strong>NOU* Cost Transport Aer: <span style="color: #850025;"> ${newCalcFinalPret_Aer} $</span></strong>`;
            newShowPretFinal_Tren.innerHTML = `<strong>NOU* Cost Transport Tren: <span style="color: #850025;"> ${newCalcFinalPret_Tren} $</span></strong>`;
            showElement(newShowPretFinal_Aer)
            showElement(newShowPretFinal_Tren)
          }
        }
      }


    });
  });

  function roundVolumetricSize(volumNumber){
    return Math.ceil(volumNumber*10)/10
  }

  function costAchizitieChina(){
    const calculComisionAgent = (1 + cAgent/100).toFixed(2);
    const calculTransportFabAg = (1 + costTrspFabAgent/100).toFixed(2);
    return {calculComisionAgent, calculTransportFabAg}
  }


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

// Funcția care adaugă <span> cu iconița în heading
function addArrowToHeading(heading) {
  // 1. Crează elementul <span>
  let span = document.createElement('span');
  span.id = 'arrowBtnPrice';  // Setează ID-ul pentru span

  // 2. Crează elementul <i> și adaugă clasele pentru iconiță
  let icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-chevron-down', 'arrow');  // Adaugă clasele

  // 3. Adaugă elementul <i> în <span>
  span.appendChild(icon);

  // // 4. Găsește heading-ul (în acest caz, un <h1>) în care vrei să adaugi <span>
  // let heading = document.getElementById('myHeading');  // Asigură-te că ai un heading cu id="myHeading"

  // 5. Adaugă <span> în interiorul heading-ului
  heading.appendChild(span);
}

function addPrefferedPrice() {
  document.getElementById("arrowBtnPrice").addEventListener("click", function() {
    let inputForm = document.getElementById("inputPrefferedPrice");
    let arrow = document.querySelector(".arrow");
    if (inputForm.style.display === "none" || inputForm.style.display === "") {
        inputForm.style.display = "block";
        // arrow.classList.remove("rotate");
        arrow.classList.toggle("rotate")
    } else {
        inputForm.style.display = "none";
        arrow.classList.toggle("rotate")
    }
    });

}


function showElement(element) {
  element.style.display = 'block'
}

document.getElementById('find-product').addEventListener("click", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    // const tabUrl = activeTab.url;
    // console.log("Active Tab URL:", tabUrl);

    // Injectează funcția findImage în tab-ul activ
    chrome.tabs.executeScript(activeTab.id, {
      code: 'findImage()'  // Execută funcția findImage în contextul paginii
    });
  });
  
});
