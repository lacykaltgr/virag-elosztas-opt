class Flower {
    constructor(id, type, kotegdb) {
        this.id = id;
        this.type = type;
        this.kotegdb = kotegdb;
    }
}

class Vodor {
    constructor(tartalom, darabszam) {
        this.tartalom = tartalom;
        this.darabszam = darabszam;
    } 
}

var flowers;
const flowerTypeInput = document.querySelector(".flower-name-input");
const flowerQuantityInput = document.querySelector(".flower-quantity-input");
const flowerButton = document.querySelector(".add-flower-button");
const flowerList = document.querySelector(".flowers-list");
const calculateButton = document.getElementById("calculate");


//korábbi virágok betöltése
document.addEventListener('DOMContentLoaded', (event) =>{
    if (localStorage.getItem('flowers') === null) {
      flowers = [];
    } else {
      flowers = JSON.parse(localStorage.getItem('flowers'));
    }
    flowers.forEach(flower => {
      createList(flower);
    });

    id=1;
    for(var virag = 0; virag < flowers.length; virag++){
        flowers[virag].id = id;
        id++;
    }
});

//virág hozzáadásának kezelése
flowerButton.addEventListener('click', (event) => {
    event.preventDefault();
    flowerType = flowerTypeInput.value.trim();
    isUnique = true;
    
    for (flower of flowers){
        if (flower.type == flowerType){
            isUnique = false;
            break;
        }
    }

    if (flowerType != ""){
        if (isUnique) {
            flowerQuantity = flowerQuantityInput.value.trim();
            thisFlower = new Flower(id, flowerType, flowerQuantity);
            flowers.push(thisFlower);
            id++;
            localStorage.setItem('flowers', JSON.stringify(flowers));
            createList(thisFlower);
        }
        else {
            alert("Ilyen típusú virág már lett hozzáadva");
        }
    }
    else {
        alert("Valamilyen név kéne");
    }
    flowerTypeInput.focus();
    flowerTypeInput.value = "";
    flowerQuantityInput.value = 0;
    }
)

//virág törlésének kezelése
flowerList.addEventListener('click', (event) => {
    const item = event.target;
    
    if (item.classList.contains("trash-btn")) {
      const type = item.parentElement;
      const typeText = type.children[0].innerText;
      flowers.forEach((flower, index) => {
        if (flower.type === typeText) {
          flowers.splice(index,1)
        }
      });
      localStorage.setItem('flowers', JSON.stringify(flowers));
      type.remove();
    }
  });

calculateButton.addEventListener('click', (event) => {
    createSolution();
})


//virálista elkészítése
function createList(flower) {
    var row = flowerList.insertRow();
    const newFlower = row.insertCell();
    const quantity = row.insertCell();
    const trashButton = row.insertCell();

    newFlower.innerText = flower.type;
    trashButton.innerText = '-';
    quantity.innerText = flower.kotegdb;
    trashButton.classList.add("btn")
    trashButton.classList.add('trash-btn');
      
    
  }

//egy vödörben lévő bizonyos típus megszámolása
function calcId(id, vdr) {
    let counter = 0;
    for (var virag = 0; virag < 9; virag++){
        if (vdr.tartalom[virag].id == id){
            counter++;
        }
    }
    return counter;
}

//elrendezés-táblázat elkészítésee
function createSolution() {
      flowers.sort(function(a,b){return a.kotegdb - b.kotegdb});

      //kötegek száma
      var kotegszam = 0;
      for (var i in flowers){
          kotegszam += parseInt(flowers[i].kotegdb);
      }
      
      //vödrök szám
      var vodorszam = Math.floor(kotegszam/9);
      var vodrok = new Array(vodorszam);
      for (var i = 0; i < vodrok.length; i++){
          vodrok[i] = new Array(9);
      }

      //vödrök elosztása
      ittvagyunkvirag = 0;
      ittvagyunkhely = 0;
      for (virag of flowers){
          for (var i =0; i < virag.kotegdb; i++){
              if (ittvagyunkhely == 9){
                  break
              }
              vodrok[ittvagyunkvirag][ittvagyunkhely] = virag;
              if (ittvagyunkvirag == vodorszam-1){
                  ittvagyunkvirag = 0;
                  ittvagyunkhely ++;
              }
              else {
                  ittvagyunkvirag++;
              }
          }
      }

      //vödrök összegzése
      var megoldas = [];
      darabszam = 0;
      for (var vodor = 0; vodor < vodrok.length; vodor++) {
            
            darabszam++;
            ugyanAz = true;
            for (var i = 0; i < 9; i++){
                //console.log(i, vodor, vodrok[vodor]);
                if (vodor == vodrok.length-1 || vodrok[vodor][i].id != vodrok[vodor+1][i].id){
                    ugyanAz = false;
                    
                }
            }
            if (!ugyanAz){
                megoldas.push(new Vodor(vodrok[vodor], darabszam));
                darabszam = 0;
            }
      }

      //segéd számolók
      megoldasszam = 0;
      viragszam = 0;
      for (mo of megoldas){
          megoldasszam++;
      }
      for (virag in flowers){
          viragszam++;
      }

    //megoldás táblázat létrehozása
    const solutionTable = document.getElementById('solution-table');
    while(solutionTable.rows.length > 0) {
        solutionTable.deleteRow(0);
      }

    var row;

    //tipusoknak
    row = solutionTable.insertRow();
    for (var cella = 0; cella < viragszam; cella++){
        row.insertCell().innerText = flowers[cella].type;
    }
    row.insertCell();

    //értékéknék
    for (var sor = 0; sor < megoldasszam; sor++) { 
        row = solutionTable.insertRow();
        
        for (var cella = 0; cella < viragszam; cella++){
            row.insertCell().innerText = 
                calcId(flowers[cella].id, megoldas[sor]);    
      }
        row.insertCell().innerText = megoldas[sor].darabszam + " darab";

    }

    //kimaradók
    const kimaradok = document.getElementById('kimaradok');
    kimaradok.innerText 
        = "kimarad " + (parseInt(kotegszam)-9*parseInt(vodorszam)).toString() + " db " + flowers[viragszam-1].type;
}