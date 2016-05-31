$(document).ready(function() {

    var cadenaLogs = [];


    eventosCache(cadenaLogs);


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


        //Cargo los eventos de cache a la pagina
        $.each(cadenaLogs, function(index, value) {

            $("#tBodyLogs").append('<tr><td>' + value + '</td>/tr>');

        });


    });

    $("#indexed").on('click', function() {

        //Importo Htmls
        importarHtml('importIndexedDb');

        //Cargo datos si los hay
        leerBBDD();

        $("#loadIndexed").on('click', function(e) {
            e.preventDefault();
            var arrayPersona = $("#formPersona").serializeArray();

            //Cargo BD
            escribirBBDD(arrayPersona);

            //Limpio la tabla 
            $("#tBodyPersonas").children().remove();
            //Recargo la lista
            leerBBDD();
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

            $.each(personas, function() {

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
        var store = db.createObjectStore("PersonaStore", { keyPath: "id", autoIncrement: true });
        var index = store.createIndex("email", ["email"]);
    };

    open.onsuccess = function() {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("PersonaStore", "readwrite");
        var store = tx.objectStore("PersonaStore");
        var index = store.index("email");

        // Add some data
        store.put({ nombre: arrayPersona[0], apellido: arrayPersona[1], email: arrayPersona[2] });

        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };
    }
}


function eventosCache(cadenaLogs) {



    var appCache = window.applicationCache;

    $(appCache).bind("checking", function(event) {
        console.log("Checking for manifest");
        cadenaLogs.push("Checking for manifest");
    });

    $(appCache).bind("noupdate", function(event) {
        console.log("No cache updates");
        cadenaLogs.push("No hay nada que actualizar en la cache");
    });

    $(appCache).bind("downloading", function(event) {
        console.log("Downloading cache");
        cadenaLogs.push("Descargando cache");
        // Get the total number of files in our manifest.
        //getTotalFiles();
    });
    // This gets fired for every file that is downloaded by the
    // cache update.
    $(appCache).bind("progress", function(event) {
        console.log("File downloaded");
        cadenaLogs.push("Fichero descargado");
        // Show the download progress.
        //displayProgress();
    });

    $(appCache).bind("cached",
        function(event) {
            console.log("All files downloaded");
            cadenaLogs.push("Todos los ficheros descargados");
        }
    );

    $(appCache).bind("updateready",
        function(event) {
            console.log("New cache available");
            cadenaLogs.push("Nueva cache disponible");
            // Swap out the old cache.
            //appCache.swapCache();
        }
    );

    $(appCache).bind("obsolete",
        function(event) {
            console.log("Manifest cannot be found");
            cadenaLogs.push("No se puede encontrar el manifest");
        }
    );
    // This gets fired when an error occurs
    $(appCache).bind("error",
        function(event) {
            console.log("An error occurred");
            cadenaLogs.push("error");
        }
    );

    /*
        $( window ).bind(
                "online offline",
                function( event ){
                    // Update the online status.
                    appStatus.text( navigator.onLine ? "Online" : "Offline" );
                }
            );
            // Set the initial status of the application.
            appStatus.text( navigator.onLine ? "Online" : "Offline" );
    */

}
