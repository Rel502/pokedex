function init() {
    console.log("läuft");
    renderCards();
}

const BASE_URL = "https://pokeapi.co/api/v2/";

let pokemonCount = 20;

async function getData(path="") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function renderCards() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 1; i < pokemonCount; i++) {   /*<--- ! Auslagern */
        let pokemonRef = await getData(`pokemon/${i}`); 
        let name = pokemonRef['name'];
        let allTypes = await getPokemonTypes(pokemonRef); 
        let mainType = await getMainType(allTypes);
        let pokemonImg = await getPokemonImg(pokemonRef);
        let bgColor = await setBgColor(mainType);

        content.innerHTML += generateCard(i, name, pokemonImg, bgColor);
        renderTypeImages(allTypes, i);
    }
}

function openCardInfo(image, bgColor) {
    showPopup();
    
    let imageBackground = document.getElementById('overlayImgContainer');
    imageBackground.classList = [];
    
    imageBackground.classList.add('overlay-img-container');
    imageBackground.classList.add(`${bgColor}`);

    let currentImage = document.getElementById('currentImage');
    currentImage.src = image;
}

function showPopup() {
    toggleAnythingElse();
}

function closePopup(bgColor) {
    toggleAnythingElse();
}

function toggleAnythingElse() {
    togglePopup();
    toggleHeader();
    toggleScrollbar();
}

function togglePopup() {
    document.getElementById('popupOverlayBg').classList.toggle('d-none');
}

function toggleHeader() {
    document.querySelector('header').classList.toggle('d-none');
}

function toggleScrollbar() {
    document.querySelector('body').classList.toggle('overflow-hidden');
}














function renderTypeImages(allTypes, i) {
    let typesContainer = document.getElementById(`typesContainer${i}`);

    for (let j = 0; j < allTypes.length; j++) {
        let srcRef = "./assets/img/types/" +  allTypes[j] + ".png";
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

async function getPokemonImg(pokemonRef) {
    let pokemonImage = pokemonRef['sprites']['front_default'];
    return pokemonImage;
}

function increasePokeCount() {
    if (pokemonCount < 151) {
        pokemonCount += 20;    
    } else {
        return;
    }
    renderCards();
}