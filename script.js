function init() {
    renderCards();
}

const BASE_URL = "https://pokeapi.co/api/v2/";
let currentPokemonID;


// async function logPokemonStats(id) {
//     let pokemonRef = await getData(`pokemon/${id}`);
//     console.log(pokemonRef
//         .stats[0].stat.name     
//     );
//     console.log(pokemonRef
//         .stats[0].base_stat     
//     );
// }


async function getData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}


/*<-----------------------------------------------------> */
// RENDERING CARDS

let currentPokemonCount = 1;
let pokemonCount = 20;

let namesArr = [];

async function renderCards() {
    let content = document.getElementById('content');
    // content.innerHTML = '';

    showSpinner();

    for (let i = currentPokemonCount; i < pokemonCount; i++) {
        await prepareRendering(i, content);
    }

    hideSpinner();

    currentPokemonCount = pokemonCount;
}


async function prepareRendering(i, content) {
    let pokemonRef = await getData(`pokemon/${i}`);
    let name = await getPokemonName(pokemonRef);
    let allTypes = await getPokemonTypes(pokemonRef);
    let mainType = await getMainType(allTypes);
    let pokemonImg = await getPokemonImg(i);
    let bgColor = await setBgColor(mainType);

    // pushToLocalArr(name, mainType, pokemonImg, bgColor);

    content.innerHTML += generateCard(i, name, pokemonImg, bgColor);
    renderTypeImages(`typesContainer${i}`, allTypes);
}


// function pushToLocalArr(name, mainType, pokemonImg, bgColor) {
//     namesArr = [
//         {
//             "name": name,
//             "mainType": mainType,
//             "img": pokemonImg,
//             "bgColor": bgColor
//         }
//     ]
// }


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


/*<-----------------------------------------------------> */
// RENDERING CARD INFO <--- opening single pokemon card
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
    let pokemonRef = await getData(`pokemon/${id}`);
    let pokemonName = await getPokemonName(pokemonRef);
    let pokemonDescrRef = await getData(`pokemon-species/${id}`);
    let pokemonDescr = await pokemonDescrRef['flavor_text_entries'][25]['flavor_text'];
    let allTypes = await getPokemonTypes(pokemonRef);
    let mainType = await getMainType(allTypes);
    let pokemonImg = await getPokemonImg(id);
    let bgColor = await setBgColor(mainType);

    return [pokemonRef, pokemonName, pokemonDescrRef, pokemonDescr, allTypes, mainType, pokemonImg, bgColor];
}


/*<-----------------------------------------------------> */
// RENDERING -> STATS
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

        statsContainer.innerHTML += /*html*/`
            <div class="progress" role="progressbar">
                <div class="progress-bar" style="width: ${statValue}%"><b>${statName}</b></div>
            </div>
        `;
    }
}


/*<-----------------------------------------------------> */
/*<-----------------------------------------------------> */
/*<-----------------------------------------------------> */
/*<-----------------------------------------------------> */
/*<-----------------------------------------------------> */
// RENDERING -> EVOLUTION
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
    let evolves_to = evolutionChainRef.evolves_to;
    let evolutionStages = [];
    evolutionStages.push(insertFirstStageOfEvolution(evolutionChainRef));
    let stageIndex = 1;

    while (evolvesToNotEmpty(evolves_to)) {
        const currentStage = evolves_to[0];
        evolutionStages.push(insertRestOfEvolutionStages(currentStage, stageIndex));
        evolves_to = currentStage.evolves_to;
        stageIndex++;
    }
    return evolutionStages;
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


/*<-----------------------------------------------------> */
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