// ============================================================================
// PHYMATH-SIM: MODELO DE FUNCIONES
// ============================================================================
// PROPÓSITO: Evalúa y grafica funciones matemáticas
// SIMPLICIDAD: Enfoque directo sin sobre-ingeniería
// ============================================================================

import { create, all } from 'mathjs'
const math = create(all)

// ============================================================================
// TIPOS DE FUNCIONES
// ============================================================================
export const FunctionTypes = {
  LINEAR: 'LINEAR',
  QUADRATIC: 'QUADRATIC',
  CUBIC: 'CUBIC',
  SINE: 'SINE',
  COSINE: 'COSINE',
  EXPONENTIAL: 'EXPONENTIAL',
  LOGARITHMIC: 'LOGARITHMIC',
  CUSTOM: 'CUSTOM'
}

// ============================================================================
// EVALUADOR MATEMÁTICO - Mantenerlo simple
// ============================================================================
class MathEvaluator {
  evaluate(expression, x) {
    try {
      const scope = { x, pi: Math.PI, e: Math.E }
      const result = math.evaluate(expression, scope)
      
      if (typeof result === 'number' && isFinite(result)) {
        return result
      }
      throw new Error('Invalid result')
    } catch (error) {
      throw new Error(`Expression error: ${error.message}`)
    }
  }
}

// ============================================================================
// FUNCIÓN MATEMÁTICA - Una clase con comportamiento simple
// ============================================================================
export class MathFunction {
  constructor(type, params, color = '#007bff') {
    this.type = type
    this.parameters = params
    this.color = color
    this.evaluator = new MathEvaluator()
    this.visible = true
    this.id = Date.now() + Math.random()
  }

  evaluate(x) {
    const p = this.parameters
    
    switch (this.type) {
      case FunctionTypes.LINEAR:
        return p.a * x + p.b
      
      case FunctionTypes.QUADRATIC:
        return p.a * x * x + p.b * x + p.c
      
      case FunctionTypes.CUBIC:
        return p.a * x * x * x + p.b * x * x + p.c * x + p.d
      
      case FunctionTypes.SINE:
        return p.a * Math.sin(p.b * x + p.c) + p.d
      
      case FunctionTypes.COSINE:
        return p.a * Math.cos(p.b * x + p.c) + p.d
      
      case FunctionTypes.EXPONENTIAL:
        return p.a * Math.exp(p.b * x) + p.c
      
      case FunctionTypes.LOGARITHMIC:
        const arg = x + p.b
        return arg > 0 ? p.a * Math.log(arg) + p.c : NaN
      
      case FunctionTypes.CUSTOM:
        return this.evaluator.evaluate(p.expression, x)
      
      default:
        return NaN
    }
  }

  derivative(x, h = 0.001) {
    return (this.evaluate(x + h) - this.evaluate(x - h)) / (2 * h)
  }

  generatePoints(xMin, xMax, resolution = 1000) {
    const points = []
    const step = (xMax - xMin) / resolution
    
    for (let x = xMin; x <= xMax; x += step) {
      const y = this.evaluate(x)
      if (isFinite(y)) {
        points.push({ x, y })
      } else if (points.length > 0) {
        points.push({ x, y: null })
      }
    }
    return points
  }

  generateDerivativePoints(xMin, xMax, resolution = 500) {
    const points = []
    const step = (xMax - xMin) / resolution
    
    for (let x = xMin; x <= xMax; x += step) {
      const dy = this.derivative(x)
      if (isFinite(dy)) {
        points.push({ x, y: dy })
      }
    }
    return points
  }

  getExpressionString() {
    const p = this.parameters
    
    switch (this.type) {
      case FunctionTypes.LINEAR:
        return `f(x) = ${p.a}x + ${p.b}`
      
      case FunctionTypes.QUADRATIC:
        return `f(x) = ${p.a}x² + ${p.b}x + ${p.c}`
      
      case FunctionTypes.CUBIC:
        return `f(x) = ${p.a}x³ + ${p.b}x² + ${p.c}x + ${p.d}`
      
      case FunctionTypes.SINE:
        return `f(x) = ${p.a}sin(${p.b}x + ${p.c}) + ${p.d}`
      
      case FunctionTypes.COSINE:
        return `f(x) = ${p.a}cos(${p.b}x + ${p.c}) + ${p.d}`
      
      case FunctionTypes.EXPONENTIAL:
        return `f(x) = ${p.a}e^(${p.b}x) + ${p.c}`
      
      case FunctionTypes.LOGARITHMIC:
        return `f(x) = ${p.a}ln(x + ${p.b}) + ${p.c}`
      
      case FunctionTypes.CUSTOM:
        return `f(x) = ${p.expression}`
      
      default:
        return 'f(x) = ?'
    }
  }
}

// ============================================================================
// GESTOR DE FUNCIONES - Manejo simple de colecciones
// ============================================================================
export class FunctionManager {
  constructor() {
    this.functions = []
    this.colors = ['#007bff', '#dc3545', '#28a745', '#ffc107', '#6f42c1']
    this.colorIndex = 0
  }

  addFunction(type, params, color) {
    if (!color) {
      color = this.colors[this.colorIndex % this.colors.length]
      this.colorIndex++
    }
    
    const func = new MathFunction(type, params, color)
    this.functions.push(func)
    return func
  }

  removeFunction(id) {
    this.functions = this.functions.filter(f => f.id !== id)
  }

  clearAll() {
    this.functions = []
    this.colorIndex = 0
  }

  getFunctions() {
    return this.functions
  }
}
