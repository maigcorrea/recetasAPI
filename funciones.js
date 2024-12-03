

function obtenerDatos(url) {
    return fetch(url).then(res => res.json());
}

function cargarCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    obtenerDatos(url).then(datos => {
        datos.categories.forEach(categoria => agregarOpcion(categoria.strCategory));
    });
}

function agregarOpcion(nombreCategoria) {
    const opcion = document.createElement("option");
    opcion.value = nombreCategoria;
    opcion.textContent = nombreCategoria;
    selectorCategorias.append(opcion);
}



function mostrarRecetasDeLaCategoria(cat) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;
    row.innerHTML = "";
    obtenerDatos(url).then(datos => {
        datos.meals.forEach(receta => row.append(crearTarjetaReceta(receta)));
    });
}




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

