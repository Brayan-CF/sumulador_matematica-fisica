// ============================================================================
// PHYMATH-SIM: SIMULADOR DE TIRO PARABÓLICO
// ============================================================================
// PROPÓSITO: Visualiza trayectorias de proyectiles con física realista
// ============================================================================

import React from 'react'
import { useProjectile } from '../../hooks/useProjectile'
import SimulatorLayout from '../templates/SimulatorLayout'
import ParameterControl from '../molecules/ParameterControl'
import ResultsPanel from '../molecules/ResultsPanel'
import SimulationCanvas from '../molecules/SimulationCanvas'
import ActionButton from '../atoms/ActionButton'
import './ProjectileSimulator.css'

function ProjectileSimulator() {
  const {
    velocity, setVelocity,
    angle, setAngle,
    gravity, setGravity,
    airResistance, setAirResistance,
    numProjectiles, setNumProjectiles,
    showTrail, setShowTrail,
    showVectors, setShowVectors,
    trajectories, results, comparisonResults,
    simulate, comparePlanets, reset
  } = useProjectile()

  const parameters = [
    {
      name: 'velocity',
      label: 'Velocidad Inicial',
      value: velocity,
      onChange: setVelocity,
      min: 10,
      max: 100,
      unit: ' m/s'
    },
    {
      name: 'angle',
      label: 'Ángulo de Lanzamiento',
      value: angle,
      onChange: setAngle,
      min: 1,
      max: 90,
      unit: '°'
    },
    {
      name: 'gravity',
      label: 'Gravedad',
      value: gravity,
      onChange: setGravity,
      min: 1,
      max: 25,
      step: 0.1,
      unit: ' m/s²'
    },
    {
      name: 'airResistance',
      label: 'Resistencia del Aire',
      value: airResistance,
      onChange: setAirResistance,
      min: 0,
      max: 0.5,
      step: 0.01,
      unit: ''
    },
    {
      name: 'numProjectiles',
      label: 'Número de Proyectiles',
      value: numProjectiles,
      onChange: setNumProjectiles,
      min: 1,
      max: 5,
      step: 1,
      unit: ''
    }
  ]

  const resultsData = [
    { label: 'Alcance Máximo', value: results.alcanceMax.toFixed(2), unit: 'm' },
    { label: 'Altura Máxima', value: results.alturaMax.toFixed(2), unit: 'm' },
    { label: 'Tiempo de Vuelo', value: results.timeTotal.toFixed(2), unit: 's' },
    { label: 'Velocidad Final', value: results.finalVelocity.toFixed(2), unit: 'm/s' },
    { label: 'Energía Inicial', value: results.initialEnergy.toFixed(2), unit: 'J' }
  ]

  return (
    <SimulatorLayout
      title="Simulador de Tiro Parabólico"
      icon="bi-arrow-up-right-circle"
      description="Visualización interactiva del movimiento proyectil"
      objective="Estudiar el comportamiento de proyectiles bajo diferentes condiciones físicas aplicando las ecuaciones de cinemática y análisis energético."
      
      controls={
        <>
          <ParameterControl 
            title="Parámetros de Simulación"
            parameters={parameters}
          />
          
          <div className="d-grid gap-2 mt-3">
            <ActionButton 
              icon="bi-play-fill" 
              label="Simular y Graficar" 
              onClick={simulate}
              variant="primary"
              fullWidth
            />
            <ActionButton 
              icon="bi-globe" 
              label="Comparar Planetas" 
              onClick={comparePlanets}
              variant="success"
              fullWidth
            />
            <ActionButton 
              icon="bi-arrow-counterclockwise" 
              label="Reiniciar Simulación" 
              onClick={reset}
              variant="outline-secondary"
              fullWidth
            />
          </div>
          
          {comparisonResults.length > 0 && (
            <div className="mt-4 p-3 bg-warning-subtle rounded shadow-sm">
              <h5 className="text-warning-emphasis mb-3">
                <i className="bi bi-globe me-2"></i>
                Comparación de Planetas
              </h5>
              {comparisonResults.map((planet, index) => (
                <div key={index} className="mb-2">
                  <strong style={{color: planet.color}}>{planet.name}:</strong>
                  <small className="d-block text-muted">
                    Alcance: {planet.metrics.range}m | Altura: {planet.metrics.height}m | Tiempo: {planet.metrics.time}s
                  </small>
                </div>
              ))}
            </div>
          )}
        </>
      }
      
      canvas={
        <SimulationCanvas 
          trajectories={trajectories}
          showTrail={showTrail}
          setShowTrail={setShowTrail}
          showVectors={showVectors}
          setShowVectors={setShowVectors}
          title="Trayectoria del Proyectil"
        />
      }
      
      results={
        <ResultsPanel 
          title="Resultados Calculados"
          results={resultsData}
          icon="calculator"
          variant="info"
        />
      }
    />
  )
}

export default ProjectileSimulator
