// ---> ALTER CODE!!!

async function loadAllPokemon() {
    // showSpinner();
    const allPokemonData = await getAllPokemonData(151);
    savePokemonData(allPokemonData);
    // hideSpinner();
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