function filterAndShowNames() {
    let searchValue = getSearchValue();

    handleFilteredResults(searchValue);

    if (searchValue.length < 3) {
        showAllPokemon();
    }
}

function handleFilteredResults(searchValue) {
    if (searchValue.length >= 3) {
        let filtered = AllNamesArr.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchValue.toLowerCase()));

        if (filtered.length > 0) {
            showFilteredPokemon(filtered);
            toggleBtn('loadMoreBtn', 'hide');
        }
    }
}

function showAllPokemon() {
    CurrentPokemonData = AllPokemonData;
    renderCards();
    toggleBtn('loadMoreBtn', 'show');
}

async function showFilteredPokemon(filteredList) {
    let content = document.getElementById('content');
    content.innerHTML = '';

    let filteredData = [];

    for (let i = 0; i < filteredList.length; i++) {
        let pRef = await getDataFromUrl(filteredList[i].url);
        filteredData.push(pRef);
    }

    CurrentPokemonData = filteredData;

    for (let i = 0; i < filteredData.length; i++) {
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