/**
 * Este es el metodo principal, agrega los eventos y su respectivo valor de squirrel.
 * Tambien cuenta la cantidad de positivos y negativos.
 * llama a las funciones de calcular el MCC y agregar los elementos en el orden respectivo
 * en el HTML.
 */
async function loadTable1(){
    const doc1 = await fetch('https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json');
    const json = await doc1.json();
    for(let i = 0; i < json.length; i++){
        let body1 = document.getElementsByClassName('bodyTable1')
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.textContent = "" + (i+1);
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        td1.textContent = json[i].events;
        td2.textContent = json[i].squirrel;
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        if(json[i].squirrel === true){
            tr.className = 'table-danger';
            positives += 1;
        }
        else
            negatives += 1;
        body1[0].appendChild(tr);

        countEvents(json[i].events, json[i].squirrel);
    }
    calculateMcc();
    addElementsMcc(mccArray);  
}

/**
 * Esta funcion agrega a los true positives y false negatives de cada evento que esta
 * en el mapa. Si no esta en el mapa se agrega un nuevo elemento al mapa.
 * @param {*} arr arreglo de los eventos de una entrada del json.
 * @param {*} bool indica el valor de squirrel de los eventos
 */
function countEvents(arr, bool){
    for(let i = 0; i < arr.length; i++){
        let mapElement;
        if(eventMap.has(arr[i]))
            mapElement = eventMap.get(arr[i]);
        else
            mapElement = eventMap.set(arr[i], {tp: 0, fn: 0, mcc: 0});
        
        if(bool === true)
            eventMap.get(arr[i]).tp += 1;
        else
            eventMap.get(arr[i]).fn += 1;
    }
}

/**
 * calcula el MCC por cada elemento del map, lo guarda en un arreglo.
 * al final ordena el arreglo con respecto al mcc.
*/
function calculateMcc(){
    for(const[key, value] of eventMap){
        let tp = value.tp;
        let fn = value.fn;
        let tn = negatives - fn;
        let fp = positives - tp;
        value.mcc = mcc(tp,tn,fp,fn);
        mccArray.push({mcc: value.mcc, event: key});
    }
    mccArray.sort((a,b)=>b.mcc-a.mcc);
}

/**
* funcion que calcula el mcc dados los TN, TN, FP y FN.
*/
function mcc(tp, tn, fp, fn){
    let res = ((tp*tn)-(fp*fn))/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn));
    return res;
}

//Añade elementos del arreglo ordenado de eventos y su coeficiente.
function addElementsMcc(arr){
    for(let i = 0; i < arr.length; i++){
        let body1 = document.getElementsByClassName('bodyTable2')
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.textContent = "" + (i+1);
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        td1.textContent = arr[i].event;
        td2.textContent = arr[i].mcc;
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        body1[0].appendChild(tr);
    }
}

/**
 * variables que guardan la cantidad de positivos y negativos.
 */
let positives = 0;
let negatives = 0;

/**
 * arreglo que se usa para ordenar eventos con respecto a su mcc
 */
let mccArray = [];

/**
 * Map para guardar cada evento, su cuenta de true positives, false negatives y su mcc.
 */
let eventMap = new Map();

/**
 * llamada a metodo principal
 */
loadTable1();
