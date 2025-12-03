/* filepath: src/components/ui/Navbar.jsx */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

function Navbar() {
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${isDarkMode ? 'navbar-dark' : 'navbar-light'} navbar-custom`}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-calculator me-2"></i>
          <span>PhyMath</span> <span>Sim</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`} 
                to="/"
              >
                <i className="bi bi-house me-1"></i>Inicio
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="physicsDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-atom me-1 text-danger"></i>Física
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/physics/projectile">
                    <i className="bi bi-arrow-up-right me-2 text-danger"></i>Tiro Parabólico
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/physics/harmonic-oscillator">
                    <i className="bi bi-arrow-left-right me-2 text-danger"></i>Oscilador Armónico
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/physics/collision">
                    <i className="bi bi-circle me-2 text-danger"></i>Colisiones
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <span className="dropdown-item-text text-muted">
                    <i className="bi bi-check-circle me-1"></i>¡Completamente funcional!
                  </span>
                </li>
              </ul>
            </li>
            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="mathDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-graph-up me-1 text-success"></i>Matemáticas
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/math/function-grapher">
                    <i className="bi bi-graph-up me-2" style={{color: '#9db5a0'}}></i>Graficador de Funciones
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/math/transformations">
                    <i className="bi bi-arrows-move me-2" style={{color: '#9db5a0'}}></i>Transformaciones Geométricas
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/math/vector-fields">
                    <i className="bi bi-arrows-angle-expand me-2" style={{color: '#9db5a0'}}></i>Campos Vectoriales
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <span className="dropdown-item-text text-muted">
                    <i className="bi bi-check-circle me-1"></i>¡Completamente funcional!
                  </span>
                </li>
              </ul>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item d-flex align-items-center me-3">
              <label className="theme-switch">
                <input 
                  type="checkbox" 
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <span className="theme-slider">
                  <i className="bi bi-sun-fill theme-icon sun-icon"></i>
                  <i className="bi bi-moon-fill theme-icon moon-icon"></i>
                </span>
              </label>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                <i className="bi bi-info-circle me-1"></i>Acerca de
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar