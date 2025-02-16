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
let usdExchange = undefined;
let initialPrice = undefined


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

document.getElementById("arrowBtn").addEventListener("click", showComissions)


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
      initialPrice = +firstPrice
 
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

      let showPrice = firstPrice

      firstPrice = +firstPrice * calculComisionAgent * calculTransportFabAg;

      // show the total costs
      let costFinalAch_Aer = costFinalAchAer();
      let costFinalAch_Tren = costFinalAchTren();

      // get the USD -> Ron value and convert it to number type
      if (usdExchange) {
        usdExchange = +usdExchange
        usdExchange = usdExchange.toFixed(2)
        usdExchange = +usdExchange
      }

      const priceDiv = document.getElementById('price')

      priceDiv.innerHTML = `<strong>Pretul produsului luat in calcul: <span style="color: #850025;"> ${+showPrice} $ → ${(+showPrice*usdExchange).toFixed(2)} RON </span></strong>`
      showFinalCost_aer.innerHTML = `<strong>Cost Transport Aer: <span style="color: #850025;"> ${costFinalAch_Aer} $ → ${(costFinalAch_Aer * usdExchange).toFixed(2)} RON </span></strong>`;
      showFinalCost_tren.innerHTML = `<strong>Cost Transport Tren: <span style="color: #850025;"> ${costFinalAch_Tren} $ → ${(costFinalAch_Tren * usdExchange).toFixed(2)} RON </span></strong>`;

      finalCostsDiv.append(priceDiv)
      finalCostsDiv.append(showFinalCost_aer);
      finalCostsDiv.append(showFinalCost_tren);

      headingsDiv.appendChild(transportCostDiv);
      headingsDiv.appendChild(finalCostsDiv);

      // Preferred Price User Input
      const prefferedPriceDiv = document.getElementById('prefferedPriceDiv')
      prefferedPriceDiv.style.display = 'block'
      // Parsing the User Costum Price
      document.getElementById("arrowBtnPrice").addEventListener('click', showPrefferedInput)
      document.getElementById('prefPriceBtn').addEventListener('click', showPrefferedPrices)

      // Calcul Profit User Input
      const calculProfitDiv = document.getElementById('calculProfit')
      calculProfitDiv.style.display = 'block'
      let inputForm = document.getElementById('inputSellPrice')
      inputForm.style.display ='block'
      document.getElementById('arrowSellBtn').addEventListener('click', showCalculProfitInput)
      document.getElementById('profitButton').addEventListener('click', showProfit)

      // if (arrowProfit) {      
      //   addInputForm('arrowSellBtn', 'inputSellPrice', '.arrow-sell')
      //   document.getElementById('profitButton').addEventListener('click', showProfit)
      // }
      
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
    // const calculTVA = 0 + '.' + tva

    return (+firstPrice + costTrspAer + cTaxVamAer) * tva/100
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

  function pretEmagFaraTVA(priceSelleMAG){
    return (priceSelleMAG/(1+'.'+ tva))
  }

  function cComisionEmagFaraTVA(option, priceSelleMAG) {
    // (pret vanzare eMAG + cost trsp fact. client) * comsionEmag 
    if (option == 1 || option == 3) {      
      return (priceSelleMAG + costTrspFacClient) * cmsEmag/100
    } 
    // (pret vanzare eMAG + cost trsp fact. client) / (1 + TVA) * comsionEmag -> platitor TVA
    else if (option == 2 || option == 4){
      // priceSelleMAG = pretEmagFaraTVA(priceSelleMAG) // pret eMAG fara TVA
      return (priceSelleMAG + costTrspFacClient/(1+'.'+tva)) * cmsEmag/100
    }
    
  }

  function cTVAcomissionEmag(option, priceSelleMAG) {
    // cComisionEmagFaraTVA * TVA
    if (option == 1 || option == 3){
      return cComisionEmagFaraTVA(option, priceSelleMAG) * tva/100
    }
    // cComisionEmagTVA * TVA
    else if (option == 2 || option == 4) {
      // priceSelleMAG = pretEmagFaraTVA(priceSelleMAG)
      return cComisionEmagFaraTVA(option, priceSelleMAG) * tva/100 
    }
  }

  function cImpozitAer(option, priceSelleMAG, costFinalTypTransport){
    // U - pret vanzare eMAG
    // V - Valoarea Comision eMAG fara TVA > cComisionEmagFaraTVA()
    // W - TVA Comision eMAG > cTVAcomissionEmag()
    // O - Cost final achizitie Aer
    // P - Cost final achizitie Tren
    // M - TVA import aer > calculTVA_aer()
    // N - TVA import tren > calculTVA_tren ()
    // C19 - TVA
    // C21 - Impozit profit
    // C23 - Consumabile produs impachetare > costTrspFacClient
    // C26 - costTrspContr
    // C29 - costTrspFacClient
    // X - Impozit Aer > cImpozitAer()

    //"Impozit pe profit neplatitor de TVA",((U35+$C$29)-(V35+W35+O35+$C$26+$C$23))*$C$21,
    // ((pret vanzare eMAG + cost trsp fact. client) - (cComisionEmagFaraTVA() + cTVAcomissionEmag + cFinalAchz_Aer + costTrspContr + consImpProd))* impozitProfit
    let costFinalAchizitie_Ron = undefined;
    
    if (costFinalTypTransport == 'aer') {
      costFinalAchizitie_Ron = costFinalAchAer()*usdExchange
    }
    else if (costFinalTypTransport == 'tren') {
      costFinalAchizitie_Ron = costFinalAchTren()*usdExchange
    }

    if (option == 1){      
      impozitProfit = 16
      return (((priceSelleMAG + costTrspFacClient) - (cComisionEmagFaraTVA(option, priceSelleMAG) + cTVAcomissionEmag(option, priceSelleMAG) + costFinalAchizitie_Ron + costTrspContr +consImpProd))*impozitProfit/100)
    }

    // "Impozit pe profit platitor de TVA",
    // ((U35+$C$29/(1+$C$19))-(V35+(O35-M35)+($C$26+$C$23)/(1+$C$19)))*$C$21
    // ((pret vanzare eMAG + cost trsp fact. client)/(1+tva)) - (cComisionEmagFaraTVA()+(costFinAchz_aer-calculTVA_aer)+(costTrspFacClient+consImpProd)/(1+TVA)))* impozitProfit
    else if (option == 2){
      impozitProfit = 16

      let calculTVA;

      if (costFinalTypTransport == 'aer'){
        calculTVA = calculTVA_aer() *  usdExchange
      }
      else if (costFinalTypTransport == 'tren'){
        calculTVA = calculTVA_tren() *  usdExchange
      }
      
      return ((priceSelleMAG + costTrspFacClient/(1+'.'+tva)) - (cComisionEmagFaraTVA(option, priceSelleMAG)+(costFinalAchizitie_Ron - calculTVA) + (costTrspContr+consImpProd)/(1+'.'+tva))) * impozitProfit/100
    }
    // "Microintreprindere (un angajat minim) neplatitor de TVA",(U35+$C$29)*$C$21,
    // ((pret vanzare eMAG + cost trsp fact. client)/(1+TVA)) * impozitProfit
    // (U35+$C$29)*$C$21
    else if (option == 3) {
      impozitProfit = 1
      return ((priceSelleMAG + costTrspFacClient) * impozitProfit/100)
    }
    // (pret vanzare eMAG + cost trsp fact. client)*impozitProfit, 
    // (pret vanzare eMAG + cost trsp fact. client) * impozitProfit
    // (U35+$C$29/(1+$C$19))*$C$21
    else {
      impozitProfit = 1
      return ((priceSelleMAG + costTrspFacClient/(1+'.'+tva)) * impozitProfit/100)
    }
  }

  function cProfitFinal(option, priceSelleMAG, costFinalTypTransport) {
    let costFinalAchizitie_Ron = undefined

    if (costFinalTypTransport == 'aer'){
      costFinalAchizitie_Ron = costFinalAchAer()*usdExchange
    }
    else if (costFinalTypTransport == 'tren'){
      costFinalAchizitie_Ron = costFinalAchTren()*usdExchange
    }

    // "Impozit pe profit neplatitor de TVA",
    // ((U35+$C$29)-(V35+W35+O35+$C$26+$C$23))-X35,
    // ((pret vanzare eMAG + cost trsp fact. client) - (cComisionEmagFaraTVA()+cTVAcomissionEmag()+cFinalAchz_aer+costTrspContr+costTrspFacClient)-cImpozitAer()
    if (option == 1 || option == 3) {
      return ((priceSelleMAG+costTrspFacClient)-(cComisionEmagFaraTVA(option, priceSelleMAG) + cTVAcomissionEmag(option, priceSelleMAG) + costFinalAchizitie_Ron + costTrspContr+consImpProd)) - cImpozitAer(option, priceSelleMAG, costFinalTypTransport)
    }
    // "Microintreprindere (un angajat minim) neplatitor de TVA"),
    // ((U35+$C$29/(1+$C$19))-(V35+(O35-M35)+($C$26+$C$23)/(1+$C$19)))-X35
    // ((pret vanzare eMAG + cost trsp fact. client)/(1+TVA))-(cComisionEmagFaraTVA()+(costFinAchz_aer+calculTVA_aer)+(costTrspFacClient+consImpProd)/(1+TVA)))- cImpozitAer()
    else {
      
      priceSelleMAG = pretEmagFaraTVA(priceSelleMAG)

      let calculTVA;

      if (costFinalTypTransport == 'aer'){
        calculTVA = calculTVA_aer() *  usdExchange
      }
      else if (costFinalTypTransport == 'tren'){
        calculTVA = calculTVA_tren() *  usdExchange
      }
      return ((priceSelleMAG + costTrspFacClient/(1+'.'+tva))-(cComisionEmagFaraTVA(option, priceSelleMAG)+(costFinalAchizitie_Ron - calculTVA)+(costTrspContr+consImpProd)/(1+'.'+tva))) - cImpozitAer(option, priceSelleMAG, costFinalTypTransport)
    }
  }

// Function to add the arrow next to "Pret preferential?"
function addArrowToHeading(heading, arrowId, arrowClass) {
  // 1. Create the element <span>
  let span = document.createElement('span');
  span.id = arrowId;  // Setează ID-ul pentru span

  // 2. Create the element <i> and add it for the icon class
  let icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-chevron-down', arrowClass);  // add classes

  // 3. Add the element <i> in <span>
  span.appendChild(icon);

  heading.appendChild(span);
}

function addInputForm(arrowID, inputID, arrowClass) {
  document.getElementById(arrowID).addEventListener("click", function() {
    let inputForm = document.getElementById(inputID);
    let arrow = document.querySelectorAll(arrowClass);
    if (inputForm.style.display === "none" || inputForm.style.display === "") {
        inputForm.style.display = "block";
        // arrow.classList.remove("rotate");
        // arrow.classList.toggle("rotate")
    } else {
        inputForm.style.display = "none";
        // arrow.classList.toggle("rotate")
    }
    });
}


function showPrefferedInput() {

  let inputForm = document.getElementById('inputPrefferedPrice');
  let arrow = document.querySelector('.arrow-preffered');
  if (inputForm.style.display === "none" || inputForm.style.display === "") {
      inputForm.style.display = "block";
      // arrow.classList.remove("rotate");
      arrow.classList.toggle("rotate")
  } else {
      inputForm.style.display = "none";
      arrow.classList.toggle("rotate")
  }

}

function showCalculProfitInput(){
  let inputForm = document.getElementById('inputSellPrice');
  let arrow = document.querySelector('.arrow-profit');
  if (inputForm.style.display === "none" || inputForm.style.display === "") {
      inputForm.style.display = "block";
      // arrow.classList.remove("rotate");
      arrow.classList.toggle("rotate")
  } else {
      inputForm.style.display = "none";
      arrow.classList.toggle("rotate")
  }
}

function showComissions(){
  let inputForm = document.getElementById('inputForm');
  let arrow = document.querySelectorAll('.arrow-comission');
  if (inputForm.style.display === "none" || inputForm.style.display === "") {
      inputForm.style.display = "block";
      // arrow.classList.remove("rotate");
      arrow.classList.toggle("rotate")
  } else {
      inputForm.style.display = "none";
      arrow.classList.toggle("rotate")

      // arrow.classList.add("rotate");
      // arrow.classList.remove("rotate");

  }
}

function getExchangeRate() {
  return fetch('https://www.bnr.ro/nbrfxrates.xml')
    .then(response => {
      if (!response.ok) {
        throw new Error('Eroare la accesarea datelor');
      }
      return response.text();  // Return in XML format
    })
    .then(data => {
      // Parse XML file in DOM format
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      // Look for exchange USD in XML
      const usdElement = xmlDoc.querySelector('Rate[currency="USD"]');

      if (usdElement) {
        const usdRate = usdElement.textContent; // extract the USD rate
        console.log("Cursul USD:", usdRate);
        return usdRate;  // return the USD rate
      } else {
        console.log("Cursul USD nu a fost gasit.");
        return null;  // return null in case of missing rate
      }
    })
    .catch(error => {
      console.error('A aparut o eroare:', error);
      return null;  // return error in case of something is wrong
    });
}

// call the function:
function processUSDRate() {
  getExchangeRate().then(usdValue => {
    if (usdValue) {
      console.log("Cursul USD este:", usdValue);
      usdExchange = usdValue
    } else {
      console.log("Nu s-a găsit cursul USD.");
    }
  }).catch(error => {
    console.log("Eroare:", error);
  });
}

// report the USD - RON rate
processUSDRate();


function addNewField(title, arrowBtnID, arrowClass) {
  const headDiv = document.createElement('div')
  const headTitle = document.createElement('h4')
  headTitle.textContent = title
  addArrowToHeading(headTitle, arrowBtnID, arrowClass)
  headDiv.appendChild(headTitle)

  return headDiv
};

function showPrefferedPrices(){
  let userPrice = document.getElementById('userPrice')
  // let initialPrice = +firstPrice
  firstPrice = parseFloat(userPrice.value).toFixed(2)

  
  if (userPrice.value == null || userPrice.value == undefined || isNaN(parseFloat(userPrice.value))){
    firstPrice = initialPrice
  }

  const {calculComisionAgent, calculTransportFabAg} = costAchizitieChina();
  firstPrice = +firstPrice * calculComisionAgent * calculTransportFabAg;
  
  debugger
  const preffCostAer = document.getElementById('newCost_Aer')
  const preffCostTren = document.getElementById('newCost_Tren')
  const newCalcFinalPret_Aer = costFinalAchAer()
  const newCalcFinalPret_Tren = costFinalAchTren()
  preffCostAer.innerHTML = `<strong>NOU* Cost Transport Aer: <span style="color: #850025;"> ${newCalcFinalPret_Aer} $ → ${(newCalcFinalPret_Aer * usdExchange).toFixed(2)} RON </span></strong>`;
  preffCostTren.innerHTML = `<strong>NOU* Cost Transport Tren: <span style="color: #850025;"> ${newCalcFinalPret_Tren} $ → ${(newCalcFinalPret_Tren * usdExchange).toFixed(2)} RON </span></strong>`;
            
  preffCostAer.style.display = 'block'
  preffCostTren.style.display = 'block'
}

function showProfit(){
  let priceEmag = document.getElementById('sellPrice')
  let option = document.getElementById('options')
  const profitAer = cProfitFinal(option.value, +priceEmag.value, 'aer').toFixed(2)
  const profitTren = cProfitFinal(option.value, +priceEmag.value, 'tren').toFixed(2)

  const showProfitAer = document.getElementById("profitAer_display")
  const showProfitTren = document.getElementById("profitTren_display")

  showProfitAer.innerText = `Profit aer: ${profitAer} RON`
  showProfitTren.innerText = `Profit tren/mare: ${profitTren} RON`

  showProfitAer.style.display = 'block'
  showProfitTren.style.display = 'block'

  let procentProfitAer;
  let procentProfitTren;
  const procentAer_display = document.getElementById('procentAer_display')
  const procentTren_display = document.getElementById('procentTren_display')

  if (option.value == 2 || option.value == 4){
    priceEmag = pretEmagFaraTVA(+priceEmag.value)
  }
  else {
    priceEmag = +priceEmag.value
  }
  procentProfitAer = ((profitAer/+priceEmag) * 100).toFixed(2)
  procentProfitTren = ((profitTren/+priceEmag) * 100).toFixed(2)
  
  if (procentProfitAer && procentProfitTren){
    if (procentProfitAer >= 30){
      procentAer_display.style.backgroundColor = '#008000'
    }
    else if (procentProfitAer < 30) {
      procentAer_display.style.backgroundColor = "#F6546A"
    }

    if (procentProfitTren >= 30){
      procentTren_display.style.backgroundColor = '#008000'
    }
    else if (procentProfitTren < 30) {
      procentTren_display.style.backgroundColor = "#F6546A"
    }

    procentAer_display.style.color = '#ffffff'
    procentTren_display.style.color = '#ffffff'

    procentAer_display.innerText = `Profit Procentual Aer:  ${procentProfitAer} %`
    procentTren_display.innerText = `Profit Procentual Tren: ${procentProfitTren} %`

    procentAer_display.style.display = 'block'
    procentTren_display.style.display = 'block'
  }
  
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



