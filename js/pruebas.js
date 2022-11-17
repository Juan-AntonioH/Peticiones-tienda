
	let json;
	let xhr;

	function solicitarDatos() {
		xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:3000/articulos/');
		xhr.responseType = 'json';
		xhr.send();
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
				document.getElementById(e.id + "_modi").onclick = () => { modificaArticulo(e) }
				document.getElementById(e.id + "_borrar").onclick = () => { borraArticulo(e.id) }
			})
		}
	}

	function borraArticulo(id) {
		xhr.open('DELETE', 'http://localhost:3000/articulos/' + id);
		xhr.send();
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
		elementos.forEach(e=>document.getElementById(e.id).value=articulo[e.id])
		enviar.onclick = () => cambiar(articulo.id);
		document.getElementById("cerrar").onclick = () => document.getElementById("miDialogo").close();
	}

	function cambiar(id) {
		let miFormulario = document.getElementById("formu")
		let miArticulos = new FormData(miFormulario);
		let newArticulos = { "id": id };
		for (let par of miArticulos) {
			par[0] == "id" ? "" : newArticulos[par[0]] = par[1];
		}
		xhr.open('PUT', 'http://localhost:3000/articulos/' + id);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(newArticulos));
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
		xhr.open('POST', 'http://localhost:3000/articulos/');
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(newArticulos));
		xhr.onloadend = function () {
			document.getElementById("miDialogo").close();
			crearTablaArticulos();
		}
	}

	window.onload = () => {
		crearTablaArticulos();
		document.getElementById("nuevo").addEventListener("click", nuevo);
	}
