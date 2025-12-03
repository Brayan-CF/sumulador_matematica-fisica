// ============================================================================
// PHYMATH-SIM: SLIDER (ÁTOMO)
// ============================================================================
// PROPÓSITO: Input range reutilizable con valor y unidad
// ============================================================================

import React from 'react'
import './Slider.css'

function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit = '' 
}) {
  return (
    <div className="slider-container">
      <label className="slider-label">
        {label}: <span className="slider-value">{value}{unit}</span>
      </label>
      
      <input 
        type="range" 
        className="slider-input form-range" 
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      
      <div className="slider-range">
        <small>{min}{unit}</small>
        <small>{max}{unit}</small>
      </div>
    </div>
  )
}

export default Slider
