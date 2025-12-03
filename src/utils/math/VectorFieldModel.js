// ============================================================================
// PHYMATH-SIM: MODELO DE CAMPO VECTORIAL
// ============================================================================
// PROPÓSITO: Cálculos y visualización de campos vectoriales 2D
// SIMPLICIDAD: Las matemáticas funcionan, la verbosidad no
// ============================================================================

export const VECTOR_FIELD_TYPES = {
  RADIAL: 'radial',
  CIRCULAR: 'circular',
  UNIFORM: 'uniform',
  GRAVITY: 'gravity',
  SADDLE: 'saddle',
  SPIRAL: 'spiral'
}

// ============================================================================
// MODELO DE CAMPO VECTORIAL
// ============================================================================
class VectorFieldModel {
  static radial(x, y) {
    const mag = Math.sqrt(x * x + y * y)
    return mag === 0 ? { x: 0, y: 0 } : { x: x / mag, y: y / mag }
  }

  static circular(x, y) {
    return { x: -y, y: x }
  }

  static uniform(x, y) {
    return { x: 1, y: 0 }
  }

  static gravity(x, y) {
    return { x: 0, y: 1 }
  }

  static saddle(x, y) {
    return { x: x, y: -y }
  }

  static spiral(x, y) {
    return { x: -y - 0.1 * x, y: x - 0.1 * y }
  }

  static getField(type, x, y, scale = 1) {
    let vector
    switch (type) {
      case 'radial': vector = this.radial(x, y); break
      case 'circular': vector = this.circular(x, y); break
      case 'uniform': vector = this.uniform(x, y); break
      case 'gravity': vector = this.gravity(x, y); break
      case 'saddle': vector = this.saddle(x, y); break
      case 'spiral': vector = this.spiral(x, y); break
      default: vector = { x: 0, y: 0 }
    }
    return { x: vector.x * scale, y: vector.y * scale }
  }

  static normalize(vector) {
    const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2)
    return mag === 0 ? { x: 0, y: 0 } : { x: vector.x / mag, y: vector.y / mag }
  }

  static magnitude(vector) {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2)
  }
}

export default VectorFieldModel