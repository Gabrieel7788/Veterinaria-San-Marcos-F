import { useState } from 'react';
import { GrupoInput } from '../componentes/moleculas/GrupoInput';
import { Boton } from '../componentes/atomos/Boton';
import { validarCorreo, validarRut } from '../utilidades/validaciones';
import { regionesComunas, opcionesRegiones } from '../datos/geografia';

export const Registro = () => {
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeErrorServidor, setMensajeErrorServidor] = useState('');

  const [opcionesComunas, setOpcionesComunas] = useState<
    { valor: string; texto: string }[]
  >([]);

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'region') {
      const comunas = regionesComunas[value] || [];

      setOpcionesComunas(
        comunas.map(c => ({ valor: c, texto: c }))
      );

      setFormData(prev => ({
        ...prev,
        region: value,
        comuna: ''
      }));
    }
  };

  const validar = () => {
    const e: Record<string, string> = {};

    if (!formData.rut) {
      e.rut = 'El RUT es obligatorio.';
    } else if (!validarRut(formData.rut)) {
      e.rut = 'RUT inválido. Ingrese sin puntos ni guión.';
    }

    if (!formData.nombre.trim()) {
      e.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.length > 50) {
      e.nombre = 'Máximo 50 caracteres.';
    }

    if (!formData.apellidos.trim()) {
      e.apellidos = 'Los apellidos son obligatorios.';
    } else if (formData.apellidos.length > 100) {
      e.apellidos = 'Máximo 100 caracteres.';
    }

    if (!formData.correo) {
      e.correo = 'El correo es obligatorio.';
    } else if (!validarCorreo(formData.correo)) {
      e.correo = 'Formato de correo inválido.';
    }

    if (formData.password.length < 8) {
      e.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (formData.password !== formData.confirmarPassword) {
      e.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    if (!formData.region) {
      e.region = 'Debes seleccionar una región.';
    }

    if (!formData.comuna) {
      e.comuna = 'Debes seleccionar una comuna.';
    }

    if (!formData.direccion.trim()) {
      e.direccion = 'La dirección es obligatoria.';
    } else if (formData.direccion.length > 300) {
      e.direccion = 'Máximo 300 caracteres.';
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  };


const manejarEnvio = async (e: React.FormEvent) => {
  e.preventDefault();

  if (cargando) return;

  setMensajeExito('');
  setMensajeErrorServidor('');

  if (!validar()) return;

  setCargando(true);

  try {
    const respuesta = await fetch(
      'http://localhost:8080/api/usuarios/registro',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          fechaNacimiento: formData.fechaNacimiento || null
        })
      }
    );

    if (!respuesta.ok) {
      if (respuesta.status === 409) {
        throw new Error(
          'El RUT o correo ya están registrados.'
        );
      }

      if (respuesta.status === 400) {
        throw new Error(
          'Los datos enviados no son válidos. Revisa el formulario.'
        );
      }

      throw new Error(
        'No se pudo completar el registro.'
      );
    }

    const usuarioRegistrado = await respuesta.json();

    setMensajeExito(
      `¡Cuenta creada correctamente! Usuario: ${usuarioRegistrado.correo}`
    );

    setFormData({
      rut: '',
      nombre: '',
      apellidos: '',
      correo: '',
      password: '',
      confirmarPassword: '',
      fechaNacimiento: '',
      region: '',
      comuna: '',
      direccion: ''
    });

    setOpcionesComunas([]);
    setErrores({});

  } catch (error) {
    if (error instanceof TypeError) {
      setMensajeErrorServidor(
        'No se pudo conectar con el backend. Comprueba que Spring Boot esté funcionando.'
      );
    } else {
      setMensajeErrorServidor(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado.'
      );
    }
  } finally {
    setCargando(false);
  }
};


  return (
    <div
      className="card shadow-sm border-0 bg-light p-4 mx-auto"
      style={{ maxWidth: '800px' }}
    >
      <h3 className="mb-4 text-primary text-center">
        Registro de Usuario
      </h3>

      <p className="text-muted text-center">
        Crea tu cuenta como dueño de mascota.
      </p>

      {mensajeExito && (
        <div className="alert alert-success" role="status">
          {mensajeExito}
        </div>
      )}

      {mensajeErrorServidor && (
        <div className="alert alert-danger" role="alert">
          {mensajeErrorServidor}
        </div>
      )}


      <form onSubmit={manejarEnvio} noValidate className="row">

        <div className="col-md-6">
          <GrupoInput label="RUT (Sin puntos ni guión)" name="rut"
            value={formData.rut} onChange={manejarCambio}
            mensajeError={errores.rut} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Nombres" name="nombre"
            value={formData.nombre} onChange={manejarCambio}
            mensajeError={errores.nombre} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Apellidos" name="apellidos"
            value={formData.apellidos} onChange={manejarCambio}
            mensajeError={errores.apellidos} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Correo electrónico" name="correo"
            type="email" value={formData.correo}
            onChange={manejarCambio} mensajeError={errores.correo} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Contraseña" name="password"
            type="password" value={formData.password}
            onChange={manejarCambio} mensajeError={errores.password} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Confirmar contraseña"
            name="confirmarPassword" type="password"
            value={formData.confirmarPassword}
            onChange={manejarCambio}
            mensajeError={errores.confirmarPassword} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Fecha de Nacimiento (Opcional)"
            name="fechaNacimiento" type="date"
            value={formData.fechaNacimiento} onChange={manejarCambio} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Región" name="region"
            value={formData.region} onChange={manejarCambio}
            esSelect opciones={opcionesRegiones}
            mensajeError={errores.region} />
        </div>

        <div className="col-md-6">
          <GrupoInput label="Comuna" name="comuna"
            value={formData.comuna} onChange={manejarCambio}
            esSelect opciones={opcionesComunas}
            mensajeError={errores.comuna}
            disabled={!formData.region} />
        </div>

        <div className="col-12">
          <GrupoInput label="Dirección" name="direccion"
            value={formData.direccion} onChange={manejarCambio}
            mensajeError={errores.direccion} />
        </div>

        <div className="col-12 text-end mt-3">
          <Boton type="submit" texto={cargando ? 'Registrando...' : 'Registrarme'}/>
        </div>

      </form>
    </div>
  );
};
