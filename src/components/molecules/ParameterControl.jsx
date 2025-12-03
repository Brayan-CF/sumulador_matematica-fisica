// ============================================================================
// PHYMATH-SIM: CONTROL DE PARÁMETROS (MOLÉCULA)
// ============================================================================
// PROPÓSITO: Agrupa sliders en tarjeta reutilizable
// ============================================================================

import React from 'react'
import Slider from '../atoms/Slider'
import './ParameterControl.css'

function ParameterControl({ title, parameters }) {
  return (
    <div className="parameter-control card shadow-sm">
      <div className="parameter-control-header card-header bg-primary text-white">
        <i className="parameter-control-icon bi bi-sliders"></i>
        <h5 className="parameter-control-title mb-0">{title}</h5>
      </div>
      
      <div className="parameter-control-body card-body">
        {parameters.map((param) => (
          <Slider 
            key={param.name}
            label={param.label}
            value={param.value}
            onChange={param.onChange}
            min={param.min}
            max={param.max}
            step={param.step || 1}
            unit={param.unit || ''}
          />
        ))}
      </div>
    </div>
  )
}

export default ParameterControl
