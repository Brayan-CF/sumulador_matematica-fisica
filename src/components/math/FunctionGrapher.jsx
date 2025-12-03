// ============================================================================
// PHYMATH-SIM: GRAFICADOR DE FUNCIONES MATEMÁTICAS
// ============================================================================
// PROPÓSITO: Visualización interactiva de funciones, derivadas y evaluaciones
// ============================================================================

import React from 'react'
import { useFunctionGrapher } from '../../hooks/useFunctionGrapher'
import FunctionCanvas from './FunctionCanvas'
import SimulatorLayout from '../templates/SimulatorLayout'
import ParameterControl from '../molecules/ParameterControl'
import ResultsPanel from '../molecules/ResultsPanel'
import ActionButton from '../atoms/ActionButton'
import Checkbox from '../atoms/Checkbox'
import Slider from '../atoms/Slider'
import './FunctionGrapher.css'

const FUNCTION_LABELS = {
  LINEAR: 'Lineal (ax + b)',
  QUADRATIC: 'Cuadrática (ax² + bx + c)',
  CUBIC: 'Cúbica (ax³ + bx² + cx + d)',
  SINE: 'Seno (a·sin(bx + c) + d)',
  COSINE: 'Coseno (a·cos(bx + c) + d)',
  EXPONENTIAL: 'Exponencial (a·e^(bx) + c)',
  LOGARITHMIC: 'Logarítmica (a·ln(x + b) + c)',
  CUSTOM: 'Personalizada'
}

const PARAM_LABELS = {
  a: 'Amplitud/Coef. a',
  b: 'Frecuencia/Coef. b',
  c: 'Desplazamiento c',
  d: 'Offset vertical d'
}

function FunctionGrapher() {
  const {
    functionType, parameters, customExpression, functionColor,
    viewport, zoom, showGrid, showAxis, showDerivative,
    evalX, evaluationResults, activeFunctions, errorMessage,
    getActiveParams, generateAllFunctionPoints,
    setFunctionType, setCustomExpression, setFunctionColor,
    setViewport, setZoom, setShowGrid, setShowAxis, setShowDerivative,
    setEvalX, updateParameter, addFunction, removeFunction,
    clearAllFunctions, toggleFunctionVisibility, evaluateAtPoint,
    resetView, applyZoom, FunctionTypes
  } = useFunctionGrapher()

  const activeParams = getActiveParams()

  const functionParameters = Object.entries(activeParams).map(([key, value]) => ({
    name: key,
    label: PARAM_LABELS[key] || key,
    value,
    onChange: (v) => updateParameter(key, v),
    min: -10, max: 10, step: 0.1, unit: ''
  }))

  const resultsData = evaluationResults ? [
    { label: 'f(x)', value: evaluationResults.y?.toFixed(4) || '—', unit: '' },
    { label: "f'(x)", value: evaluationResults.derivative?.toFixed(4) || '—', unit: '' }
  ] : []

  const handleViewportChange = (field, value) => {
    setViewport(prev => ({ ...prev, [field]: parseFloat(value) }))
  }

  return (
    <SimulatorLayout
      title="Graficador de Funciones"
      icon="bi-graph-up"
      description="Visualización interactiva de funciones matemáticas"
      objective="Explorar el comportamiento de funciones, sus derivadas y transformaciones mediante parámetros ajustables."
      
      controls={
        <>
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          <div className="card shadow-sm mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="bi bi-calculator me-2"></i>Tipo de Función</h5>
            </div>
            <div className="card-body">
              <select 
                className="form-select"
                value={functionType}
                onChange={(e) => setFunctionType(e.target.value)}
              >
                {Object.keys(FUNCTION_LABELS).map(type => (
                  <option key={type} value={type}>{FUNCTION_LABELS[type]}</option>
                ))}
              </select>

              {functionType === FunctionTypes.CUSTOM && (
                <div className="mt-2">
                  <label className="form-label">Expresión Personalizada</label>
                  <input 
                    type="text" 
                    className="form-control font-monospace"
                    value={customExpression}
                    onChange={(e) => setCustomExpression(e.target.value)}
                    placeholder="ej: Math.sin(x) * x"
                  />
                  <small className="text-muted">Usa variable 'x' y funciones Math.*</small>
                </div>
              )}
            </div>
          </div>

          {activeParams && Object.keys(activeParams).length > 0 && (
            <ParameterControl 
              title="Parámetros de la Función"
              parameters={functionParameters}
            />
          )}

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <label className="form-label">Color de la Gráfica</label>
              <input 
                type="color" 
                className="form-control form-control-color w-100"
                value={functionColor}
                onChange={(e) => setFunctionColor(e.target.value)}
              />
            </div>
          </div>

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6 className="mb-3">Control de Vista</h6>
              
              <Slider 
                label="Zoom"
                value={zoom}
                onChange={(v) => { setZoom(v); applyZoom(v) }}
                min={0.5} max={5} step={0.1}
                unit="x"
              />

              <div className="mt-2">
                <small className="text-muted d-block mb-2">Límites del Viewport:</small>
                <div className="row g-2">
                  <div className="col-6">
                    <input 
                      type="number" 
                      className="form-control form-control-sm" 
                      placeholder="X mín"
                      value={viewport.xMin}
                      onChange={(e) => handleViewportChange('xMin', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      type="number" 
                      className="form-control form-control-sm" 
                      placeholder="X máx"
                      value={viewport.xMax}
                      onChange={(e) => handleViewportChange('xMax', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      type="number" 
                      className="form-control form-control-sm" 
                      placeholder="Y mín"
                      value={viewport.yMin}
                      onChange={(e) => handleViewportChange('yMin', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input 
                      type="number" 
                      className="form-control form-control-sm" 
                      placeholder="Y máx"
                      value={viewport.yMax}
                      onChange={(e) => handleViewportChange('yMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6 className="mb-3">Visualización</h6>
              <Checkbox label="Mostrar Grilla" checked={showGrid} onChange={setShowGrid} />
              <Checkbox label="Mostrar Ejes" checked={showAxis} onChange={setShowAxis} />
              <Checkbox label="Mostrar Derivada" checked={showDerivative} onChange={setShowDerivative} />
            </div>
          </div>

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <label className="form-label">Evaluar en x =</label>
              <div className="input-group">
                <input 
                  type="number" 
                  className="form-control"
                  value={evalX}
                  onChange={(e) => setEvalX(parseFloat(e.target.value))}
                  step={0.1}
                />
                <button 
                  className="btn btn-primary"
                  onClick={evaluateAtPoint}
                >
                  <i className="bi bi-calculator"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <ActionButton 
              icon="bi-plus-circle" 
              label="Añadir Función" 
              onClick={addFunction}
              variant="primary" fullWidth
            />
            <ActionButton 
              icon="bi-arrow-counterclockwise" 
              label="Resetear Vista" 
              onClick={resetView}
              variant="outline-secondary" fullWidth
            />
            <ActionButton 
              icon="bi-trash" 
              label="Limpiar Todo" 
              onClick={clearAllFunctions}
              variant="outline-danger" fullWidth
            />
          </div>
        </>
      }
      
      canvas={
        <FunctionCanvas
          functions={generateAllFunctionPoints()}
          viewport={viewport}
          showGrid={showGrid}
          showAxis={showAxis}
          evalPoint={evaluationResults ? { x: evalX, y: evaluationResults.y } : null}
        />
      }
      
      results={
        <>
          {resultsData.length > 0 && (
            <ResultsPanel 
              title={`Evaluación en x = ${evalX}`}
              results={resultsData}
              icon="calculator"
              variant="success"
            />
          )}

          {activeFunctions.length > 0 && (
            <div className="card shadow-sm mt-3">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Funciones Activas ({activeFunctions.length})
                </h6>
              </div>
              <div className="card-body p-2">
                {activeFunctions.map((fn) => (
                  <div key={fn.id} className="d-flex align-items-center justify-content-between p-2 border-bottom">
                    <div className="d-flex align-items-center">
                      <div 
                        style={{ 
                          width: '20px', height: '20px', 
                          backgroundColor: fn.color,
                          borderRadius: '4px',
                          marginRight: '8px'
                        }}
                      />
                      <small className="text-muted">{FUNCTION_LABELS[fn.type]}</small>
                    </div>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => toggleFunctionVisibility(fn.id)}
                      >
                        <i className={`bi bi-eye${fn.visible ? '' : '-slash'}`}></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFunction(fn.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      }
    />
  )
}

export default FunctionGrapher
