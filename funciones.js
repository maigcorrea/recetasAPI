
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



function mostrarReceta(idReceta) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`;
    let modalTitle=document.querySelector(".modal-title");
    let modalContenido=document.querySelector(".modal-body p");
    let modalImg=document.querySelector(".modal-body img");
    let modalUl=document.querySelector(".modal-body ul");
    const btnFavoritos=document.querySelector(".modal-footer button:nth-child(1)");
    
    

    obtenerDatos(url)
    .then((datosReceta,index) => {
        const receta = datosReceta.meals[0];
        modalTitle.textContent = receta.strMeal;
        modalImg.setAttribute("src",receta.strMealThumb);
        modalContenido.textContent = receta.strInstructions;

        // const ingredientes = document.querySelector(".modal-body ul");
        modalUl.innerHTML = "";
        for (let i = 1; i <= 20; i++) {
            const ingrediente = receta[`strIngredient${i}`];
            const medida = receta[`strMeasure${i}`];
            if(ingrediente!="" && ingrediente!=null){
                modalUl.innerHTML+=`
                    <li>${ingrediente} - ${medida}</li>
                `;
            }
        }

        //Cambiar el texto del botón por eliminar
        console.log(idFavoritos);
        if(!idFavoritos.includes(idReceta)){
            btnFavoritos.textContent="Guardar";
        }else{
            btnFavoritos.textContent="Eliminar";
        }
        

        // Modificar el botón del modal para usar onclick
        // const btnFavoritos = document.querySelector(".modal-footer button:nth-child(1)");
        btnFavoritos.setAttribute("onclick", `guardarComoFavorito(${receta.idMeal})`);
    });    
}



function guardarComoFavorito(idReceta) {
    const btnFavoritos = document.querySelector(".modal-footer button:nth-child(1)");
    let toastContainer=document.createElement("div");
    
    btnFavoritos.setAttribute("id","liveToastBtn");

    if(!idFavoritos.includes(idReceta)){
        //Vaciar el localStorage
        localStorage.clear();

        // console.log(idFavoritos);
        idFavoritos.push(idReceta);
        
        localStorage.setItem("favoritos",JSON.stringify(idFavoritos));
        // idFavoritos.forEach((id,index)=>{
        //     localStorage.setItem(index,id);
        // })

        //TOAST
    toastContainer.innerHTML=`
        <div class="toast-container position-fixed top-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">Bieeen</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Receta añadida correctamente
    </div>
  </div>
</div>
    `;

    document.body.append(toastContainer);

    // //Inicializar el toast desde aquí, porque no
    // const toastElement = toastContainer.querySelector('.toast');
    // const toast = new bootstrap.Toast(toastElement);

    // //Mostrar el toast
    // toast.show(); 

    const toastTrigger = document.getElementById('liveToastBtn')
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
    }
    }else{
        //Actualizar el array borrando el id que coincida con el de la receta
        console.log(idFavoritos);

        idFavoritos.forEach((id,index)=>{
            if(id==idReceta){
                idFavoritos.splice(index,1);
            }
        })
        console.log(idFavoritos);
        //Borrar el localStorage

        localStorage.clear();

        //Actualizar el localStorage con el array actualizado

        if (idFavoritos.length === 0) {
            //Lo que se almacena en el localStorage es de tipo string, si el array está vacío, la cadena que queda en el localStorage son los [], que representa un array vacio.Sin embargo, aunque el array esté vacío, localStorage no elimina automáticamente las claves. Esto significa que la clave favoritos seguirá existiendo en localStorage, pero contendrá el valor "[]".
            localStorage.removeItem("favoritos");  // Elimina la clave si el array está vacío
        } else {
            localStorage.setItem("favoritos", JSON.stringify(idFavoritos));  // Guarda solo si hay elementos
        }

        
    }

    //Cambiar el texto del botón por eliminar
    if(!idFavoritos.includes(idReceta)){
        btnFavoritos.textContent="Guardar";
    }else{
        btnFavoritos.textContent="Eliminar";
    }
}

