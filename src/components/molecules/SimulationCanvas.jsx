// ============================================================================
// PHYMATH-SIM: CANVAS DE SIMULACIÓN (MOLÉCULA)
// ============================================================================
// PROPÓSITO: Combina canvas con checkboxes de visualización
// ============================================================================

import React from 'react'
import Checkbox from '../atoms/Checkbox'
import CanvasRenderer from '../physics/CanvasRenderer'
import './SimulationCanvas.css'

function SimulationCanvas({ 
  trajectories, 
  showTrail, 
  setShowTrail, 
  showVectors, 
  setShowVectors,
  title = "Visualización",
  width = 800,
  height = 400
}) {
  return (
    <div className="simulation-canvas card shadow-sm">
      <div className="simulation-canvas-header card-header bg-success text-white">
        <i className="simulation-canvas-icon bi bi-graph-up"></i>
        <h5 className="simulation-canvas-title mb-0">{title}</h5>
      </div>
      
      <div className="simulation-canvas-body card-body">
        <div className="simulation-canvas-controls">
          <Checkbox 
            label="Mostrar estela" 
            checked={showTrail} 
            onChange={setShowTrail}
            icon="bi-bezier2"
          />
          <Checkbox 
            label="Mostrar vectores" 
            checked={showVectors} 
            onChange={setShowVectors}
            icon="bi-arrow-right-short"
          />
        </div>
        
        <div className="simulation-canvas-wrapper">
          <CanvasRenderer 
            trajectories={trajectories}
            showTrail={showTrail}
            showVectors={showVectors}
            width={width}
            height={height}
          />
        </div>
      </div>
    </div>
  )
}

export default SimulationCanvas
