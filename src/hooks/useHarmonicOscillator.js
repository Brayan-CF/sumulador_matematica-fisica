// ============================================================================
// PHYMATH-SIM: HOOK DE OSCILADOR ARMÓNICO
// ============================================================================
// PROPÓSITO: Gestiona el estado de simulación (péndulo, resorte, doble)
// ============================================================================

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { HarmonicOscillatorSimulator } from '../utils/physics/HarmonicOscillatorModel'

export function useHarmonicOscillator() {
  const simulatorRef = useRef(new HarmonicOscillatorSimulator())
  const animationRef = useRef(null)

  const [oscillatorType, setOscillatorType] = useState('PENDULUM')
  const [isRunning, setIsRunning] = useState(false)
  const [showPhase, setShowPhase] = useState(true)
  const [showEnergy, setShowEnergy] = useState(true)
  const [currentState, setCurrentState] = useState({ energy: { total: 0 } })
  const [analytics, setAnalytics] = useState({ period: 0, frequency: 0, amplitude: 0 })
  const [initialEnergy, setInitialEnergy] = useState(0)

  const [pendulumParamsRaw, setPendulumParams] = useState({
    length: 1.0,
    mass: 1.0,
    theta0: 0.3,
    omega0: 0,
    damping: 0.05
  })

  const [springParamsRaw, setSpringParams] = useState({
    mass: 1.0,
    k: 10.0,
    x0: 0.2,
    v0: 0,
    damping: 0.1
  })

  const [doublePendulumParamsRaw, setDoublePendulumParams] = useState({
    L1: 1.0,
    L2: 1.0,
    m1: 1.0,
    m2: 1.0,
    theta1_0: 0.3,
    theta2_0: 0.1,
    omega1_0: 0,
    omega2_0: 0,
    damping: 0.02
  })

  const pendulumParams = useMemo(() => pendulumParamsRaw, [
    pendulumParamsRaw.length,
    pendulumParamsRaw.mass,
    pendulumParamsRaw.theta0,
    pendulumParamsRaw.omega0,
    pendulumParamsRaw.damping
  ])

  const springParams = useMemo(() => springParamsRaw, [
    springParamsRaw.mass,
    springParamsRaw.k,
    springParamsRaw.x0,
    springParamsRaw.v0,
    springParamsRaw.damping
  ])

  const doublePendulumParams = useMemo(() => doublePendulumParamsRaw, [
    doublePendulumParamsRaw.L1,
    doublePendulumParamsRaw.L2,
    doublePendulumParamsRaw.m1,
    doublePendulumParamsRaw.m2,
    doublePendulumParamsRaw.theta1_0,
    doublePendulumParamsRaw.theta2_0,
    doublePendulumParamsRaw.omega1_0,
    doublePendulumParamsRaw.omega2_0,
    doublePendulumParamsRaw.damping
  ])

  const setupSimulation = useCallback(() => {
    const sim = simulatorRef.current

    if (oscillatorType === 'PENDULUM') {
      sim.setupSimplePendulum(pendulumParams)
    } else if (oscillatorType === 'SPRING_MASS') {
      sim.setupSpringMass(springParams)
    } else if (oscillatorType === 'DOUBLE_PENDULUM') {
      sim.setupDoublePendulum(doublePendulumParams)
    }

    setCurrentState(sim.getCurrentState())
    setAnalytics(sim.getAnalytics())
    setInitialEnergy(sim.getCurrentState().energy?.total || 0)
  }, [oscillatorType, pendulumParams, springParams, doublePendulumParams])

  const start = useCallback(() => {
    if (!isRunning) {
      setupSimulation()
      setIsRunning(true)
    }
  }, [isRunning, setupSimulation])

  const pause = useCallback(() => {
    setIsRunning(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    pause()
    setupSimulation()
  }, [pause, setupSimulation])

  const updateParameter = useCallback((paramName, value) => {
    if (oscillatorType === 'PENDULUM') {
      setPendulumParams(prev => ({ ...prev, [paramName]: value }))
    } else if (oscillatorType === 'SPRING_MASS') {
      setSpringParams(prev => ({ ...prev, [paramName]: value }))
    } else if (oscillatorType === 'DOUBLE_PENDULUM') {
      setDoublePendulumParams(prev => ({ ...prev, [paramName]: value }))
    }
  }, [oscillatorType])

  useEffect(() => {
    if (!isRunning) return

    const animate = () => {
      const sim = simulatorRef.current
      sim.step(0.016)
      setCurrentState(sim.getCurrentState())
      setAnalytics(sim.getAnalytics())
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    setupSimulation()
  }, [setupSimulation])

  return {
    oscillatorType,
    isRunning,
    showPhase,
    showEnergy,
    currentState,
    analytics,
    initialEnergy,
    pendulumParams,
    springParams,
    doublePendulumParams,
    
    setOscillatorType,
    setShowPhase,
    setShowEnergy,
    updateParameter,
    start,
    pause,
    reset,
    simulatorRef
  }
}
