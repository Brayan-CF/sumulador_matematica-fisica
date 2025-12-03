// ============================================================================
// PHYMATH-SIM: SIMULADOR DE CAMPOS VECTORIALES
// ============================================================================
// PROPÓSITO: Visualiza campos vectoriales 2D (radial, circular, etc)
// ============================================================================

import React from 'react'
import { useVectorField } from '../../hooks/useVectorField'
import SimulatorLayout from '../templates/SimulatorLayout'
import ParameterControl from '../molecules/ParameterControl'
import ResultsPanel from '../molecules/ResultsPanel'
import Checkbox from '../atoms/Checkbox'
import VectorFieldCanvas from './VectorFieldCanvas'
import './VectorFieldSimulator.css'

function VectorFieldSimulator() {
  const {
    fieldType,
    setFieldType,
    vectorScale,
    setVectorScale,
    gridDensity,
    setGridDensity,
    showArrows,
    setShowArrows,
    showMagnitude,
    setShowMagnitude,
    generateVectorGrid
  } = useVectorField()

  // Parámetros
  const parameters = [
    {
      name: 'vectorScale',
      label: 'Escala de Vectores',
      value: vectorScale,
      onChange: setVectorScale,
      min: 5,
      max: 30,
      step: 1,
      unit: ''
    },
    {
      name: 'gridDensity',
      label: 'Densidad del Grid',
      value: gridDensity,
      onChange: setGridDensity,
      min: 15,
      max: 40,
      step: 5,
      unit: ' px'
    }
  ]

  // Generar vectores
  const vectors = generateVectorGrid(800, 600)

  // Resultados
  const results = [
    { label: 'Tipo de Campo', value: fieldType, unit: '' },
    { label: 'Vectores Totales', value: vectors.length, unit: '' },
    { label: 'Densidad', value: gridDensity, unit: ' px' }
  ]

  // Controles
  const controls = (
    <>
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-info text-white">
          <h6 className="mb-0">Tipo de Campo Vectorial</h6>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2">
            <button 
              className={`btn ${fieldType === 'radial' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFieldType('radial')}
            >
              Radial
            </button>
            <button 
              className={`btn ${fieldType === 'circular' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFieldType('circular')}
            >
              Circular
            </button>
            <button 
              className={`btn ${fieldType === 'uniform' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFieldType('uniform')}
            >
              Uniforme
            </button>
            <button 
              className={`btn ${fieldType === 'gravity' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFieldType('gravity')}
            >
              Gravitacional
            </button>
            <button 
              className={`btn ${fieldType === 'saddle' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFieldType('saddle')}
            >
              Silla de Montar
            </button>
            <button 
              className={`btn ${fieldType === 'spiral' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFieldType('spiral')}
            >
              Espiral
            </button>
          </div>
        </div>
      </div>

      <ParameterControl title="Configuración" parameters={parameters} />

      <div className="card shadow-sm mt-3">
        <div className="card-header bg-success text-white">
          <h6 className="mb-0">Opciones de Visualización</h6>
        </div>
        <div className="card-body">
          <Checkbox
            label="Mostrar Flechas"
            checked={showArrows}
            onChange={setShowArrows}
            icon="bi-arrow-up"
          />
          <Checkbox
            label="Color por Magnitud"
            checked={showMagnitude}
            onChange={setShowMagnitude}
            icon="bi-palette"
          />
        </div>
      </div>
    </>
  )

  // Canvas
  const canvas = (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-arrows-move me-2"></i>
          Campo Vectorial
        </h5>
      </div>
      <div className="card-body">
        <VectorFieldCanvas
          vectors={vectors}
          showArrows={showArrows}
          showMagnitude={showMagnitude}
        />
        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            {showMagnitude ? 'Colores indican magnitud del vector' : 'Flechas azules representan dirección y magnitud'}
          </small>
        </div>
      </div>
    </div>
  )

  return (
    <SimulatorLayout
      title="Simulador de Campos Vectoriales"
      icon="bi-arrows-move"
      description="Visualiza diferentes tipos de campos vectoriales en 2D"
      objective="Comprender la estructura y comportamiento de campos vectoriales"
      controls={controls}
      canvas={canvas}
      results={<ResultsPanel title="Información del Campo" results={results} variant="success" />}
    />
  )
}

export default VectorFieldSimulator
