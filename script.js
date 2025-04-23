// Initializes the app by loading all Pokémon names and the first 20 Pokémon
async function init() {
    await loadAllNames();
    await loadPokemon(loadedCount, 20);
}

let AllPokemonData = [];
let CurrentPokemonData = [];
let AllNamesArr = [];
// -> AllNamesArr[i].name -> "bulbasaur"
// -> AllNamesArr[i].url -> "https://pokeapi.co/api/v2/pokemon/1/"

let loadedCount = 0;

const BASE_URL = "https://pokeapi.co/api/v2/";

// Fetches data from a given API path
async function getData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

// Loads names and URLs of all 151 Pokémon into AllNamesArr
async function loadAllNames() {
    let response = await getData(`pokemon?limit=151`);
    let allNamesRef = response.results;

    for (let i = 0; i < 151; i++) {
        let element = allNamesRef[i];
        AllNamesArr.push(element);
    }
}

// Loads detailed data for a batch of Pokémon and renders them
async function loadPokemon(startIndex, count) {
    showSpinner();

    for (let i = startIndex; i < startIndex + count; i++) {
        let pokemonRef = await getData(`pokemon/${i + 1}`);
        AllPokemonData.push(pokemonRef);
    }
    
    loadedCount += count;
    hideSpinner();
    renderCards();
}

// Renders all Pokémon cards currently in memory
function renderCards() {
    let content = document.getElementById('content');
    content.innerHTML = "";

    CurrentPokemonData = AllPokemonData;

    for (let i = 0; i < CurrentPokemonData.length; i++) {
        let [id, name, pokemonImg, bgColor, allTypes] = prepareRendering(i);

        content.innerHTML += generateCard(id, name, pokemonImg, bgColor)
        renderTypeImages(`typesContainer${id}`, allTypes);
    }
}

// Prepares data needed for rendering a Pokémon card
function prepareRendering(i) {
    let pRef = CurrentPokemonData[i];
    let id = pRef.id;
    let name = pRef.name;
    let pokemonImg = getPokemonImg(pRef);
    let allTypes = getPokemonTypes(pRef);
    let mainType = getMainType(allTypes);
    let bgColor = setBgColor(mainType);

    return [id, name, pokemonImg, bgColor, allTypes];
}

// Renders the popup with detailed Pokémon info
async function renderCardInfo(id) {
    showPopup();

    let [pokemonImg, name, mainType, pokemonDescr, bgColor, allTypes] = await prepareCardInfoRendering(id);
    let cardContent = document.getElementById('popupOverlayBg');

    cardContent.innerHTML = '';
    cardContent.innerHTML += generateCardDescription(id, pokemonImg, name, mainType, pokemonDescr);

    hidePrevButtonIfFirstPokemon(id);
    insertOverlayImage(pokemonImg, bgColor);
    renderTypeImages(`typesContainerDescr${id}`, allTypes);
}

// Prepares data needed for the info popup of a Pokémon
async function prepareCardInfoRendering(id) {
    let pRef = CurrentPokemonData.find(p => p.id === Number(id));
    let name = pRef.name;
    let pokemonDescrRef = await getData(`pokemon-species/${id}`);
    console.log(pokemonDescrRef);
    
    let pokemonDescr = getDescription(pokemonDescrRef);
    let pokemonImg = getPokemonImg(pRef);
    let allTypes = getPokemonTypes(pRef);
    let mainType = getMainType(allTypes);
    let bgColor = setBgColor(mainType);

    return [pokemonImg, name, mainType, pokemonDescr, bgColor, allTypes];
}

// Renders Pokémon base stats in the popup
async function renderCardStats(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';
    content.innerHTML += generateCardStats(id);
    prepareStatsRendering(id);
}

// Prepares and renders stat progress bars
function prepareStatsRendering(id) {
    let pRef = CurrentPokemonData.find(p => p.id === Number(id));
    // let pRef = CurrentPokemonData[id - 1];
    let statsRef = pRef.stats;

    for (let statsIndex = 0; statsIndex < statsRef.length; statsIndex++) {
        let statName = statsRef[statsIndex].stat.name;
        let statValue = statsRef[statsIndex].base_stat;
        let statsContainer = document.getElementById('statsContainer');

        statsContainer.innerHTML += generateProgressBar(statValue, statName);
    }
}

// Renders the evolution section in the popup
function renderCardEvolution(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';
    content.innerHTML += generateCardEvolution(id);
    prepareEvolutionRendering(id, content);
}

// Fetches and prepares data for rendering evolution stages
async function prepareEvolutionRendering(id, content) {
    let evoChainRef = await getEvoChainRef(id);
    let EvolutionStages = await getEvolutionData(evoChainRef);

    for (let i = 0; i < EvolutionStages.length; i++) {
        let stageIndex = EvolutionStages[i].url.slice(42 -1); // Extract stage ID
        let pRef = await getData(`pokemon/${stageIndex}`);
        let pImg = getPokemonImg(pRef);

        content.innerHTML += generateEvolutionStages(pRef, pImg);
    }
}

// Gets the evolution chain reference data
async function getEvoChainRef(id) {
    let pRef = await getData(`pokemon-species/${id}`);
    let evoChainUrl = pRef['evolution_chain']['url'].slice(26);
    let evoChainData = await getData(evoChainUrl);
    return evoChainData.chain;
}

// Traverses and collects evolution stages from the evolution chain
async function getEvolutionData(evoChainRef) {
    let stages = [], current = evoChainRef;

    while (current) {
        stages.push({
            name: current.species.name,
            url: current.species.url
        });

        current = current.evolves_to[0] || null;
    }
    return stages;
}

// Shows the next Pokémon, loads it if not already loaded
function nextPokemon(id) {
    if (id < 151) {
        id++;
    } else {
        id = 1;
    }
    checkNextPokemon(id);
}

// Loads and shows next Pokémon if not already in memory
function checkNextPokemon(id) {
    if (!id < 1) {
        if (!CurrentPokemonData[id - 1]) {
            loadAndShowSinglePokemon(id);
            return;
        } else {
            renderCardInfo(id);
        }
    } 
}

// Shows the previous Pokémon, loads it if necessary
function previousPokemon(id) {
    id--;
    if (!id < 1) {
        if (!CurrentPokemonData[id - 1]) {
            loadAndShowSinglePokemon(id);
            return;
        } else {
            renderCardInfo(id);
        }
    } else {
        toggleBtn('prevPokemonBtn', 'hide');
        return;
    }
}

// Loads a single Pokémon if not already loaded
async function loadAndShowSinglePokemon(id) {
    let targetIndex = id - 1;
    console.log(targetIndex);

    let pRef = await getDataFromUrl(AllNamesArr[targetIndex].url);
    let newId = pRef.id;

    CurrentPokemonData.push(pRef);
    renderCardInfo(newId);
}

// Increases the number of loaded Pokémon if under 151
async function increasePokeCount() {
    let loadAmount = updateLoadAmount();
    if (loadAmount === 0) return;

    // loadedCount += loadAmount;

    await loadPokemon(loadedCount, loadAmount);

    checkLoadedCount();
}

// Determines how many Pokémon to load next
function updateLoadAmount() {
    if (loadedCount >= 151) {
        return 0;
    } else if (loadedCount < 131) {
        return 20;
    } else {
        return 151 - loadedCount;
    }
}
