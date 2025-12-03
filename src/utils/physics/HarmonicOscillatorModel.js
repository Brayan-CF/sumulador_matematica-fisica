// ============================================================================
// PHYMATH-SIM: MODELO DE OSCILADOR ARMÓNICO
// ============================================================================
// PROPÓSITO: Simula sistemas de péndulos y resortes
// SIMPLICIDAD: Física primero, complejidad nunca
// ============================================================================

export const OSCILLATOR_TYPES = {
  PENDULUM: 'PENDULUM',
  SPRING_MASS: 'SPRING_MASS',
  DOUBLE_PENDULUM: 'DOUBLE_PENDULUM'
}

// ============================================================================
// SIMULADOR DE OSCILADOR ARMÓNICO
// ============================================================================
export class HarmonicOscillatorSimulator {
  constructor() {
    this.gravity = 9.81
    this.dt = 0.016
    this.reset()
  }

  reset() {
    this.time = 0
    this.state = {}
    this.trajectory = []
    this.phaseSpace = []
    this.type = null
    this.params = {}
    this.analytics = {}
  }

  // --------------------------------------------------------------------------
  // CONFIGURAR PÉNDULO
  // --------------------------------------------------------------------------
  setupSimplePendulum({ length = 1.0, mass = 1.0, theta0 = 0.1, omega0 = 0, damping = 0 }) {
    this.type = OSCILLATOR_TYPES.PENDULUM
    this.params = { length, mass, damping }
    this.state = {
      theta: theta0,
      omega: omega0,
      energy: { total: 0 }
    }
    this.trajectory = [{ ...this.state, t: 0 }]
    this.phaseSpace = [{ theta: theta0, omega: omega0, t: 0 }]
    this.analytics = {
      period: 2 * Math.PI * Math.sqrt(length / this.gravity)
    }
  }

  // --------------------------------------------------------------------------
  // CONFIGURAR RESORTE-MASA
  // --------------------------------------------------------------------------
  setupSpringMass({ mass = 1.0, k = 10.0, x0 = 0.1, v0 = 0, damping = 0 }) {
    this.type = OSCILLATOR_TYPES.SPRING_MASS
    this.params = { mass, k, damping }
    this.state = {
      x: x0,
      v: v0,
      energy: { total: 0 }
    }
    this.trajectory = [{ ...this.state, t: 0 }]
    this.phaseSpace = [{ x: x0, v: v0, t: 0 }]
    this.analytics = {
      period: 2 * Math.PI * Math.sqrt(mass / k)
    }
  }

  // --------------------------------------------------------------------------
  // CONFIGURAR PÉNDULO DOBLE
  // --------------------------------------------------------------------------
  setupDoublePendulum({ L1 = 1.0, L2 = 1.0, m1 = 1.0, m2 = 1.0, 
                         theta1_0 = 0.1, theta2_0 = 0.1, 
                         omega1_0 = 0, omega2_0 = 0, damping = 0 }) {
    this.type = OSCILLATOR_TYPES.DOUBLE_PENDULUM
    this.params = { L1, L2, m1, m2, damping }
    this.state = {
      theta1: theta1_0,
      theta2: theta2_0,
      omega1: omega1_0,
      omega2: omega2_0,
      energy: { total: 0 }
    }
    this.trajectory = [{ ...this.state, t: 0 }]
    this.phaseSpace = [{ theta1: theta1_0, omega1: omega1_0, t: 0 }]
    this.analytics = { period: 0 }
  }

  // --------------------------------------------------------------------------
  // ACTUALIZAR SIMULACIÓN
  // --------------------------------------------------------------------------
  update() {
    if (this.type === OSCILLATOR_TYPES.PENDULUM) {
      this.updatePendulum()
    } else if (this.type === OSCILLATOR_TYPES.SPRING_MASS) {
      this.updateSpring()
    } else if (this.type === OSCILLATOR_TYPES.DOUBLE_PENDULUM) {
      this.updateDoublePendulum()
    }
    this.time += this.dt
  }

  step(dt) {
    if (dt) this.dt = dt
    this.update()
  }

  // --------------------------------------------------------------------------
  // FÍSICA DEL PÉNDULO (Runge-Kutta 4)
  // --------------------------------------------------------------------------
  updatePendulum() {
    const { length, damping } = this.params
    const { theta, omega } = this.state
    const g_L = this.gravity / length

    const k1_theta = omega
    const k1_omega = -g_L * Math.sin(theta) - damping * omega

    const k2_theta = omega + 0.5 * this.dt * k1_omega
    const k2_omega = -g_L * Math.sin(theta + 0.5 * this.dt * k1_theta) - damping * (omega + 0.5 * this.dt * k1_omega)

    const k3_theta = omega + 0.5 * this.dt * k2_omega
    const k3_omega = -g_L * Math.sin(theta + 0.5 * this.dt * k2_theta) - damping * (omega + 0.5 * this.dt * k2_omega)

    const k4_theta = omega + this.dt * k3_omega
    const k4_omega = -g_L * Math.sin(theta + this.dt * k3_theta) - damping * (omega + this.dt * k3_omega)

    this.state.theta += (this.dt / 6) * (k1_theta + 2 * k2_theta + 2 * k3_theta + k4_theta)
    this.state.omega += (this.dt / 6) * (k1_omega + 2 * k2_omega + 2 * k3_omega + k4_omega)

    this.trajectory.push({ ...this.state, t: this.time })
    this.phaseSpace.push({ theta: this.state.theta, omega: this.state.omega, t: this.time })
  }

  // --------------------------------------------------------------------------
  // FÍSICA DEL RESORTE (Runge-Kutta 4)
  // --------------------------------------------------------------------------
  updateSpring() {
    const { mass, k, damping } = this.params
    const { x, v } = this.state
    const k_m = k / mass
    const damp_m = damping / mass

    const k1_x = v
    const k1_v = -k_m * x - damp_m * v

    const k2_x = v + 0.5 * this.dt * k1_v
    const k2_v = -k_m * (x + 0.5 * this.dt * k1_x) - damp_m * (v + 0.5 * this.dt * k1_v)

    const k3_x = v + 0.5 * this.dt * k2_v
    const k3_v = -k_m * (x + 0.5 * this.dt * k2_x) - damp_m * (v + 0.5 * this.dt * k2_v)

    const k4_x = v + this.dt * k3_v
    const k4_v = -k_m * (x + this.dt * k3_x) - damp_m * (v + this.dt * k3_v)

    this.state.x += (this.dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x)
    this.state.v += (this.dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v)

    this.trajectory.push({ ...this.state, t: this.time })
    this.phaseSpace.push({ x: this.state.x, v: this.state.v, t: this.time })
  }

  // --------------------------------------------------------------------------
  // FÍSICA DEL PÉNDULO DOBLE (Simplificado)
  // --------------------------------------------------------------------------
  updateDoublePendulum() {
    const { L1, L2, m1, m2, damping } = this.params
    const { theta1, theta2, omega1, omega2 } = this.state
    
    const delta = theta2 - theta1
    const den1 = (m1 + m2) * L1 - m2 * L1 * Math.cos(delta) * Math.cos(delta)
    const den2 = (L2 / L1) * den1

    const alpha1 = (m2 * L1 * omega1 * omega1 * Math.sin(delta) * Math.cos(delta) +
                   m2 * this.gravity * Math.sin(theta2) * Math.cos(delta) +
                   m2 * L2 * omega2 * omega2 * Math.sin(delta) -
                   (m1 + m2) * this.gravity * Math.sin(theta1)) / den1 - damping * omega1

    const alpha2 = (-m2 * L2 * omega2 * omega2 * Math.sin(delta) * Math.cos(delta) +
                   (m1 + m2) * this.gravity * Math.sin(theta1) * Math.cos(delta) -
                   (m1 + m2) * L1 * omega1 * omega1 * Math.sin(delta) -
                   (m1 + m2) * this.gravity * Math.sin(theta2)) / den2 - damping * omega2

    this.state.omega1 += alpha1 * this.dt
    this.state.omega2 += alpha2 * this.dt
    this.state.theta1 += this.state.omega1 * this.dt
    this.state.theta2 += this.state.omega2 * this.dt

    this.trajectory.push({ ...this.state, t: this.time })
    this.phaseSpace.push({ theta1: this.state.theta1, omega1: this.state.omega1, t: this.time })
  }

  // --------------------------------------------------------------------------
  // MÉTODOS DE DIBUJO
  // --------------------------------------------------------------------------
  drawPendulum(ctx, width, height) {
    const centerX = width / 2
    const centerY = 100
    const scale = 150
    const { length } = this.params
    const { theta } = this.state
    
    const x = centerX + scale * length * Math.sin(theta)
    const y = centerY + scale * length * Math.cos(theta)
    
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    ctx.fillStyle = '#007bff'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    ctx.fill()
  }

  drawSpringMass(ctx, width, height) {
    const centerY = height / 2
    const scale = 50
    const { x } = this.state
    
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = '#333'
    ctx.fillRect(50, centerY - 60, 10, 120)
    
    const springStart = 60
    const springEnd = width / 2 + scale * x
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(springStart, centerY)
    for (let i = 0; i <= 10; i++) {
      const xPos = springStart + (springEnd - springStart) * (i / 10)
      const yOffset = (i % 2 === 0) ? 20 : -20
      ctx.lineTo(xPos, centerY + yOffset)
    }
    ctx.lineTo(springEnd, centerY)
    ctx.stroke()
    
    ctx.fillStyle = '#28a745'
    ctx.fillRect(springEnd - 25, centerY - 25, 50, 50)
  }

  drawDoublePendulum(ctx, width, height) {
    const centerX = width / 2
    const centerY = 100
    const scale = 150
    const { L1, L2 } = this.params
    const { theta1, theta2 } = this.state
    
    const x1 = centerX + scale * L1 * Math.sin(theta1)
    const y1 = centerY + scale * L1 * Math.cos(theta1)
    const x2 = x1 + scale * L2 * Math.sin(theta2)
    const y2 = y1 + scale * L2 * Math.cos(theta2)
    
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    
    ctx.fillStyle = '#dc3545'
    ctx.beginPath()
    ctx.arc(x1, y1, 15, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = '#ffc107'
    ctx.beginPath()
    ctx.arc(x2, y2, 15, 0, 2 * Math.PI)
    ctx.fill()
  }

  drawPhaseSpace(ctx, width, height) {
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)
    
    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()
    
    if (this.phaseSpace.length > 1) {
      ctx.strokeStyle = '#007bff'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const scale = 100
      this.phaseSpace.forEach((point, i) => {
        const pos = point.theta !== undefined ? point.theta : point.x
        const vel = point.omega !== undefined ? point.omega : point.v
        const x = width / 2 + pos * scale
        const y = height / 2 - vel * scale
        
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }
  }

  drawEnergyGraph(ctx, width, height) {
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)
    
    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(50, 0)
    ctx.lineTo(50, height - 30)
    ctx.lineTo(width, height - 30)
    ctx.stroke()
    
    if (this.trajectory.length > 1) {
      const maxEnergy = Math.max(...this.trajectory.map(p => p.energy?.total || 0))
      const scaleY = (height - 50) / (maxEnergy || 1)
      const scaleX = (width - 60) / this.trajectory.length
      
      ctx.strokeStyle = '#28a745'
      ctx.lineWidth = 2
      ctx.beginPath()
      this.trajectory.forEach((point, i) => {
        const x = 50 + i * scaleX
        const y = height - 30 - (point.energy?.total || 0) * scaleY
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }
  }

  // --------------------------------------------------------------------------
  // MÉTODOS GETTER
  // --------------------------------------------------------------------------
  getCurrentState() {
    return { ...this.state, time: this.time }
  }

  getAnalytics() {
    return this.analytics
  }
}
