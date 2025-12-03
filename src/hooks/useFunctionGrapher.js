// ============================================================================
// PHYMATH-SIM: HOOK DE GRAFICADOR DE FUNCIONES
// ============================================================================
// PROPÓSITO: Gestiona el estado y operaciones del graficador de funciones
// ============================================================================

import { useState, useCallback, useRef } from 'react'
import { FunctionManager, FunctionTypes } from '../utils/math/FunctionModel.js'

const FUNCTION_PARAMS = {
  [FunctionTypes.LINEAR]: ['a', 'b'],
  [FunctionTypes.QUADRATIC]: ['a', 'b', 'c'],
  [FunctionTypes.CUBIC]: ['a', 'b', 'c', 'd'],
  [FunctionTypes.SINE]: ['a', 'b', 'c', 'd'],
  [FunctionTypes.COSINE]: ['a', 'b', 'c', 'd'],
  [FunctionTypes.EXPONENTIAL]: ['a', 'b', 'c'],
  [FunctionTypes.LOGARITHMIC]: ['a', 'b', 'c'],
  [FunctionTypes.CUSTOM]: []
}

const DEFAULT_PARAMS = {
  [FunctionTypes.LINEAR]: { a: 1, b: 0 },
  [FunctionTypes.QUADRATIC]: { a: 1, b: 0, c: 0 },
  [FunctionTypes.CUBIC]: { a: 1, b: 0, c: 0, d: 0 },
  [FunctionTypes.SINE]: { a: 1, b: 1, c: 0, d: 0 },
  [FunctionTypes.COSINE]: { a: 1, b: 1, c: 0, d: 0 },
  [FunctionTypes.EXPONENTIAL]: { a: 1, b: 1, c: 0 },
  [FunctionTypes.LOGARITHMIC]: { a: 1, b: 0, c: 0 },
  [FunctionTypes.CUSTOM]: { expression: 'x^2' }
}

export function useFunctionGrapher() {
  const functionManagerRef = useRef(new FunctionManager())

  const [functionType, setFunctionType] = useState(FunctionTypes.QUADRATIC)
  const [parameters, setParameters] = useState({ a: 1, b: 0, c: 0, d: 0, expression: 'x^2' })
  const [customExpression, setCustomExpression] = useState('x^2')
  const [functionColor, setFunctionColor] = useState('#007bff')
  const [viewport, setViewport] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [showAxis, setShowAxis] = useState(true)
  const [showDerivative, setShowDerivative] = useState(false)
  const [evalX, setEvalX] = useState(0)
  const [evaluationResults, setEvaluationResults] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [activeFunctions, setActiveFunctions] = useState([])

  const getActiveParams = useCallback(() => FUNCTION_PARAMS[functionType] || [], [functionType])

  const updateParameter = useCallback((param, value) => {
    setParameters(prev => ({ ...prev, [param]: value }))
  }, [])

  const createCurrentFunction = useCallback(() => {
    const currentParams = functionType === FunctionTypes.CUSTOM 
      ? { expression: customExpression }
      : parameters

    try {
      return functionManagerRef.current.addFunction(functionType, currentParams, functionColor)
    } catch (error) {
      console.error('Error creating function:', error)
      return null
    }
  }, [functionType, parameters, customExpression, functionColor])

  const addFunction = useCallback(() => {
    try {
      setErrorMessage(null)
      const func = createCurrentFunction()
      if (func) {
        func.evaluate(0)
        setActiveFunctions(prev => [...prev, func])
        return func
      }
      return null
    } catch (error) {
      setErrorMessage(error.message || 'Error al agregar la función')
      return null
    }
  }, [createCurrentFunction])

  const removeFunction = useCallback((id) => {
    functionManagerRef.current.removeFunction(id)
    setActiveFunctions(prev => prev.filter(func => func.id !== id))
  }, [])

  const clearAllFunctions = useCallback(() => {
    functionManagerRef.current.clearAll()
    setActiveFunctions([])
    setEvaluationResults([])
  }, [])

  const toggleFunctionVisibility = useCallback((id) => {
    setActiveFunctions(prev => prev.map(func => 
      func.id === id ? { ...func, visible: !func.visible } : func
    ))
  }, [])

  const evaluateAtPoint = useCallback(() => {
    const x = parseFloat(evalX)
    if (isNaN(x)) return

    const results = activeFunctions.filter(func => func.visible).map(func => ({
      id: func.id,
      expression: func.getExpressionString(),
      value: func.evaluate(x),
      color: func.color
    }))

    setEvaluationResults(results)
  }, [evalX, activeFunctions])

  const generateAllFunctionPoints = useCallback(() => {
    return activeFunctions
      .filter(func => func.visible)
      .map(func => {
        func.points = func.generatePoints(viewport.xMin, viewport.xMax, 1000)
        func.derivativePoints = showDerivative ? func.generateDerivativePoints(viewport.xMin, viewport.xMax, 500) : []
        return func
      })
  }, [activeFunctions, viewport, showDerivative])

  const resetView = useCallback(() => {
    setViewport({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })
    setZoom(1)
  }, [])

  const applyZoom = useCallback((zoomLevel) => {
    const factor = 1 / zoomLevel
    const centerX = (viewport.xMax + viewport.xMin) / 2
    const centerY = (viewport.yMax + viewport.yMin) / 2
    const halfRangeX = 10 * factor
    const halfRangeY = 10 * factor
    
    setViewport({
      xMin: centerX - halfRangeX,
      xMax: centerX + halfRangeX,
      yMin: centerY - halfRangeY,
      yMax: centerY + halfRangeY
    })
  }, [viewport])

  const resetParameters = useCallback(() => {
    setParameters(prev => ({ ...prev, ...DEFAULT_PARAMS[functionType] }))
    if (functionType === FunctionTypes.CUSTOM) {
      setCustomExpression('x^2')
    }
  }, [functionType])

  return {
    functionType,
    parameters,
    customExpression,
    functionColor,
    viewport,
    zoom,
    showGrid,
    showAxis,
    showDerivative,
    evalX,
    evaluationResults,
    activeFunctions,
    errorMessage,
    
    getActiveParams,
    generateAllFunctionPoints,
    
    setFunctionType,
    setCustomExpression,
    setFunctionColor,
    setViewport,
    setZoom,
    setShowGrid,
    setShowAxis,
    setShowDerivative,
    setEvalX,
    updateParameter,
    
    addFunction,
    removeFunction,
    clearAllFunctions,
    toggleFunctionVisibility,
    evaluateAtPoint,
    resetView,
    applyZoom,
    resetParameters,
    
    FunctionTypes,
    functionParams: FUNCTION_PARAMS
  }
}
