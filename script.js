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

// GET and RETURN data from PokeAPI
async function getData(path="") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

// async function logData() {
//     let path = "pokemon/1/";
//     console.log(await getData(path));
// }

async function renderCards() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    for (let i = 1; i < count; i++) {
        let pokemonRef = await getData(`pokemon/${i}`); /*<--- Reference for single pokemon by ID */
        let name = pokemonRef['name'];
        // let type = pokemonRef['types'][0]['type']['name'];
        let type = await getPokemonType(pokemonRef); 
        let pokemonImg = await getPokemonImg(pokemonRef);

        content.innerHTML += generateCard(name, type, pokemonImg);
    }
}

async function getPokemonType(pokemonRef) {
    let typesArr = await pokemonRef.types;
    let type = typesArr[0]['type']['name'];

    return type;
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
// Fighting: 2
// Flying: 3
// Poison: 4
// Ground: 5
// Rock: 6
// Bug: 7
// Ghost: 8
// Steel: 9
// Fire: 10
// Water: 11
// Grass: 12
// Electric: 13
// Psychic: 14
// Ice: 15
// Dragon: 16
// Dark: 17
// Fairy: 18

-----------------> */