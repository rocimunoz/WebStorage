$(document).ready(function() {






    $("#localStorage").on('click', function() {
        var divDerecho = document.querySelector('#paginaImportada');
        divDerecho.innerHTML = "";
        var contentLocalStorage = document.querySelector('#importLocalStorage').import;
        var divLocalStorage = contentLocalStorage.querySelector("#x");
        divDerecho.appendChild(divLocalStorage.cloneNode(true));


    });


    $("#sessionStorage").on('click', function() {
        var divDerecho = document.querySelector('#paginaImportada');
        divDerecho.innerHTML = "";
        var contentLocalStorage = document.querySelector('#importSessionStorage').import;

        var divLocalStorage = contentLocalStorage.querySelector("#x");
        divDerecho.appendChild(divLocalStorage.cloneNode(true));

    });

    $("#cache").on('click', function() {
        var divDerecho = document.querySelector('#paginaImportada');
        divDerecho.innerHTML = "";
        var contentLocalStorage = document.querySelector('#importCache').import;

        var divLocalStorage = contentLocalStorage.querySelector("#x");
        divDerecho.appendChild(divLocalStorage.cloneNode(true));

    });

    $("#indexed").on('click', function() {
        var divDerecho = document.querySelector('#paginaImportada');
        divDerecho.innerHTML = "";
        var contentLocalStorage = document.querySelector('#importIndexedDb').import;

        var divLocalStorage = contentLocalStorage.querySelector("#x");
        divDerecho.appendChild(divLocalStorage.cloneNode(true));

    });

    $("#websql").on('click', function() {
        var divDerecho = document.querySelector('#paginaImportada');
        divDerecho.innerHTML = "";
        var contentLocalStorage = document.querySelector('#importWebSql').import;

        var divLocalStorage = contentLocalStorage.querySelector("#x");
        divDerecho.appendChild(divLocalStorage.cloneNode(true));

    });

    $("#fileSystem").on('click', function() {
        var divDerecho = document.querySelector('#paginaImportada');
        divDerecho.innerHTML = "";
        var contentLocalStorage = document.querySelector('#importFileSystem').import;

        var divLocalStorage = contentLocalStorage.querySelector("#x");
        divDerecho.appendChild(divLocalStorage.cloneNode(true));

    });


});
