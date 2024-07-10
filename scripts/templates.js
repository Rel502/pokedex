function generateCard(id, name, image, bgColor) {
    return /*html*/`
        <!-- CARD -->
        <div class="card pointer ${bgColor}" style="width: 18rem;">
            <div class="bg-color-333 color-white">
                <h2 class="card-title text-center m-2">#${id}  ${name}</h2>
            </div>

            <div class="image-container">
                <img id="pokeImg" src=${image} class="card-img-top" alt="${name} image">
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

function generateTypeIcon(type, srcRef) {
    return /*html*/`
        <div class="type-container type-container-${type}">
            <img src=${srcRef}>
        </div>
    `;
}