// ============================================================================
// PHYMATH-SIM: CANVAS DE FUNCIONES MATEMÁTICAS
// ============================================================================
// PROPÓSITO: Renderiza gráficas de funciones, derivadas y grid en canvas
// OPTIMIZACIÓN: Factores de transformación cacheados con useMemo
// ============================================================================

import React, { useRef, useEffect, useMemo } from 'react'

function FunctionCanvas({ functions, viewport, showGrid, showAxis, showDerivative }) {
  const canvasRef = useRef(null)
  const renderRef = useRef(null)

  // ========================================================================
  // USEMEMO: Factores de transformación cacheados (evita 6000+ cálculos/s)
  // ========================================================================
  const transformFactors = useMemo(() => {
    const rangeX = viewport.xMax - viewport.xMin
    const rangeY = viewport.yMax - viewport.yMin
    const canvasWidth = 800
    const canvasHeight = 400
    const margin = 50
    
    return {
      scaleX: (canvasWidth - 2 * margin) / rangeX,
      scaleY: (canvasHeight - 2 * margin) / rangeY,
      offsetX: -viewport.xMin * ((canvasWidth - 2 * margin) / rangeX) + margin,
      offsetY: canvasHeight - margin + viewport.yMin * ((canvasHeight - 2 * margin) / rangeY),
      margin,
      canvasWidth,
      canvasHeight,
      rangeX,
      rangeY
    }
  }, [viewport.xMin, viewport.xMax, viewport.yMin, viewport.yMax])

  // ========================================================================
  // FUNCIÓN INLINE: Conversión mundo → canvas (usa factores cacheados)
  // ========================================================================
  const worldToCanvas = (x, y) => ({
    x: x * transformFactors.scaleX + transformFactors.offsetX,
    y: transformFactors.offsetY - y * transformFactors.scaleY
  })

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja grilla (sin useCallback)
  // ========================================================================
  const drawGrid = (ctx) => {
    if (!showGrid) return

    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1

    const stepX = Math.pow(10, Math.floor(Math.log10(transformFactors.rangeX / 10)))
    const stepY = Math.pow(10, Math.floor(Math.log10(transformFactors.rangeY / 10)))

    for (let x = Math.ceil(viewport.xMin / stepX) * stepX; x <= viewport.xMax; x += stepX) {
      const canvasPos = worldToCanvas(x, 0)
      ctx.beginPath()
      ctx.moveTo(canvasPos.x, transformFactors.margin)
      ctx.lineTo(canvasPos.x, transformFactors.canvasHeight - transformFactors.margin)
      ctx.stroke()

      if (Math.abs(x) > 0.001) {
        ctx.fillStyle = '#666'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(x.toFixed(1), canvasPos.x, transformFactors.canvasHeight - 30)
      }
    }

    for (let y = Math.ceil(viewport.yMin / stepY) * stepY; y <= viewport.yMax; y += stepY) {
      const canvasPos = worldToCanvas(0, y)
      ctx.beginPath()
      ctx.moveTo(transformFactors.margin, canvasPos.y)
      ctx.lineTo(transformFactors.canvasWidth - transformFactors.margin, canvasPos.y)
      ctx.stroke()

      if (Math.abs(y) > 0.001) {
        ctx.fillStyle = '#666'
        ctx.font = '10px Arial'
        ctx.textAlign = 'right'
        ctx.fillText(y.toFixed(1), 40, canvasPos.y + 3)
      }
    }
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja ejes (sin useCallback)
  // ========================================================================
  const drawAxes = (ctx) => {
    if (!showAxis) return

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    const xAxisY = worldToCanvas(0, 0).y
    if (xAxisY >= transformFactors.margin && xAxisY <= transformFactors.canvasHeight - transformFactors.margin) {
      ctx.beginPath()
      ctx.moveTo(transformFactors.margin, xAxisY)
      ctx.lineTo(transformFactors.canvasWidth - transformFactors.margin, xAxisY)
      ctx.stroke()
    }

    const yAxisX = worldToCanvas(0, 0).x
    if (yAxisX >= transformFactors.margin && yAxisX <= transformFactors.canvasWidth - transformFactors.margin) {
      ctx.beginPath()
      ctx.moveTo(yAxisX, transformFactors.margin)
      ctx.lineTo(yAxisX, transformFactors.canvasHeight - transformFactors.margin)
      ctx.stroke()
    }

    ctx.fillStyle = '#333'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('x', transformFactors.canvasWidth - 30, xAxisY > transformFactors.canvasHeight - 70 ? transformFactors.canvasHeight - 70 : xAxisY + 20)
    ctx.save()
    ctx.translate(yAxisX < 70 ? 70 : yAxisX - 20, 30)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('y', 0, 0)
    ctx.restore()
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja función (sin useCallback)
  // ========================================================================
  const drawFunction = (ctx, func, isDerivative = false) => {
    if (!func.points || func.points.length === 0) return

    const points = isDerivative ? func.derivativePoints : func.points
    if (!points || points.length === 0) return

    ctx.strokeStyle = isDerivative ? func.color + '80' : func.color
    ctx.lineWidth = isDerivative ? 1 : 2
    ctx.setLineDash(isDerivative ? [5, 5] : [])

    let isDrawing = false
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      
      if (point.y === null || isNaN(point.y) || !isFinite(point.y)) {
        isDrawing = false
        continue
      }

      const canvasPos = worldToCanvas(point.x, point.y)

      if (canvasPos.x >= transformFactors.margin && canvasPos.x <= transformFactors.canvasWidth - transformFactors.margin &&
          canvasPos.y >= transformFactors.margin && canvasPos.y <= transformFactors.canvasHeight - transformFactors.margin) {
        
        if (!isDrawing) {
          ctx.beginPath()
          ctx.moveTo(canvasPos.x, canvasPos.y)
          isDrawing = true
        } else {
          ctx.lineTo(canvasPos.x, canvasPos.y)
        }
      } else {
        if (isDrawing) {
          ctx.stroke()
          isDrawing = false
        }
      }
    }

    if (isDrawing) {
      ctx.stroke()
    }
    
    ctx.setLineDash([])
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja leyenda (sin useCallback)
  // ========================================================================
  const drawLegend = (ctx, functions) => {
    if (!functions || functions.length === 0) return

    const visibleFunctions = functions.filter(func => func.visible)
    if (visibleFunctions.length === 0) return

    const legendX = transformFactors.canvasWidth - 200
    const legendY = 60
    const legendWidth = 180
    const legendHeight = visibleFunctions.length * 25 + 40

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    ctx.fillStyle = '#333'
    ctx.font = '14px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Funciones Activas:', legendX + 10, legendY + 20)

    visibleFunctions.forEach((func, index) => {
      const y = legendY + 40 + index * 25

      ctx.strokeStyle = func.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(legendX + 10, y)
      ctx.lineTo(legendX + 30, y)
      ctx.stroke()

      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.fillText(func.getExpressionString(), legendX + 35, y + 4)

      if (showDerivative && func.derivativePoints && func.derivativePoints.length > 0) {
        ctx.strokeStyle = func.color + '80'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(legendX + 10, y + 10)
        ctx.lineTo(legendX + 30, y + 10)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = '#666'
        ctx.font = '10px Arial'
        ctx.fillText("f'(x)", legendX + 35, y + 14)
      }
    })
  }

  // ========================================================================
  // USEEFFECT: Renderizado con requestAnimationFrame
  // ========================================================================
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (renderRef.current) {
      cancelAnimationFrame(renderRef.current)
    }

    const render = () => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      drawGrid(ctx)
      drawAxes(ctx)
      
      if (functions && functions.length > 0) {
        functions.forEach(func => {
          if (func.visible) {
            drawFunction(ctx, func, false)
            if (showDerivative) {
              drawFunction(ctx, func, true)
            }
          }
        })

        drawLegend(ctx, functions)
      }

      ctx.fillStyle = '#666'
      ctx.font = '10px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`Rango: [${viewport.xMin.toFixed(1)}, ${viewport.xMax.toFixed(1)}] × [${viewport.yMin.toFixed(1)}, ${viewport.yMax.toFixed(1)}]`, 10, canvas.height - 10)
    }

    renderRef.current = requestAnimationFrame(render)

    return () => {
      if (renderRef.current) {
        cancelAnimationFrame(renderRef.current)
      }
    }
  }, [functions, viewport, showGrid, showAxis, showDerivative, transformFactors])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      style={{ 
        width: '100%', 
        height: 'auto', 
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fafafa'
      }}
    />
  )
}

export default FunctionCanvas
