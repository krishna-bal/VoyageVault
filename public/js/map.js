const map = new mapboxgl.Map({
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    accessToken: mapToken,
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/standard', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// TO SEE ONLY IMAGE COMMENT MARKER

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h6> ${listing.title} </h6> <p>Exact location will be provided after booking</p>`))
    .addTo(map)
