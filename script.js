function init() {
    renderCards();
}

const BASE_URL = "https://pokeapi.co/api/v2/";

let pokemonCount = 20;
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
    let allTypes = await getPokemonTypes(pokemonRef);
    let mainType = await getMainType(allTypes);
    let pokemonImg = await getPokemonImg(i);
    let bgColor = await setBgColor(mainType);

    content.innerHTML += generateCard(i, name, pokemonImg, bgColor);
    renderTypeImages(`typesContainer${i}`, allTypes);
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
    let content = document.getElementById('evolutionContainer');
    content.innerHTML = '';

    let evolutionRef = await getData(`evolution-chain/${id}`);
    let evolvesToRef = await evolutionRef.chain;
    let firstEvolution = await evolvesToRef.evolves_to[0].species.name;
    let secondEvolution = await evolvesToRef.evolves_to[0].evolves_to[0].species.name;

    content.innerHTML += /*html*/`
        <div>
            <img src="./assets/icons/1_icon.png" alt="First">
            ${convertFirstLetterUp(firstEvolution)}
        </div>
        <div>
            <img src="./assets/icons/2_icon.png" alt="First">
            ${convertFirstLetterUp(secondEvolution)}
        </div>
    `;
}


async function logEvo(id) {
    let evoRef = await getData(`evolution-chain/${id}`);
    console.log(evoRef
        .chain.evolves_to[0].species.name
    );
    console.log(evoRef
        .chain.evolves_to[0].evolves_to[0].species.name
    );
}

logEvo(1)


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