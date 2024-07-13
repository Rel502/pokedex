function init() {
    console.log("läuft");
    renderCards();
}

const BASE_URL = "https://pokeapi.co/api/v2/";

let pokemonCount = 20;
let currentPokemonID;

async function getData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}


async function renderCards() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 1; i < pokemonCount; i++) {
        await prepareRendering(i, content);
    }
}


async function prepareRendering(i, content) {
    let pokemonRef = await getData(`pokemon/${i}`);
    let name = await getPokemonName(pokemonRef);
    // let name = pokemonRef['name'];
    let allTypes = await getPokemonTypes(pokemonRef);
    let mainType = await getMainType(allTypes);
    let pokemonImg = await getPokemonImg(i);
    let bgColor = await setBgColor(mainType);

    content.innerHTML += generateCard(i, name, pokemonImg, bgColor);
    renderTypeImages(`typesContainer${i}`, allTypes, i);
}


async function getPokemonImg(i) {
    let pokemonRef = await getData(`pokemon/${i}`);
    let pokemonImg = pokemonRef['sprites']['front_default'];
    return pokemonImg;
}


async function getPokemonName(pokemonRef) { 
    let name = await pokemonRef['name'];
    return name;
}


function convertFirstLetterUp(string) {
    let stringInUpperCase = string.toUpperCase();
    
    let firstLetter = stringInUpperCase.slice(0, 1);
    let elseLetters = string.slice(1);

    return firstLetter + elseLetters;
}


async function renderCardInfo(id) {
    showPopup();

    // Notwendige Variablen definieren
    let pokemonRef = await getData(`pokemon/${id}`);
    let pokemonName = await getPokemonName(pokemonRef);
    let pokemonDescrRef = await getData(`pokemon-species/${id}`);
    let pokemonDescr = await pokemonDescrRef['flavor_text_entries'][25]['flavor_text'];
    let allTypes = await getPokemonTypes(pokemonRef); 
    let mainType = await getMainType(allTypes);
    let pokemonImg = await getPokemonImg(id);                  
    let bgColor = await setBgColor(mainType);

    // HTML generieren
    let cardContent = document.getElementById('popupOverlayBg');
    cardContent.innerHTML = '';

    cardContent.innerHTML += generateCardDescription(id, pokemonImg, pokemonName, mainType, pokemonDescr);

    // renderTypeImages('typesContainerCard', allTypes, id);
    insertOverlayImage(pokemonImg, bgColor);
}


function nextPokemon(id) {
    id++;
    renderCardInfo(id);
}

function previousPokemon(id) {
    id--;
    renderCardInfo(id);
}












function insertOverlayImage(image, bgColor) {
    let imageBackground = document.getElementById('overlayImgContainer');
    imageBackground.classList = [];

    imageBackground.classList.add('overlay-img-container');
    imageBackground.classList.add(`${bgColor}`);

    let currentImage = document.getElementById('currentImage');
    currentImage.src = image;
}


function showPopup() {
    togglePopup('show');
    toggleHeader('hide');
    toggleScrollbar('hide');
}


function closePopup() {
    togglePopup('hide');
    toggleHeader('show');
    toggleScrollbar('show');
}


function togglePopup(param) {
    if (param == 'show') {
        document.getElementById('popupOverlayBg').classList.remove('d-none');
    } else {
        document.getElementById('popupOverlayBg').classList.add('d-none');
    }
}


function toggleHeader(param) {
    if (param == 'show') {
        document.querySelector('header').classList.remove('d-none');
    } else {
        document.querySelector('header').classList.add('d-none');
    }
}


function toggleScrollbar(param) {
    if (param == 'show') {
        document.querySelector('body').classList.remove('overflow-hidden');
    } else {
        document.querySelector('body').classList.add('overflow-hidden');
    }
}


function renderTypeImages(container, allTypes, i) {
    let typesContainer = document.getElementById(container);

    for (let j = 0; j < allTypes.length; j++) {
        let srcRef = "./assets/img/types/" + allTypes[j] + ".png";
        typesContainer.innerHTML += generateTypeIcon(allTypes[j], srcRef);
    }
}


async function getPokemonTypes(pokemonRef) {
    let typesArr = await pokemonRef['types'];
    let allTypes = [];

    for (let i = 0; i < typesArr.length; i++) {
        let type = typesArr[i]['type']['name'];
        allTypes.push(type);
    }

    return allTypes;
}


async function getMainType(allTypes) {
    let mainType = allTypes[0];
    return mainType;
}


function setBgColor(mainType) {
    let bgColor = `bg-color-${mainType}`;
    return bgColor;

}


function increasePokeCount() {
    if (pokemonCount < 151) {
        pokemonCount += 20;
    } else {
        return;
    }
    renderCards();
}