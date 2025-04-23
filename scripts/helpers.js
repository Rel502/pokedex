// Asynchronously retrieves the name of a Pokémon from its reference object
async function getPokemonName(pokemonRef) {
    let name = await pokemonRef['name'];
    return name;
}

// Extracts all types of the Pokémon and returns them as an array
function getPokemonTypes(pokemonRef) {
    let typesArr = pokemonRef['types'];
    let allTypes = [];

    for (let i = 0; i < typesArr.length; i++) {
        let type = typesArr[i]['type']['name'];
        allTypes.push(type);
    }
    return allTypes;
}

// Returns the first type in the array (main type of the Pokémon)
function getMainType(allTypes) {
    let mainType = allTypes[0];
    return mainType;
}

// Sets the background color based on the Pokémon's main type
function setBgColor(mainType) {
    let bgColor = `bg-color-${mainType}`;
    return bgColor;
}

// Renders the type icons as images inside a container
function renderTypeImages(container, allTypes) {
    let typesContainer = document.getElementById(container);

    for (let j = 0; j < allTypes.length; j++) {
        let srcRef = "./assets/img/types/" + allTypes[j] + ".png";
        typesContainer.innerHTML += generateTypeIcon(srcRef);
    }
}

// Retrieves the Pokémon's default front sprite image
function getPokemonImg(pRef) {
    let pokemonImg = pRef['sprites']['front_default'];
    return pokemonImg;
}

// Gets the German description for the Pokémon species
function getDescription(species) {
    let entry = species['flavor_text_entries'].find(e => e.language.name === 'de');
    return returnGermanDescription(entry);
}

// Returns the German description, formatted by removing unnecessary line breaks
function returnGermanDescription(entry) {
    if (entry) {
        return formattedText(entry);
    } else {
        return 'Keine Beschreibung';
    }
}

// Formats the Pokémon description by replacing newlines and form feeds with spaces
function formattedText(entry) {
    let unnecessaryBreaks = /\n|\f/g;
    return entry.flavor_text.replace(unnecessaryBreaks, ' ');
}

// Closes the popup when clicking outside the popup content
document.addEventListener("click", (event) => {
    let window = document.getElementById('popupOverlayBg');

    if (event.target == window) {
        closePopup();
    }
});

// Toggles the visibility of the popup based on the provided parameter ('show' or 'hide')
function togglePopup(param) {
    if (param == 'show') {
        document.getElementById('popupOverlayBg').classList.remove('d-none');
    } else {
        document.getElementById('popupOverlayBg').classList.add('d-none');
    }
}

// Toggles the visibility of the header based on the provided parameter ('show' or 'hide')
function toggleHeader(param) {
    if (param == 'show') {
        document.querySelector('header').classList.remove('d-none');
    } else {
        document.querySelector('header').classList.add('d-none');
    }
}

// Toggles the visibility of the body scrollbar based on the provided parameter ('show' or 'hide')
function toggleScrollbar(param) {
    if (param == 'show') {
        document.querySelector('body').classList.remove('overflow-hidden');
    } else {
        document.querySelector('body').classList.add('overflow-hidden');
    }
}

// Shows the popup, hides the header, and disables the body scrollbar
function showPopup() {
    togglePopup('show');
    toggleHeader('hide');
    toggleScrollbar('hide');
}

// Closes the popup, shows the header, and enables the body scrollbar
function closePopup() {
    togglePopup('hide');
    toggleHeader('show');
    toggleScrollbar('show');
}

// Converts the first letter of a string to uppercase
function convertFirstLetterUp(string) {
    let stringInUpperCase = string.toUpperCase();

    let firstLetter = stringInUpperCase.slice(0, 1);
    let elseLetters = string.slice(1);

    return firstLetter + elseLetters;
}

// Hides the "Load More" button if all Pokémon have been loaded
function checkLoadedCount() {
    if (loadedCount >= 151) {
        toggleBtn('loadMoreBtn', 'hide');
    }
}

// Toggles the visibility of a button based on the provided state ('show' or 'hide')
function toggleBtn(id, state) {
    let button = document.getElementById(id);

    if (state === 'hide') {
        button.classList.add('d-none');
    } else if (state === 'show') {
        button.classList.remove('d-none');
    }
}

// Hides the "Previous Pokémon" button if the first Pokémon is selected
function hidePrevButtonIfFirstPokemon(id) {
    if (id == 1) {
        toggleBtn('prevPokemonBtn', 'hide');
    }
}

// Displays the loading spinner and disables the body scrollbar
function showSpinner() {
    let container = document.getElementById('loadingSpinner');
    container.classList.remove('d-none');
    toggleScrollbar('hide');
}

// Hides the loading spinner and enables the body scrollbar
function hideSpinner() {
    let container = document.getElementById('loadingSpinner');
    container.classList.add('d-none');
    toggleScrollbar('show');
}

// Inserts an image inside an overlay container, applying the appropriate background color
function insertOverlayImage(image, bgColor) {
    let imageBackground = document.getElementById('overlayImgContainer');
    imageBackground.classList = [];

    imageBackground.classList.add('overlay-img-container');
    imageBackground.classList.add(`${bgColor}`);

    let currentImage = document.getElementById('currentImage');
    currentImage.src = image;
}
