// ============================================================================
// PHYMATH-SIM: SIMULADOR DE TRANSFORMACIONES GEOMÉTRICAS
// ============================================================================
// PROPÓSITO: Visualiza transformaciones 2D (traslación, rotación, escala)
// ============================================================================

import React from 'react'
import { useTransformation } from '../../hooks/useTransformation'
import SimulatorLayout from '../templates/SimulatorLayout'
import ParameterControl from '../molecules/ParameterControl'
import ResultsPanel from '../molecules/ResultsPanel'
import ActionButton from '../atoms/ActionButton'
import TransformationCanvas from './TransformationCanvas'
import './TransformationSimulator.css'

function TransformationSimulator() {
  const {
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
  } = useTransformation()

  // Parámetros
  const parameters = [
    {
      name: 'translateX',
      label: 'Traslación X',
      value: translateX,
      onChange: setTranslateX,
      min: -200,
      max: 200,
      step: 5,
      unit: ' px'
    },
    {
      name: 'translateY',
      label: 'Traslación Y',
      value: translateY,
      onChange: setTranslateY,
      min: -200,
      max: 200,
      step: 5,
      unit: ' px'
    },
    {
      name: 'rotation',
      label: 'Rotación',
      value: rotation,
      onChange: setRotation,
      min: 0,
      max: 360,
      step: 5,
      unit: '°'
    },
    {
      name: 'scaleX',
      label: 'Escala X',
      value: scaleX,
      onChange: setScaleX,
      min: 0.1,
      max: 3,
      step: 0.1,
      unit: 'x'
    },
    {
      name: 'scaleY',
      label: 'Escala Y',
      value: scaleY,
      onChange: setScaleY,
      min: 0.1,
      max: 3,
      step: 0.1,
      unit: 'x'
    }
  ]

  // Resultados
  const matrix = getTransformationMatrix()
  const results = [
    { label: 'Traslación', value: `(${translateX}, ${translateY})`, unit: 'px' },
    { label: 'Rotación', value: rotation, unit: '°' },
    { label: 'Escala', value: `(${scaleX}, ${scaleY})`, unit: '' }
  ]

  // Controles
  const controls = (
    <>
      <ParameterControl title="Transformaciones" parameters={parameters} />
      
      <div className="transformation-shape-selector card shadow-sm mt-3">
        <div className="card-header bg-info text-white">
          <h6 className="mb-0">Seleccionar Forma</h6>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2">
            <button 
              className={`btn ${shapeType === 'triangle' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setShapeType('triangle')}
            >
              Triángulo
            </button>
            <button 
              className={`btn ${shapeType === 'square' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setShapeType('square')}
            >
              Cuadrado
            </button>
            <button 
              className={`btn ${shapeType === 'star' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setShapeType('star')}
            >
              Estrella
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <ActionButton
          icon="bi-arrow-counterclockwise"
          label="Resetear"
          onClick={reset}
          variant="secondary"
          fullWidth
        />
      </div>
    </>
  )

  // Canvas
  const canvas = (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-arrows-angle-expand me-2"></i>
          Visualización de Transformaciones
        </h5>
      </div>
      <div className="card-body">
        <TransformationCanvas
          originalShape={getOriginalShape()}
          transformedShape={getTransformedShape()}
        />
        <div className="mt-3 p-2 bg-light rounded">
          <small>
            <span className="text-muted">■ Forma original</span>
            {' | '}
            <span className="text-primary">■ Forma transformada</span>
          </small>
        </div>
      </div>
    </div>
  )

  return (
    <SimulatorLayout
      title="Simulador de Transformaciones 2D"
      icon="bi-arrows-angle-expand"
      description="Visualiza transformaciones geométricas con matrices"
      objective="Comprender cómo las matrices transforman formas en el plano 2D"
      controls={controls}
      canvas={canvas}
      results={<ResultsPanel title="Parámetros Actuales" results={results} variant="info" />}
    />
  )
}

export default TransformationSimulator
