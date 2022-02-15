mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom

});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h4>${campground.title}</h4><p>${campground.location}</p>`
        )
    )
    .addTo(map);


// const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
//     .setLngLat([-74.5, 40])
//     .addTo(map);