mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hyaXMxMTJ0c2FvIiwiYSI6ImNsc2h2bWxwdzJiamcya282bTg4OWF6MGsifQ.gM9SFLoJgp11BoJ8lUPq5Q';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-122.421727, 47.622412], // Adjust to your desired starting point
    zoom: 10.75
});

let crimeChart = null,
    neighborhood = {},
    numCrimes = 0;

const grades = [0, '1 ~ 999', '1000 ~ 1999', '2000 ~ 2999', '3000 ~ 3999', '4000 ~ 4999', '5000 ~ 5999', '6000 ~ 6999', '7000 and above'],
    colors = [
        'rgb(217,217,217)',
        'rgb(255,255,204)',
        'rgb(255,237,160)',
        'rgb(254,217,118)',
        'rgb(254,178,76)',
        'rgb(253,141,60)',
        'rgb(252,78,42)',
        'rgb(227,26,28)',
        'rgb(177,0,38)'
    ];

const legend = document.getElementById('legend');
let labels = ['<strong>No. of Crime Reported</strong>'], vbreak;

for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    square_size = 10
    labels.push(
        '<p class="break"><i class="square" style="background:' + colors[i] + '; width: ' + square_size +
        'px; height: ' +
        square_size + 'px; "></i> <span class="square-label" style="top: ' + square_size / 2 + 'px;">' + vbreak +
        '</span></p>');
}

const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.seattle.gov/Public-Safety/SPD-Crime-Data-2008-Present/tazs-3rd5/about_data">Seattle Open Data</a></p>';

// join all the labels and the source to create the legend content.
legend.innerHTML = labels.join('') + source;

async function geojsonFetch() {

    // Await operator is used to wait for a promise. 
    // An await can cause an async function to pause until a Promise is settled.
    let response;
    response = await fetch('assets/sngh_crime_data.geojson');
    crime_data = await response.json();

    map.on('load', () => {
        map.addSource('seattle-neighborhoods', {
            'type': 'geojson',
            'data': crime_data
        });

        map.addLayer({
            'id': 'choropleth-layer',
            'type': 'fill',
            'source': 'seattle-neighborhoods',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'crime_count'],
                    'rgba(0, 0, 255, 0)',
                    // colors from https://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=7
                    0, 'rgb(217,217,217)',
                    1, 'rgb(255,255,204)',
                    1000, 'rgb(255,237,160)',
                    2000, 'rgb(254,217,118)',
                    3000, 'rgb(254,178,76)',
                    4000, 'rgb(253,141,60)',
                    5000, 'rgb(252,78,42)',
                    6000, 'rgb(227,26,28)',
                    7000, 'rgb(177,0,38)'
                ],
                'fill-opacity': 0.75
            }
        });
    });


    map.on('click', 'choropleth-layer', (event) => {
        const nghName = event.features[0].properties.S_HOOD;
        const crimeCount = event.features[0].properties.crime_count;
        const tractInfo = `<strong>Neighborhood:</strong> ${nghName}<br><strong>Number of crimes reported: </strong>${crimeCount}`;
        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(tractInfo)
            .addTo(map);
    });

    // the coordinated chart relevant operations
    let crimeDataByNeighborhood = calCrimes(crime_data);
    let topNeighborhoods = Object.keys(crimeDataByNeighborhood).slice(0, 10); // Get the top 10 neighborhoods
    // let crimeCounts = topNeighborhoods.map(neighborhood => crimeDataByNeighborhood[neighborhood]);
    let crimeCounts = [];
    for (let i = 0; i < topNeighborhoods.length; i++) {
        let neighborhood = topNeighborhoods[i];
        let crimeCount = crimeDataByNeighborhood[neighborhood];
        crimeCounts.push(crimeCount);
    }


    // Generate the chart
    crimeChart = c3.generate({
        bindto: '#crime-chart',
        data: {
            columns: [
                ['Number of Crimes'].concat(crimeCounts)
            ],
            type: 'bar'
        },
        axis: {
            rotated: true,
            x: {
                label: {
                    text: 'Neighborhoods',
                    position: 'outer-center'
                },
                type: 'category',
                categories: topNeighborhoods
            },
            y: {
                label: {
                    text: 'Number of Crimes',
                    position: 'outer-middle'
                }
            }
        },
        bar: {
            width: {
                ratio: 0.8
            }
        },
        legend: {
            show: false
        }
    });

    //load data to the map as new layers.
    //map.on('load', function loadingData() {
    map.on('idle', () => { //simplifying the function statement: arrow with brackets to define a function
        let crimeDataByNeighborhood = calCrimes(crime_data);
        let topNeighborhoods = Object.keys(crimeDataByNeighborhood).slice(0, 10); // Get the top 10 neighborhoods
        let crimeCounts = topNeighborhoods.map(neighborhood => crimeDataByNeighborhood[neighborhood]);

        // Update the chart with the new data
        crimeChart.load({
            columns: [
                ['Number of Crimes'].concat(crimeCounts)
            ]
        });
    });
};

geojsonFetch();



function calCrimes(currentCrimes) {
    let crimeDataArray = currentCrimes.features.map(feature => ({
        neighborhood: feature.properties.S_HOOD,
        crimeCount: feature.properties.crime_count
    }));

    // Sort the array based on crimeCount in descending order to get the neighborhoods with the most crimes on top
    crimeDataArray.sort((a, b) => b.crimeCount - a.crimeCount);

    // Since we only need the top 10, slice the array accordingly
    let topCrimeDataArray = crimeDataArray.slice(0, 10);

    // Convert this array into an object with neighborhood names as keys and their crime counts as values
    let topCrimeDataObject = topCrimeDataArray.reduce((acc, item) => {
        acc[item.neighborhood] = item.crimeCount;
        return acc;
    },{});
    return topCrimeDataObject;
}

// capture the element reset and add a click event to it.
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {

    // this event will trigger the map fly to its origin location and zoom level.
    map.flyTo({
        center: [-122.421727, 47.6062],
        zoom: 11
    });
    // also remove all the applied filters
    map.setFilter('choropleth-layer', null)


});