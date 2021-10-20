import React,{ useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  //state de la app
  const [ busqueda, guardarBusqueda ] = useState('');
  const [ imagenes, guardarImagenes ] = useState([]);
  const [ paginarActual, guardarPaginaActual ] = useState(1);
  const [ totalPaginas, guardarTotalPaginas ] = useState(1);


  useEffect(() => {
    
    const consultarAPI = async () => {
      if(busqueda.trim() === ''){
        return;
      }
      const imagenesPorPagina = 30;
      const key = '19879247-0a0e1635e44bbe001fa7ee1b9';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginarActual}`;
      
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      guardarImagenes(resultado.hits);

      //calcular el total de  paginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(calcularTotalPaginas);

      //mover pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({ behavior: 'smooth' });
    }
    consultarAPI();    

  }, [busqueda, paginarActual])

  //definir pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginarActual - 1;

    if(nuevaPaginaActual === 0){
      return;
    }
    guardarPaginaActual(nuevaPaginaActual);
  }

  //degfinir pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginarActual + 1;

    if(nuevaPaginaActual > totalPaginas){
      return;
    }

    guardarPaginaActual(nuevaPaginaActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imágenes</p>
        <Formulario
          guardarBusqueda={guardarBusqueda}
        />
      </div>
      <div className="row justify-content-center">
          <ListadoImagenes
            imagenes={imagenes}
          />
            
          { (paginarActual === 1) ? null : 
            (<button
              type="button"
              className="btn btn-info mr-1"
              onClick={paginaAnterior}
            >
              &laquo;Anterior 
            </button> )
          }

          { (paginarActual === totalPaginas) ? null :
            ( <button
              type="button"
              className="btn btn-info mr-1"
              onClick={paginaSiguiente}
            >
              Siguiente &raquo;
            </button>)
          }
          
      </div>
        
    </div>
  );
}

export default App;
