import { useState } from "react";

export default function TopCard({ actividad, onFinalizarRanking }) {
  const [indexActual, setIndexActual] = useState(0);
  const [ranking, setRanking] = useState(Array(10).fill(null));

  const actividadActual = actividad[indexActual];

  const handleElegirPosicion = (posicion) => {
    if (ranking[posicion] !== null) {
      alert("Ya elegiste esa posición.");
      return;
    }

    const nuevoRanking = [...ranking];
    nuevoRanking[posicion] = actividadActual;

    setRanking(nuevoRanking);

    if (indexActual + 1 < actividad.length) {
      setIndexActual(indexActual + 1);
    } else {
      setIndexActual(indexActual + 1);
      console.log("Ranking final:", nuevoRanking);
      alert("¡Orden completado!");
      if (onFinalizarRanking) {
        const rankingIds = nuevoRanking.map(item => item?.id || null);
        console.log("Ranking IDs:", rankingIds);
        onFinalizarRanking(rankingIds);
      }
    }
  };

  return (
    <div className="container">
      <div className="Top">
        <ul>
          {ranking.map((item, i) => (
            <li key={i}>
              <button onClick={() => handleElegirPosicion(i)}>
                {item ? item.nombre : `Top ${i + 1}`}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="right">
        <div className="galeria">Fotos</div>

        {actividadActual ? (
          <div className="actividad">
            <h2>{actividadActual.nombre}</h2>
            <p>{actividadActual.descripcion}</p>
          </div>
        ) : (
          <div className="actividad">
            <h2>Ranking final:</h2>
            <ol>
              {ranking.map((item, i) => (
                <li key={i}>{item?.nombre || `Vacío (${i + 1})`}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
