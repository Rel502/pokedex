function init() {
    loadAllPokemon();
}

const BASE_URL = "https://pokeapi.co/api/v2/";
let currentPokemonID;

async function getData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

// Rendering cards
let currentPokemonCount = 1;
let pokemonCount = 21;

let namesArr = [];

async function loadAllPokemon() {
    showSpinner();
    const allPokemonData = await getAllPokemonData(151);
    savePokemonData(allPokemonData);
    hideSpinner();
    renderCards();
}

async function getAllPokemonData(count) {
    const promises = [];
    for (let i = 1; i <= count; i++) {
        promises.push(loadSinglePokemon(i));
    }
    return await Promise.all(promises);
}

function savePokemonData(dataArr) {
    dataArr.forEach(pokemon => namesArr.push({
        name: pokemon.name,
        allTypes: pokemon.allTypes,
        mainType: pokemon.mainType,
        img: pokemon.img,
        bgColor: pokemon.bgColor
    }));
}

async function loadSinglePokemon(i) {
    let pokemonRef = await getData(`pokemon/${i}`);
    let name = await getPokemonName(pokemonRef);
    let allTypes = await getPokemonTypes(pokemonRef);
    let mainType = await getMainType(allTypes);
    let pokemonImg = await getPokemonImg(i);
    let bgColor = await setBgColor(mainType);

    return { name, allTypes, mainType, img: pokemonImg, bgColor };
}

// Pushing the Pokemon data of all Pokemon into a local array
function pushToLocalArr(name, allTypes, mainType, pokemonImg, bgColor) {
    namesArr.push({
        "name": name,
        "allTypes": allTypes,
        "mainType": mainType,
        "img": pokemonImg,
        "bgColor": bgColor
    })
}

async function renderCards() {
    let content = document.getElementById('content');

    for (let i = currentPokemonCount; i < pokemonCount; i++) {
        prepareRendering(i, content);
    }

    currentPokemonCount = pokemonCount;
}

async function prepareRendering(i, content) {
    const pokemon = namesArr[i - 1];

    let name = pokemon.name;
    let pokemonImg = pokemon.img;
    let bgColor = pokemon.bgColor;
    let allTypes = pokemon.allTypes;

    content.innerHTML += generateCard(i, name, pokemonImg, bgColor);
    renderTypeImages(`typesContainer${i}`, allTypes);
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

// RENDERING CARD INFO <--- opening a single pokemon card
async function renderCardInfo(id) {
    showPopup();

    let [pokemonRef, pokemonName, pokemonDescrRef, pokemonDescr, allTypes, mainType, pokemonImg, bgColor] = await prepareCardInfoRendering(id);
    let cardContent = document.getElementById('popupOverlayBg');
    cardContent.innerHTML = '';
    cardContent.innerHTML += generateCardDescription(id, pokemonImg, pokemonName, mainType, pokemonDescr);

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

async function loadPokemonData(id) {
    return await Promise.all([
        getData(`pokemon/${id}`),
        getData(`pokemon-species/${id}`)
    ]);
}

async function loadPokemonDetails(ref, id) {
    return await Promise.all([
        getPokemonName(ref),
        getPokemonTypes(ref),
        getPokemonImg(id)
    ]);
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
function nextPokemon(id) {
    if (id < 151) {
        id++;
    } else {
        id = 1;
    }
    renderCardInfo(id);
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