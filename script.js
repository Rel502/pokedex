function init() {
    console.log("läuft");
}

const BASE_URL = "https://pokeapi.co/api/v2/";

async function getData(path="") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function logData(path) {
    console.log(await getData(path));
}

logData("pokemon/ditto");