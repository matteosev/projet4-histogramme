function checkInputs(){
  sizeData = parseInt(document.querySelector("#sizeData").value);
  (sizeData < 1)? document.querySelector("#sizeData").value = 1: "";
  (sizeData > 25)? document.querySelector("#sizeData").value = 25: "";
}

function generateRandomData(){
  const size = document.querySelector('#sizeData').value;
  const min = parseFloat(document.querySelector('#limitInf').value);
  const max = parseFloat(document.querySelector('#limitSup').value);
  let x = []; // attention à bien déclarer les tableaux sur 2 lignes 
  let y = []; // let x = y = []; assigne les variables x et y au même tableau

  for (i = 0; i < size; i++){
    x.push(i);
    y.push(Math.random() * (max - min) + min);
  }

  console.clear();
  console.log(`data abscisse : ${x}`);
  console.log(`data ordonnée : ${y}`);
  document.querySelector("#listX").value = x;
  document.querySelector("#listY").value = y;
  drawHisto();
}

function countDecimals(number){
  if (Math.floor(number) === number) return 0;
  return number.toString().split(".")[1].length;
}

function getScale(number){
  /*
  entrée: un nombre < 1
  sortie: l'échelle du nombre
  ex: 
  getScale(647) = 2
  l'échelle de 647 est 10^2 = 100
  getScale(0.045) = -2
  l'échelle de 0.045 est 10^-2 = 0.01

  ne gère pas les nombres négatifs pour l'instant
  */

  if (number >= 1){
    number = number.toString();
    if (number.includes(".")){
      for (let [index, digit] of (number).split("").entries()){
        if (digit == "."){return index - 1;}
      }
    }
    else{
      return number.length - 1;
    }
  } 
  else if (number >= 0){
    if (number.toString().includes("e")){
      number = number.toString();
      for (i = 0; i < number.length; i++){
        if (number[i] == "e"){
          return number.substring(i + 1);
        }
      }
    }
    else{
      for (let [index, digit] of (number % 1).toString().replace("0.", "").split("").entries()){
        if (digit != "0"){return -(index + 1);}
      } 
    }
  }
}

function adaptToDisplay(number){
      // on s'assure que le nombre est bien un nombre et pas une chaine de caractère
  number = parseFloat(number);
  if (number >= Math.pow(10, 6)){
    // l'exposant de l'échelle du nombre, ex: getScale(236) = 2
    const exponent = getScale(number);
    // l'échelle, ex: Math.pow(10, 2) = 10^2 = 100
    const scale = Math.pow(10, exponent);
    // on arrondi le nombre au maximum
    number = Math.floor(number / scale) * scale;
    // on convertit le nombre en notation scientifique
    number = number.toExponential();
    // en 1 ligne
    // number = (Math.floor(parseFloat(number) / Math.pow(10, getScale(number))) * Math.pow(10, getScale(number))).toExponential();
  } else if (number >= 10){
    number = number.toFixed(0);
  } else if (countDecimals(number) > 3){
    number = number.toFixed(3);
  } else if (countDecimals(number) > 3){
    scale = Math.abs(getScale(number));
    number = parseFloat(number.toFixed(scale));
    if (number < 0.001){
      number = number.toExponential();
    }
  }
  return number;
}

function getLists(){
  /*
  entrée: aucune

  sortie: un objet contenant deux tableaux 
    abs: les abscisses des colonnes à tracer
    ord: les ordonnées des colonnes à tracer

  action: produire les listes contenant les abscisses et ordonnées
          tout en supprimant les chaines de caractère vides "" et
          en convertissant chaque élément en nombre
  */

  // document.querySelector("#monId") : sélectionne l'élément d'id "monId"
  // .value : récupère la valeur de l'élément (ici le texte contenu dans la balise <input>)
  // .split("monSéparateur") : découpe la chaine de caractère en fonction de "monSéparateur"
  // .filter(valeurDeChaqueElementDeLaListe => fonction à exécuter)

  
  /*
  la notation val => val équivaut à 
  function(val){return val === true}
  explication : 
  une chaine de caractère vide "" renvoie le booléen false
  val va prendre la valeur tour à tour de chaque élément de la liste
  puis la fonction val => val renvoie un booléen false si 
  val est une chaine de caractères vide
  la méthode filter() prend en paramètre ce booléen, si le booléen 
  renvoyé est false alors elle supprime l'élément de la liste

  si vous avez fait peu ou pas de js et ne comprenez pas cette méthode 
  c'est normal, sinon vous êtes un génie
  il est tout à fait possible de créer une fonction soi même qui prend
  en paramètre un tableau et renvoie ce tableau sans les ""
  c'est ce que j'ai fais avant d'utiliser filter() :

  function removeEmptyStringsFromArray(array){
    for (i in array){
      if (array[i] === ""){
        array.splice(i, 1);
      }
    }
    return array
  }
  
  mais vous reconnaitrez que la syntaxe est moins élégante
  array.splice(i, 1) supprime 1 élément à partir de l'index i
  
  à noter : on aurait pu remplacer le 

  if (array[i] === ""){
    array.splice(i, 1);
  }

  par 

  (array[i] === "")? array.splice(i, 1): "ne rien faire";

  j'utilise cette syntaxe plusieurs fois dans ce programme

  list.map(function) : applique la fonction à chaque élément de la liste
  soit list.map(Number) : convertit tous les éléments de la liste en nombre
  ou si on veut être parfaitement exact
  construit un nouvel objet "Number" à partir de chaque élement de 
  la liste et remplace l'ancien élément par l'objet construit

  */

  return {
    abs: document.querySelector("#listX").value.split(",").filter(val => val).map(Number),
    ord: document.querySelector("#listY").value.split(",").filter(val => val).map(Number)
  };
}

function sortLists(abs, ord){
  length = abs.length;
  //au cas où différence de taille entre les listes
  (abs.length > ord.length)? length = abs.length - (abs.length - ord.length) : "";
  (abs.length < ord.length)? length = ord.length - (ord.length - abs.length) : "";

  // tri par insertion par rapport aux abscisses
  for (let i = 1; i < length; i++){
    let tmpAbs = abs[i];
    let tmpOrd = ord[i];
    let k = i;
    while (k > 0 && abs[k - 1] > tmpAbs){
      abs[k] = abs[k - 1];
      ord[k] = ord[k - 1];
      k--
    }
    abs[k] = tmpAbs;
    ord[k] = tmpOrd;
  }
}

function getExtremums(list){
  /*
  entrée: la liste dont vous voulez le minimum et le maximum

  sortie: un objet contenant deux nombres
    min: le minimum
    max: le maximum

  action: trouver le minimum et le maximum d'une liste
  */

  /*
  for (val of list){console.log(val);}
  =
  for (i in list){console.log(list[i]);}
  */

  let min = max = list[0]

  for (val of list){
    (val < min)? min = val: "";
    (val > max)? max = val: "";
  }

  return {
    min: min, 
    max: max
  };
}

function createColumns(listX, listY){
  /*
  entrée: 2 tableaux
    listX: un tableau contenant les abscisses
    listY: un tableau contenant les ordonnées

  sortie: un tableau content plusieurs objets
    objet{
      abs: l'abscisse de la colonne à tracer
      ord: l'ordonnée de la colonne à tracer
    }

  action: transformer les listes contentant les abscisses et ordonnées
          en objets représentant des colonnes
          1 objet = 1 colonne
  */

  let columns = [];

  // (condition)? action si vrai: action si faux;
  (listX.length < listY.length)? maxIndex = listX.length: maxIndex = listY.length;

  for (i = 0; i < maxIndex; i++){
    columns.push({
      abs: listX[i], 
      ord: listY[i]
    });
  }

  return columns;
}

function customRound(numberToRound, nbDecimal = 0){
  /*
  entrée: 
    numberToRound: le nombre à arrondir
    nbDecimal: le nombre de chiffres après la virgule, vaut pas défaut 0
  sortie: le nombre arrondi

  cette fonction était sensée arrondir un nombre à un nombre de décimales 
  choisi par l'utilisateur, mais je me suis rendu compte que cela existait déjà:
  Number.toFixed(nombreDeDecimales)
  je la laisse au cas où ça vous intéresse de voir comment j'ai fais
  */

  multiplier = "1"; // attention c'est bien une chaine de caractère
  for (let i = 0; i < nbDecimal; i++){
    multiplier += "0";  // si nbDecimal = 2, multiplier = "100"
  }

  // transforme la chaine de caractère en nombre entier "100" => 100
  multiplier = parseInt(multiplier);

  // retourne le nombre arrondi au nombre de décimales voulues
  // ex: Math.round(1.2345 * 100) / 100 = Math.round(123.45) / 100
  //                                    = 123 / 100
  //                                    = 1.23
  return Math.round(numberToRound * multiplier) / multiplier;
}

/* fonctions de tracer 
beginPath: on commence un nouveau "chemin"

moveTo(x, y): on se déplace sur la canvas à la position (x, y) 
en "levant le crayon"

lineTo(x, y): idem sauf en "appuyant sur le crayon"

stroke(): on dessine le "chemin"

attention: tant que la fonction stroke() n'est pas appelée, rien n'est dessiné
*/



function drawAbs(graduationLength, axisSize, listAbs, step){
  /*
  entrée:
    graduationLength: la longueur des graduations
    axisSize: la taille réservée pour l'affichage des axes
    listAbs: la liste des abscisses
    step: la distance horizontale entre chaque graduation
  sortie: aucune
  Cette fonction est une procédure, c'est à dire qu'elle ne renvoie aucune
  valeur, elle dessine les graduations sur l'axe des abscisses.
  */

  ctx.fillStyle = "black";  // couleur de remplissage (pour le texte)
  ctx.textAlign = "center"; // alignement horizontal
  ctx.beginPath();
  for (i in listAbs){
    let value = listAbs[i];
    //value = value.toFixed(Math.abs(getScale(value)));
    value = adaptToDisplay(value);
    const x = axisSize + i * step;  // abscisse de la graduation
    // on écrit la valeur de la graduation
    ctx.fillText(String(value), x + step / 2, histoHeight + 2 * graduationLength)
    // on se place sur l'axe des abscisses à la position de la graduation
    ctx.moveTo(x, histoHeight);
    // on trace la graduation
    ctx.lineTo(x, histoHeight + graduationLength);
  }
}

function drawOrd(graduationLength, axisSize, histoHeight, minOrd, maxOrd){
  /*
  entrée:
    graduationLength: la longueur des graduations
    axisSize: la taille réservée pour l'affichage des axes
    histoHeight: la hauteur de l'histogramme
    maxOrd: la valeur maximale en ordonnées
  sortie: aucune
  Cette procédure dessine les graduations sur l'axe des ordonnées.
  */

  ctx.textAlign = "center"; // alignement horizontal du texte 
  ctx.textBaseline = "middle";  // alignement vertical du texte
  const nbGraduation = 10;
  // distance verticale entre chaque graduation
  const stepGraduation = histoHeight / nbGraduation;
  // différence entre chaque valeur des graduations
  let stepValue;
  let value;
  if (minOrd >= 0){
    stepValue = maxOrd / nbGraduation;
    value = 0;
  } else{
    stepValue = (maxOrd + Math.abs(minOrd)) / nbGraduation;
    value = minOrd;
  }
  // parcours des graduations
  for (let i = 0; i < nbGraduation; i++){
    // calcul et arrondi si nécessaire de la valeur à afficher
    toDisplay = adaptToDisplay(value);
    // hauteur de la graduation à tracer
    const y = histoHeight - i * stepGraduation;
    // affichage de la valeur à gauche de la graduation dans l'espace réservé
    ctx.fillText(String(toDisplay), axisSize / 2 - graduationLength / 2, y);
    // on se place sur l'axe des ordonnées à la hauteur de la graduation
    ctx.moveTo(axisSize, y);
    // on trace la graduation
    ctx.lineTo(axisSize - graduationLength, y);
    value += stepValue;
  }
}

function drawColumns(columns, minOrd, maxOrd, step, axisSize){

  ctx.fillStyle = "#add8e6"; 
  // parcours de toutes les colonnes
  for (i in columns){
    column = columns[i];
    const abs  = i * step.abs;  // position "virtuelle" en abscisse
    let ord;
    //const ord = column.ord * step.ord;  // idem pour les ordonnées
    if (column.ord > 0){
      ord = column.ord * step.ord + Math.abs(minOrd) * step.ord;  // idem pour les ordonnées
    } else if (column.ord < 0){
      ord = Math.abs(column.ord);
    }
    // trace le contour de la colonne
    ctx.strokeRect(abs + axisSize, can.height - axisSize, step.abs, -ord);  
    // rempli la colonne
    ctx.fillRect(abs + ctx.lineWidth + axisSize, can.height - ctx.lineWidth - axisSize, step.abs - 2 * ctx.lineWidth, -ord + 2 * ctx.lineWidth);
  }
}

function drawHisto(){
  /*
  entrée: aucune
  sortie: aucune
  Cette procédure trace l'histogramme, les graduations des abscisses 
  et des ordonées.
  */

  // on récupère les listes des abscisses et ordonnées entrées par l'utilisateur
  const lists = getLists();

  sortLists(lists.abs, lists.ord);
  // on récupère le minimum et maximum de chaque liste
  const extremums = {
    abs: getExtremums(lists.abs),
    ord: getExtremums(lists.ord)
  }

  minOrd = extremums.ord.min;
  maxOrd = extremums.ord.max;

  // espace réservé aux graduations
  const axisSize = 200;
  // largeur et hauteur de l'histogramme
  const histoWidth = histoHeight = can.width - axisSize;

  // la longueur d'une unité sur chaque axe
  const step = {
    abs: histoWidth / lists.abs.length,
    ord: histoHeight / (Math.abs(minOrd) + maxOrd)
  }

  // on transforme les listes pour en faire des objets 
  // 1 objet = 1 colonne 
  const columns = createColumns(lists.abs, lists.ord);


  // partie dessin

  ctx.clearRect(0,0, can.width, can.height);    // tout effacer
  ctx.strokeRect(0, 0, can.width, can.height);  // tracer cadre canvas
  ctx.strokeRect(axisSize, 0, histoWidth, histoHeight);

  const graduationLength = 50;  // longueur des graduations
  drawAbs(graduationLength, axisSize, lists.abs, step.abs);
  drawOrd(graduationLength, axisSize, histoHeight, minOrd, maxOrd);
  ctx.stroke();

  drawColumns(columns, extremums.ord.min, extremums.ord.max, step, axisSize);
}

function resizeCanvas(){

  // si l'écran est en mode portrait
  if (window.innerWidth < window.innerHeight){
    /*can.style.width = "100%";  // largeur "physique" (extérieur)
    can.style.height = window.getComputedStyle(can, null).getPropertyValue("width");*/
    /*
    hauteur "physique" (extérieur) :
    window.getComputedStyle(can, null) = on récupère les attributs de style
    getPropertyValue("width") = on récupère la largeur en PIXELS
    puis on assigne à la hauteur la même valeur que la largeur
    le canvas est donc un carré
    */
  }
  // si l'écran est en mode paysage
  else{
    // hauteur de l'élément body - distance par rapport au bord supérieur de cet élément
    /*const possibleHeight = parseInt(window.getComputedStyle(document.body, null).getPropertyValue("height")) - can.getBoundingClientRect().top;
    // largeur de l'élément contenant le canvas
    const containerWidth = parseInt(window.getComputedStyle(document.querySelector("#main"), null).getPropertyValue("width"));
    if (possibleHeight < containerWidth){
      can.style.height = possibleHeight + "px";
      can.style.width = window.getComputedStyle(can, null).getPropertyValue("height");
    }
    else{
      can.style.width = "100%";  // largeur "physique" (extérieur)
      can.style.height = window.getComputedStyle(can, null).getPropertyValue("width");
    }*/
  }
  // quand le canvas est petit les trait disparaissent car trop fins
  // donc j'augmente l'épaisseur
  (parseInt(can.style.height) < 300)? ctx.lineWidth = 5: ctx.lineWidth = 3;

  // on trace l'histogramme
  drawHisto();
}

// mise en place
const can = document.querySelector('#can');
can.width = 1200; // largeur "virtuelle" (intérieur)
can.height = 1200;  // hauteur "virtuelle" (intérieur)
// body occupe toute la hauteur de l'écran
// on récupère le contexte (= image du canvas à un instant donné) pour 
// pouvoir dessiner dessus
const ctx = can.getContext("2d");
ctx.font = "30px Arial";  // taille et police du texte
generateRandomData()
resizeCanvas(); // on met le canvas à la bonne taille

// pour rendre le canvas "responsive" (adaptatif)
// window.addEventListener("événement", fonctionAexecuter)
window.addEventListener("resize", resizeCanvas);

inputs = document.querySelectorAll("input");

for (i in inputs){
  inputs[i].onchange = checkInputs;
}