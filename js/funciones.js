$(document).ready(function() {

    var cadenaLogs = [];

    eventosCache(cadenaLogs);


    /********************** EVENTOS IMPORT ***************************************/

    $("#navigator").on('click', function() {
            importarHtml('importNavigator');

            if (window.navigator.onLine) {
                $("#estado").empty();
                $("#estado").append("Estado: Online");

            } else if (window.navigator.offLine) {
                $("#estado").empty();
                $("#estado").append("Estado: Offline");
            }

            $("#version").empty();
            $("#version").append("Version: " + window.navigator.appVersion);

            $("#idioma").empty();
            $("#idioma").append("Idioma: " + window.navigator.language);

            

            $("#plataforma").empty();
            $("#plataforma").append("Plataforma: " + window.navigator.platform);

            

            


        

    });


$("#localStorage").on('click', function() {
    importarHtml('importLocalStorage');

    var tabSeleccionada = 0;
    if (localStorage.getItem("tabLocal") != null) {
        tabSeleccionada = localStorage.getItem("tabLocal");
    }

    $('.nav-tabs >li').removeClass('active');
    $('.nav-tabs >li').eq(tabSeleccionada).addClass("active");
    


    var pestana = $("#" + tabSeleccionada).attr("href");
    
    $(".tab-pane").removeClass("active");
    $(pestana).addClass("active");


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
    var pestana = $("#" + tabSeleccionada).href;
    $("#" + pestana).addClass("active");

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


    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 20 * 1024 * 1024 /*20MB*/ , onInitFs, errorHandler);


    $("#canciones").change(function() {
        console.log("subimos una cancion")
            //grab the first image in the fileList
            //in this example we are only loading one file.
        console.log(this.files[0].size);
        cargarCancion(this.files[0]);

    });

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

/*********************  EVENTOS INDEXED DB **********************************/

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
                console.log("tam: " + personas.length);
                $.each(personas, function() {

                    $("#tBodyPersonas").append('<tr><td>' + this.id + '</td><td>' + this.nombre.value + '</td><td>' + this.apellido.value + '</td><td>' + this.email.value + '</td></tr>');
                    
                });
            }


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


        var autoIncrement = store.autoIncrement;
        console.log(autoIncrement);
        if (autoIncrement) {
            store.put({ nombre: arrayPersona[0], apellido: arrayPersona[1], email: arrayPersona[2] });
        } else {

            /*
            var myIndex = store.index('email');
            var getAllKeyRequest = myIndex.getAllKeys();
            getAllKeyRequest.onsuccess = function() {
                console.log(getAllKeyRequest.result);
                var tam = getAllKeyRequest.result.length;
                store.put({id: tam,  nombre: arrayPersona[0], apellido: arrayPersona[1], email: arrayPersona[2] }); 
            }
            */
            var tam = $("#tBodyPersonas > tr").length;
            var idChapucero = Math.floor((Math.random() * 10) + 1);
            store.put({ id: idChapucero, nombre: arrayPersona[0], apellido: arrayPersona[1], email: arrayPersona[2] });




        }


        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };
    }
}


/********************** EVENTOS CACHE **********************************/


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

    });

    $(appCache).bind("progress", function(event) {
        console.log("Se esta descargando el fichero");
        cadenaLogs.push("Se esta descargando el fichero");

    });

    $(appCache).bind("cached", function(event) {
        console.log("Todos los ficheros descargados");
        cadenaLogs.push("Todos los ficheros descargados");
    });

    $(appCache).bind("updateready", function(event) {
        console.log("New cache available");
        cadenaLogs.push("Nueva cache disponible");
    });

    $(appCache).bind("obsolete",
        function(event) {
            console.log("No se puede encontrar el manifest");
            cadenaLogs.push("No se puede encontrar el manifest");
        }
    );
    // This gets fired when an error occurs
    $(appCache).bind("error",
        function(event) {
            console.log("Se ha producido un error");
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




/*******************  EVENTOS FILE SYSTEM API *********************************/

function leerCanciones() {


}

function cargarCancion(file) {

    var reader = new FileReader();
    reader.onload = function(event) {
        the_url = event.target.result;
        $("#tBodyCanciones").append("<tr><td><audio src='" + the_url + "' preload=auto controls></audio></td></tr>");
    }

    reader.readAsDataURL(file);
}


function onInitFs(fs) {
    console.log('Opened file system: ' + fs.name);
}

function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };

    console.log('Error: ' + msg);
}
