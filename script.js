async function init() {
    await loadAllNames(); // <-- load all names ref and url ref from pokemon?limit=151
    await loadPokemon(loadedCount, 20);
}

let AllPokemonData = [];
let CurrentPokemonData = [];

let AllNamesArr = [];
// -> AllNamesArr[i].name -> "bulbasaur"
// -> AllNamesArr[i].url -> "https://pokeapi.co/api/v2/pokemon/1/"

let CurrentNamesArr = [];

let loadedCount = 0;

const BASE_URL = "https://pokeapi.co/api/v2/";

async function getData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadAllNames() {
    let response = await getData(`pokemon?limit=151`);
    let allNamesRef = response.results;

    for (let i = 0; i < 151; i++) {
        let element = allNamesRef[i];
        AllNamesArr.push(element);
    }

    console.log(AllNamesArr);
}

async function loadPokemon(startIndex, count) {
    showSpinner();

    for (let i = startIndex; i < startIndex + count; i++) {
        let pokemonRef = await getData(`pokemon/${i + 1}`);
        AllPokemonData.push(pokemonRef);
    }

    hideSpinner();
    renderCards();
}

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

async function prepareCardInfoRendering(id) {
    let pRef = CurrentPokemonData.find(p => p.id === Number(id));
    let name = pRef.name;
    let pokemonDescrRef = await getData(`pokemon-species/${id}`);
    let pokemonDescr = getDescription(pokemonDescrRef);
    let pokemonImg = getPokemonImg(pRef);
    let allTypes = getPokemonTypes(pRef);
    let mainType = getMainType(allTypes);
    let bgColor = setBgColor(mainType);

    return [pokemonImg, name, mainType, pokemonDescr, bgColor, allTypes];
}

async function renderCardStats(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';
    content.innerHTML += generateCardStats(id);
    prepareStatsRendering(id);
}

function prepareStatsRendering(id) {
    let pRef = CurrentPokemonData[id - 1];
    let statsRef = pRef.stats;

    for (let statsIndex = 0; statsIndex < statsRef.length; statsIndex++) {
        let statName = statsRef[statsIndex].stat.name;
        let statValue = statsRef[statsIndex].base_stat;
        let statsContainer = document.getElementById('statsContainer');

        statsContainer.innerHTML += generateProgressBar(statValue, statName);
    }
}

// --------------------> EVOLUTION CHAIN

function renderCardEvolution(id) {
    let content = document.getElementById(`overlayContent${id}`);
    content.innerHTML = '';

    content.innerHTML += generateCardEvolution(id);

    prepareEvolutionRendering(id, content);
}

async function prepareEvolutionRendering(id, content) {
    let evoChainRef = await getEvoChainRef(id);
    let EvolutionStages = await getEvolutionData(evoChainRef);

    for (let i = 0; i < EvolutionStages.length; i++) {
        let stageIndex = EvolutionStages[i].url.slice(-2, -1); // <-- Zugriff auf die einzelnen Stages
        let pRef = await getData(`pokemon/${stageIndex}`);
        let pImg = getPokemonImg(pRef);

        content.innerHTML += generateEvolutionStages(pRef, pImg);
    }
}

async function getEvoChainRef(id) {
    let pRef = await getData(`pokemon-species/${id}`);
    let evoChainUrl = pRef['evolution_chain']['url'].slice(-18);

    // -> Wenn id zweistellig, dann -> -19
    // -> Wenn id dreistellig, dann -> -20

    // || -> von vorne "slicen"

    let evoChainData = await getData(evoChainUrl);
    return evoChainData.chain;
}

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




// evoChainRef.chain.species.name <--- Name des aktuellen Pokemons
// evoChainRef.chain.species.url  <--- Url des aktuellen Pokemons

// evoChainRef.chain.evolves_to[0]species.name <--- Name des nächsten Pokemon
// evoChainRef.chain.evolves_to[0]species.url <--- Url des nächsten Pokemon

// evoChainRef.chain.evolves_to[0]evolves_to[0]species.name <--- Name des übernächsten Pokemon
// ...


// async function prepareEvolutionRendering(id) {
//     let evolutionChainRef = await getEvolutionChainRef(id);
//     let evolutionStages = await getEvolutionStages(evolutionChainRef);

//     let content = document.getElementById('evolutionContainer');
//     content.innerHTML = '';

//     for (let i = 0; i < evolutionStages.length; i++) {
//         let currentStage = evolutionStages[i];
//         content.innerHTML += generateEvolutionStages(currentStage);
//     }
// }

// async function getEvolutionChainRef(id) {
//     let pokemonSpeciesRef = await getData(`pokemon-species/${id}`);
//     let evolutionChainUrl = await pokemonSpeciesRef.evolution_chain.url;
//     let evolutionData = await getEvolutionData(evolutionChainUrl);
//     return await evolutionData.chain;
// }

// async function getEvolutionData(evolutionChainUrl) {
//     let response = await fetch(evolutionChainUrl);
//     let responseToJson = await response.json();
//     return responseToJson;
// }

// async function getEvolutionStages(evolutionChainRef) {
//     let evolutionStages = [];
//     evolutionStages.push(insertFirstStageOfEvolution(evolutionChainRef));
//     return addRemainingStages(evolutionChainRef.evolves_to, evolutionStages, 1);
// }

// function addRemainingStages(evolves_to, stages, stageIndex) {
//     while (evolvesToNotEmpty(evolves_to)) {
//         const current = evolves_to[0];
//         stages.push(insertRestOfEvolutionStages(current, stageIndex));
//         evolves_to = current.evolves_to;
//         stageIndex++;
//     }
//     return stages;
// }

// function insertRestOfEvolutionStages(currentStage, stageIndex) {
//     return ({
//         index: stageIndex,
//         name: currentStage.species.name,
//         url: currentStage.species.url,
//     });
// }

// function evolvesToNotEmpty(evolves_to) {
//     return evolves_to.length !== 0;
// }

// function insertFirstStageOfEvolution(evolutionChainRef) {
//     return ({
//         index: 0,
//         name: evolutionChainRef.species.name,
//         url: evolutionChainRef.species.url,
//     })
// };











function nextPokemon(id) {
    if (id < 151) {
        id++;
    } else {
        id = 1;
    }
    checkNextPokemon(id);
}

function checkNextPokemon(id) {
    if (!CurrentPokemonData[id - 1]) {
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
        // CurrentPokemonData = AllPokemonData;
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

async function loadAndShowSinglePokemon(id) {
    let targetIndex = id - 1;
    console.log(targetIndex);

    let pRef = await getDataFromUrl(AllNamesArr[targetIndex].url);
    let newId = pRef.id;

    CurrentPokemonData.push(pRef);

    renderCardInfo(newId);
    // -> !Problem -> rendering über CurrentPokemonData
    // -> individuell innerhalb dieser Fnc rendern!
}

async function increasePokeCount() {
    let loadAmount = updateLoadAmount();
    if (loadAmount === 0) return;

    loadedCount += loadAmount;
    await loadPokemon(loadedCount, loadAmount);

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