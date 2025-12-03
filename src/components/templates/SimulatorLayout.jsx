// ============================================================================
// PHYMATH-SIM: TEMPLATE DE LAYOUT PARA SIMULADORES
// ============================================================================
// PROPÓSITO: Estructura reutilizable común para todos los simuladores
// ============================================================================

import React from 'react'
import { Link } from 'react-router-dom'
import './SimulatorLayout.css'

function SimulatorLayout({ 
  title, 
  icon, 
  description, 
  objective,
  controls,
  canvas,
  results,
  equations
}) {
  return (
    <div className="simulator-layout container">
      {/* ============================================================================
         SECCIÓN: HEADER CON NAVEGACIÓN Y TÍTULO
         ============================================================================ */}
      <div className="simulator-header">
        {/* ********** NAVEGACIÓN DE RETORNO ********** */}
        <div className="simulator-nav">
          <Link to="/dashboard" className="simulator-back-button">
            <i className="bi bi-arrow-left"></i>
            <span>Volver</span>
          </Link>
          
          {/* ********** TÍTULO Y DESCRIPCIÓN ********** */}
          <div className="simulator-title-container">
            <h1 className="simulator-title">
              <i className={`simulator-title-icon bi ${icon}`}></i>
              {title}
            </h1>
            <p className="simulator-description">{description}</p>
          </div>
        </div>
        
        {/* ********** OBJETIVO DIDÁCTICO (OPCIONAL) ********** 
            Solo se renderiza si se pasa la prop 'objective'
        */}
        {objective && (
          <div className="simulator-objective alert alert-info">
            <i className="simulator-objective-icon bi bi-info-circle"></i>
            <div className="simulator-objective-content">
              <strong>Objetivo:</strong> {objective}
            </div>
          </div>
        )}
      </div>
      
      {/* ============================================================================
         SECCIÓN: LAYOUT PRINCIPAL (2 COLUMNAS)
         Columna izquierda (4/12): Controles + Resultados + Ecuaciones
         Columna derecha (8/12): Canvas de visualización
         ============================================================================ */}
      <div className="row">
        {/* ********** COLUMNA IZQUIERDA: CONTROLES Y RESULTADOS ********** */}
        <div className="simulator-left-column col-lg-4 mb-4">
          {/* Controles (obligatorio) */}
          {controls}
          
          {/* Resultados (obligatorio) */}
          {results}
          
          {/* Ecuaciones (opcional) */}
          {equations && (
            <div className="simulator-equations">
              {equations}
            </div>
          )}
        </div>

        {/* ********** COLUMNA DERECHA: CANVAS DE VISUALIZACIÓN ********** */}
        <div className="simulator-right-column col-lg-8 mb-4">
          {canvas}
        </div>
      </div>
    </div>
  )
}

export default SimulatorLayout
