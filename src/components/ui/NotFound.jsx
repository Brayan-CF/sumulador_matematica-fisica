// ============================================================================
// PHYMATH-SIM: PÁGINA DE ERROR 404
// ============================================================================
// PROPÓSITO: Mostrar un error 404 cuando la ruta no existe
// ============================================================================

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

function NotFound() {
  const { isDarkMode } = useTheme()

  return (
    <div className={`not-found-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-6 text-center">
            <div className="error-animation">
              <div className="error-code">
                <span className="digit">4</span>
                <span className="digit zero">
                  <i className="bi bi-gear-fill spinning"></i>
                </span>
                <span className="digit">4</span>
              </div>
            </div>
            
            <h1 className="display-5 fw-bold mt-4 mb-3">
              ¡Página No Encontrada!
            </h1>
            
            <p className="lead mb-4 text-secondary-custom">
              Parece que te has perdido en el espacio-tiempo. 
              La página que buscas no existe o ha sido movida a otra dimensión.
            </p>
            
            <div className="error-details mb-4">
              <div className="card bg-transparent border-secondary">
                <div className="card-body">
                  <p className="mb-2">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    <strong>Error 404:</strong> Recurso no encontrado
                  </p>
                  <p className="small text-muted mb-0">
                    La URL solicitada no corresponde a ninguna ruta válida en PhyMath Sim.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/" className="btn btn-primary btn-lg">
                <i className="bi bi-house me-2"></i>Volver al Inicio
              </Link>
              <button 
                className="btn btn-outline-secondary btn-lg"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>Página Anterior
              </button>
            </div>

            <div className="mt-5">
              <p className="text-muted">¿Buscabas alguno de estos?</p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link to="/physics/projectile" className="btn btn-sm btn-outline-danger">
                  <i className="bi bi-arrow-up-right me-1"></i>Tiro Parabólico
                </Link>
                <Link to="/math/function-grapher" className="btn btn-sm btn-outline-success">
                  <i className="bi bi-graph-up me-1"></i>Graficador
                </Link>
                <Link to="/physics/collision" className="btn btn-sm btn-outline-danger">
                  <i className="bi bi-circle me-1"></i>Colisiones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
