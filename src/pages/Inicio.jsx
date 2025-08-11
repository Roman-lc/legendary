import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Inicio() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerificarYIr = async (ruta) => {
    setError("");
    if (!codigo.trim()) {
      setError("Por favor ingresá un código.");
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "grupos", codigo.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLoading(false);
        navigate(`/${ruta}/${codigo.trim()}`);
      } else {
        setLoading(false);
        setError("❌ El grupo no existe.");
      }
    } catch (e) {
      console.error("Error al verificar grupo:", e);
      setLoading(false);
      setError("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <>
    <div className="container">

      <div className="container-inicio">

        <h1 className="efecto-sombra">
          <span className="intro">Esto será legen...</span>
          <br /> 
          <span className="esperenlo">Esperenlo</span>
          <span className="wait punto1">.</span>
          <span className="wait punto2">.</span>
          <span className="wait punto3">.</span>
          <span className="word-container">
          <span className="star">⭐</span>
          <span className="word">dario</span>
          </span>
        </h1>





        <div>

          <input
            type="text"
            placeholder="Código del grupo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <button onClick={() => handleVerificarYIr("grupo")} disabled={loading}>
            {loading ? "Verificando..." : "Unirse al grupo"}
          </button>

          <button onClick={() => handleVerificarYIr("resultados")} disabled={loading}>
            {loading ? "Verificando..." : "Ver Resultados"}
          </button>

          {loading && (
            <p style={{ marginTop: 10 }}>
              Buscando grupo
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </p>
          )}

          {!loading && error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

          <Link to="/crearGrupo">
            <button>Crear un nuevo grupo</button>
          </Link>
        </div>

        <p style={{ paddingLeft: "3%", paddingRight: "3%" }}>"Hagas lo que hagas en esta vida, no es legendario a menos que tus amigos estén ahí para verlo" <br/> -Barney Stinson</p>

      </div>

      <div className="banner-container">
        <img className="img-banner" style={{ width: "100%" }} src="src/assets/banner.png" alt="Banner" />
      </div>

    </div>

    <div className="footer">
      <p>© 2025 </p>
      <p>Hecho por Roman de Argentina para el mundo</p>
    </div>
    </>
  );
}
