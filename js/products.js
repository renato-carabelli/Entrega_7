document.addEventListener('DOMContentLoaded', async () => {

    const btnPrecioAsc = document.getElementById("precioAsc");
    const btnPrecioDesc = document.getElementById("precioDesc");
    const btnRelevancia = document.getElementById("relevancia");
    const btnNoFiltro = document.getElementById("noFiltro");
    const buscador = document.getElementById("buscador");

    // Obtener el valor del localStorage
    const selectedCategoryId = localStorage.getItem("catID");

    // Comprobar si hay una categoría seleccionada en el localStorage
    if (selectedCategoryId) {
        let response = await getJSONData(PRODUCTS_URL + selectedCategoryId + EXT_TYPE);
        const carList = response.data;

        let productList = [...carList.products];
        let productListFiltrar = [...carList.products];
        let filtro = "";

        const prodTitle = document.getElementById("titulo");
        prodTitle.innerHTML = `
            <h1> Productos </h1>
            <p>Aqui veras los productos de la categoria ${carList.catName}</p>`;

        ListarDatos(productList);


        btnPrecioAsc.addEventListener("click", function () {
            filtro = "PrecioAsc";
            filtrar(productList, filtro);
        });
        btnPrecioDesc.addEventListener("click", function () {
            filtro = "PrecioDesc";
            filtrar(productList, filtro);
        });
        btnRelevancia.addEventListener("click", function () {
            filtro = "Relevancia";
            filtrar(productList, filtro);


        });
        btnNoFiltro.addEventListener("click", function () {
            filtro = "";
            container.innerHTML = "";
            let input = buscador.value.toLowerCase();
            productList = productListFiltrar.filter(item => item.name.toLowerCase().includes(input) || item.description.toLowerCase().includes(input) || item.currency.toLowerCase().includes(input) || item.cost.toString().includes(input));
            filtrar(productList, filtro);
        });

        buscador.addEventListener("input", function () {
            let input = buscador.value.toLowerCase();
            productList = productListFiltrar.filter(item => item.name.toLowerCase().includes(input) || item.description.toLowerCase().includes(input) || item.currency.toLowerCase().includes(input) || item.cost.toString().includes(input));
            container.innerHTML = "";
            filtrar(productList, filtro);
        });

        const btnFiltrar = document.getElementById("filtrarPrecio");
        const btnLimpiar = document.getElementById("filtrarLimpiar");


        btnFiltrar.addEventListener("click", function () {
            let precioMin = document.getElementById("inputmin").value;
            let precioMax = document.getElementById("inputmax").value;
            // let datosFiltrados=[]; esto no es necesario
            if (precioMax == 0) {
                precioMax = Number.MAX_SAFE_INTEGER;
            }
            // productList.forEach(producto=>{
            //     if((parseInt(producto.cost)>=parseInt(precioMin))&&(parseInt(producto.cost)<=parseInt(precioMax))){
            //         datosFiltrados.push(producto);

            //     } esto lo cambié por un filter

            const datosFiltrados = productListFiltrar.filter(producto =>
                parseInt(producto.cost) >= precioMin && parseInt(producto.cost) <= precioMax
            );
            if (datosFiltrados.length === 0) {
                alert("No hay productos en ese rango");
            }

            container.innerHTML = "";
            productList = datosFiltrados; //para actualizar el productList y que se pueda ordenar despues de filtrar por precio

            filtrar(datosFiltrados, filtro); //acá cambié para que no llame a ListarDatos, sino que a filtrar que ya tiene el listardatos, asi cuando se hace click en ordenar funcione.
        });

        btnLimpiar.addEventListener("click", function () {
            let precioMin = document.getElementById("inputmin");
            let precioMax = document.getElementById("inputmax");
            precioMin.value = "";
            precioMax.value = "";

            productList = [...productListFiltrar] //acá otra vez setea el valor al inicial para que aparezcan todos los productos.
            container.innerHTML = "";
            ListarDatos(productList); 
        })

    }
});

function filtrar(array, filtro) {
    let datosSorteados = array;
    if (filtro === "PrecioDesc") {
        datosSorteados = array.sort(function (a, b) {
            if (a.cost < b.cost) {
                return 1;
            }
            if (a.cost > b.cost) {
                return -1;
            }
            return 0;
        })
    } else if (filtro === "PrecioAsc") {
        datosSorteados = array.sort(function (a, b) {
            if (a.cost > b.cost) {
                return 1;
            }
            if (a.cost < b.cost) {
                return -1;
            }
            return 0;

        })
    } else if (filtro === "Relevancia") {
        datosSorteados = array.sort(function (a, b) {
            if (a.soldCount < b.soldCount) {
                return 1;
            }
            if (a.soldCount > b.soldCount) {
                return -1;
            }
            return 0;
        })
    }
    container.innerHTML = "";
    ListarDatos(datosSorteados);
}

function ListarDatos(productList) {
    const container = document.getElementById('container');

    productList.forEach(prodList => {
        let name = prodList.name;
        let description = prodList.description;
        let price = prodList.cost;
        let currency = prodList.currency;
        let soldCount = prodList.soldCount;
        let image = prodList.image;

        const productsList = document.createElement('div');
        productsList.innerHTML = `
        <div onclick="setCatID(${prodList.id})" class="list-group-item list-group-item-action cursor-active">
            <div class="row">
                <div class="col-3">
                        <img src="${image}" alt="${prodList.image}" class="img-thumbnail">
                    </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <p class="mb-1">${name} - ${currency} ${price}</p>
                                <small class="text-muted">${soldCount} vendidos</small>
                        </div>
                        <small class="text-muted">${description} vendidos</small>
                    </div>
                </div>
            </div>
            </div>`;
        container.appendChild(productsList);
    })
}
