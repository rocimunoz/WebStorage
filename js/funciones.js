$(document).ready(function() {

//var docLocalStorage = "";
//var thisDoc = document.currentScript.ownerDocument;
    $("#localStorage").on('click', function() {
        importarHtml('importLocalStorage'); 

        $("#reload1").on('click', function() {
           
            alert("Boton con local storage");

        });

        $("#reload2").on('click', function() {
           
            alert("boton sin local storage");

        });


    });


    $("#sessionStorage").on('click', function() {
        importarHtml('importSessionStorage');
    });

    $("#cache").on('click', function() {
        importarHtml('importCache');
    });

    $("#indexed").on('click', function() {

        importarHtml('importIndexedDb');
    });

    $("#websql").on('click', function() {
        importarHtml('importWebSql');
    });

    $("#fileSystem").on('click', function() {
        importarHtml('importFileSystem');
    });


    $("#reload3").on('click', function() {
        console.log("llego");
        console.log($("#reload1"));

    });

    $("#reload1").on('click', function() {
        console.log("llego al 1");
        console.log($("#reload1"));

    });
 


$(function() {
    
});


});


function importarHtml(idPage) {

    var divDerecho = document.querySelector('#paginaImportada');
    divDerecho.innerHTML = "";
    var contentLocalStorage = document.querySelector('#'+ idPage).import;
    var divLocalStorage = contentLocalStorage.querySelector("#x");
    var newNode = document.importNode(divLocalStorage, true);
    //divDerecho.appendChild(divLocalStorage.cloneNode(true));
    divDerecho.appendChild(newNode);


}
