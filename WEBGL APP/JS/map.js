let geodata = {};
const geodataUrl = "../Data/Geodata.json";
const dataLayerPanel = document.getElementById("data-layers-container");
const template = document.getElementById("data-layer-template");
const layersBtn = document.querySelector("#map-layers-btn");
const legendTemplate = document.querySelector("#discrete-legend-value-template");

const accessToken = "pk.eyJ1IjoiaXRvdW1wYWxpZGlzIiwiYSI6ImNqbGV6cHphaTBwOWUzcG5qMm1jcmFycG8ifQ.G4gMpKSSUrgfGxrOt-iK9g";
mapboxgl.accessToken = accessToken;

var map = new mapboxgl.Map({
    container: 'map', // Container ID   
    language: 'en-EN'
});

//---------------- Geocoder  ---------------//
var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    placeholder: 'Search for a place', // Placeholder text for the search bar
    language: 'en',
    limit: 5,
    position: 'bottom-right',
    zoom: 15
});

// Listen for the `result` event from the Geocoder
// `result` event is triggered when a user makes a selection
geocoder.on('result', function (ev) {
    console.log(ev.result.geometry);
    gameInstance.SendMessage("HtmlUIManager", "OnGeocoder", JSON.stringify(ev.result.geometry));
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

//---------------- Reverse Geocoding for markers  ---------------//
async function reverseGeocodingAsync(latlon) {
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + latlon.lng + "%2C%20" + latlon.lat + ".json?language=en&access_token=pk.eyJ1IjoiaXRvdW1wYWxpZGlzIiwiYSI6ImNqbGV6cHphaTBwOWUzcG5qMm1jcmFycG8ifQ.G4gMpKSSUrgfGxrOt-iK9g";
    let result = await fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        })
    return result;
}


layersBtn.addEventListener("click", function () {
    dataLayerPanel.classList.toggle("hidden")
})

setupContextMode();

async function setupContextMode() {
    geodata = await readFromLocalFile(geodataUrl);
    populateGeodataUI(geodata);
}

function populateGeodataUI(data) {
    for (let i = 0; i < data.length; i++) {
        const datalayer = data[i];
        const clone = template.content.cloneNode(true);
        clone.id = datalayer.Name + "-template";
        const toggle = clone.querySelector("#layer-id");
        toggle.id = datalayer.Name;
        toggle.setAttribute("index", i.toString());
        const label = clone.getElementById("label");
        label.htmlFor = datalayer.Name;
        label.textContent = datalayer.Name.replace(/_/g, " ");
        label.setAttribute("title", datalayer.Description);

        dataLayerPanel.appendChild(clone);
        //setup legend
        createLegend(toggle, datalayer);

        toggle.addEventListener("click", function () {
            if (toggle.getAttribute("state") == "on") {
                gameInstance.SendMessage("HtmlUIManager", "OnFeatureActivate", (toggle.id+','+false).toString());
                toggle.setAttribute("state", "off");
                toggle.parentElement.querySelector("#legend").classList.add("hidden");
                toggle.style.backgroundColor = "#ffffff";
            } else {
                gameInstance.SendMessage("HtmlUIManager", "OnFeatureActivate", toggle.id+','+true);
                toggle.setAttribute("state", "on");
                toggle.parentElement.querySelector("#legend").classList.remove("hidden");
                toggle.style.backgroundColor = datalayer.Colours[0].color;
            }
        });
    }
}

function createLegend(toggle, datalayer) {
    if (datalayer.Colours.length > 1) {
        for (let item of datalayer.Colours) {
            const rect = legendTemplate.content.cloneNode(true);
            rect.style.backgroundColor = item.color;
            const label = rect.querySelector("#label");
            label.innerText = item.label;
            toggle.querySelector("#legend").appendChild(rect);
        }
    } 
}

function requestGeoJson(){
    gameInstance.SendMessage("HtmlUIManager", "OnGeodataReceived", JSON.stringify(geodata));
}

async function readFromLocalFile(url) {
    const filetext = await fetch(url)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            return data;
        })

    return filetext;
}