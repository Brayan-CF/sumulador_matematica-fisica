// ============================================================================
// PHYMATH-SIM: CHECKBOX (ÁTOMO)
// ============================================================================
// PROPÓSITO: Checkbox reutilizable con label e icono opcional
// ============================================================================

import React from 'react'
import './Checkbox.css'

function Checkbox({ label, checked, onChange, icon }) {
  const checkboxId = `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`
  
  return (
    <div className="checkbox-container form-check">
      <input 
        type="checkbox" 
        className="checkbox-input form-check-input" 
        id={checkboxId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      
      <label 
        className="checkbox-label form-check-label" 
        htmlFor={checkboxId}
      >
        {icon && <i className={`checkbox-icon bi ${icon}`}></i>}
        {label}
      </label>
    </div>
  )
}

export default Checkbox
