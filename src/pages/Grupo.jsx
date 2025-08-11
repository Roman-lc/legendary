import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import TopCard from "../components/armadoDetTop/TopCard";

import actividadesJSON from "../data/actividades.json";

export default function Grupo() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const [grupoExiste, setGrupoExiste] = useState(null);
  const [nombre, setNombre] = useState("");
  const [nombreConfirmado, setNombreConfirmado] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [rankingFinal, setRankingFinal] = useState(null);
  const [rankingEnviado, setRankingEnviado] = useState(false);

  useEffect(() => {
    async function verificarGrupo() {
      try {
        const docRef = doc(db, "grupos", codigo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGrupoExiste(true);
          const data = docSnap.data();
          setActividades(data.actividades || []);
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

  const handleEnviarRanking = async () => {
    try {
      const docRef = doc(db, 'grupos', codigo);
      await updateDoc(docRef, {
        participantes: arrayUnion({
          nombre: nombre,
          ranking: rankingFinal // Array de IDs o nombres, según lo que mande TopCard
        })
      });
      setRankingEnviado(true);
      alert("Ranking enviado con éxito ✅");
    } catch (error) {
      console.error("Error al enviar ranking:", error);
      alert("Hubo un error al enviar el ranking ❌");
    }
  };

  // Cargando grupo
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

  // Confirmar nombre
  if (!nombreConfirmado) {
    return (
      <div>
        <h2>Grupo: {codigo}</h2>
        <label>
          Tu nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            if (nombre.trim() !== "") {
              setNombreConfirmado(true);
            } else {
              alert("Por favor, ingresá tu nombre.");
            }
          }}
        >
          Entrar al grupo
        </button>
      </div>
    );
  }

  // Armar actividades completas desde JSON
  const actividadesCompletas = actividades
    .map((nombre) => {
      const act = actividadesJSON.find(
        (a) => a.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
      );
      if (!act) {
        console.warn("Actividad no encontrada en JSON:", nombre);
      }
      return act;
    })
    .filter(Boolean); // eliminar nulos si no encontró alguna

  return (
    <div>
      <h1>¡Bienvenido, {nombre}!</h1>
      <p>Estás en el grupo: {codigo}</p>

      <TopCard actividad={actividadesCompletas} onFinalizarRanking={(rankingIds) => {
        setRankingFinal(rankingIds);
      }} />

      {rankingFinal && !rankingEnviado && (
        <button onClick={handleEnviarRanking}>Enviar</button>
      )}

      {rankingEnviado && <p>✅ Tu ranking fue enviado correctamente.</p>}
    </div>
  );
}
