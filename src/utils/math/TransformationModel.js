// ============================================================================
// PHYMATH-SIM: MODELO DE TRANSFORMACIONES
// ============================================================================
// PROPÓSITO: Transformaciones geométricas 2D usando matrices
// SIMPLICIDAD: Álgebra lineal simple y limpia
// ============================================================================

export const TRANSFORMATION_TYPES = {
  TRANSLATION: 'TRANSLATION',
  ROTATION: 'ROTATION',
  SCALE: 'SCALE'
}

// ============================================================================
// MODELO DE TRANSFORMACIÓN
// ============================================================================
class TransformationModel {
  static identity() {
    return [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  }

  static translation(tx, ty) {
    return [[1, 0, tx], [0, 1, ty], [0, 0, 1]]
  }

  static rotation(angle) {
    const rad = (angle * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    return [[cos, -sin, 0], [sin, cos, 0], [0, 0, 1]]
  }

  static scale(sx, sy) {
    return [[sx, 0, 0], [0, sy, 0], [0, 0, 1]]
  }

  static multiply(m1, m2) {
    const result = [[0, 0, 0], [0, 0, 0], [0, 0, 1]]
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        result[i][j] = m1[i][0] * m2[0][j] + m1[i][1] * m2[1][j] + m1[i][2] * m2[2][j]
      }
    }
    return result
  }

  static transformPoint(matrix, x, y) {
    return {
      x: matrix[0][0] * x + matrix[0][1] * y + matrix[0][2],
      y: matrix[1][0] * x + matrix[1][1] * y + matrix[1][2]
    }
  }

  static transformShape(matrix, points) {
    return points.map(p => this.transformPoint(matrix, p.x, p.y))
  }

  static createTriangle() {
    return [{ x: 0, y: -50 }, { x: -43, y: 25 }, { x: 43, y: 25 }]
  }

  static createSquare() {
    return [{ x: -40, y: -40 }, { x: 40, y: -40 }, { x: 40, y: 40 }, { x: -40, y: 40 }]
  }

  static createStar() {
    const points = []
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180
      points.push({ x: Math.cos(angle) * 50, y: Math.sin(angle) * 50 })
      const innerAngle = (i * 72 - 90 + 36) * Math.PI / 180
      points.push({ x: Math.cos(innerAngle) * 25, y: Math.sin(innerAngle) * 25 })
    }
    return points
  }
}

export default TransformationModel