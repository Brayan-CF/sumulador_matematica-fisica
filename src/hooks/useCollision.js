// ============================================================================
// PHYMATH-SIM: HOOK DE COLISIONES
// ============================================================================
// PROPÓSITO: Gestiona el estado de la simulación y el bucle de animación
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import { CollisionSimulator, MATERIALS } from '../utils/physics/CollisionModel'

export function useCollision() {
  const simulatorRef = useRef(null)
  const animationRef = useRef(null)

  const [isRunning, setIsRunning] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('head-on')
  const [showTrajectories, setShowTrajectories] = useState(true)
  const [statistics, setStatistics] = useState({})
  const [gravity, setGravity] = useState({ x: 0, y: 0 })

  const [newObjectConfig, setNewObjectConfig] = useState({
    mass: 1,
    radius: 0.5,
    posX: 2,
    posY: 2,
    velX: 1,
    velY: 0,
    material: 'STEEL'
  })

  const initializeSimulator = useCallback((canvasWidth, canvasHeight) => {
    const bounds = {
      left: 0,
      top: 0,
      right: canvasWidth / 50,
      bottom: canvasHeight / 50
    }
    simulatorRef.current = new CollisionSimulator(bounds)
  }, [])

  const setupPreset = useCallback((presetName) => {
    const sim = simulatorRef.current
    if (!sim) return

    sim.clear()

    const presets = {
      'head-on': [
        { position: { x: 2, y: 5 }, velocity: { x: 1, y: 0 }, mass: 1, radius: 0.5, material: MATERIALS.STEEL },
        { position: { x: 8, y: 5 }, velocity: { x: -1, y: 0 }, mass: 1, radius: 0.5, material: MATERIALS.STEEL }
      ],
      'oblique': [
        { position: { x: 2, y: 3 }, velocity: { x: 1, y: 1 }, mass: 1.5, radius: 0.6, material: MATERIALS.ALUMINUM },
        { position: { x: 8, y: 7 }, velocity: { x: -0.5, y: -0.5 }, mass: 1, radius: 0.5, material: MATERIALS.WOOD }
      ],
      'multiple': [
        { position: { x: 3, y: 5 }, velocity: { x: 2, y: 0 }, mass: 2, radius: 0.4, material: MATERIALS.STEEL },
        { position: { x: 7, y: 5 }, velocity: { x: 0, y: 0 }, mass: 1.5, radius: 0.5, material: MATERIALS.RUBBER },
        { position: { x: 5, y: 3 }, velocity: { x: 0, y: 1 }, mass: 1, radius: 0.3, material: MATERIALS.WOOD },
        { position: { x: 5, y: 7 }, velocity: { x: 0, y: -0.5 }, mass: 0.8, radius: 0.35, material: MATERIALS.ALUMINUM }
      ]
    }

    const config = presets[presetName] || presets['head-on']
    config.forEach(obj => sim.addObject(obj))
  }, [])

  const addObject = useCallback(() => {
    const sim = simulatorRef.current
    if (!sim) return

    sim.addObject({
      position: { x: newObjectConfig.posX, y: newObjectConfig.posY },
      velocity: { x: newObjectConfig.velX, y: newObjectConfig.velY },
      mass: newObjectConfig.mass,
      radius: newObjectConfig.radius,
      material: MATERIALS[newObjectConfig.material]
    })
  }, [newObjectConfig])

  const removeObject = useCallback((id) => {
    simulatorRef.current?.removeObject(id)
  }, [])

  const clearAll = useCallback(() => {
    simulatorRef.current?.clear()
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    pause()
    setupPreset(selectedPreset)
  }, [pause, setupPreset, selectedPreset])

  const updateNewObjectParam = useCallback((param, value) => {
    setNewObjectConfig(prev => ({ ...prev, [param]: value }))
  }, [])

  const updateGravity = useCallback((x, y) => {
    setGravity({ x, y })
    simulatorRef.current?.setGravity(x, y)
  }, [])

  const updateStatistics = useCallback(() => {
    const sim = simulatorRef.current
    if (!sim) return

    setStatistics({
      totalObjects: sim.objects.length,
      totalCollisions: sim.totalCollisions,
      totalEnergy: sim.getTotalEnergy().toFixed(2),
      totalMomentum: sim.getTotalMomentum().magnitude.toFixed(2)
    })
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const animate = () => {
      const sim = simulatorRef.current
      if (sim) {
        sim.update()
        updateStatistics()
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, updateStatistics])

  return {
    isRunning,
    selectedPreset,
    showTrajectories,
    statistics,
    gravity,
    newObjectConfig,
    simulatorRef,
    
    setSelectedPreset,
    setShowTrajectories,
    updateNewObjectParam,
    updateGravity,
    initializeSimulator,
    setupPreset,
    addObject,
    removeObject,
    clearAll,
    start,
    pause,
    reset
  }
}
