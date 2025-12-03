// ============================================================================
// PHYMATH-SIM: HOOK DE TRANSFORMACIONES
// ============================================================================
// PROPÓSITO: Gestiona el estado de transformaciones 2D (traslación, rotación, escala)
// ============================================================================

import { useState } from 'react'
import TransformationModel from '../utils/math/TransformationModel'

export function useTransformation() {
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [shapeType, setShapeType] = useState('triangle')
  
  const getOriginalShape = () => {
    const shapes = {
      triangle: TransformationModel.createTriangle(),
      square: TransformationModel.createSquare(),
      star: TransformationModel.createStar()
    }
    return shapes[shapeType] || shapes.triangle
  }

  const getTransformationMatrix = () => {
    let matrix = TransformationModel.identity()
    
    if (translateX !== 0 || translateY !== 0) {
      matrix = TransformationModel.multiply(matrix, TransformationModel.translation(translateX, translateY))
    }
    
    if (rotation !== 0) {
      matrix = TransformationModel.multiply(matrix, TransformationModel.rotation(rotation))
    }
    
    if (scaleX !== 1 || scaleY !== 1) {
      matrix = TransformationModel.multiply(matrix, TransformationModel.scale(scaleX, scaleY))
    }
    
    return matrix
  }

  const getTransformedShape = () => {
    return TransformationModel.transformShape(getTransformationMatrix(), getOriginalShape())
  }

  const reset = () => {
    setTranslateX(0)
    setTranslateY(0)
    setRotation(0)
    setScaleX(1)
    setScaleY(1)
  }

  return {
    translateX, setTranslateX,
    translateY, setTranslateY,
    rotation, setRotation,
    scaleX, setScaleX,
    scaleY, setScaleY,
    shapeType, setShapeType,
    getOriginalShape,
    getTransformedShape,
    getTransformationMatrix,
    reset
  }
}
