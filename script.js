async function init() {
    await loadPokemon(loadedCount, 20);
    loadedCount += 20;
}

let AllPokemonData = [];
let CurrentPokemonData = [];

let loadedCount = 0;

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

// async function prepareCardInfoRendering(id) {
//     const [ref, species] = await loadPokemonData(id);
//     const [name, types, img] = await loadPokemonDetails(ref, id);
//     const mainType = await getMainType(types);
//     const bgColor = await setBgColor(mainType);
//     const descr = getDescription(species);

//     return [ref, name, species, descr, types, mainType, img, bgColor];
// }

async function renderCardStats(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';
    content.innerHTML += generateCardStats(id);
    prepareStatsRendering(id);
}

function prepareStatsRendering(id) {
    let pRef = CurrentPokemonData[id-1];
    let statsRef = pRef.stats;

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
    let pokemonSpeciesRef = await getData(`pokemon-species/${id}`);
    let evolutionChainUrl = await pokemonSpeciesRef.evolution_chain.url; 
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
        toggleBtn('prevPokemonBtn', 'hide');
        return;
    }
}