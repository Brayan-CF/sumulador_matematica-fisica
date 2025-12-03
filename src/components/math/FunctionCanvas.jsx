// ============================================================================
// PHYMATH-SIM: CANVAS DE FUNCIONES MATEMÁTICAS
// ============================================================================
// PROPÓSITO: Renderiza gráficas de funciones, derivadas y grid en canvas
// ============================================================================

import React, { useRef, useEffect, useCallback } from 'react'

function FunctionCanvas({ functions, viewport, showGrid, showAxis, showDerivative }) {
  const canvasRef = useRef(null)

  const worldToCanvas = useCallback((x, y, canvas) => {
    const canvasX = ((x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * (canvas.width - 100) + 50
    const canvasY = canvas.height - 50 - ((y - viewport.yMin) / (viewport.yMax - viewport.yMin)) * (canvas.height - 100)
    return { x: canvasX, y: canvasY }
  }, [viewport])

  const drawGrid = useCallback((ctx, canvas) => {
    if (!showGrid) return

    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1

    const rangeX = viewport.xMax - viewport.xMin
    const rangeY = viewport.yMax - viewport.yMin
    const stepX = Math.pow(10, Math.floor(Math.log10(rangeX / 10)))
    const stepY = Math.pow(10, Math.floor(Math.log10(rangeY / 10)))

    for (let x = Math.ceil(viewport.xMin / stepX) * stepX; x <= viewport.xMax; x += stepX) {
      const canvasPos = worldToCanvas(x, 0, canvas)
      ctx.beginPath()
      ctx.moveTo(canvasPos.x, 50)
      ctx.lineTo(canvasPos.x, canvas.height - 50)
      ctx.stroke()

      if (Math.abs(x) > 0.001) {
        ctx.fillStyle = '#666'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(x.toFixed(1), canvasPos.x, canvas.height - 30)
      }
    }

    for (let y = Math.ceil(viewport.yMin / stepY) * stepY; y <= viewport.yMax; y += stepY) {
      const canvasPos = worldToCanvas(0, y, canvas)
      ctx.beginPath()
      ctx.moveTo(50, canvasPos.y)
      ctx.lineTo(canvas.width - 50, canvasPos.y)
      ctx.stroke()

      if (Math.abs(y) > 0.001) {
        ctx.fillStyle = '#666'
        ctx.font = '10px Arial'
        ctx.textAlign = 'right'
        ctx.fillText(y.toFixed(1), 40, canvasPos.y + 3)
      }
    }
  }, [showGrid, viewport, worldToCanvas])

  const drawAxes = useCallback((ctx, canvas) => {
    if (!showAxis) return

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    const xAxisY = worldToCanvas(0, 0, canvas).y
    if (xAxisY >= 50 && xAxisY <= canvas.height - 50) {
      ctx.beginPath()
      ctx.moveTo(50, xAxisY)
      ctx.lineTo(canvas.width - 50, xAxisY)
      ctx.stroke()
    }

    const yAxisX = worldToCanvas(0, 0, canvas).x
    if (yAxisX >= 50 && yAxisX <= canvas.width - 50) {
      ctx.beginPath()
      ctx.moveTo(yAxisX, 50)
      ctx.lineTo(yAxisX, canvas.height - 50)
      ctx.stroke()
    }

    ctx.fillStyle = '#333'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('x', canvas.width - 30, xAxisY > canvas.height - 70 ? canvas.height - 70 : xAxisY + 20)
    ctx.save()
    ctx.translate(yAxisX < 70 ? 70 : yAxisX - 20, 30)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('y', 0, 0)
    ctx.restore()
  }, [showAxis, worldToCanvas])

  const drawFunction = useCallback((ctx, canvas, func, isDerivative = false) => {
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

      const canvasPos = worldToCanvas(point.x, point.y, canvas)

      if (canvasPos.x >= 50 && canvasPos.x <= canvas.width - 50 &&
          canvasPos.y >= 50 && canvasPos.y <= canvas.height - 50) {
        
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
  }, [worldToCanvas])

  const drawLegend = useCallback((ctx, canvas, functions) => {
    if (!functions || functions.length === 0) return

    const visibleFunctions = functions.filter(func => func.visible)
    if (visibleFunctions.length === 0) return

    const legendX = canvas.width - 200
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
  }, [showDerivative])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    drawGrid(ctx, canvas)
    drawAxes(ctx, canvas)
    
    if (functions && functions.length > 0) {
      functions.forEach(func => {
        if (func.visible) {
          drawFunction(ctx, canvas, func, false)
          if (showDerivative) {
            drawFunction(ctx, canvas, func, true)
          }
        }
      })

      drawLegend(ctx, canvas, functions)
    }

    ctx.fillStyle = '#666'
    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Rango: [${viewport.xMin.toFixed(1)}, ${viewport.xMax.toFixed(1)}] × [${viewport.yMin.toFixed(1)}, ${viewport.yMax.toFixed(1)}]`, 10, canvas.height - 10)

  }, [functions, viewport, showGrid, showAxis, showDerivative, drawGrid, drawAxes, drawFunction, drawLegend])

  useEffect(() => {
    render()
  }, [render])

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
