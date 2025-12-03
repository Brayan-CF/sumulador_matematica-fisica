// ============================================================================
// PHYMATH-SIM: MODELO DE PROYECTILES
// ============================================================================
// PROPÓSITO: Simula movimiento proyectil con gravedad y resistencia del aire
// SIMPLICIDAD: Física limpia sin código innecesario
// ============================================================================

export const PLANETS = {
  EARTH: { name: 'Tierra', gravity: 9.81, color: '#4A90E2' },
  MOON: { name: 'Luna', gravity: 1.6, color: '#C5C5C5' },
  MARS: { name: 'Marte', gravity: 3.7, color: '#E74C3C' },
  JUPITER: { name: 'Júpiter', gravity: 24.8, color: '#F39C12' }
}

export const PROJECTILE_MATERIALS = {
  BALL: { name: 'Pelota', mass: 0.145, dragCoeff: 0.47, radius: 0.037, color: '#FF6B6B' },
  BULLET: { name: 'Bala', mass: 0.004, dragCoeff: 0.295, radius: 0.004, color: '#4ECDC4' },
  ARROW: { name: 'Flecha', mass: 0.02, dragCoeff: 0.04, radius: 0.004, color: '#45B7D1' },
  STONE: { name: 'Piedra', mass: 0.5, dragCoeff: 0.6, radius: 0.05, color: '#FFEAA7' }
}

// ============================================================================
// SIMULADOR MULTI-PROYECTIL
// ============================================================================
export class MultiProjectileSimulator {
  constructor() {
    this.projectiles = []
    this.nextId = 1
    this.gravity = 9.81
    this.airDensity = 1.225
    this.time = 0
    this.dt = 0.01
  }

  addProjectile({ v0, angle, material = PROJECTILE_MATERIALS.BALL, position = { x: 0, y: 0 }, color = null }) {
    const angleRad = angle * Math.PI / 180
    const projectile = {
      id: this.nextId++,
      v0,
      angle: angleRad,
      material,
      color: color || material.color,
      position: { ...position },
      velocity: {
        x: v0 * Math.cos(angleRad),
        y: v0 * Math.sin(angleRad)
      },
      trajectory: [{ ...position, t: 0 }],
      active: true,
      landingData: null
    }
    
    this.projectiles.push(projectile)
    return projectile.id
  }

  calculateAirResistance(velocity, material) {
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
    if (speed === 0) return { x: 0, y: 0 }

    const area = Math.PI * material.radius ** 2
    const dragMagnitude = 0.5 * this.airDensity * material.dragCoeff * area * speed ** 2
    
    return {
      x: -dragMagnitude * (velocity.x / speed),
      y: -dragMagnitude * (velocity.y / speed)
    }
  }

  update() {
    this.time += this.dt

    this.projectiles.forEach(proj => {
      if (!proj.active) return

      const drag = this.calculateAirResistance(proj.velocity, proj.material)
      const ax = drag.x / proj.material.mass
      const ay = -this.gravity + (drag.y / proj.material.mass)

      proj.velocity.x += ax * this.dt
      proj.velocity.y += ay * this.dt
      proj.position.x += proj.velocity.x * this.dt
      proj.position.y += proj.velocity.y * this.dt

      proj.trajectory.push({ ...proj.position, t: this.time })

      if (proj.position.y <= 0 && proj.velocity.y < 0) {
        proj.position.y = 0
        proj.active = false
        proj.landingData = {
          range: proj.position.x,
          time: this.time,
          impact: Math.sqrt(proj.velocity.x ** 2 + proj.velocity.y ** 2)
        }
      }
    })
  }

  removeProjectile(id) {
    this.projectiles = this.projectiles.filter(p => p.id !== id)
  }

  clearAll() {
    this.projectiles = []
    this.time = 0
  }

  setGravity(g) {
    this.gravity = g
  }

  getProjectiles() {
    return this.projectiles
  }

  getMaxHeight(v0, angle) {
    const angleRad = angle * Math.PI / 180
    const vy = v0 * Math.sin(angleRad)
    return (vy ** 2) / (2 * this.gravity)
  }

  getRange(v0, angle) {
    const angleRad = angle * Math.PI / 180
    return (v0 ** 2 * Math.sin(2 * angleRad)) / this.gravity
  }

  getFlightTime(v0, angle) {
    const angleRad = angle * Math.PI / 180
    const vy = v0 * Math.sin(angleRad)
    return (2 * vy) / this.gravity
  }

  getActiveProjectiles() {
    return this.projectiles.filter(p => p.active)
  }

  getAllTrajectories() {
    return this.projectiles.map(p => ({
      id: p.id,
      color: p.color,
      trajectory: p.trajectory,
      name: p.material.name,
      gravity: this.gravity
    }))
  }
}

// ============================================================================
// FUNCIONES AUXILIARES SIMPLES
// ============================================================================
let currentGravity = 9.81

export function setGravity(g) {
  currentGravity = g
}

export function calculateTimeTotal(v0, angleDeg) {
  const angleRad = angleDeg * Math.PI / 180
  const vy = v0 * Math.sin(angleRad)
  return (2 * vy) / currentGravity
}

export function calculateAlcanceMax(v0, angleDeg) {
  const angleRad = angleDeg * Math.PI / 180
  return (v0 ** 2 * Math.sin(2 * angleRad)) / currentGravity
}

export function calculateAlturaMax(v0, angleDeg) {
  const angleRad = angleDeg * Math.PI / 180
  const vy = v0 * Math.sin(angleRad)
  return (vy ** 2) / (2 * currentGravity)
}

export function calculateFinalVelocity(v0, angleDeg) {
  return v0
}

export function calculateInitialEnergy(v0) {
  const mass = 1
  return 0.5 * mass * v0 ** 2
}

export function calculateOptimalAngle() {
  return 45
}

export function calculatePosition(v0, angleDeg, t, airResistance = 0) {
  const angleRad = angleDeg * Math.PI / 180
  const vx = v0 * Math.cos(angleRad)
  const vy = v0 * Math.sin(angleRad)
  
  return {
    x: vx * t,
    y: vy * t - 0.5 * currentGravity * t ** 2,
    t
  }
}
