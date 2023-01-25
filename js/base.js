// variables globales 
let = resultados = [];
let seriesAñadidas = [];

// localstorage start
function incializeLocalStorage() {
  const localdata = localStorage.getItem('listadoseries');
  if (localdata) {
    seriesAñadidas = JSON.parse(localdata);
    renderizarListado();
  }
};
function limpiarBusqueda() {
  document.getElementById('contenidoBusqueda').innerHTML = '';
  resultados = [];
};
incializeLocalStorage();

function renderizarListado() {
  const filtroMaxCaps = document.getElementById('cantidadCap').value;
  const filteredArray = seriesAñadidas.filter((e) => parseInt(e.pendientesDeVer) <= parseInt(filtroMaxCaps));
  console.log('filteredArray', filteredArray);
  document.getElementById('listadoseries').innerHTML = '';
  let htmltorender = '<h3 class="text-center">Listado de series añadidas filtradas por cantidad de capitulos a ver</h3>';
  for (let i = 0; i < seriesAñadidas.length; i++) {
      const e = seriesAñadidas[i];
      const htmlData = `<div class="gridCard my-5">
      <div>
        <img src="https://image.tmdb.org/t/p/w300${e.poster_path}" alt="">
      </div>
      <div>
        <h3>${e.name}</h3>
        <span id="${e.id}" style="display:none;"></span>
        <p>Califacion: ${e.vote_average === 0 ? 'Sin Califacion' : e.vote_average} </p>
        <p>Cantidad de episodios: ${e.detail.number_of_episodes}</p>
        <p> Ultimo capitulo emitido: ${e.detail.last_episode_to_air ? e.detail.last_episode_to_air.episode_number : '-'} </p>
        <p>Fecha emision ultimo episodio: ${e.detail.last_air_date ? dayjs(e.detail.last_air_date).format('DD/MM/YYYY') : '-'} </p>
        <p>Fecha emision proximo episodio: ${e.detail.next_episode_to_air ? dayjs(e.detail.next_episode_to_air.air_date).format('DD/MM/YYYY') : 'Finalizado/Suspendido'} </p>
        <p>Capitulos pendientes de ver: ${e.pendientesDeVer}</p>
        <button type="button" class="btn btn-primary" onclick="eliminarSerieDelListado(${e.id})">Eliminar</button>
        </div>
      </div>
    </div>`
      htmltorender = htmltorender + htmlData;
      document.getElementById('listadoseries').innerHTML = htmltorender;
    };
};
// renderizar listado series a ver
// ENDPOINTS API TMDB
const optionsGet = {
	method: 'GET',
};
async function detalleSerie(id) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=c675bcfb72f422cb8d13272f97429e98&language=es-US&page=1&include_adult=false`, optionsGet)
    .then(res => res.json())
    .catch(err => console.error(err));
    const data = await response;
    return data;
};

async function buscarSerie() {
    const valorBusqueda = document.getElementById('paramBusqueda').value;
    if (!valorBusqueda) {
      alert('Debes ingresar un texto de busqueda');
    }
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=c675bcfb72f422cb8d13272f97429e98&language=es-US&page=1&query=${valorBusqueda}&include_adult=false`, optionsGet)
	.then(res => res.json())
        .then(async data => {
          document.getElementById('contenidoBusqueda').innerHTML = '';
            let htmltorender = '<h3 class="text-center">Resultados busqueda:</h3>';
            const objData = data.results;
            if (objData.length === 0) {
              htmltorender = htmltorender + `<div><h4 class="text-center">No se encontraron resultados</h4></div>`;
              document.getElementById('contenidoBusqueda').innerHTML = htmltorender;
            }
            for (let i = 0; i < objData.length; i++) {
                const e = objData[i];
                const details = await detalleSerie(e.id);
                e.detail = details;
                e.ultimoEpisodioVisto = null;
                const htmlData = `<div class="gridCard my-5">
                <div>
                  <img src="https://image.tmdb.org/t/p/w300${e.poster_path}" alt="no se encontro una imagen">
                </div>
                <div>
                  <h3>${e.name}</h3>
                  <span id="${e.id}" style="display:none;"></span>
                  <p>Calificacion: ${e.vote_average === 0 ? 'Sin Califacion' : e.vote_average} </p>
                  <p>Cantidad de episodios: ${e.detail.number_of_episodes}</p>
                  <p> Ultimo capitulo emitido: ${e.detail.last_episode_to_air ? e.detail.last_episode_to_air.episode_number : '-'} </p>
                  <p>Fecha emision ultimo episodio: ${e.detail.last_air_date ? dayjs(e.detail.last_air_date).format('DD/MM/YYYY') : '-'} </p>
                  <p>Fecha emision proximo episodio: ${e.detail.next_episode_to_air ? dayjs(e.detail.next_episode_to_air.air_date).format('DD/MM/YYYY') : 'Finalizado/Suspendido'} </p>
                  <div class="row justify-content-center">
                    <div class="col-lg-12 col-md-4 col-sm-12">
                      <div class="mb-3">
                        <label for="ultimoCapVisto" class="form-label"
                          >Ultimo capitulo visto:</label
                        >
                        <input
                          type="number"
                          class="form-control"
                          name="ultimoCapVisto"
                          id="ultimoCapVisto${e.id}"
                        />
                      </div>
                      <div class="col-lg-8 col-md-2 col-sm-12 d-flex flex-row justify-content-end">
                        <button type="button" class="btn btn-primary" onclick="AñadirSerie(${e.id})">Añadir</button>
                      </div>
                    </div>
                      
                  </div>
                </div>
              </div>`
                htmltorender = htmltorender + htmlData;
                document.getElementById('contenidoBusqueda').innerHTML = htmltorender;
                resultados.push(e);
            }
         })
        .catch(err => console.error(err));
        console.log(resultados);
};

function AñadirSerie(param) {
  const filtro = seriesAñadidas.filter((e) => param === e.id)
  if (filtro.length === 0) {
    const element = resultados.filter((e) => param === e.id);
    const getValueUltimoEpisodioVisto = document.getElementById(`ultimoCapVisto${param}`).value;
    element[0].ultimoEpisodioVisto = getValueUltimoEpisodioVisto;
    element[0].pendientesDeVer = `${parseInt(element[0].detail.number_of_episodes) - parseInt(element[0].ultimoEpisodioVisto)}`;
    seriesAñadidas.push(element[0]);
    localStorage.setItem('listadoseries', JSON.stringify(seriesAñadidas));
    alert(`la serie ${element[0].name} se añadio con éxito al listado`);
    renderizarListado();
  } else {
    alert('La serie que intentas añadir ya fue añadida previamente');
  }
};

function eliminarSerieDelListado(param) {
  const arraysinserie = seriesAñadidas.filter(e => e.id !== param);
  const paramName = seriesAñadidas.filter(e => e.id === param);
  seriesAñadidas = arraysinserie;
  localStorage.setItem('listadoseries', JSON.stringify(seriesAñadidas));
  renderizarListado();
  alert(`La serie: ${paramName[0].name} se elimino con éxito del listado`);
};