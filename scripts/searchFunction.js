// Suchfunktion - Nach bestimmten Pokemon filtern
function filterPokemon() {
    let searchValue = getSearchValue();
    clearContent();

    if (searchValue.length >= 3) {
        let filtered = getFilteredPokemon(searchValue);
        filtered.length ? renderFiltered(filtered) : showNoResults();
        toggleBtn('loadMoreBtn', 'hide');
    } else {
        resetAndRenderAll();
        toggleBtn('loadMoreBtn', 'show');
    }
}

function getSearchValue() {
    return document.getElementById('search').value.trim().toLowerCase();
}

function clearContent() {
    document.getElementById('content').innerHTML = '';
}

function getFilteredPokemon(searchValue) {
    return namesArr
        .map((p, i) => ({ ...p, i }))
        .filter(p => p.name.toLowerCase().includes(searchValue));
}

function renderFiltered(filtered) {
    let content = document.getElementById('content');
    filtered.forEach(p => {
        let id = p.i + 1;
        content.innerHTML += generateCard(id, p.name, p.img, p.bgColor);
        renderTypeImages(`typesContainer${id}`, p.allTypes);
    });
}

function showNoResults() {
    document.getElementById('content').innerHTML = '<p>Kein Pokémon gefunden.</p>';
}

function resetAndRenderAll() {
    currentPokemonCount = 1;
    pokemonCount = 21;
    renderCards();
}