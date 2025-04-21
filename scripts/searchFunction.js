


function filterAndShowNames() {
    let searchValue = getSearchValue();

    if (searchValue.length >= 3) {
        let filtered = AllNamesArr.filter((pokemon) => 
            pokemon.name.toLowerCase().includes(searchValue.toLowerCase()));

        if (filtered.length > 0) {
            showFilteredPokemon(filtered); 
            toggleBtn('loadMoreBtn', 'hide');
        }
    } else {
        CurrentPokemonData = AllPokemonData;
        renderCards();
        toggleBtn('loadMoreBtn', 'show');
    }
}


async function showFilteredPokemon(filteredList) {
    let content = document.getElementById('content');
    content.innerHTML = '';

    // Lade vollständige Daten aller Treffer
    let filteredData = [];

    for (let i = 0; i < filteredList.length; i++) {
        let pRef = await getDataFromUrl(filteredList[i].url);
        filteredData.push(pRef);
    }

    // Setze CurrentPokemonData temporär auf die Treffer
    CurrentPokemonData = filteredData;

    // Rendere wie gewohnt
    for (let i = 0; i < CurrentPokemonData.length; i++) {
        let [id, name, pokemonImg, bgColor, allTypes] = prepareRendering(i);

        content.innerHTML += generateCard(id, name, pokemonImg, bgColor);
        renderTypeImages(`typesContainer${id}`, allTypes);
    }
}


function getDataFromUrl(url) {
    return fetch(url).then(res => res.json());
}

function getSearchValue() {
    let searchValue = document.getElementById('search').value;
    searchValue = searchValue.trim();
    return searchValue;
}




// function searchPokemon(query) {
//     let filtered = AllNamesArr.filter(pokemon =>
//         pokemon.name.toLowerCase().includes(query.toLowerCase())
//     );
    
//     if (filtered.length > 0) {
//         loadPokemonByUrl(filtered[0].url);
//     } else {
//         console.log("Kein Pokémon gefunden 😢");
//     }
// }
