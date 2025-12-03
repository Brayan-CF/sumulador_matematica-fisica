// ============================================================================
// PHYMATH-SIM: PANEL DE RESULTADOS (MOLÉCULA)
// ============================================================================
// PROPÓSITO: Muestra resultados calculados con formato consistente
// ============================================================================

import React from 'react'
import './ResultsPanel.css'

function ResultsPanel({ 
  title, 
  results, 
  icon = 'calculator', 
  variant = 'info' 
}) {
  return (
    <div className={`results-panel results-panel-${variant} bg-${variant}-subtle border border-${variant}`}>
      <div className="results-panel-header">
        <i className={`results-panel-icon bi bi-${icon}`}></i>
        <h5 className={`results-panel-title text-${variant}-emphasis`}>{title}</h5>
      </div>
      
      <div className="results-panel-list">
        {results.map((result, index) => (
          <div key={index} className="results-panel-item">
            <span className="results-panel-label">{result.label}:</span>
            <div className="results-panel-value-container">
              <span className="results-panel-value">{result.value}</span>
              {result.unit && <small className="results-panel-unit">{result.unit}</small>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsPanel
