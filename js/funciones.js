$(document).ready(function() {

    $("#localStorage").on('click', function() {
        importarHtml('importLocalStorage');
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



});


function importarHtml(idPage) {

    var divDerecho = document.querySelector('#paginaImportada');
    divDerecho.innerHTML = "";
    var contentLocalStorage = document.querySelector('#'+ idPage).import;
    var divLocalStorage = contentLocalStorage.querySelector("#x");
    divDerecho.appendChild(divLocalStorage.cloneNode(true));


}
