function generateCard(name, type, image) {
    return /*html*/`
        <!-- CARD -->
        <div class="card" style="width: 18rem;">
            <h2 class="card-title text-center m-2 mb-3">${name}</h2>
            
            <div class="image-container">
                <img id="pokeImg" src=${image} class="card-img-top" alt="${name} image">
            </div>
            
            <div class="pokemon-category card m-3">
                <div class="card-body text-center p-2">
                    <h5>${type}</h5>
                </div>
            </div>
        </div>
        <!---------->
    `;
}
