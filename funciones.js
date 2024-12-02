
// Usando fetch(), esta función obtiene los datos desde la API de TheMealDB y los convierte a formato JSON
function obtenerDatos(url) {
    return fetch(url).then(res => res.json());
}


// Esta función se encarga de obtener la lista de categorías de recetas desde la API y agregar cada categoría al <select> del HTML.
// Por cada categoría recibida, llama a agregarOpcion, que crea y añade una opción en el <select> del HTML.
function cargarCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    obtenerDatos(url).then(datos => {
        datos.categories.forEach(categoria =>{
            agregarOpcion(categoria.strCategory);
        });
    });
}




// Esta función se encarga de crear una opción dentro del <select> de categorías.
//Se le pasa como parámetro el nombre de la categoría, que hemos cogido de la api
function agregarOpcion(nombreCategoria) {
    const opcion = document.createElement("option");
    opcion.value = nombreCategoria;
    opcion.textContent = nombreCategoria;
    selectorCategorias.append(opcion);
}






// Esta función es la que se ejecuta cuando el usuario selecciona una categoría en el <select> de categorías:
// El evento onchange del <select> llama a la función mostrarRecetasDeLaCategoria, pasando el valor de la opción seleccionada (this.value) como parámetro.
// Aquí, la función obtenerDatos(url) se llama para obtener las recetas de esa categoría, y cuando los datos se reciben, se llama a crearTarjetaReceta(receta) para crear una tarjeta con la receta.
function mostrarRecetasDeLaCategoria(cat) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;
    row.innerHTML = "";
    obtenerDatos(url).then(datos => {
        datos.meals.forEach(receta => {
            row.append(crearTarjetaReceta(receta)); 
        });
    });
}


// Esta función se utiliza dentro de mostrarRecetasDeLaCategoria para crear una tarjeta con la receta. 
// Aquí es donde se usa el método appendChild para agregar cada tarjeta al DOM.
// Para cada receta, crea una tarjeta (div.card) con la imagen y el nombre de la receta.
// Añade un botón que, al hacer clic, abre el modal con los detalles de la receta. El botón también tiene el atributo data-bs-toggle="modal", lo que permite que el modal se abra al hacer clic.
// Dentro de esta función, también se crea un botón que, cuando se hace clic, llama a la función mostrarReceta(idMeal).
function crearTarjetaReceta(receta) {
    const col = document.createElement("div");
    col.classList.add("col-md-4");
    col.innerHTML = `
        <div class="card text-white bg-primary mb-3">
            <div class="card-header">
                <img src="${receta.strMealThumb}" class="img-fluid">
            </div>
            <div class="card-body">
                <h4 class="card-title">${receta.strMeal}</h4>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#emergente" onclick="mostrarReceta(${receta.idMeal})">
                    Abrir receta
                </button>
            </div>
        </div>`;
    return col;
}



// Esta función es la que se ejecuta cuando el usuario hace clic en el botón Abrir receta de la tarjeta. 
// La función recibe un idMeal como parámetro, que es el identificador único de la receta.
// Al hacer clic en el botón de abrir receta(con el onclick), esta función obtiene los detalles completos de la receta (nombre, imagen, instrucciones e ingredientes) mediante la función obtenerDatos().
// Luego, inserta esos datos en el modal para que el usuario vea los detalles completos.
function mostrarReceta(idReceta) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`;
    obtenerDatos(url).then(datos => {
        const receta = datos.meals[0];
        document.querySelector(".modal-title").textContent = receta.strMeal;
        document.querySelector(".modal-body img").src = receta.strMealThumb;
        document.querySelector(".modal-body p").textContent = receta.strInstructions;

        const ingredientes = document.querySelector(".modal-body ul");
        ingredientes.innerHTML = "";
        for (let i = 1; i <= 20; i++) {
            const ingrediente = receta[`strIngredient${i}`];
            const medida = receta[`strMeasure${i}`];
            if (ingrediente) {
                ingredientes.innerHTML += `<li>${ingrediente} - ${medida}</li>`;
            }
        }
    });
}














