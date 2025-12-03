// ============================================================================
// PHYMATH-SIM: BOTÓN DE ACCIÓN (ÁTOMO)
// ============================================================================
// PROPÓSITO: Botón reutilizable con icono y variantes Bootstrap
// ============================================================================

import React from 'react'
import './ActionButton.css'

function ActionButton({ 
  onClick, 
  icon, 
  label, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false 
}) {
  const buttonClasses = [
    'action-button',
    'btn',
    `btn-${variant}`,
    `action-button-${variant}`,
    fullWidth ? 'action-button-full w-100' : ''
  ].filter(Boolean).join(' ')

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`action-button-icon bi ${icon}`}></i>}
      {label}
    </button>
  )
}

export default ActionButton
