const ctx = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMPERATURE = 14;

function fetchData() {
    return fetch('./ZonAnn.Ts+dSST.csv').then((response) => response.text());
}

function parseData(data) {
    return Papa.parse(data, { header: true }).data;
}

function getLabelsAndTemps(parsedData) {
    return parsedData.reduce((acc, entry) => { // not to to avoid multiple itiration through the array with map(see commented section below)
                acc.years.push(entry.Year);
                acc.tempsGlob.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
                acc.tempsNHem.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
                acc.tempsSHem.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);

                return acc;
            }, {years: [], tempsGlob: [], tempsNHem: [], tempsSHem: []})
        
            // const years = parsedData.map(entry => entry.Year);
            // const temps = parsedData.map(entry => Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
}

function drawChart(labels, datasetOne, datasetTwo, datasetThree) { // years and temps from function getLabelsAndTemps
    new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Global mean temperature',
                        data: datasetOne, 
                        borderColor: 'rgba(0, 0, 0, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Northern Hemisphere mean temperature',
                        data: datasetTwo, 
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Southern Hemisphere mean temperature',
                        data: datasetThree, 
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 2,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            ticks: {
                                    callback(value) {
                                        return value + "°"
                                    }
                            }
                        }
                    },
                    elements: {
                        point: {
                            pointStyle: 'star'
                        }
                    }
                }
    });
}

fetchData()
    .then(parseData)
    .then(getLabelsAndTemps)
    .then(({ years, tempsGlob, tempsNHem, tempsSHem }) => drawChart(years, tempsGlob, tempsNHem, tempsSHem))

            
            

