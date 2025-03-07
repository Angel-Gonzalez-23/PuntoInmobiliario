(function(){
    const lat = 20.4550292;
    const lng = -97.736834;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 17);

    let markers = new L.FeatureGroup().addTo(mapa)
    let propiedades = [];

    //Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriaSelect = document.querySelector('#categorias');
    const precioSelect = document.querySelector('#precios');


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de ctaegorias y eventos
    categoriaSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })

    precioSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try {
            const url= '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }
    const mostrarPropiedades = propiedades => {
        //limpiar markers
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            //Agregar pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <h1 class="text-xl font-extrabold uppercase my-3">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de propiedad ${propiedad.titulo}"> 
                <p class="text-gray-600 font-bold">${propiedad.precio.precio} </p>
                <p class="text-gray-500 font-bold">${propiedad.categoria.nombre} </p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver propiedad </a>
            `)

            markers.addLayer(marker)
        })
    }
    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad
    

    obtenerPropiedades()
})()