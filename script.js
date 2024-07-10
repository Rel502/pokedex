function init() {
    console.log("läuft");
    renderCards();
}

/*<--- NEXT STEPS ------->

1) getPokemonType() -> typesArr (wie zeige ich alle types an?)
    -> for-Schleife?
    -> ...

2) Hintergrundfarbe der cards, je nach Pokemon 
    -> ref: https://pokeapi.co/docs/v2#pokemon-colors

3) Mehr Pokemon rendern, ...
    -> ... 20 - 40 direkt
    -> weitere 20 - 40 bei Klick auf "more" icon

------------------------->*/


const BASE_URL = "https://pokeapi.co/api/v2/";

let count = 20;

async function getData(path="") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function renderCards() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 1; i < count; i++) {
        let pokemonRef = await getData(`pokemon/${i}`); 
        let name = pokemonRef['name'];
        let allTypes = await getPokemonTypes(i, pokemonRef); 
        let pokemonImg = await getPokemonImg(pokemonRef);
        let bgColor = await setBgColor(allTypes);  

        content.innerHTML += generateCard(i, name, pokemonImg, bgColor);
        renderTypeImages(allTypes, i);
    }
}

function renderTypeImages(allTypes, i) {
    let typesContainer = document.getElementById(`typesContainer${i}`);

    for (let j = 0; j < allTypes.length; j++) {
        let srcRef = "./assets/img/types/" +  allTypes[j] + ".png";
        typesContainer.innerHTML += generateTypeIcon(allTypes[j], srcRef);
    }
}

/*<--- getPokemonType -------> */

async function getPokemonTypes(i, pokemonRef) {
    let typesArr = await pokemonRef['types'];
    let allTypes = [];

    for (let i = 0; i < typesArr.length; i++) {
        let type = typesArr[i]['type']['name'];
        allTypes.push(type);
    }

    let type = typesArr[0]['type']['name'];
    return allTypes;
}

function setBgColor(allTypes) {
    if (allTypes.includes('grass')) {
        return "bg-color-grass";
    } else if (allTypes.includes('fire')) {
        return "bg-color-fire";
    } else if (allTypes.includes('water')) {
        return "bg-color-water";
    } else if (allTypes.includes('bug')) {
        return "bg-color-bug";
    } else if (allTypes.includes('normal')) {
        return "bg-color-normal";
    } 
} 

async function getPokemonImg(pokemonRef) {
    let pokemonImage = pokemonRef['sprites']['front_default'];
    return pokemonImage;
}

function increasePokeCount() {
    if (count < 151) {
        count += 20;    
    } else {
        return;
    }
    renderCards();
}












/*---> Types <------- 

// Normal: 1  <--- ID
// Fighting: 2  -> fighting.png
// Flying: 3    -> flying.png
// Poison: 4    -> poison.png
// Ground: 5    -> ground.png
// Rock: 6      -> rock.png
// Bug: 7       -> bug.png
// Ghost: 8     -> ghost.png
// Steel: 9     -> steel.png
// Fire: 10     -> fire.png
// Water: 11    -> water.png
// Grass: 12    -> grass.png
// Electric: 13 -> electric.png
// Psychic: 14  -> psychic.png
// Ice: 15      -> ice.png
// Dragon: 16   -> dragon.png
// Dark: 17     -> dark.png
// Fairy: 18    -> fairy.png

-----------------> */