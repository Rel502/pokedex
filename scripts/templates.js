function generateCard(id, name, pokemonImg, bgColor) {
    return /*html*/`
        <!-- CARD -->
        <div onclick="renderCardInfo('${id}')" class="card pointer ${bgColor} ${bgColor}-hvr" style="width: 18rem;">
            <div class="bg-color-333 color-white">
                <h2 class="card-title text-center m-2">#${id}  ${convertFirstLetterUp(name)}</h2>
            </div>

            <div class="image-container">
                <img id="pokeImg" src=${pokemonImg} class="card-img-top" alt="${name} image">
            </div>
            
            <div class="pokemon-category p-1 pt-0">
                <div id="typesContainer${id}" class="d-flex justify-content-center gap-1 p-2">
                    <!-- <div class="type-container">
                        <img src="./assets/img/types/grass.png">
                    </div>
                    <div class="type-container">
                        <img src="./assets/img/types/poison.png">
                    </div> -->
                </div>
            </div>
        </div>
        <!---------->
    `;
}

function generateTypeIcon(srcRef) {
    return /*html*/`
        <div class="type-container type-container-std">
            <img class="type-icon" src=${srcRef}>
        </div>
    `;
}


function generateCardDescription(id, pokemonImg, pokemonName, mainType, pokemonDescr) {
    return /*html*/`
        <div class="overlay-outer-div">
            <section id="overlayImgContainer" class="overlay-img-container">
                <!-- Close Icon -->
                <div onclick="closePopup()" class="icon-container pointer d-flex justify-content-center align-items-center">
                    <img class="icons" src="./assets/icons/close.png" alt="close">
                </div>
                
                <div class="d-flex justify-content-center align-items-center h-100-percent">
                    <!-- Previous Pokemon -->
                    <img onclick="previousPokemon('${id}')" class="icons pointer ml-16" src="./assets/icons/left.png" alt="left">
                    
                    <!-- Pokemon Image, Types, ID -->
                    <div class="d-flex flex-column justify-content-center align-items-center h-100-percent w-100-percent"> 
                        <h2 class="card-title color-white m-2">#${id}  ${convertFirstLetterUp(pokemonName)}</h2>
                        <img id="currentImage" src="${pokemonImg}" alt="">
                        <div id="typesContainerDescr${id}" class="d-flex justify-content-center gap-1 p-2"></div>
                    </div>
                    
                    <!-- Next Pokemon -->
                    <img onclick="nextPokemon('${id}')" class="icons pointer mr-16" src="./assets/icons/right.png" alt="right">
                </div>
            </section>

            <section id="overlayContent${id}" class="overlay-content-section">
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">About</a>
                    </li>
                    <li onclick="renderCardStats('${id}')" class="nav-item">
                        <a class="nav-link" href="#">Stats</a>
                    </li>
                    <li onclick="renderCardEvolution('${id}')" class="nav-item">
                        <a class="nav-link" href="#">Evolution</a>
                    </li>
                </ul>

                <!-- Type -->
                 <div class="card-details-container">
                    <div class="mb-3">
                        <h2 class="mb-2">Primärtyp</h2>
                        <p>${convertFirstLetterUp(mainType)}</p>
                    </div>
                    <div class="mb-2">
                        <h2 class="mb-2">Beschreibung</h2>
                        <p>${pokemonDescr}</p>
                    </div>
                 </div>
            </section>
        </div>
    `;
}


function generateCardStats(id) {
    return /*html*/`
    <ul class="nav nav-pills">
        <li onclick="renderCardInfo('${id}')" class="nav-item">
            <a class="nav-link" aria-current="page" href="#">About</a>
        </li>
        <li onclick="renderCardStats('${id}')" class="nav-item">
            <a class="nav-link active" href="#">Stats</a>
        </li>
        <li onclick="renderCardEvolution('${id}')" class="nav-item">
            <a class="nav-link" href="#">Evolution</a>
        </li>
    </ul>

    <div class="card-details-container">
        <h2>Statuswerte</h2>
        <div id="statsContainer" class="stats-container">
            <!-- rendering stats... -->
        </div>
    </div>
`;
}


function generateCardEvolution(id) {
    return /*html*/`
    <ul class="nav nav-pills">
        <li onclick="renderCardInfo('${id}')" class="nav-item">
            <a class="nav-link" aria-current="page" href="#">About</a>
        </li>
        <li onclick="renderCardStats('${id}')" class="nav-item">
            <a class="nav-link" href="#">Stats</a>
        </li>
        <li onclick="renderCardEvolution('${id}')" class="nav-item">
            <a class="nav-link active" href="#">Evolution</a>
        </li>
    </ul>

    <div class="card-details-container">
        <h2>Evolution</h2>
        <div id="evolutionContainer" class="evolution-container">
            <!-- rendering evolution-chain... -->
        </div>
    </div>
`;
}