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
                const htmlData = `<div class="gridCard my-5">
                <div>
                  <img src="https://image.tmdb.org/t/p/w300${e.poster_path}" alt="">
                </div>
                <div>
                  <h3>title goes here</h3>
                  <p>somedata</p>
                  <p>even some more other data</p>
                </div>
              </div>`
                htmltorender = htmltorender + htmlData;
                document.getElementById('contenidoBusqueda').innerHTML = htmltorender;
            }
         })
        .catch(err => console.error(err));
};