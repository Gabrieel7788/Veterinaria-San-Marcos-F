import { Link } from 'react-router-dom';

export const Navbar = () => {
  // Leemos si hay un usuario conectado en el navegador
  const usuario = JSON.parse(localStorage.getItem('usuarioVet') || 'null');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">🐾 Vet San Marcos</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navegación Pública (Izquierda) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/novedades">Novedades</Link>
            </li>
            {/* Dropdown Institucional */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Sobre Nosotros
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/nosotros">Quiénes Somos</Link></li>
                <li><Link className="dropdown-item" to="/contacto">Contacto</Link></li>
              </ul>
            </li>
          </ul>

          {/* Acciones de Usuario (Derecha) */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/reservas">🛒 Mis Reservas</Link>
            </li>
            
            {/* Separador visual solo en pantallas grandes */}
            <div className="vr d-none d-lg-block text-white opacity-50"></div>
            
            {/* Menú Dinámico de Cuenta */}
            {!usuario ? (
              // Vista para INVITADOS (no logueados)
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  👤 Ingresar
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li><Link className="dropdown-item" to="/login">Iniciar Sesión</Link></li>
                  <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                </ul>
              </li>
            ) : (
              // Vista para usuarios registrados (Clientes o Administradores)
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle fw-bold" href="#" role="button" data-bs-toggle="dropdown">
                  🟢 Mi Cuenta
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li className="px-3 py-2 text-muted small border-bottom mb-2">
                    Rol: {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
                  </li>
                  
                  {/* Solo mostrar Administración si el rol es 'admin' */}
                  {usuario.rol === 'admin' && (
                    <li><Link className="dropdown-item text-primary fw-bold" to="/admin">⚙️ Administración</Link></li>
                  )}
                  
                  <li>
                    <button 
                      className="dropdown-item text-danger mt-2" 
                      onClick={() => {
                        localStorage.removeItem('usuarioVet'); // Borramos la sesión
                        window.location.href = '/'; // Recargamos la página principal
                      }}
                    >
                      Cerrar Sesión
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