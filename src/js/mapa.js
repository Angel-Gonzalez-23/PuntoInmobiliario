(function() {
    const lat = document.querySelector('#lat').value || 20.4550292;
    const lng = document.querySelector('#lng').value || -97.736834;
    const mapa = L.map('mapa').setView([lat, lng ], 17);
    let marker;
    
    //Utilizar Provider y Geocoder
const geocodeservices = L.esri.Geocoding.geocodeService() ;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)
    //detectar movimiento del pin
    marker.on('moveend', function(e) {
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))    
        //obtener información de las calles al posicionar pin    
        geocodeservices.reverse().latlng(posicion, 17).run(function(error, resultado) {
            marker.bindPopup(resultado.address.LongLabel)      
            //lenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })
})()