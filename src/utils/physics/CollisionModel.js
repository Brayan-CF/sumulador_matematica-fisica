// ============================================================================
// PHYMATH-SIM: MODELO DE COLISIONES
// ============================================================================
// PROPÓSITO: Simula colisiones elásticas e inelásticas entre objetos
// SIMPLICIDAD: La física funciona, la complejidad no
// ============================================================================

export const MATERIALS = {
  STEEL: { density: 7850, restitution: 0.9, color: '#C0C0C0' },
  RUBBER: { density: 1500, restitution: 0.8, color: '#8B4513' },
  WOOD: { density: 600, restitution: 0.5, color: '#DEB887' },
  ALUMINUM: { density: 2700, restitution: 0.7, color: '#B0B0B0' }
}

// ============================================================================
// OBJETO DE COLISIÓN
// ============================================================================
export class CollisionObject {
  constructor({ id, mass = 1.0, radius = 0.5, position = { x: 0, y: 0 }, 
                velocity = { x: 0, y: 0 }, material = MATERIALS.STEEL, fixed = false }) {
    this.id = id
    this.mass = mass
    this.radius = radius
    this.position = { ...position }
    this.velocity = { ...velocity }
    this.material = material
    this.color = material.color
    this.fixed = fixed
    this.trajectory = []
  }

  update(dt, bounds) {
    if (this.fixed) return

    this.position.x += this.velocity.x * dt
    this.position.y += this.velocity.y * dt

    // Colisiones con paredes
    if (this.position.x - this.radius < bounds.left) {
      this.position.x = bounds.left + this.radius
      this.velocity.x *= -this.material.restitution
    }
    if (this.position.x + this.radius > bounds.right) {
      this.position.x = bounds.right - this.radius
      this.velocity.x *= -this.material.restitution
    }
    if (this.position.y - this.radius < bounds.top) {
      this.position.y = bounds.top + this.radius
      this.velocity.y *= -this.material.restitution
    }
    if (this.position.y + this.radius > bounds.bottom) {
      this.position.y = bounds.bottom - this.radius
      this.velocity.y *= -this.material.restitution
    }

    this.trajectory.push({ ...this.position })
    if (this.trajectory.length > 500) this.trajectory.shift()
  }

  checkCollision(other) {
    const dx = other.position.x - this.position.x
    const dy = other.position.y - this.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < (this.radius + other.radius)
  }

  separate(other) {
    const dx = other.position.x - this.position.x
    const dy = other.position.y - this.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const overlap = (this.radius + other.radius) - distance

    if (overlap > 0 && distance > 0) {
      const nx = dx / distance
      const ny = dy / distance
      
      if (!this.fixed && !other.fixed) {
        const totalMass = this.mass + other.mass
        const pushThis = overlap * (other.mass / totalMass)
        const pushOther = overlap * (this.mass / totalMass)
        this.position.x -= nx * pushThis
        this.position.y -= ny * pushThis
        other.position.x += nx * pushOther
        other.position.y += ny * pushOther
      } else if (!this.fixed) {
        this.position.x -= nx * overlap
        this.position.y -= ny * overlap
      } else if (!other.fixed) {
        other.position.x += nx * overlap
        other.position.y += ny * overlap
      }
    }
  }
}

// ============================================================================
// SIMULADOR DE COLISIONES
// ============================================================================
export class CollisionSimulator {
  constructor(bounds = { left: 0, top: 0, right: 10, bottom: 10 }) {
    this.objects = []
    this.bounds = bounds
    this.time = 0
    this.dt = 0.016
    this.nextId = 1
    this.totalCollisions = 0
    this.showTrajectories = true
    this.gravity = { x: 0, y: 0 }
  }

  addObject(config) {
    const obj = new CollisionObject({ ...config, id: this.nextId++ })
    this.objects.push(obj)
    return obj.id
  }

  removeObject(id) {
    this.objects = this.objects.filter(obj => obj.id !== id)
  }

  clear() {
    this.objects = []
    this.time = 0
    this.totalCollisions = 0
    this.nextId = 1
  }

  update() {
    this.time += this.dt

    // Aplicar gravedad
    if (this.gravity.x !== 0 || this.gravity.y !== 0) {
      this.objects.forEach(obj => {
        if (!obj.fixed) {
          obj.velocity.x += this.gravity.x * this.dt
          obj.velocity.y += this.gravity.y * this.dt
        }
      })
    }

    // Actualizar posiciones
    this.objects.forEach(obj => obj.update(this.dt, this.bounds))

    // Manejar colisiones
    this.handleCollisions()
  }

  handleCollisions() {
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const obj1 = this.objects[i]
        const obj2 = this.objects[j]

        if (obj1.checkCollision(obj2)) {
          this.resolveCollision(obj1, obj2)
          this.totalCollisions++
        }
      }
    }
  }

  resolveCollision(obj1, obj2) {
    obj1.separate(obj2)

    const dx = obj2.position.x - obj1.position.x
    const dy = obj2.position.y - obj1.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance === 0) return

    const nx = dx / distance
    const ny = dy / distance

    const dvx = obj2.velocity.x - obj1.velocity.x
    const dvy = obj2.velocity.y - obj1.velocity.y
    const dvn = dvx * nx + dvy * ny

    if (dvn > 0) return

    const restitution = (obj1.material.restitution + obj2.material.restitution) / 2
    const impulse = -(1 + restitution) * dvn / ((1 / obj1.mass) + (1 / obj2.mass))

    if (!obj1.fixed) {
      obj1.velocity.x -= (impulse / obj1.mass) * nx
      obj1.velocity.y -= (impulse / obj1.mass) * ny
    }
    if (!obj2.fixed) {
      obj2.velocity.x += (impulse / obj2.mass) * nx
      obj2.velocity.y += (impulse / obj2.mass) * ny
    }
  }

  getTotalEnergy() {
    return this.objects.reduce((sum, obj) => {
      const speed = Math.sqrt(obj.velocity.x ** 2 + obj.velocity.y ** 2)
      return sum + 0.5 * obj.mass * speed * speed
    }, 0)
  }

  getTotalMomentum() {
    const momentum = this.objects.reduce((sum, obj) => ({
      x: sum.x + obj.mass * obj.velocity.x,
      y: sum.y + obj.mass * obj.velocity.y
    }), { x: 0, y: 0 })
    
    momentum.magnitude = Math.sqrt(momentum.x ** 2 + momentum.y ** 2)
    return momentum
  }

  getObjects() {
    return this.objects
  }

  setBounds(bounds) {
    this.bounds = bounds
  }

  setGravity(x = 0, y = 0) {
    this.gravity = { x, y }
  }

  draw(ctx, width, height) {
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, width, height)
    
    const scaleX = width / (this.bounds.right - this.bounds.left)
    const scaleY = height / (this.bounds.bottom - this.bounds.top)
    
    ctx.strokeStyle = '#dee2e6'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, width, height)
    
    this.objects.forEach(obj => {
      const x = (obj.position.x - this.bounds.left) * scaleX
      const y = (obj.position.y - this.bounds.top) * scaleY
      const radius = obj.radius * scaleX
      
      // Trayectoria
      if (this.showTrajectories && obj.trajectory.length > 1) {
        ctx.strokeStyle = obj.color
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        obj.trajectory.forEach((pos, i) => {
          const tx = (pos.x - this.bounds.left) * scaleX
          const ty = (pos.y - this.bounds.top) * scaleY
          if (i === 0) ctx.moveTo(tx, ty)
          else ctx.lineTo(tx, ty)
        })
        ctx.stroke()
        ctx.globalAlpha = 1.0
      }
      
      // Objeto
      ctx.fillStyle = obj.color
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = '#0056b3'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Vector de velocidad
      const velScale = 20
      ctx.strokeStyle = '#28a745'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + obj.velocity.x * velScale, y + obj.velocity.y * velScale)
      ctx.stroke()
      
      // ID
      ctx.fillStyle = '#000'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(obj.id, x, y)
    })
  }
}
