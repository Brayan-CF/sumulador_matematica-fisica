// ============================================================================
// PHYMATH-SIM: SIMULADOR DE COLISIONES
// ============================================================================
// PROPÓSITO: Análisis de colisiones elásticas e inelásticas entre objetos
// ============================================================================

import React, { useEffect, useRef } from 'react'
import { useCollision } from '../../hooks/useCollision'
import SimulatorLayout from '../templates/SimulatorLayout'
import ParameterControl from '../molecules/ParameterControl'
import ResultsPanel from '../molecules/ResultsPanel'
import ActionButton from '../atoms/ActionButton'
import Checkbox from '../atoms/Checkbox'
import './CollisionSimulator.css'

function CollisionSimulator() {
  const canvasRef = useRef(null)

  const {
    isRunning, selectedPreset, showTrajectories, setShowTrajectories,
    showVectors, setShowVectors, showStats, setShowStats,
    statistics, newObjectConfig, updateNewObjectConfig,
    initializeSimulator, setupPreset, addNewObject,
    start, pause, reset, clearAll, simulatorRef
  } = useCollision()

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      initializeSimulator(canvas.width, canvas.height)
      setupPreset('head-on')
    }
  }, [initializeSimulator, setupPreset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !simulatorRef.current) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      simulatorRef.current.draw(ctx, canvas.width, canvas.height, {
        showTrajectories,
        showVectors
      })
    } catch (error) {
      console.error('Error dibujando colisiones:', error)
    }
  }, [isRunning, showTrajectories, showVectors, simulatorRef, statistics])

  const newObjectParameters = [
    { name: 'mass', label: 'Masa', value: newObjectConfig.mass, onChange: (v) => updateNewObjectConfig('mass', v), min: 0.1, max: 10, step: 0.1, unit: ' kg' },
    { name: 'radius', label: 'Radio', value: newObjectConfig.radius, onChange: (v) => updateNewObjectConfig('radius', v), min: 0.1, max: 2, step: 0.1, unit: ' m' },
    { name: 'posX', label: 'Posición X', value: newObjectConfig.posX, onChange: (v) => updateNewObjectConfig('posX', v), min: 0, max: 16, step: 0.1, unit: ' m' },
    { name: 'posY', label: 'Posición Y', value: newObjectConfig.posY, onChange: (v) => updateNewObjectConfig('posY', v), min: 0, max: 10, step: 0.1, unit: ' m' },
    { name: 'velX', label: 'Velocidad X', value: newObjectConfig.velX, onChange: (v) => updateNewObjectConfig('velX', v), min: -5, max: 5, step: 0.1, unit: ' m/s' },
    { name: 'velY', label: 'Velocidad Y', value: newObjectConfig.velY, onChange: (v) => updateNewObjectConfig('velY', v), min: -5, max: 5, step: 0.1, unit: ' m/s' }
  ]

  const resultsData = [
    { label: 'Objetos Activos', value: statistics.objectCount || 0, unit: '' },
    { label: 'Colisiones Totales', value: statistics.collisionCount || 0, unit: '' },
    { label: 'Momentum Total X', value: statistics.totalMomentum?.x?.toFixed(3) || '0', unit: ' kg·m/s' },
    { label: 'Momentum Total Y', value: statistics.totalMomentum?.y?.toFixed(3) || '0', unit: ' kg·m/s' },
    { label: 'Energía Cinética', value: statistics.kineticEnergy?.toFixed(3) || '0', unit: ' J' }
  ]

  return (
    <SimulatorLayout
      title="Simulador de Colisiones"
      icon="bi-box"
      description="Análisis de colisiones elásticas e inelásticas entre objetos"
      objective="Estudiar la conservación del momentum y energía en sistemas de colisiones múltiples con diferentes materiales."
      
      controls={
        <>
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="bi bi-collection me-2"></i>Escenarios Predefinidos</h5>
            </div>
            <div className="card-body">
              <select 
                className="form-select"
                value={selectedPreset}
                onChange={(e) => setupPreset(e.target.value)}
              >
                <option value="head-on">Colisión Frontal</option>
                <option value="oblique">Colisión Oblicua</option>
                <option value="multiple">Múltiples Objetos</option>
                <option value="wall">Colisión con Pared</option>
                <option value="gravity">Caída con Gravedad</option>
              </select>
            </div>
          </div>

          <ParameterControl 
            title="Añadir Nuevo Objeto"
            parameters={newObjectParameters}
          />

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <label className="form-label">Material</label>
              <select 
                className="form-select"
                value={newObjectConfig.material}
                onChange={(e) => updateNewObjectConfig('material', e.target.value)}
              >
                <option value="STEEL">Acero (e=0.90)</option>
                <option value="ALUMINUM">Aluminio (e=0.85)</option>
                <option value="GLASS">Vidrio (e=0.95)</option>
                <option value="WOOD">Madera (e=0.50)</option>
                <option value="RUBBER">Goma (e=0.80)</option>
                <option value="PLASTIC">Plástico (e=0.70)</option>
              </select>
              
              <div className="mt-2">
                <Checkbox 
                  label="Objeto Fijo (pared)" 
                  checked={newObjectConfig.fixed}
                  onChange={(v) => updateNewObjectConfig('fixed', v)}
                />
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6 className="mb-3">Opciones de Visualización</h6>
              <Checkbox label="Mostrar Trayectorias" checked={showTrajectories} onChange={setShowTrajectories} icon="bi-bezier2" />
              <Checkbox label="Mostrar Vectores" checked={showVectors} onChange={setShowVectors} icon="bi-arrow-right" />
              <Checkbox label="Mostrar Estadísticas" checked={showStats} onChange={setShowStats} icon="bi-bar-chart" />
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <ActionButton 
              icon="bi-plus-circle" 
              label="Añadir Objeto" 
              onClick={addNewObject}
              variant="primary" fullWidth
            />
            
            {!isRunning ? (
              <ActionButton 
                icon="bi-play-fill" 
                label="Iniciar Simulación" 
                onClick={start}
                variant="success" fullWidth
              />
            ) : (
              <ActionButton 
                icon="bi-pause-fill" 
                label="Pausar Simulación" 
                onClick={pause}
                variant="warning" fullWidth
              />
            )}
            
            <ActionButton 
              icon="bi-arrow-counterclockwise" 
              label="Reiniciar Preset" 
              onClick={reset}
              variant="outline-secondary" fullWidth
            />
            
            <ActionButton 
              icon="bi-trash" 
              label="Limpiar Todo" 
              onClick={clearAll}
              variant="outline-danger" fullWidth
            />
          </div>
        </>
      }
      
      canvas={
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0"><i className="bi bi-diagram-3 me-2"></i>Visualización de Colisiones</h5>
          </div>
          <div className="card-body">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              style={{ 
                width: '100%', 
                height: 'auto',
                border: '2px solid #28a745',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)'
              }}
            />
            
            <div className="mt-3 p-2 bg-light rounded">
              <small className="text-muted">
                <strong>Leyenda:</strong> Los objetos de diferentes colores representan diferentes materiales. 
                El tamaño indica la masa relativa.
              </small>
            </div>
          </div>
        </div>
      }
      
      results={
        <>
          <ResultsPanel 
            title="Estadísticas del Sistema"
            results={resultsData}
            icon="bar-chart"
            variant="info"
          />
          
          {showStats && (
            <div className="mt-3 p-3 bg-success-subtle rounded shadow-sm">
              <h6 className="text-success-emphasis"><i className="bi bi-check-circle me-2"></i>Conservación</h6>
              <small className="text-muted d-block">
                En colisiones elásticas, tanto el momentum como la energía cinética se conservan.
                En colisiones inelásticas, solo el momentum se conserva.
              </small>
            </div>
          )}
        </>
      }
    />
  )
}

export default CollisionSimulator
