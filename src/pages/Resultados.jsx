import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import actividadesJSON from "../data/actividades.json";

export default function Resultados() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const [grupoExiste, setGrupoExiste] = useState(null);
  const [actividades, setActividades] = useState([]); // Nombres desde Firebase
  const [participantes, setParticipantes] = useState([]);
  const [rankingFinal, setRankingFinal] = useState([]);

  useEffect(() => {
    async function verificarGrupo() {
      try {
        const docRef = doc(db, "grupos", codigo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGrupoExiste(true);
          const data = docSnap.data();
          setActividades(data.actividades || []);
          setParticipantes(data.participantes || []);
        } else {
          setGrupoExiste(false);
        }
      } catch (error) {
        console.error("Error verificando grupo:", error);
        setGrupoExiste(false);
      }
    }

    verificarGrupo();
  }, [codigo]);

  useEffect(() => {
    if (actividades.length > 0 && participantes.length > 0) {
      const top = calcularTop(actividades, participantes, actividadesJSON);
      setRankingFinal(top);
    }
  }, [actividades, participantes]);

  function calcularTop(actividadesFirebase, votos, actividadesJSON) {
    const puntajes = {};

    // Filtrar solo las actividades que están en este grupo (por nombre)
    const actividadesGrupo = actividadesJSON.filter(a =>
      actividadesFirebase.includes(a.nombre)
    );

    // Inicializar puntajes usando el id del JSON
    actividadesGrupo.forEach(a => (puntajes[a.id] = 0));

    // Sumar puntos usando IDs del ranking
    votos.forEach(({ ranking }) => {
      ranking.forEach((actividadId, index) => {
        const puntos = ranking.length - index;
        if (Object.prototype.hasOwnProperty.call(puntajes, actividadId)) {
          puntajes[actividadId] += puntos;
        }
      });
    });

    // Retornar array ordenado con los datos completos
    return actividadesGrupo
      .map(a => ({ ...a, puntos: puntajes[a.id] }))
      .sort((a, b) => b.puntos - a.puntos);
  }

  // Loading
  if (grupoExiste === null) {
    return <p>Cargando grupo...</p>;
  }

  // Grupo no existe
  if (grupoExiste === false) {
    return (
      <div>
        <p>El grupo con código "{codigo}" no existe.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Resultados</h1>
      <p>Estás en el grupo: {codigo}</p>

      <h2>Ranking Final</h2>
      <ol>
        {rankingFinal.map((act, i) => (
          <li key={i}>
            {act.nombre} — {act.puntos} puntos
          </li>
        ))}
      </ol>

      <h2>Ranking por participante</h2>
      {participantes.map((p, idx) => (
        <div key={idx}>
          <h3>{p.nombre}</h3>
          <ol>
            {p.ranking.map((id, i) => {
              const actividad = actividadesJSON.find(a => a.id === id);
              return (
                <li key={i}>
                  {actividad ? actividad.nombre : id}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
