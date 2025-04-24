// Entry point: filters or shows all Pokémon based on search length
function filterAndShowNames() {
    let searchValue = getSearchValue();

    handleFilteredResults(searchValue);

    if (searchValue.length < 3) {
        showAllPokemon();
    }
}

// Handles filtered search results if input is 3+ characters
function handleFilteredResults(searchValue) {
    if (searchValue.length >= 3) {
        let filtered = getFilteredUniquePokemon(searchValue);

        if (filtered.length > 0) {
            showFilteredPokemon(filtered);
            toggleBtn('loadMoreBtn', 'hide');
        }
    }
}

// Filters Pokémon names and removes duplicates
function getFilteredUniquePokemon(searchValue) {
    let seenNames = new Set();
    return AllNamesArr.filter((pokemon => {
        let name = pokemon.name.toLowerCase();
        if (name.includes(searchValue.toLowerCase()) && !seenNames.has(name)) {
            seenNames.add(name);
            return true;
        }
        return false;
    }))
}

// Loads and renders the filtered Pokémon
async function showFilteredPokemon(filtered) {
    let content = document.getElementById('content');
    content.innerHTML = '';

    let FilteredData = await loadFilteredPokemon(filtered);
    CurrentPokemonData = FilteredData;

    renderCurrentPokemonData(content);
}

// Renders all currently loaded Pokémon into the container
function renderCurrentPokemonData(container) {
    for (let i = 0; i < CurrentPokemonData.length; i++) {
        let [id, name, pokemonImg, bgColor, allTypes] = prepareRendering(i);

        container.innerHTML += generateCard(id, name, pokemonImg, bgColor);
        renderTypeImages(`typesContainer${id}`, allTypes);
    }
}

// Loads detailed data for all filtered Pokémon
async function loadFilteredPokemon(filtered) {
    let requests = [];
    for (let i = 0; i < filtered.length; i++) {
        let pRef = getDataFromUrl(filtered[i].url);
        requests.push(pRef);
    }
    let data = await Promise.all(requests);
    return data;
}

// Renders the complete list of all Pokémon
function showAllPokemon() {
    CurrentPokemonData = AllPokemonData;
    renderCards();
    toggleBtn('loadMoreBtn', 'show');
}

// Fetches JSON data from given URL
function getDataFromUrl(url) {
    return fetch(url).then(res => res.json());
}

// Gets and trims the current search input value
function getSearchValue() {
    let searchValue = document.getElementById('search').value;
    searchValue = searchValue.trim();
    return searchValue;
}