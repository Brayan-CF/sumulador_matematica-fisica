// ============================================================================
// PHYMATH-SIM: CANVAS PARA OSCILADOR ARMÓNICO
// ============================================================================
// PROPÓSITO: Renderiza 3 canvas (animación, fase, energía)
// ============================================================================

import React, { useRef, useEffect } from 'react'
import './HarmonicOscillatorCanvas.css'

function HarmonicOscillatorCanvas({ 
  currentState, 
  analytics,
  oscillatorType,
  showPhase,
  showEnergy,
  simulatorRef 
}) {
  const canvasRef = useRef(null)
  const phaseCanvasRef = useRef(null)
  const energyCanvasRef = useRef(null)

  // ========================================================================
  // USEEFFECT: Renderiza canvas principal con RAF
  // ========================================================================
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderFrame = () => {
      const ctx = canvas.getContext('2d')
      const simulator = simulatorRef.current

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar según tipo de oscilador
      try {
        if (oscillatorType === 'DOUBLE_PENDULUM') {
          simulator.drawDoublePendulum(ctx, canvas.width, canvas.height)
        } else if (oscillatorType === 'SPRING_MASS' || oscillatorType === 'VERTICAL_SPRING') {
          simulator.drawSpringMass(ctx, canvas.width, canvas.height)
        } else {
          simulator.drawPendulum(ctx, canvas.width, canvas.height)
        }
      } catch (error) {
        console.error('Error dibujando oscilador:', error)
      }
    }

    const rafId = requestAnimationFrame(renderFrame)
    return () => cancelAnimationFrame(rafId)
  }, [currentState, oscillatorType, simulatorRef])

  // ========================================================================
  // USEEFFECT: Renderiza espacio de fases con RAF
  // ========================================================================
  useEffect(() => {
    if (!showPhase) return
    
    const canvas = phaseCanvasRef.current
    if (!canvas) return

    const renderFrame = () => {
      const ctx = canvas.getContext('2d')
      const simulator = simulatorRef.current

      try {
        simulator.drawPhaseSpace(ctx, canvas.width, canvas.height)
      } catch (error) {
        console.error('Error dibujando espacio de fases:', error)
      }
    }

    const rafId = requestAnimationFrame(renderFrame)
    return () => cancelAnimationFrame(rafId)
  }, [currentState, showPhase, simulatorRef])

  // ========================================================================
  // USEEFFECT: Renderiza gráfico de energía con RAF
  // ========================================================================
  useEffect(() => {
    if (!showEnergy) return
    
    const canvas = energyCanvasRef.current
    if (!canvas) return

    const renderFrame = () => {
      const ctx = canvas.getContext('2d')
      const simulator = simulatorRef.current

      try {
        simulator.drawEnergyGraph(ctx, canvas.width, canvas.height)
      } catch (error) {
        console.error('Error dibujando energías:', error)
      }
    }

    const rafId = requestAnimationFrame(renderFrame)
    return () => cancelAnimationFrame(rafId)
  }, [currentState, showEnergy, simulatorRef])

  /* ============================================================================
     RENDERIZADO: 3 CANVAS CON CHECKBOXES DE VISIBILIDAD
     ============================================================================ */
  return (
    <div className="harmonic-oscillator-canvas">
      {/* ********** CANVAS PRINCIPAL ********** */}
      <div className="harmonic-oscillator-main card">
        <div className="harmonic-oscillator-main-header card-header bg-success text-white">
          <i className="harmonic-oscillator-icon bi bi-activity"></i>
          <h5 className="harmonic-oscillator-title mb-0">Visualización del Oscilador</h5>
        </div>
        <div className="harmonic-oscillator-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="harmonic-oscillator-canvas-element"
            width={800}
            height={400}
          />
        </div>
        <div className="harmonic-oscillator-info">
          <div className="harmonic-oscillator-info-item">
            <span className="harmonic-oscillator-info-label">Tiempo</span>
            <span className="harmonic-oscillator-info-value">{currentState.t?.toFixed(2) || 0}s</span>
          </div>
          <div className="harmonic-oscillator-info-item">
            <span className="harmonic-oscillator-info-label">Posición</span>
            <span className="harmonic-oscillator-info-value">{currentState.position?.toFixed(3) || 0}</span>
          </div>
          <div className="harmonic-oscillator-info-item">
            <span className="harmonic-oscillator-info-label">Velocidad</span>
            <span className="harmonic-oscillator-info-value">{currentState.velocity?.toFixed(3) || 0}</span>
          </div>
        </div>
      </div>

      {/* ********** CANVAS SECUNDARIOS (FASE Y ENERGÍA) ********** */}
      <div className="harmonic-oscillator-secondary-grid">
        {/* CANVAS DE ESPACIO DE FASES */}
        {showPhase && (
          <div className="harmonic-oscillator-secondary card">
            <div className="harmonic-oscillator-secondary-header card-header bg-info text-white">
              <i className="harmonic-oscillator-icon bi bi-diagram-3"></i>
              <span>Espacio de Fases</span>
            </div>
            <div className="harmonic-oscillator-canvas-wrapper">
              <canvas
                ref={phaseCanvasRef}
                className="harmonic-oscillator-canvas-element"
                width={400}
                height={400}
              />
            </div>
          </div>
        )}

        {/* CANVAS DE ENERGÍAS */}
        {showEnergy && (
          <div className="harmonic-oscillator-secondary card">
            <div className="harmonic-oscillator-secondary-header card-header bg-warning text-dark">
              <i className="harmonic-oscillator-icon bi bi-lightning-charge"></i>
              <span>Energías del Sistema</span>
            </div>
            <div className="harmonic-oscillator-canvas-wrapper">
              <canvas
                ref={energyCanvasRef}
                className="harmonic-oscillator-canvas-element"
                width={600}
                height={300}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HarmonicOscillatorCanvas
