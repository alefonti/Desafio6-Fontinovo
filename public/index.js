const client = io();

const inputs = document.getElementsByTagName("input");
const boton = document.getElementById("botonEnviarProducto");

const inputEmail = document.getElementById("inputEmail");
const botonMsj = document.getElementById("botonEnviarMensaje");

client.on ("mensajes-todos", (data) => {

    const campoTexto = document.getElementById("campoTexto")
    campoTexto.innerHTML = data;
    campoTexto.scrollTo(0, campoTexto.scrollHeight);         
    
});

document.getElementById("botonEnviarMensaje").addEventListener("click", (e) => {

    if (inputEmail.value.trim() != "") {
        const mensajeAEnviar = document.getElementById("mensaje").value;
        const emailCliente = document.getElementById("inputEmail").value;
        document.getElementById("mensaje").value = "";
        client.emit("mensaje", {"email":emailCliente, "msj":mensajeAEnviar});
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'INGRESE UN E-MAIL',
        });    
    }
});

document.getElementById("botonEnviarProducto").addEventListener("click", () =>  {

    if (inputs[0].value.trim() !== "" && inputs[1].value.trim() !== "" && inputs[2].value.trim() !== "") {
        const nombreProducto = document.getElementById("formNombre").value;
        const precioProducto = document.getElementById("formPrecio").value;
        const urlProducto = document.getElementById("formUrl").value;
        client.emit("nuevo-producto", {"name": nombreProducto, "price": precioProducto, "url": urlProducto});
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Faltan datos del producto',
        });    
    }
});

client.on ("productos-todos", (productos) => {

    let productosHtml = "";
    const vistaProductos = document.getElementById("vistaProductos");

    if (productos.length !== 0) {
        productos.forEach(producto => {
        productosHtml += `<tr><td>${producto.id}</td><td>${producto.name}</td><td>$${producto.price}</td><td><img src="${producto.url}"></td></tr>`  
        });
        vistaProductos.innerHTML = productosHtml;
    } else {
        vistaProductos.innerHTML = `<td colspan="4">No Hay Productos Cargados</td>`;
    }   
});