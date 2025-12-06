// ============================================================================
// PHYMATH-SIM: DASHBOARD PRINCIPAL
// ============================================================================
// PROPÓSITO: Página principal con lista de simuladores disponibles
// ============================================================================

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

function Dashboard() {
  const { isDarkMode } = useTheme()
  
  return (
    <div className="dashboard">
      <section className="hero-section">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4 bounce-in">
                <i className="bi bi-calculator me-3"></i>PhyMath Sim
              </h1>
              <p className="lead mb-4 fade-in">
                Plataforma Interactiva para la Visualización de Sistemas Dinámicos Complejos
              </p>
              <p className="fs-5 mb-5 slide-in">
                Convierte ecuaciones complejas en visualizaciones gráficas y animadas en tiempo real. 
                Aprende física y matemáticas de manera interactiva con simulaciones de alta fidelidad.
              </p>
              
              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="stats-card rounded p-4">
                    <h3 className="fw-bold">
                      <i className="bi bi-cpu me-2"></i>6+
                    </h3>
                    <p className="mb-0">Simuladores Avanzados</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stats-card rounded p-4">
                    <h3 className="fw-bold">
                      <i className="bi bi-book me-2"></i>2
                    </h3>
                    <p className="mb-0">Áreas de Conocimiento</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <a 
                    href="https://github.com/Brayan-CF/sumulador_matematica-fisica" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <div className="stats-card rounded p-4 github-link-card">
                      <h3 className="fw-bold">
                        <i className="bi bi-github me-2"></i>100%
                      </h3>
                      <p className="mb-0">Código Abierto</p>
                      <small className="d-block mt-1 opacity-75">
                        <i className="bi bi-box-arrow-up-right me-1"></i>Ver en GitHub
                      </small>
                    </div>
                  </a>
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-center">
                <a href="#simulators" className="btn btn-light btn-lg px-4">
                  <i className="bi bi-play-circle me-2"></i>Explorar Simuladores
                </a>
                <a href="#about" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-info-circle me-2"></i>Más Información
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="simulators" className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="category-header physics-header mb-4">
                <i className="bi bi-atom me-2"></i>Simuladores de Física Avanzados
              </h2>
              <p className="text-secondary-custom mb-4">
                Explora los principios fundamentales de la física a través de simulaciones interactivas de alta precisión.
              </p>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6">
              <div className="card module-card card-custom">
                <div className="card-body text-center p-4">
                  <i className="bi bi-arrow-up-right-circle feature-icon physics-icon"></i>
                  <h5 className="card-title fw-bold">Tiro Parabólico</h5>
                  <p className="card-text text-secondary-custom">
                    Simula el movimiento de proyectiles con diferentes velocidades, ángulos y condiciones ambientales avanzadas.
                  </p>
                  <ul className="list-unstyled small text-secondary-custom mb-3">
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Múltiples proyectiles simultáneos</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Resistencia del aire variable</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Simulación multi-planetaria</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Análisis energético completo</li>
                  </ul>
                  <Link to="/physics/projectile" className="btn btn-danger">
                    <i className="bi bi-play-fill me-1"></i>Simular Ahora
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card module-card card-custom">
                <div className="card-body text-center p-4">
                  <i className="bi bi-arrow-left-right feature-icon physics-icon"></i>
                  <h5 className="card-title fw-bold">Oscilador Armónico</h5>
                  <p className="card-text text-secondary-custom">
                    Visualiza péndulos, sistemas masa-resorte y oscilaciones complejas con análisis de fase completo.
                  </p>
                  <ul className="list-unstyled small text-secondary-custom mb-3">
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Péndulo simple y doble</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Sistema masa-resorte</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Diagramas de fase dinámicos</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Análisis energético temporal</li>
                  </ul>
                  <Link to="/physics/harmonic-oscillator" className="btn btn-danger">
                    <i className="bi bi-play-fill me-1"></i>Simular Ahora
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card module-card card-custom">
                <div className="card-body text-center p-4">
                  <i className="bi bi-circle feature-icon physics-icon"></i>
                  <h5 className="card-title fw-bold">Sistema de Colisiones</h5>
                  <p className="card-text text-secondary-custom">
                    Analiza choques complejos entre múltiples objetos con conservación de momento y energía en tiempo real.
                  </p>
                  <ul className="list-unstyled small text-secondary-custom mb-3">
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Colisiones elásticas e inelásticas</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Múltiples objetos simultáneos</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Conservación de momento</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Análisis energético dinámico</li>
                  </ul>
                  <Link to="/physics/collision" className="btn btn-danger">
                    <i className="bi bi-play-fill me-1"></i>Colisionar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-12">
              <h2 className="category-header math-header mb-4">
                <i className="bi bi-graph-up me-2"></i>Herramientas Matemáticas Avanzadas
              </h2>
              <p className="text-secondary-custom mb-4">
                Visualiza conceptos matemáticos complejos con herramientas interactivas de análisis en tiempo real.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card module-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-graph-up feature-icon math-icon"></i>
                  <h5 className="card-title fw-bold">Graficador de Funciones</h5>
                  <p className="card-text text-muted">
                    Visualiza funciones matemáticas complejas con zoom avanzado, derivadas y análisis multifuncional.
                  </p>
                  <ul className="list-unstyled small text-muted mb-3">
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Funciones complejas y paramétricas</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Derivadas e integrales visuales</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Zoom y navegación avanzada</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Múltiples funciones simultáneas</li>
                  </ul>
                  <Link to="/math/function-grapher" className="btn btn-success">
                    <i className="bi bi-play-fill me-1"></i>Graficar Ahora
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card module-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-arrows-move feature-icon math-icon"></i>
                  <h5 className="card-title fw-bold">Transformaciones Geométricas</h5>
                  <p className="card-text text-muted">
                    Explora rotaciones, traslaciones, escalas y reflexiones con matrices de transformación avanzadas.
                  </p>
                  <ul className="list-unstyled small text-muted mb-3">
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Transformaciones 2D y 3D</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Matrices interactivas</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Composición de transformaciones</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Visualización en tiempo real</li>
                  </ul>
                  <Link to="/math/transformations" className="btn btn-success">
                    <i className="bi bi-play-fill me-1"></i>Transformar Ahora
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card module-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-arrows-angle-expand feature-icon math-icon"></i>
                  <h5 className="card-title fw-bold">Campos Vectoriales</h5>
                  <p className="card-text text-muted">
                    Analiza campos vectoriales complejos con operaciones avanzadas de divergencia, rotacional y gradiente.
                  </p>
                  <ul className="list-unstyled small text-muted mb-3">
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Campos 2D y 3D interactivos</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Operadores diferenciales</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Líneas de flujo dinámicas</li>
                    <li><i className="bi bi-check-circle-fill text-success me-1"></i>Análisis vectorial completo</li>
                  </ul>
                  <Link to="/math/vector-fields" className="btn btn-success">
                    <i className="bi bi-play-fill me-1"></i>Explorar Campos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard