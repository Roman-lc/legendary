import React, { useState, useEffect } from "react";

export default function DualList({ initialData = [], onListaChange }) {
  const [izquierda, setIzquierda] = useState([]);
  const [derecha, setDerecha] = useState(initialData);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentCount = izquierda.length;
    if (
      onListaChange &&
      (currentCount === 10 || (prevCount === 10 && currentCount < 10))
    ) {
      onListaChange(izquierda.map((item) => item.nombre));
    }
    setPrevCount(currentCount);
  }, [izquierda, onListaChange, prevCount]);

  const seleccionado =
    origen === "izquierda"
      ? izquierda.find((item) => item.id === seleccionadoId)
      : derecha.find((item) => item.id === seleccionadoId);

  const moverAIzquierda = () => {
    if (seleccionado && origen === "derecha" && izquierda.length < 10) {
      setDerecha((prev) => prev.filter((i) => i.id !== seleccionado.id));
      setIzquierda((prev) => [...prev, seleccionado]);
      limpiarSeleccion();
    }
  };

  const moverADerecha = () => {
    if (seleccionado && origen === "izquierda") {
      setIzquierda((prev) => prev.filter((i) => i.id !== seleccionado.id));
      setDerecha((prev) => [...prev, seleccionado]);
      limpiarSeleccion();
    }
  };

  const limpiarSeleccion = () => {
    setSeleccionadoId(null);
    setOrigen(null);
  };

  const renderList = (items, origenLista, extraStyle = {}) => (
    <ul
      style={{
        width: isMobile ? "100%" : "200px",
        height: isMobile ? "auto" : "300px",
        overflowY: "auto",
        margin: 0,
        padding: 0,
        listStyle: "none",
        ...extraStyle,
      }}
    >
      {items.map((item) => {
        const isDisabled = izquierda.length >= 10 && origenLista === "derecha";
        return (
          <li
            key={item.id}
            onClick={() => {
              if (!(isDisabled && origenLista === "derecha")) {
                setSeleccionadoId(item.id);
                setOrigen(origenLista);
              }
            }}
            style={{
              padding: 10,
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.5 : 1,
              backgroundColor:
                seleccionadoId === item.id && origen === origenLista
                  ? "#d0e7ff"
                  : "transparent",
            }}
          >
            {item.nombre}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
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
        {renderList(izquierda, "izquierda", {
          borderRight: !isMobile ? "1px solid #ccc" : "none",
        })}

        {/* Panel central */}
        <div
          style={{
            width: isMobile ? "100%" : "250px",
            padding: 20,
            borderRight: !isMobile ? "1px solid #ccc" : "none",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {izquierda.length >= 10 && origen !== "izquierda" ? (
            <p style={{ fontWeight: "bold", color: "green" }}>
              ✅ Ya tienes tus 10 seleccionados
            </p>
          ) : seleccionado ? (
            <>
              <h3>{seleccionado.nombre}</h3>
              <p>{seleccionado.descripcion}</p>
              {origen === "derecha" && (
                <button
                  onClick={moverAIzquierda}
                  disabled={izquierda.length >= 10}
                >
                  ⬅ Agregar a izquierda
                </button>
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
        {renderList(derecha, "derecha")}
      </div>
    </div>
  );
}
