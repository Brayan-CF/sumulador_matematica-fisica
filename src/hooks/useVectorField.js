// ============================================================================
// PHYMATH-SIM: HOOK DE CAMPO VECTORIAL
// ============================================================================
// PROPÓSITO: Gestiona el estado y generación de visualización de campos vectoriales
// ============================================================================

import { useState } from 'react'
import VectorFieldModel from '../utils/math/VectorFieldModel'

export function useVectorField() {
  const [fieldType, setFieldType] = useState('radial')
  const [vectorScale, setVectorScale] = useState(15)
  const [gridDensity, setGridDensity] = useState(20)
  const [showArrows, setShowArrows] = useState(true)
  const [showMagnitude, setShowMagnitude] = useState(false)

  const generateVectorGrid = (width, height) => {
    const vectors = []
    const step = gridDensity
    const centerX = width / 2
    const centerY = height / 2

    for (let x = step; x < width; x += step) {
      for (let y = step; y < height; y += step) {
        const relX = (x - centerX) / 50
        const relY = (y - centerY) / 50
        const vector = VectorFieldModel.getField(fieldType, relX, relY, vectorScale / 15)
        
        vectors.push({
          x, y,
          vx: vector.x,
          vy: vector.y,
          magnitude: VectorFieldModel.magnitude(vector)
        })
      }
    }

    return vectors
  }

  return {
    fieldType, setFieldType,
    vectorScale, setVectorScale,
    gridDensity, setGridDensity,
    showArrows, setShowArrows,
    showMagnitude, setShowMagnitude,
    generateVectorGrid
  }
}
