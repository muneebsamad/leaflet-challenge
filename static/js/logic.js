// Initialize the map and set its view to a default location
const map = L.map('map').setView([20, 0], 2);

// Add a tile layer (background map image) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data
d3.json(url).then(data => {
    // Function to determine marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 4;
    }

    // Function to determine marker color based on earthquake depth
    function markerColor(depth) {
        if (depth > 90) return "#A93226";
        else if (depth > 70) return "#FF4500";
        else if (depth > 50) return "#FF8C00";
        else if (depth > 30) return "#5DADE2";
        else if (depth > 10) return "#ADFF2F";
        else return "#00FF00";
    }

    // Function to create markers
    function createMarkers(feature) {
        return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "#000000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }

    // Create a GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => createMarkers(feature)
    }).addTo(map);

    // Create a legend
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "legend");
        const grades = [0, 10, 30, 50, 70, 90];
        const colors = ["#00FF00", "#ADFF2F", "#5DADE2", "#FF8C00", "#FF4500", "#A93226"];

        div.innerHTML = "<h4>Depth (km)</h4>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});
