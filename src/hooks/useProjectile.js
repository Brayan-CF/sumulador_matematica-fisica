// ============================================================================
// PHYMATH-SIM: HOOK DE MOVIMIENTO PROYECTIL
// ============================================================================
// PROPÓSITO: Gestiona el estado y cálculos de la simulación de proyectiles
// ============================================================================

import { useState, useCallback, useEffect } from 'react'
import * as Model from '../utils/physics/ProjectileModel.js'

const PLANETS = [
  { name: 'Tierra', gravity: 9.81, color: '#007bff' },
  { name: 'Luna', gravity: 1.6, color: '#6c757d' },
  { name: 'Marte', gravity: 3.7, color: '#dc3545' },
  { name: 'Júpiter', gravity: 24.8, color: '#fd7e14' }
]

const TRAJECTORY_COLORS = ['#dc3545', '#007bff', '#28a745', '#ffc107', '#6f42c1']

export function useProjectile() {
  const [velocity, setVelocity] = useState(50)
  const [angle, setAngle] = useState(45)
  const [gravity, setGravity] = useState(9.81)
  const [airResistance, setAirResistance] = useState(0)
  const [numProjectiles, setNumProjectiles] = useState(1)
  const [showTrail, setShowTrail] = useState(true)
  const [showVectors, setShowVectors] = useState(false)
  const [trajectories, setTrajectories] = useState([])
  const [results, setResults] = useState({
    alcanceMax: 0,
    alturaMax: 0,
    timeTotal: 0,
    finalVelocity: 0,
    initialEnergy: 0,
    optimalAngle: 45
  })
  const [comparisonResults, setComparisonResults] = useState([])

  const simulate = useCallback(() => {
    Model.setGravity(gravity)

    const timeTotal = Model.calculateTimeTotal(velocity, angle)
    const alcanceMax = Model.calculateAlcanceMax(velocity, angle)
    const alturaMax = Model.calculateAlturaMax(velocity, angle)
    const finalVelocity = Model.calculateFinalVelocity(velocity, angle)
    const initialEnergy = Model.calculateInitialEnergy(velocity)
    const optimalAngle = Model.calculateOptimalAngle()

    setResults({ alcanceMax, alturaMax, timeTotal, finalVelocity, initialEnergy, optimalAngle })

    const newTrajectories = []
    
    if (numProjectiles === 1) {
      const points = []
      const timeStep = 0.05
      let t = 0
      
      while (t <= timeTotal) {
        const pos = Model.calculatePosition(velocity, angle, t, airResistance)
        if (pos.y >= 0) points.push(pos)
        t += timeStep
      }
      
      newTrajectories.push({ 
        points, 
        angle, 
        color: '#dc3545',
        name: `${angle}° (${velocity} m/s)`
      })
    } else {
      for (let i = 0; i < numProjectiles; i++) {
        const angleOffset = (i - Math.floor(numProjectiles/2)) * 5
        const currentAngle = angle + angleOffset
        const currentTimeTotal = Model.calculateTimeTotal(velocity, currentAngle)
        
        const points = []
        const timeStep = 0.05
        let t = 0
        
        while (t <= currentTimeTotal) {
          const pos = Model.calculatePosition(velocity, currentAngle, t, airResistance)
          if (pos.y >= 0) points.push(pos)
          t += timeStep
        }
        
        newTrajectories.push({
          points,
          angle: currentAngle,
          color: TRAJECTORY_COLORS[i % TRAJECTORY_COLORS.length],
          name: `${currentAngle}° (${velocity} m/s)`
        })
      }
    }

    setTrajectories(newTrajectories)
    setComparisonResults([])
  }, [velocity, angle, gravity, airResistance, numProjectiles])

  const comparePlanets = useCallback(() => {
    const planetTrajectories = PLANETS.map(planet => {
      Model.setGravity(planet.gravity)
      const timeTotal = Model.calculateTimeTotal(velocity, angle)
      const points = []
      const timeStep = 0.05

      for (let t = 0; t <= timeTotal; t += timeStep) {
        const pos = Model.calculatePosition(velocity, angle, t)
        if (pos.y >= 0) points.push(pos)
      }

      const range = Model.calculateAlcanceMax(velocity, angle)
      const height = Model.calculateAlturaMax(velocity, angle)
      const time = Model.calculateTimeTotal(velocity, angle)

      return {
        points,
        angle,
        color: planet.color,
        name: planet.name,
        gravity: planet.gravity,
        metrics: {
          range: range.toFixed(1),
          height: height.toFixed(1),
          time: time.toFixed(1)
        }
      }
    })

    setTrajectories(planetTrajectories)
    setComparisonResults(planetTrajectories)
    Model.setGravity(gravity)
  }, [velocity, angle, gravity])

  const reset = useCallback(() => {
    setVelocity(50)
    setAngle(45)
    setGravity(9.81)
    setAirResistance(0)
    setNumProjectiles(1)
    setShowTrail(true)
    setShowVectors(false)
    setTrajectories([])
    setComparisonResults([])
    setResults({
      alcanceMax: 0,
      alturaMax: 0,
      timeTotal: 0,
      finalVelocity: 0,
      initialEnergy: 0,
      optimalAngle: 45
    })
  }, [])

  useEffect(() => {
    if (comparisonResults.length === 0) {
      simulate()
    }
  }, [simulate, comparisonResults.length])

  return {
    velocity,
    angle,
    gravity,
    airResistance,
    numProjectiles,
    showTrail,
    showVectors,
    trajectories,
    results,
    comparisonResults,
    
    setVelocity,
    setAngle,
    setGravity,
    setAirResistance,
    setNumProjectiles,
    setShowTrail,
    setShowVectors,
    
    simulate,
    comparePlanets,
    reset
  }
}
