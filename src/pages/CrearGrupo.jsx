import React, { useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import actividadesData from '../data/actividades.json';

import DualList from '../components/DualList/DualList';


function CrearGrupo() {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [codigoCreado, setCodigoCreado] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState([]);

  const handleListaChange = useCallback((nuevaLista) => {
    setListaSeleccionada(nuevaLista);
  }, []);

  const generarCodigo = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  };

  const generarCodigoUnico = async () => {
    let codigo;
    let existe = true;

    while (existe) {
      codigo = generarCodigo();
      const docRef = doc(db, 'grupos', codigo);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        existe = false;
      }
    }

    return codigo;
  };

  const handleCrearGrupo = async () => {
    if (nombreGrupo.trim().length < 3) {
      setMensaje('El nombre del grupo debe tener al menos 3 caracteres.');
      return;
    }

    if (listaSeleccionada.length < 10) {
      setMensaje('Debes seleccionar al menos 10 actividades.');
      return;
    }

    setMensaje('');
    setCodigoCreado('');
    setCopiado(false);
    setLoading(true);

    try {
      const codigo = await generarCodigoUnico();

      await setDoc(doc(db, 'grupos', codigo), {
        nombre: nombreGrupo.trim(),
        creadoEn: new Date().toISOString(),
        participantes: [],
        actividades: listaSeleccionada,
      });

      setTimeout(() => {
        setCodigoCreado(codigo);
        setMensaje(`✅ Grupo creado con éxito. Código: ${codigo}`);
        setLoading(false);
      }, 10);
    } catch (error) {
      console.error('Error al crear el grupo:', error);
      setMensaje('❌ Ocurrió un error al crear el grupo.');
      setLoading(false);
    }
  };

  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(codigoCreado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Crear un nuevo grupo</h2>

      <input
        type="text"
        placeholder="Nombre del grupo"
        value={nombreGrupo}
        onChange={(e) => setNombreGrupo(e.target.value)}
        disabled={loading}
        style={{ marginRight: 10 }}
      />

      <DualList initialData={actividadesData} onListaChange={handleListaChange} />

      <button onClick={handleCrearGrupo} disabled={loading}>
        {loading ? 'Creando...' : 'Crear'}
      </button>

      {loading && (
        <p style={{ marginTop: 10 }}>
          Generando código
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </p>
      )}

      {!loading && mensaje && (
        <div style={{ marginTop: 20 }}>
          <p>{mensaje}</p>
          {codigoCreado && (
            <button onClick={copiarAlPortapapeles}>
              {copiado ? '✅ Copiado' : '📋 Copiar código'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CrearGrupo;
