'use strict'

// Resalta un input que no contenga un dato numerico valido.
function inputValido(i){
    var esValido = !isNaN(i.value);
    if(!esValido){
        i.style.backgroundColor = "red";
        alert("Ingreso un "+i.id+" inválido.");
    }
    else{
        i.style.backgroundColor = "white";
    }
    return esValido;
}

var botonAgregar = document.getElementById("btn_agregar");

botonAgregar.addEventListener("click", function(){
    var inputProducto = document.getElementById("tipo");
    var inputMarca = document.getElementById("marca");
    var inputPrecio = document.getElementById("precio");
    var inputStock = document.getElementById("stock");
    
    var datosCompletos = (inputProducto.value!="")&&(inputMarca.value!="")&&(inputPrecio.value!="")&&(inputStock.value!="");
    
    if(datosCompletos){
        if(inputValido(inputPrecio)&&inputValido(inputStock)){
            console.log(inputProducto.value);
            console.log(inputMarca.value);
            console.log(inputPrecio.value);
            console.log(inputStock.value);
            inputProducto.value = "";
            inputMarca.value = "";
            inputPrecio.value = "";
            inputStock.value = "";
        }
    }
    else{
        alert("Los datos del producto no estan completos.");
    }
});


var inputCodigo;
var botonEliminar = document.getElementById("btn_eliminar");

botonEliminar.addEventListener("click", function(){
    var inputCodigo = document.getElementById("codigo");
    
    if(inputCodigo.value!=""){
        if(existeElCodigo(inputCodigo.value)){
            borrarProducto();
            inputCodigo.value = "";
            alert("Ingreso un codigo VALIDO");
        }
        else{
            alert("¡El codigo ingresado NO existe!.");
        }
    }
    else{
        alert("No se ingreso ningún código.");
    }
});

var primeraFila;
var contador;
var botonVaciar;