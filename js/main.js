const btnAgregar = document.getElementById("invitar")

const btnBorrar = document.getElementById("borrar")

const btnGuardar = document.getElementById("guardar")

const btnVerificar = document.getElementById("verificar")

const btnCargar = document.getElementById("cargar")

let storageList = []



let lista = []


//lista =JSON.parse(JSONlist)
function agregarLista() {
    const listaElement = document.getElementById("lista-invitados")
    listaElement.innerHTML = "";
    lista.forEach((item) => {
        const listItem = document.createElement("li")
        listItem.textContent = `${item.nombre} - Edad:  ${item.edad} -Acompañantes: ${item.comp}`
        listaElement.appendChild(listItem)
    })
}


agregarLista()

function invitar() {

    const nombre1 = document.getElementById("name").value
    let nombre = nombre1.toUpperCase()
    const edad = parseInt(document.getElementById("age").value)
    const comp = parseInt(document.getElementById("comp").value)
    const formulario = document.getElementById("formulario")

    if (nombre1 != "" && edad > 0 && comp >= 0) {
        const item = {
            nombre,
            edad,
            comp
        };
        lista.push(item)
        agregarLista()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese valores correctos.',
          })    }
}


btnAgregar.addEventListener("click", () => invitar())


function borrar() {
    Swal.fire({
        title: 'Ingrese el nombre completo de la persona que desea borrar',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        showLoaderOnConfirm: true,
        preConfirm: (nombreABorrar) => {
            return new Promise((resolve) => {
                // Convertir el nombre a mayúsculas
                nombreABorrar = nombreABorrar.toUpperCase();

                // Encontrar el índice del invitado en la lista
                const indiceBorrar = lista.findIndex(item => item.nombre === nombreABorrar);

                // Verificar si se encontró el invitado
                if (indiceBorrar !== -1) {
                    // Borrar el invitado de la lista usando splice
                    lista.splice(indiceBorrar, 1);
                    agregarLista();
                    resolve();
                } else {
                    Swal.showValidationMessage('No existe invitado con ese nombre.');
                    resolve();
                }
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Borrado',
                'El invitado ha sido borrado correctamente.',
                'success'
            );
        }
    });
}

btnBorrar.addEventListener("click", () => borrar())

let title = document.getElementById('title')
title.addEventListener("click", cambiarNombre)

function cambiarNombre() {
    Swal.fire({
        title: 'Ingresa el nombre de la fiesta',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true,
        preConfirm: (nuevoNombre) => {
            // Aquí puedes realizar cualquier validación necesaria en el nuevoNombre
            if (!nuevoNombre) {
                Swal.showValidationMessage('El nombre no puede estar vacío');
            }
            return nuevoNombre;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const nuevoNombre = result.value;
            // Haz lo que necesites con el nuevoNombre, por ejemplo, asignarlo al título
            title.innerText = nuevoNombre;
        }
    });
}



for(i=0;i<localStorage.length;i++){
    storageList.push(JSON.stringify(localStorage.key(i)))
}

function storageRecover(item){
   return storageList[item]
}




// Retrieve data from localStorage
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("Objeto_")) {
        let item = JSON.parse(localStorage.getItem(key));
        lista.push(item);
    }
}

agregarLista()


const capacidad = document.getElementById("capacity").value

let sumaComp = 0;

for (let i = 0; i < lista.length; i++) {
    sumaComp += lista[i].comp;
}

let total= sumaComp + lista.length


function verificar() {
    const capacidad = parseInt(document.getElementById("capacity").value); // Get the current value of the input field

    let sumaComp = 0;




    for (let i = 0; i < lista.length; i++) {
        sumaComp += lista[i].comp;
    }

    let total = sumaComp + lista.length;

    let diferencia = capacidad - total;

    let favor = total - capacidad

    total <= capacidad ? Swal.fire("Excelente! Hay un total de " + total + " invitados. Todavía es posible invitar a "+ diferencia + " personas más.") : Swal.fire("El número de invitados es de " + total + " personas. Ha excedido la capacidad máxima por " + favor + " invitados. Reduzca el número de invitados.")
    
    //alert("El número de invitados es de " + total + " personas. Ha excedido la capacidad máxima por " + favor + " invitados. Reduzca el número de invitados.")
    
    //alert("Excelente! Hay un total de " + total + " invitados. Todavía es posible invitar a "+ diferencia + " personas más.") : alert("El número de invitados es de " + total + " personas. Ha excedido la capacidad máxima por " + favor + " invitados. Reduzca el número de invitados.")
    
}

btnVerificar.addEventListener("click", verificar);

function importarDatosDesdeJSON() {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = ".json";

    // Agrega un evento 'change' al elemento de entrada de archivo
    inputFile.addEventListener("change", (event) => {
        const file = event.target.files[0]; // Obtiene el primer archivo seleccionado

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);

                    // Verificar si el array 'lista' ya tiene contenido
                    if (lista.length > 0) {
                        Swal.fire({
                            title: 'Lista existente',
                            text: 'La lista actual tiene contenido. ¿Deseas sobreescribir o agregar la lista JSON?',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Sobreescribir',
                            cancelButtonText: 'Agregar',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Sobreescribir la lista existente
                                lista = jsonData;
                            } else {
                                // Agregar la lista JSON a la lista existente
                                lista = [...lista, ...jsonData];
                            }
                            agregarLista();
                            Swal.fire(
                                'Carga exitosa',
                                'Los datos del archivo JSON se han cargado correctamente.',
                                'success'
                            );
                        });
                    } else {
                        // Si la lista está vacía, simplemente asigna la lista JSON
                        lista = jsonData;
                        agregarLista();
                        Swal.fire(
                            'Carga exitosa',
                            'Los datos del archivo JSON se han cargado correctamente.',
                            'success'
                        );
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar el archivo JSON. Asegúrate de que sea válido.',
                    });
                }
            };

            reader.readAsText(file);
        }
    });

    // Agrega un evento 'click' al enlace para abrir la ventana de selección de archivos
    document.getElementById("fileSelectorLink").addEventListener("click", (event) => {
        event.preventDefault(); // Evita que el enlace navegue a una nueva página
        inputFile.click(); // Abre la ventana de selección de archivos
    });
}

importarDatosDesdeJSON();

function guardar() {
    storageList = []
    localStorage.clear()
    lista.forEach(function (objeto) {
        var clave = 'Objeto_' + objeto.nombre; // Generar una clave única para cada objeto
        localStorage.setItem(clave, JSON.stringify(objeto)); // Guardar el objeto como una cadena JSON
    })
}

btnGuardar.addEventListener("click", () => guardar())

