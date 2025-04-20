async function getPokemonName(pokemonRef) {
    let name = await pokemonRef['name'];
    return name;
}

function getPokemonTypes(pokemonRef) {
    let typesArr = pokemonRef['types'];
    let allTypes = [];

    for (let i = 0; i < typesArr.length; i++) {
        let type = typesArr[i]['type']['name'];
        allTypes.push(type);
    }
    return allTypes;
}

function getMainType(allTypes) {
    let mainType = allTypes[0];
    return mainType;
}

function setBgColor(mainType) {
    let bgColor = `bg-color-${mainType}`;
    return bgColor;
}

function renderTypeImages(container, allTypes) {
    let typesContainer = document.getElementById(container);

    for (let j = 0; j < allTypes.length; j++) {
        let srcRef = "./assets/img/types/" + allTypes[j] + ".png";
        typesContainer.innerHTML += generateTypeIcon(srcRef);
    }
}

function getPokemonImg(pRef) {
    let pokemonImg = pRef['sprites']['front_default'];
    return pokemonImg;
}

function getDescription(species) {
    return species['flavor_text_entries'][25]?.['flavor_text'] || 'Keine Beschreibung';
}

document.addEventListener("click", (event) => {
    let window = document.getElementById('popupOverlayBg');

    if (event.target == window) {
        closePopup();
    }
});

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

function convertFirstLetterUp(string) {
    let stringInUpperCase = string.toUpperCase();

    let firstLetter = stringInUpperCase.slice(0, 1);
    let elseLetters = string.slice(1);

    return firstLetter + elseLetters;
}

async function increasePokeCount() {
    let loadAmount = updateLoadAmount();
    if (loadAmount === 0) return;

    await loadPokemon(loadedCount, loadAmount);
    loadedCount += loadAmount;

    checkLoadedCount();
}

function updateLoadAmount() {
    if (loadedCount >= 151) {
        return 0;
    } else if (loadedCount < 131) {
        return 20;
    } else {
        return 151 - loadedCount;
    }
}

function checkLoadedCount() {
    if (loadedCount >= 151) {
        toggleBtn('loadMoreBtn', 'hide');
    }
}

function toggleBtn(id, state) {
    let button = document.getElementById(id);

    if (state === 'hide') {
        button.classList.add('d-none');
    } else if (state === 'show') {
        button.classList.remove('d-none');
    }
}

function showSpinner() {
    let container = document.getElementById('loadingSpinner');
    container.classList.remove('d-none');
    toggleScrollbar('hide');
}

function hideSpinner() {
    let container = document.getElementById('loadingSpinner');
    container.classList.add('d-none');
    toggleScrollbar('show');
}

function insertOverlayImage(image, bgColor) {
    let imageBackground = document.getElementById('overlayImgContainer');
    imageBackground.classList = [];

    imageBackground.classList.add('overlay-img-container');
    imageBackground.classList.add(`${bgColor}`);

    let currentImage = document.getElementById('currentImage');
    currentImage.src = image;
}