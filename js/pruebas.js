
let json;
let xhr = new XMLHttpRequest();
let artSinModificar = [];
function solicitarDatos(metodo = 'GET', id = "", body = "") {
	xhr.open(metodo, 'http://localhost:3000/articulos/' + id);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.responseType = 'json';
	xhr.send(body);
	xhr.onload = function () {
		json = xhr.response;
	}
	return xhr;
}

function dialogos() {
	return `</div>
		<div class="text-center">
			<form id="formu">
			<label for="id">ID</label>
            <input type="text" name="id" id="id">
            <br>

            <label for="nombre">Nombre</label>
            <input type="text" name="nombre" id="nombre">
            <br>

            <label for="descripcion">Descripción</label>
            <input type="text" name="descripcion" id="descripcion">
            <br>

            <label for="precio">Precio</label>
            <input type="number" name="precio" id="precio">
            <br>
        </form>
			<button id="cerrar" class="btn btn-secondary">Cancelar</button>
			<button id="enviar" class="btn btn-info">Nuevo</button>
		</div>`;
}

function crearTablaArticulos() {
	let articulo;
	xhr = solicitarDatos();
	xhr.onloadend = function () {
		let tablaArticulos = "<table class='table table-striped '><tr><th><th>nombre<th>descripcion<th>precio<th></tr>"
		let lista = [...json];
		lista.forEach(e => {
			tablaArticulos += `
			<tr>
			<td><img src="assets/${e.id}.jpg" class="imagen">
			<td>${e.nombre}
			<td>${e.descripcion}
			<td>${e.precio}
			<td><button id="${e.id}_modi" class="btn btn-success">modificar</button>
			<button id="${e.id}_borrar" class="btn btn-danger">borrar</button> 
			</tr>`
		})
		tablaArticulos += "</table>"
		document.getElementById("contenedor").innerHTML = tablaArticulos;
		lista.forEach(e => {
			articulo = artSinModificar.find(a => a.id == e.id);
			if (articulo != undefined) {
				let boton = document.createElement("button");
				boton.id = articulo.id + "_cambiar";
				boton.className = "btn btn-warning";
				boton.innerText = "Restaurar";
				document.getElementById(e.id + "_borrar").after(boton);
				document.getElementById(e.id + "_cambiar").onclick = () => { restaurarArticulo(e.id) }
			}
			document.getElementById(e.id + "_modi").onclick = () => { modificaArticulo(e) }
			document.getElementById(e.id + "_borrar").onclick = () => { borraArticulo(e.id) }
		})
	}
}

function restaurarArticulo(id){
	var opcion = confirm("¿Estás seguro de restaurar los valores?");
	if(opcion){
		let pos = artSinModificar.findIndex(e=> e.id==id);
		let objeto = JSON.stringify(artSinModificar[pos])
		xhr = solicitarDatos('PUT', id, objeto);
		artSinModificar.splice(pos,1);
		xhr.onloadend = function () {
			document.getElementById("miDialogo").close();
			crearTablaArticulos();
		}
	}else{

	}
}

function borraArticulo(id) {
	xhr = solicitarDatos('DELETE', id);
	xhr.onloadend = function () {
		crearTablaArticulos();
	}
}

function modificaArticulo(articulo) {
	let dialogo = document.getElementById("miDialogo");
	dialogo.innerHTML = dialogos();
	let enviar = document.getElementById("enviar");
	enviar.innerHTML = "Modificar";
	document.getElementById("id").disabled = true;
	dialogo.showModal();
	let elementos = document.querySelectorAll("input")
	elementos.forEach(e => document.getElementById(e.id).value = articulo[e.id])
	enviar.onclick = () => cambiar(articulo);
	document.getElementById("cerrar").onclick = () => document.getElementById("miDialogo").close();
}

function cambiar(articulo) {
	let miFormulario = document.getElementById("formu")
	let miArticulos = new FormData(miFormulario);
	let newArticulos = { "id": articulo.id };
	for (let par of miArticulos) {
		par[0] == "id" ? "" : newArticulos[par[0]] = par[1];
	}
	let pos = artSinModificar.findIndex(e => e.id == articulo.id);
	pos == -1 ? artSinModificar.push(articulo) : artSinModificar[pos] = articulo;
	let objeto = JSON.stringify(newArticulos)
	xhr = solicitarDatos('PUT', articulo.id, objeto);
	xhr.onloadend = function () {
		document.getElementById("miDialogo").close();
		crearTablaArticulos();
	}
}

function nuevo() {
	let dialogo = document.getElementById("miDialogo");
	dialogo.innerHTML = dialogos();
	document.getElementById("id").disabled = false;
	dialogo.showModal();
	document.getElementById("cerrar").onclick = () => document.getElementById("miDialogo").close();
	document.getElementById("enviar").addEventListener("click", enviar);

}

function enviar() {
	let miFormulario = document.getElementById("formu")
	let miArticulos = new FormData(miFormulario);
	let newArticulos = {};
	for (let par of miArticulos) {
		newArticulos[par[0]] = par[1]
	}
	let objeto = JSON.stringify(newArticulos)
	xhr = solicitarDatos('POST',"", objeto);
	xhr.onloadend = function () {
		document.getElementById("miDialogo").close();
		crearTablaArticulos();
	}
}

window.onload = () => {
	crearTablaArticulos();
	document.getElementById("nuevo").addEventListener("click", nuevo);
}
