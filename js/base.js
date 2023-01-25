// ENDPOINTS API TMDB
const optionsGet = {
	method: 'GET',
};

function buscarSerie() {
    const valorBusqueda = document.getElementById('paramBusqueda').value;
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=c675bcfb72f422cb8d13272f97429e98&language=es-US&page=1&query=${valorBusqueda}&include_adult=false`, optionsGet)
	.then(res => res.json())
        .then(data => {
            let htmltorender = '<br>';
            const objData = data.results;
            console.log('datatrue', objData);
            for (let i = 0; i < objData.length; i++) {
                const e = objData[i];
                const htmlData = `<div class="gridCard">
                <p>${e.name}</p>
                </div>`
                htmltorender = htmltorender + htmlData;
                document.getElementById('contenidoBusqueda').innerHTML = htmltorender;
            }
         })
        .catch(err => console.error(err));
};