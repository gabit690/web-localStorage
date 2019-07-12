'use strict'

// FUNCIONES

// Resalta un input que no contenga un dato numerico valido o si es menor o igual a 0.
function inputValido(i){
    let esValido = (!isNaN(i.value))&&(i.value>0);
    if(!esValido){
        i.style.backgroundColor = "red";
        alert("Ingreso un "+i.id+" inválido.");
    }
    else{
        i.style.backgroundColor = "white";
    }
    return esValido;
}

// Agrego los datos de un producto a la tabla de la pagina.
function agregarProductoALaTabla(codigo, nombre, marca, precio, stock){
    let tabla = document.getElementsByTagName("table")[0];
    let nuevaFila = document.createElement("tr");
    let celdaCodigo = document.createElement("td");
    celdaCodigo.textContent = codigo;
    let celdaProducto = document.createElement("td");
    celdaProducto.textContent = nombre;
    let celdaMarca = document.createElement("td");
    celdaMarca.textContent = marca;
    let celdaPrecio = document.createElement("td");
    celdaPrecio.textContent = precio;
    let celdaStock = document.createElement("td");
    celdaStock.textContent = stock;
    nuevaFila.appendChild(celdaCodigo);
    nuevaFila.appendChild(celdaProducto);
    nuevaFila.appendChild(celdaMarca);
    nuevaFila.appendChild(celdaPrecio);
    nuevaFila.appendChild(celdaStock);
    tabla.appendChild(nuevaFila);
}

// agrega un nuevo producto con los datos del input.
function agregarProducto(inputProducto, inputMarca, inputPrecio, inputStock){
    let hayProductos = (JSON.parse(localStorage.getItem("cantidadDeProductos"))>0);
    if(!hayProductos){
        // Oculto la fila vacia de la tabla.
        let filas = document.getElementsByTagName("tr");
        filas.item(1).style.display = "none";
    }
    /* Añado el producto a la tabla de la pagina*/
    let nuevoCodigo = "pr"+(JSON.parse(localStorage.getItem("codigosGenerados"))+1);
    let nuevoNombreDeProducto = inputProducto.value.trim();
    let nuevaMarca = inputMarca.value.trim();
    let nuevoPrecio = parseFloat(inputPrecio.value.trim());
    let nuevoStock = parseInt(inputStock.value.trim());
    let productoNuevo = {
        codigo: nuevoCodigo,
        producto: nuevoNombreDeProducto,
        marca: nuevaMarca,
        precio: nuevoPrecio,
        stock: nuevoStock
    }
    agregarProductoALaTabla(nuevoCodigo, nuevoNombreDeProducto, nuevaMarca, nuevoPrecio, nuevoStock);
    /* Agrego la nueva Clave al LocalStorage */
    let claves = JSON.parse(localStorage.getItem("claves"));
    claves.push(nuevoCodigo);
    localStorage.setItem("claves", JSON.stringify(claves));
    /* Subo el nuevo producto al array de productos */
    let productos = JSON.parse(localStorage.getItem("productos"));
    productos.push(productoNuevo);
    localStorage.setItem("productos", JSON.stringify(productos));
}

// Aumenta los contadores de cantidad de productos, codigos generados y el contador que se muestra en pantalla.
function aumentarContadores(){
    /* Aumento cantidad de productos en LocalStorage */
    let nuevaCantidadProductos = JSON.parse(localStorage.getItem("cantidadDeProductos"))+1;
    localStorage.setItem("cantidadDeProductos", JSON.stringify(nuevaCantidadProductos));
    /* Aumento cantidad de Codigos en LocalStorage */
    let nuevaCantidadCodigos = JSON.parse(localStorage.getItem("codigosGenerados"))+1;
    localStorage.setItem("codigosGenerados", JSON.stringify(nuevaCantidadCodigos));
    /* Aumento el contador */
    let contador = document.getElementById("contador");
    contador.textContent = parseFloat(contador.textContent)+1;
}

// Cambia la cantidad de productos mostrados en la pagina.
function setearContador(cantidadDeProductos){
    let contador = document.getElementById("contador");
    contador.textContent = cantidadDeProductos;
}

// Cargar los datos de los productos a la tabla mostrada en pantalla usando los productos existentes.
function armarTabla(){
    let productos = JSON.parse(localStorage.getItem("productos"));
    let hayProductos = productos.length>0;
    if(hayProductos){
        // Oculto la fila vacia de la tabla.
        let filas = document.getElementsByTagName("tr");
        filas[1].style.display = "none";
        /* Añado los productos existentes a la tabla */
        for(let elemento = 0; elemento<productos.length; elemento++){
            let unProducto = productos[elemento];
            agregarProductoALaTabla(unProducto.codigo, unProducto.producto, unProducto.marca, unProducto.precio, unProducto.stock);      
        }
    }
};


// Verifica si el codigo por parametro corresponde a un codigo de producto existente.
function existeElCodigo(unCodigo){
    let encontrado = false;
    let claves = JSON.parse(localStorage.getItem("claves"));
    for(let indice = 0; indice<claves.length; indice++){
        encontrado = (claves[indice]==unCodigo);
        if(encontrado){
            claves.splice(indice, 1); // Elimino la clave del array en el LocalStorage.
            localStorage.setItem("claves", JSON.stringify(claves));
            break;
        }
    }
    return encontrado;
}

// Elimina los datos del producto con el codigo pasado por parametro. Lo saca de los datos del LocalStorage y de la tabla de la pagina.
function sacarUnProducto(unCodigo){
    let productos = JSON.parse(localStorage.getItem("productos"));
    /* Eliminar Producto del Local Storage*/
    let encontrado = false;
    for(let indice = 0; indice<productos.length; indice++){
        encontrado = (productos[indice].codigo==unCodigo);
        if(encontrado){
            productos.splice(indice, 1); // Elimino el producto del array en el LocalStorage.
            localStorage.setItem("productos", JSON.stringify(productos));
            break;
        }
    }
    /* Eliminar Fila */
    let filas = document.getElementsByTagName("tr");
    for(let indice = 2; indice<(filas.length);indice++){
        if(filas[indice].firstChild.textContent==unCodigo){
            filas[indice].remove();
            break;
        }
    }
    if(productos.length==0){
        filas[1].style.display = "table-row";
    }
}

// Devuelve el resultado de verificar si los datos proporcionados corresponden a un producto que no existe.
function esOtroProducto(inputProducto, inputMarca){
    let esDistinto = true;
    let productos = JSON.parse(localStorage.getItem("productos"));
    for(let elemento = 0; elemento<productos.length; elemento++){
        let nombreProductoExistente = productos[elemento].producto.toLowerCase().trim()+productos[elemento].marca.toLowerCase().trim();
        let nombreProductoIngresado = inputProducto.value.toLowerCase().trim()+inputMarca.value.toLowerCase().trim();
        esDistinto = (nombreProductoExistente!=nombreProductoIngresado);
        if(!esDistinto){
            alert("Ya hay un producto con esa denominación y marca. Ingrese otro distinto");
            inputProducto.style.backgroundColor = "red";
            inputMarca.style.backgroundColor = "red";
            break;
        }
        else{
            inputProducto.style.backgroundColor = "white";
            inputMarca.style.backgroundColor = "white";
        }
    }
    return esDistinto;
}
// finaliza la definicion de funciones.

/* Obtengo los datos necesarios para empezar a procesar o cargar datos a la tabla */
var cantidadDeProductos = JSON.parse(localStorage.getItem("cantidadDeProductos"));

if(cantidadDeProductos==null){
    localStorage.setItem("claves", JSON.stringify([]));
    localStorage.setItem("cantidadDeProductos", JSON.stringify(0));
    localStorage.setItem("codigosGenerados", JSON.stringify(0));
    localStorage.setItem("productos", JSON.stringify([]));
}
else if(cantidadDeProductos>0){
    armarTabla();
    cantidadDeProductos = JSON.parse(localStorage.getItem("cantidadDeProductos"));
    setearContador(cantidadDeProductos);
}

var botonAgregar = document.getElementById("btn_agregar");

botonAgregar.addEventListener("click", function(){
    let inputProducto = document.getElementById("tipo");
    let inputMarca = document.getElementById("marca");
    let inputPrecio = document.getElementById("precio");
    let inputStock = document.getElementById("stock");
    let datosCompletos = (inputProducto.value!="")&&(inputMarca.value!="")&&(inputPrecio.value!="")&&(inputStock.value!="");
    if(datosCompletos){
        let precioValido = inputValido(inputPrecio);
        let stockValido = inputValido(inputStock);
        let datosValidos = esOtroProducto(inputProducto, inputMarca)&&precioValido&&stockValido;
        if(datosValidos){
            agregarProducto(inputProducto, inputMarca, inputPrecio, inputStock);
            aumentarContadores();
            /* Limpio los inputs */
            inputProducto.value = "";
            inputMarca.value = "";
            inputPrecio.value = "";
            inputStock.value = "";
        }
    }
    else{
        alert("Los datos del producto NO están completos.");
    }
});


var botonEliminar = document.getElementById("btn_eliminar");

botonEliminar.addEventListener("click", function(){
    let contador = document.getElementById("contador");
    let inputCodigo = document.getElementById("codigo");
    let hayProductos = parseFloat(contador.textContent)>0;
    if((hayProductos)&&(inputCodigo.value!="")){
        let eliminarProducto = existeElCodigo(inputCodigo.value);
        if(eliminarProducto){
            let cantidadProductos = JSON.parse(localStorage.getItem("cantidadDeProductos"))-1;
            localStorage.setItem("cantidadDeProductos", JSON.stringify(cantidadProductos));
            contador.textContent = parseFloat(contador.textContent)-1;
            sacarUnProducto(inputCodigo.value);
            inputCodigo.value = "";
            inputCodigo.style.backgroundColor = "white";
        }
        else{
            alert("El código ingresado NO existe!!!.");
            inputCodigo.style.backgroundColor = "red";
        }
    }
});

var botonVaciar = document.getElementById("btn_limpiar");

botonVaciar.addEventListener("click", function(){
    let contador = document.getElementById("contador");
    let cantidadDeProductos = parseFloat(contador.textContent);
    let sePuedeVaciarTabla = parseFloat(contador.textContent)>0;
    if(sePuedeVaciarTabla){
        let filas = document.getElementsByTagName("tr");
        for(let ejecucion = 1; ejecucion <= cantidadDeProductos; ejecucion++){
            filas[2].remove();
        }
        // Muestro la fila vacia de la tabla.
        filas[1].style.display = "table-row";
        // Reinicio el contador de productos de la pagina.
        contador.textContent = 0;
        /* reinicio datos del local storage */
        localStorage.setItem("cantidadDeProductos", JSON.stringify(0));
        localStorage.setItem("claves", JSON.stringify([]));
        localStorage.setItem("productos", JSON.stringify([]));
    }
});

// localStorage.clear();