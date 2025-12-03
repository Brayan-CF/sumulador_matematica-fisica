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

  // ========================================================================
  // ESTADOS PRIMITIVOS: Péndulo simple
  // ========================================================================
  const [pendulumLength, setPendulumLength] = useState(1.0)
  const [pendulumMass, setPendulumMass] = useState(1.0)
  const [pendulumTheta0, setPendulumTheta0] = useState(0.3)
  const [pendulumOmega0, setPendulumOmega0] = useState(0)
  const [pendulumDamping, setPendulumDamping] = useState(0.05)

  // ========================================================================
  // ESTADOS PRIMITIVOS: Resorte-masa
  // ========================================================================
  const [springMass, setSpringMass] = useState(1.0)
  const [springK, setSpringK] = useState(10.0)
  const [springX0, setSpringX0] = useState(0.2)
  const [springV0, setSpringV0] = useState(0)
  const [springDamping, setSpringDamping] = useState(0.1)

  // ========================================================================
  // ESTADOS PRIMITIVOS: Péndulo doble
  // ========================================================================
  const [doubleL1, setDoubleL1] = useState(1.0)
  const [doubleL2, setDoubleL2] = useState(1.0)
  const [doubleM1, setDoubleM1] = useState(1.0)
  const [doubleM2, setDoubleM2] = useState(1.0)
  const [doubleTheta1_0, setDoubleTheta1_0] = useState(0.3)
  const [doubleTheta2_0, setDoubleTheta2_0] = useState(0.1)
  const [doubleOmega1_0, setDoubleOmega1_0] = useState(0)
  const [doubleOmega2_0, setDoubleOmega2_0] = useState(0)
  const [doubleDamping, setDoubleDamping] = useState(0.02)

  // ========================================================================
  // OBJETOS ESTABILIZADOS: useMemo para evitar re-renders
  // ========================================================================
  const pendulumParams = useMemo(() => ({
    length: pendulumLength,
    mass: pendulumMass,
    theta0: pendulumTheta0,
    omega0: pendulumOmega0,
    damping: pendulumDamping
  }), [pendulumLength, pendulumMass, pendulumTheta0, pendulumOmega0, pendulumDamping])

  const springParams = useMemo(() => ({
    mass: springMass,
    k: springK,
    x0: springX0,
    v0: springV0,
    damping: springDamping
  }), [springMass, springK, springX0, springV0, springDamping])

  const doublePendulumParams = useMemo(() => ({
    L1: doubleL1,
    L2: doubleL2,
    m1: doubleM1,
    m2: doubleM2,
    theta1_0: doubleTheta1_0,
    theta2_0: doubleTheta2_0,
    omega1_0: doubleOmega1_0,
    omega2_0: doubleOmega2_0,
    damping: doubleDamping
  }), [doubleL1, doubleL2, doubleM1, doubleM2, doubleTheta1_0, doubleTheta2_0, doubleOmega1_0, doubleOmega2_0, doubleDamping])

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

  // ========================================================================
  // ACTUALIZAR PARÁMETROS: Setea primitivos según tipo de oscilador
  // ========================================================================
  const updateParameter = useCallback((paramName, value) => {
    if (oscillatorType === 'PENDULUM') {
      if (paramName === 'length') setPendulumLength(value)
      else if (paramName === 'mass') setPendulumMass(value)
      else if (paramName === 'theta0') setPendulumTheta0(value)
      else if (paramName === 'omega0') setPendulumOmega0(value)
      else if (paramName === 'damping') setPendulumDamping(value)
    } else if (oscillatorType === 'SPRING_MASS') {
      if (paramName === 'mass') setSpringMass(value)
      else if (paramName === 'k') setSpringK(value)
      else if (paramName === 'x0') setSpringX0(value)
      else if (paramName === 'v0') setSpringV0(value)
      else if (paramName === 'damping') setSpringDamping(value)
    } else if (oscillatorType === 'DOUBLE_PENDULUM') {
      if (paramName === 'L1') setDoubleL1(value)
      else if (paramName === 'L2') setDoubleL2(value)
      else if (paramName === 'm1') setDoubleM1(value)
      else if (paramName === 'm2') setDoubleM2(value)
      else if (paramName === 'theta1_0') setDoubleTheta1_0(value)
      else if (paramName === 'theta2_0') setDoubleTheta2_0(value)
      else if (paramName === 'omega1_0') setDoubleOmega1_0(value)
      else if (paramName === 'omega2_0') setDoubleOmega2_0(value)
      else if (paramName === 'damping') setDoubleDamping(value)
    }
  }, [oscillatorType])

  // ========================================================================
  // USEEFFECT: Loop de animación separado (solo depende de isRunning)
  // ========================================================================
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

  // ========================================================================
  // USEEFFECT: Setup inicial y al cambiar parámetros
  // ========================================================================
  useEffect(() => {
    setupSimulation()
  }, [oscillatorType, pendulumParams, springParams, doublePendulumParams])

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
