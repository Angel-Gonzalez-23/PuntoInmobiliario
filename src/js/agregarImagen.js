import { Dropzone } from "dropzone";
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: "Agrega imagen de la propiedad en los siguientes formatos .png .pg .jpeg",
    acceptedFiles:  ".png,.pg,.jpeg,.jpg",
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "Elimiar imagen",
    dictMaxFilesExceeded: "Maximo 10 imagenes",
    headers: {
        "CSRF-Token": token
    },
    paramName: "imagen",
    //reescribir sobre el objeto de dropzone
    init: function () {
        const dropzone = this;
        const btnPublicar = document.querySelector("#publicar")
        btnPublicar.addEventListener("click",function () {
            dropzone.processQueue()
        });
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0 ){
                window.location.href = '/mis-propiedades'
            }
        })
    }
}