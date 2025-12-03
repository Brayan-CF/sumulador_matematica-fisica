// ============================================================================
// PHYMATH-SIM: SIMULADOR DE OSCILADORES ARMÓNICOS
// ============================================================================
// PROPÓSITO: Simula péndulos y sistemas masa-resorte con visualización
// ============================================================================

import React from 'react'
import { useHarmonicOscillator } from '../../hooks/useHarmonicOscillator'
import SimulatorLayout from '../templates/SimulatorLayout'
import ParameterControl from '../molecules/ParameterControl'
import ResultsPanel from '../molecules/ResultsPanel'
import HarmonicOscillatorCanvas from '../molecules/HarmonicOscillatorCanvas'
import ActionButton from '../atoms/ActionButton'
import Checkbox from '../atoms/Checkbox'
import './HarmonicOscillatorSimulator.css'

function HarmonicOscillatorSimulator() {
  const {
    oscillatorType, setOscillatorType,
    isRunning, showPhase, setShowPhase,
    showEnergy, setShowEnergy,
    currentState, analytics, initialEnergy,
    pendulumParams, springParams, doublePendulumParams,
    updateParameter, start, pause, reset, simulatorRef
  } = useHarmonicOscillator()

  const getParametersConfig = () => {
    switch (oscillatorType) {
      case 'PENDULUM':
      case 'COMPOUND_PENDULUM':
        return [
          { name: 'length', label: 'Longitud', value: pendulumParams.length, onChange: (v) => updateParameter('length', v), min: 0.1, max: 3, step: 0.1, unit: ' m' },
          { name: 'mass', label: 'Masa', value: pendulumParams.mass, onChange: (v) => updateParameter('mass', v), min: 0.1, max: 5, step: 0.1, unit: ' kg' },
          { name: 'theta0', label: 'Ángulo Inicial', value: pendulumParams.theta0, onChange: (v) => updateParameter('theta0', v), min: -1.57, max: 1.57, step: 0.01, unit: ' rad' },
          { name: 'damping', label: 'Amortiguamiento', value: pendulumParams.damping, onChange: (v) => updateParameter('damping', v), min: 0, max: 1, step: 0.01, unit: '' }
        ]

      case 'SPRING_MASS':
      case 'VERTICAL_SPRING':
        return [
          { name: 'mass', label: 'Masa', value: springParams.mass, onChange: (v) => updateParameter('mass', v), min: 0.1, max: 5, step: 0.1, unit: ' kg' },
          { name: 'k', label: 'Constante k', value: springParams.k, onChange: (v) => updateParameter('k', v), min: 1, max: 100, step: 1, unit: ' N/m' },
          { name: 'x0', label: 'Posición Inicial', value: springParams.x0, onChange: (v) => updateParameter('x0', v), min: -1, max: 1, step: 0.01, unit: ' m' },
          { name: 'damping', label: 'Amortiguamiento', value: springParams.damping, onChange: (v) => updateParameter('damping', v), min: 0, max: 1, step: 0.01, unit: '' }
        ]

      case 'DOUBLE_PENDULUM':
        return [
          { name: 'L1', label: 'Longitud 1', value: doublePendulumParams.L1, onChange: (v) => updateParameter('L1', v), min: 0.1, max: 2, step: 0.1, unit: ' m' },
          { name: 'L2', label: 'Longitud 2', value: doublePendulumParams.L2, onChange: (v) => updateParameter('L2', v), min: 0.1, max: 2, step: 0.1, unit: ' m' },
          { name: 'm1', label: 'Masa 1', value: doublePendulumParams.m1, onChange: (v) => updateParameter('m1', v), min: 0.1, max: 3, step: 0.1, unit: ' kg' },
          { name: 'm2', label: 'Masa 2', value: doublePendulumParams.m2, onChange: (v) => updateParameter('m2', v), min: 0.1, max: 3, step: 0.1, unit: ' kg' },
          { name: 'theta1_0', label: 'Ángulo 1', value: doublePendulumParams.theta1_0, onChange: (v) => updateParameter('theta1_0', v), min: -1.57, max: 1.57, step: 0.01, unit: ' rad' },
          { name: 'theta2_0', label: 'Ángulo 2', value: doublePendulumParams.theta2_0, onChange: (v) => updateParameter('theta2_0', v), min: -1.57, max: 1.57, step: 0.01, unit: ' rad' }
        ]

      default:
        return []
    }
  }

  const resultsData = [
    { label: 'Período', value: analytics.period?.toFixed(3) || 'N/A', unit: 's' },
    { label: 'Frecuencia', value: analytics.frequency?.toFixed(3) || 'N/A', unit: 'Hz' },
    { label: 'Amplitud', value: analytics.amplitude?.toFixed(3) || 'N/A', unit: '' },
    { label: 'Energía Total', value: currentState.energy?.total?.toFixed(3) || 'N/A', unit: 'J' },
    { label: 'Energía Inicial', value: initialEnergy.toFixed(3), unit: 'J' }
  ]

  /* ============================================================================
     RENDERIZADO: COMPOSICIÓN DE COMPONENTES
     ============================================================================ */
  return (
    <SimulatorLayout
      title="Simulador de Oscilador Armónico"
      icon="bi-activity"
      description="Análisis de sistemas oscilatorios: péndulos y sistemas masa-resorte"
      objective="Estudiar el movimiento oscilatorio, espacio de fases, conservación de energía y comportamiento caótico en sistemas dinámicos."
      
      controls={
        <>
          {/* ********** SELECTOR DE TIPO DE OSCILADOR ********** */}
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Tipo de Oscilador
              </h5>
            </div>
            <div className="card-body">
              <select 
                className="form-select"
                value={oscillatorType}
                onChange={(e) => setOscillatorType(e.target.value)}
                disabled={isRunning}
              >
                <option value="PENDULUM">Péndulo Simple</option>
                <option value="SPRING_MASS">Sistema Masa-Resorte</option>
                <option value="DOUBLE_PENDULUM">Péndulo Doble (Caótico)</option>
                <option value="COMPOUND_PENDULUM">Péndulo Compuesto</option>
                <option value="VERTICAL_SPRING">Resorte Vertical (con gravedad)</option>
              </select>
            </div>
          </div>

          <ParameterControl 
            title="Parámetros del Sistema"
            parameters={getParametersConfig()}
          />

          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h6 className="mb-3">Opciones de Visualización</h6>
              <Checkbox 
                label="Espacio de Fases" 
                checked={showPhase}
                onChange={setShowPhase}
                icon="bi-diagram-3"
              />
              <Checkbox 
                label="Gráfico de Energías" 
                checked={showEnergy}
                onChange={setShowEnergy}
                icon="bi-lightning-charge"
              />
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            {!isRunning ? (
              <ActionButton 
                icon="bi-play-fill" 
                label="Iniciar Simulación" 
                onClick={start}
                variant="success"
                fullWidth
              />
            ) : (
              <ActionButton 
                icon="bi-pause-fill" 
                label="Pausar Simulación" 
                onClick={pause}
                variant="warning"
                fullWidth
              />
            )}
            <ActionButton 
              icon="bi-arrow-counterclockwise" 
              label="Reiniciar" 
              onClick={reset}
              variant="outline-secondary"
              fullWidth
            />
          </div>
        </>
      }
      
      canvas={
        <HarmonicOscillatorCanvas 
          currentState={currentState}
          analytics={analytics}
          oscillatorType={oscillatorType}
          showPhase={showPhase}
          showEnergy={showEnergy}
          simulatorRef={simulatorRef}
        />
      }
      
      results={
        <ResultsPanel 
          title="Análisis del Sistema"
          results={resultsData}
          icon="graph-up"
          variant="info"
        />
      }
    />
  )
}

export default HarmonicOscillatorSimulator
