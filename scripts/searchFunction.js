function filterAndShowNames() {
    let searchValue = getSearchValue();

    handleFilteredResults(searchValue);

    if (searchValue.length < 3) {
        showAllPokemon();
    }
}

function handleFilteredResults(searchValue) {
    if (searchValue.length >= 3) {
        let seenNames = new Set();
        let filtered = AllNamesArr.filter((pokemon) => {
            let name = pokemon.name.toLowerCase();
            if (name.includes(searchValue.toLowerCase()) && !seenNames.has(name)) {
                seenNames.add(name);
                return true;
            }
            return false;
        });

        if (filtered.length > 0) {
            showFilteredPokemon(filtered);
            toggleBtn('loadMoreBtn', 'hide');
        }
    }
}

async function showFilteredPokemon(filtered) {
    let content = document.getElementById('content');
    content.innerHTML = '';

    let FilteredData = await loadFilteredPokemon(filtered);
    CurrentPokemonData = FilteredData;

    renderCurrentPokemonData(content);
}

function renderCurrentPokemonData(container) {
    for (let i = 0; i < CurrentPokemonData.length; i++) {
        let [id, name, pokemonImg, bgColor, allTypes] = prepareRendering(i);

        container.innerHTML += generateCard(id, name, pokemonImg, bgColor);
        renderTypeImages(`typesContainer${id}`, allTypes);
    }
}

async function loadFilteredPokemon(filtered) {
    let requests = [];
    for (let i = 0; i < filtered.length; i++) {
        let pRef = getDataFromUrl(filtered[i].url);
        requests.push(pRef);
    }
    let data = await Promise.all(requests);
    return data;
}

function showAllPokemon() {
    CurrentPokemonData = AllPokemonData;
    renderCards();
    toggleBtn('loadMoreBtn', 'show');
}

function getDataFromUrl(url) {
    return fetch(url).then(res => res.json());
}

function getSearchValue() {
    let searchValue = document.getElementById('search').value;
    searchValue = searchValue.trim();
    return searchValue;
}