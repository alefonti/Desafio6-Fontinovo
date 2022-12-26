const express = require ("express");
const app = express();

const http = require ("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const fs = require("fs");
const archivoMensajes = "./mensajes.json";

const productos = [];

const leerMensajes = async() => {
    const mensajesEnJson = await fs.promises.readFile(archivoMensajes, "utf-8");
    const mensajesObject = JSON.parse(mensajesEnJson);
    return mensajesObject;
}

const agregarMensaje = async(data) => {
    const mensajesObject = await leerMensajes();
    var hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth() + 1;
    const anio = hoy.getFullYear();    
    const hora = hoy.getHours();
    const min = hoy.getMinutes();
    const seg = hoy.getSeconds();
    mensajesObject.push({
        "email": data.email,
        "date": `[${dia}/${mes}/${anio} ${hora}:${min}:${seg}]`,
        "msj": data.msj
    });
    const mensajesJson = JSON.stringify(mensajesObject);
    await fs.promises.writeFile(archivoMensajes, mensajesJson);
}

const mensajesAHtml = async() => {
    const mensajesObject = await leerMensajes();
    let mensajesEnHTML = "";
    for (const msj of mensajesObject) {
        mensajesEnHTML += `<p><span class="email">${msj.email}</span> <span class="date">${msj.date}:</span> <span class="msj">${msj.msj}</span></p>`;
    }
    return mensajesEnHTML;
}    
 
io.on ("connect", (client) => {
    console.log(`Cliente conectado con ID ${client.id}`)

    mensajesAHtml()
    .then ((msjs) => { 
        client.emit("mensajes-todos", msjs);
    })
  
    client.on ("mensaje", (msj) => {
        agregarMensaje(msj)
        .then(() => {
            mensajesAHtml()
            .then((msjs) => {
                io.sockets.emit("mensajes-todos", msjs);
            })
        })
    })

    client.emit("productos-todos", productos);
    
    client.on("nuevo-producto", (producto) => {
        productos.push(producto);
        producto.id = productos.length;
        io.sockets.emit("productos-todos", productos);
    })
});


const PORT = 8080;
server.listen(PORT, () => console.log(`Server Corriendo en puerto ${PORT}`));