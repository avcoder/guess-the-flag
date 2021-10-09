var layer;
var map;

function mapInit(nodeId) {
  map = L.map(nodeId);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function show({ lat, lng, name }) {
  map.setView([lat, lng], 3);
  layer = L.marker([lat, lng]).addTo(map);
  layer.bindPopup(name, { className: "tooltip" });
  //   layer.openPopup();
}

function remove() {
  layer.remove();
}

const leafletMap = {
  mapInit,
  show,
  remove,
};

export default leafletMap;
