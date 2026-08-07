// mapboxgl.accessToken = maptoken;

// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v12",
//   center: [-74.5, 40],
//   zoom: 9,
// }); 

const map = L.map("map").setView([26.9124, 75.7873], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

L.marker([26.9124, 75.7873]).addTo(map); 

const marker = new map.Marker({color:"red"})
.setLongLat(listing.geometry.coordinates) 
.setPopup(new map.Popup({offset:25})).setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
.addTo(map); 