import React, { useState, useEffect } from "react";

const dataInicial = [
  { 
    id: 1, 
    nombre: "Reto Sikowits", 
    descripcion: "Elige un personaje. Conviértete en ese personaje. Vívelo. Respíralo. Y bajo ningún concepto —repito, NINGUNO— rompas el personaje. Incluso si un oso panda te pide la hora. Especialmente si un oso panda te pide la hora." 
  },
  { 
    id: 2, 
    nombre: "Barnie's Chicken", 
    descripcion: "Todo el grupo conspira para convencer a una persona de que algo del pasado fue completamente distinto. El evento, el lugar, el pollo… TODO. Mientras más absurdo y específico, mejor. Si empieza a dudar de su propia memoria, vas ganando. Challenge accepted." 
  },
  { 
    id: 3, 
    nombre: "Suit up Spidy", 
    descripcion: "Durante un día entero, cada miembro del grupo debe convertirse en su propia y original versión de Spider-Man. Traje, nombre, poderes ridículos… todo. Si alguien pregunta, actúa como si fuera la cosa más normal del mundo. Porque en tu universo, lo es." 
  },
  { 
    id: 4, 
    nombre: "Charla TEDMosby", 
    descripcion: "El grupo debe dar una charla TED improvisada sobre un tema tan aburrido que podría poner a dormir a un cactus… pero con la pasión de un discurso que cambiará la historia. Bonus: cuanta más gente random se sume a escuchar, más legendario." 
  },
  { 
    id: 5, 
    nombre: "Sospechoso no encubierto", 
    descripcion: "Uno se viste de forma tan llamativa que es imposible no notarlo. Otro del grupo describe en voz alta —en un lugar público— su aspecto y un hábito extrañísimo… justo antes de que aparezca caminando como si nada." 
  },
  { 
    id: 6, 
    nombre: "Tu cara me suena", 
    descripcion: "Convéncelos de que te conocen de algún lugar. No importa si es mentira. Hazlo tan convincente que empiecen a inventar recuerdos contigo… y actúa como si todos fueran amigos de la infancia." 
  },
  { 
    id: 7, 
    nombre: "Las traes", 
    descripcion: "Consigue que alguien te traiga algo sin pedirlo directamente. Solo carisma, indirectas y manipulación sutil digna de un maestro Jedi con traje. Barney estaría orgulloso." 
  },
  { 
    id: 8, 
    nombre: "Tienes una Bingo-Personalidad", 
    descripcion: "Completa tu cartón de personalidad: coqueteo casual, anécdota épica, referencia pop, comentario sarcástico y algo completamente fuera de contexto. Si logras las cinco en una misma conversación, ¡Bingo!" 
  },
  { 
    id: 9, 
    nombre: "Gran historia, pequeña mentira", 
    descripcion: "Cuenta una historia 90% real y 10% embellecida. El truco: que nadie pueda adivinar qué parte es inventada. Si empiezan a dudar de todo, has ganado." 
  },
  { 
    id: 10, 
    nombre: "Véndeme este lápiz", 
    descripcion: "Sé el Jordan Belfort del papel higiénico. Tu misión: venderle a un desconocido un objeto completamente inútil… como si fuera lo más valioso del mundo. Puede ser un lápiz, una piedra o una servilleta usada. Bonus si usas frases motivacionales ridículas y te crees tu propia mentira. True story." 
  },
];


export default function Ranking() {
  const [izquierda, setIzquierda] = useState([]);
  const [derecha, setDerecha] = useState(dataInicial);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const seleccionado =
    origen === "izquierda"
      ? izquierda.find((item) => item.id === seleccionadoId)
      : derecha.find((item) => item.id === seleccionadoId);

  const moverAIzquierda = () => {
    if (seleccionado && origen === "derecha") {
      setDerecha(derecha.filter((i) => i.id !== seleccionado.id));
      setIzquierda([...izquierda, seleccionado]);
      setSeleccionadoId(null);
      setOrigen(null);
    }
  };

  const moverADerecha = () => {
    if (seleccionado && origen === "izquierda") {
      setIzquierda(izquierda.filter((i) => i.id !== seleccionado.id));
      setDerecha([...derecha, seleccionado]);
      setSeleccionadoId(null);
      setOrigen(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        //backgroundColor: "rgba(0, 0, 60, 0.7)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: "650px",
          width: "700px",
          border: "1px solid #ccc",
        }}
      >
        {/* Lista izquierda */}
        <ul
          style={{
            order: isMobile ? 2 : 1,
            width: isMobile ? "100%" : "200px",
            height: isMobile ? "auto" : "300px",
            overflowY: "auto",
            borderRight: isMobile ? "none" : "1px solid #ccc",
            borderBottom: isMobile ? "1px solid #ccc" : "none",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {izquierda.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setSeleccionadoId(item.id);
                setOrigen("izquierda");
              }}
              style={{
                padding: 10,
                cursor: "pointer",
                backgroundColor:
                  seleccionadoId === item.id && origen === "izquierda"
                    ? "#d0e7ff"
                    : "transparent",
              }}
            >
              {item.nombre}
            </li>
          ))}
        </ul>

        {/* Panel de descripción */}
        <div
          style={{
            order: isMobile ? 1 : 2,
            width: isMobile ? "100%" : "250px",
            padding: 20,
            borderRight: isMobile ? "none" : "1px solid #ccc",
            borderBottom: isMobile ? "1px solid #ccc" : "none",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {seleccionado ? (
            <>
              <h3>{seleccionado.nombre}</h3>
              <p>{seleccionado.descripcion}</p>
              {origen === "derecha" && (
                <button onClick={moverAIzquierda}>⬅ Agregar a izquierda</button>
              )}
              {origen === "izquierda" && (
                <button onClick={moverADerecha}>➡ Mover a derecha</button>
              )}
            </>
          ) : (
            <p>Seleccioná un ítem para ver su descripción</p>
          )}
        </div>

        {/* Lista derecha */}
        <ul
          style={{
            order: 3,
            width: isMobile ? "100%" : "200px",
            height: isMobile ? "auto" : "300px",
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {derecha.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                setSeleccionadoId(item.id);
                setOrigen("derecha");
              }}
              style={{
                padding: 10,
                cursor: "pointer",
                backgroundColor:
                  seleccionadoId === item.id && origen === "derecha"
                    ? "#d0e7ff"
                    : "transparent",
              }}
            >
              {item.nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
