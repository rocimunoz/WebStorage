$(document).ready(function() {

    //var docLocalStorage = "";
    //var thisDoc = document.currentScript.ownerDocument;
    $("#localStorage").on('click', function() {
        importarHtml('importLocalStorage');

        var tabSeleccionada = 0;
        if (localStorage.getItem("tabLocal") != null) {
            tabSeleccionada = localStorage.getItem("tabLocal");
        }

        $('.nav-tabs >li').removeClass('active');
        $('.nav-tabs >li').eq(tabSeleccionada).addClass("active");

        $('.nav-tabs').bind('click', function(e) {

            localStorage.setItem("tabLocal", e.target.id);

        });




    });


    $("#sessionStorage").on('click', function() {
        importarHtml('importSessionStorage');

        var tabSeleccionada = 0;
        if (sessionStorage.getItem("tabSession") != null) {
            tabSeleccionada = sessionStorage.getItem("tabSession");
        }

        $('.nav-tabs >li').removeClass('active');
        $('.nav-tabs >li').eq(tabSeleccionada).addClass("active");

        $('.nav-tabs').bind('click', function(e) {

            sessionStorage.setItem("tabSession", e.target.id);

        });



    });

    $("#cache").on('click', function() {
        importarHtml('importCache');
    });

    $("#indexed").on('click', function() {

        //Importo Htmls
        importarHtml('importIndexedDb');

        //Cargo datos si los hay
        leerBBDD();
        



        $("#loadIndexed").on('click', function(e) {
            //e.preventDefault();
            var arrayPersona = $("#formPersona").serializeArray();

            //Cargo BD
            escribirBBDD(arrayPersona);


        })




    });

    $("#websql").on('click', function() {
        importarHtml('importWebSql');
    });

    $("#fileSystem").on('click', function() {
        importarHtml('importFileSystem');
    });





});


function importarHtml(idPage) {
    var divDerecho = document.querySelector('#paginaImportada');
    divDerecho.innerHTML = "";
    var contentLocalStorage = document.querySelector('#' + idPage).import;
    var divLocalStorage = contentLocalStorage.querySelector("#x");
    var newNode = document.importNode(divLocalStorage, true);
    //divDerecho.appendChild(divLocalStorage.cloneNode(true));
    divDerecho.appendChild(newNode);
}


function leerBBDD() {

    var personas = [];

    // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    // Open (or create) the database
    var open = indexedDB.open("PersonasDB", 1);

    // Create the schema
    open.onupgradeneeded = function() {
        var db = open.result;
        var store = db.createObjectStore("PersonaStore", { keyPath: "id" });
        var index = store.createIndex("email", ["email"]);
    };

    open.onsuccess = function(e) {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("PersonaStore", "readwrite");
        var store = tx.objectStore("PersonaStore");
        var index = store.index("email");

        
        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                //cursor.value.nombre.value;
                //cursor.value.apellido.value;
                //cursor.value.email.value;
                personas.push(cursor.value);
                cursor.continue();
            } else {
                console.log("fin del cursor");
            }

            $.each(personas, function () {

            $("#tBodyPersonas").append('<tr><td>' + this.id + '</td><td>' + this.nombre.value + '</td><td>' + this.apellido.value + '</td><td>' + this.email.value + '</td></tr>');
                
        });
        };



        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };

        
    }

    

}

function escribirBBDD(arrayPersona) {

    // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    // Open (or create) the database
    var open = indexedDB.open("PersonasDB", 1);

    // Create the schema
    open.onupgradeneeded = function() {
        var db = open.result;
        var store = db.createObjectStore("PersonaStore", { keyPath: "id" });
        var index = store.createIndex("email", ["email"]);
    };

    open.onsuccess = function() {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("PersonaStore", "readwrite");
        var store = tx.objectStore("PersonaStore");
        var index = store.index("email");

        // Add some data
        store.put({ id: 1, nombre: arrayPersona[0], apellido: arrayPersona[1], email: arrayPersona[2] });

        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };
    }

}
