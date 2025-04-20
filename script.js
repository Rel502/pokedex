async function init() {
    await loadPokemon(loadedCount, 20);
    loadedCount += 20;
}

let AllPokemonData = [];
let CurrentPokemonData = [];

let loadedCount = 0;
// let currentPokemonCount = 1;
// let pokemonCount = 21;

const BASE_URL = "https://pokeapi.co/api/v2/";

async function getData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadPokemon(startIndex, count) {
    showSpinner();

    for (let i = startIndex; i < startIndex + count; i++) {
        let pokemonRef = await getData(`pokemon/${i + 1}`);
        AllPokemonData.push(pokemonRef);
        // console.log(`#${i+1}: ${pokemonRef.name}`);
    }

    hideSpinner();
    renderCards();
}

function renderCards() {
    let content = document.getElementById('content');
    content.innerHTML = "";

    CurrentPokemonData = AllPokemonData;

    for (let i = 0; i < CurrentPokemonData.length; i++) {
        let pRef = CurrentPokemonData[i];

        let name = pRef.name;
        let pokemonImg = getPokemonImg(pRef);
        let allTypes = getPokemonTypes(pRef);
        let mainType = getMainType(allTypes);
        let bgColor = setBgColor(mainType);

        content.innerHTML += generateCard(i + 1, name, pokemonImg, bgColor)
        renderTypeImages(`typesContainer${i + 1}`, allTypes);
    }
}








// RENDERING CARD INFO <--- opening a single pokemon card

async function renderCardInfo(id) {
    showPopup();

    let pRef = CurrentPokemonData[id - 1];

    let name = pRef.name;
    let pokemonDescrRef = await getData(`pokemon-species/${id}`);
    let pokemonDescr = getDescription(pokemonDescrRef);
    let pokemonImg = getPokemonImg(pRef);
    let allTypes = getPokemonTypes(pRef);
    let mainType = getMainType(allTypes);
    let bgColor = setBgColor(mainType);

    let cardContent = document.getElementById('popupOverlayBg');
    cardContent.innerHTML = '';
    cardContent.innerHTML += generateCardDescription(id, pokemonImg, name, mainType, pokemonDescr);

    insertOverlayImage(pokemonImg, bgColor);
    renderTypeImages(`typesContainerDescr${id}`, allTypes);
}




async function prepareCardInfoRendering(id) {
    const [ref, species] = await loadPokemonData(id);
    const [name, types, img] = await loadPokemonDetails(ref, id);
    const mainType = await getMainType(types);
    const bgColor = await setBgColor(mainType);
    const descr = getDescription(species);

    return [ref, name, species, descr, types, mainType, img, bgColor];
}

function getDescription(species) {
    return species['flavor_text_entries'][25]?.['flavor_text'] || 'Keine Beschreibung';
}







// RENDERING -> Pokemon Stats 
async function renderCardStats(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';
    content.innerHTML += generateCardStats(id);
    await prepareStatsRendering(content, id);
}

async function prepareStatsRendering(content, id) {
    let pokemonRef = await getData(`pokemon/${id}`);
    let statsRef = await pokemonRef.stats;

    for (let statsIndex = 0; statsIndex < statsRef.length; statsIndex++) {
        let statName = statsRef[statsIndex].stat.name;
        let statValue = statsRef[statsIndex].base_stat;
        let statsContainer = document.getElementById('statsContainer');

        statsContainer.innerHTML += generateProgressBar(statValue, statName);
    }
}

async function renderCardEvolution(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';

    content.innerHTML += generateCardEvolution(id);

    await prepareEvolutionRendering(id);
}

async function prepareEvolutionRendering(id) {
    let evolutionChainRef = await getEvolutionChainRef(id);
    let evolutionStages = await getEvolutionStages(evolutionChainRef);

    let content = document.getElementById('evolutionContainer');
    content.innerHTML = '';

    for (let i = 0; i < evolutionStages.length; i++) {
        let currentStage = evolutionStages[i];
        content.innerHTML += generateEvolutionStages(currentStage);
    }
}

async function getEvolutionChainRef(id) {
    let pokemonSpecies = await getData(`pokemon-species/${id}`);
    let evolutionChainUrl = await pokemonSpecies.evolution_chain.url;
    let evolutionData = await getEvolutionData(evolutionChainUrl);
    return await evolutionData.chain;
}

async function getEvolutionData(evolutionChainUrl) {
    let response = await fetch(evolutionChainUrl);
    let responseToJson = await response.json();
    return responseToJson;
}

async function getEvolutionStages(evolutionChainRef) {
    let evolutionStages = [];
    evolutionStages.push(insertFirstStageOfEvolution(evolutionChainRef));
    return addRemainingStages(evolutionChainRef.evolves_to, evolutionStages, 1);
}

function addRemainingStages(evolves_to, stages, stageIndex) {
    while (evolvesToNotEmpty(evolves_to)) {
        const current = evolves_to[0];
        stages.push(insertRestOfEvolutionStages(current, stageIndex));
        evolves_to = current.evolves_to;
        stageIndex++;
    }
    return stages;
}

function insertRestOfEvolutionStages(currentStage, stageIndex) {
    return ({
        index: stageIndex,
        name: currentStage.species.name,
        url: currentStage.species.url,
    });
}

function evolvesToNotEmpty(evolves_to) {
    return evolves_to.length !== 0;
}

function insertFirstStageOfEvolution(evolutionChainRef) {
    return ({
        index: 0,
        name: evolutionChainRef.species.name,
        url: evolutionChainRef.species.url,
    })
};

// NEXT / PREVIOUS POKEMON
//-> Abfrage: nächstes Pokemon bereits vorhanden in CurrentPokemonData?
//-> check loadedAmount?
//-> falls nein, -> loadMore!




// function nextPokemon(id) {
//     if (id < 151) {
//         id++;
//     } else {
//         id = 1;
//     }
//     renderCardInfo(id);
// }

function nextPokemon(id) {
    if (id < 151) {
        id++;
    } else {
        id = 1;
    }

    checkNextPokemon(id);
}

function checkNextPokemon(id) {
    if (!CurrentPokemonData[id-1]) {
        increasePokeCount().then(() => {
            renderCardInfo(id);
        });
    } else {
        renderCardInfo(id);
    }
}

function previousPokemon(id) {
    id--;
    if (!id < 1) {
        renderCardInfo(id);
    } else {
        return;
    }
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

// Close overlay if click on background
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

function renderTypeImages(container, allTypes) {
    let typesContainer = document.getElementById(container);

    for (let j = 0; j < allTypes.length; j++) {
        let srcRef = "./assets/img/types/" + allTypes[j] + ".png";
        typesContainer.innerHTML += generateTypeIcon(srcRef);
    }
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

function getPokemonImg(pRef) {
    let pokemonImg = pRef['sprites']['front_default'];
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