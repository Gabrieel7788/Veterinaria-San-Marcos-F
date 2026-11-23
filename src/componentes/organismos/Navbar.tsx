import { Link } from 'react-router-dom';

export const Navbar = () => {
  let usuario: { rol: string } | null = null;

  try {
    const token = sessionStorage.getItem('tokenVet');
    const datos = sessionStorage.getItem('usuarioVet');

    if (token && datos) {
      usuario = JSON.parse(datos);
    }
  } catch {
    usuario = null;
  }

  const rol = usuario?.rol;

  const esCliente = rol === 'DUENO_MASCOTA';

  const esPersonal =
    rol === 'ADMINISTRADOR' ||
    rol === 'RECEPCIONISTA';

  const cerrarSesion = () => {
    sessionStorage.removeItem('usuarioVet');
    sessionStorage.removeItem('tokenVet');
    localStorage.removeItem('usuarioVet');

    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div className="container">

        <Link
          className="navbar-brand fw-bold fs-4"
          to="/"
        >
          🐾 Vet San Marcos
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          {/* Navegación general */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">

            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">
                Catálogo
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/novedades">
                Novedades
              </Link>
            </li>

            <li className="nav-item dropdown">

              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Sobre Nosotros
              </a>

              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/nosotros"
                  >
                    Quiénes Somos
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/contacto"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>

            </li>
          </ul>

          {/* Cuenta de usuario */}
          <ul className="navbar-nav ms-auto gap-2">

            {!usuario ? (

              <li className="nav-item dropdown">

                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  👤 Ingresar
                </a>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/login"
                    >
                      Iniciar sesión
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item"
                      to="/registro"
                    >
                      Registrarse
                    </Link>
                  </li>
                </ul>

              </li>

            ) : (

              <li className="nav-item dropdown">

                <a
                  className="nav-link dropdown-toggle fw-bold"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  👤 Mi Cuenta
                </a>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">

                  <li className="px-3 py-2 text-muted small border-bottom">

                    Rol: {
                      rol === 'ADMINISTRADOR'
                        ? 'Administrador'
                        : rol === 'RECEPCIONISTA'
                          ? 'Recepcionista'
                          : rol === 'DUENO_MASCOTA'
                            ? 'Dueño de mascota'
                            : 'Sin rol'
                    }

                  </li>

                  {/* Exclusivo del dueño */}
                  {esCliente && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/mascotas"
                        >
                          🐾 Mis Mascotas
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/citas"
                        >
                          📅 Mis Citas
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Exclusivo del administrador */}
                  {rol === 'ADMINISTRADOR' && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin"
                      >
                        ⚙️ Administración
                      </Link>
                    </li>
                  )}

                  {/* Recepcionista y administrador */}
                  {esPersonal && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/recepcion"
                        >
                          📅 Gestionar Citas
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/fichas-clinicas"
                        >
                          🩺 Fichas Clínicas
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={cerrarSesion}
                    >
                      Cerrar sesión
                    </button>
                  </li>

                </ul>
              </li>

            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};
