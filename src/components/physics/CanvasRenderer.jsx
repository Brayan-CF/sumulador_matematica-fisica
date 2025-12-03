// ============================================================================
// PHYMATH-SIM: RENDERIZADOR DE CANVAS PARA PROYECTILES
// ============================================================================
// PROPÓSITO: Dibuja trayectorias, proyectiles y vectores en canvas
// OPTIMIZACIÓN: Loop de animación único con limpieza correcta
// ============================================================================

import React, { useRef, useEffect } from 'react'

const MARGIN = 50
const ARROW_LENGTH = 8
const VECTOR_SCALE = 0.5

function CanvasRenderer({ trajectories, showTrail, showVectors }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const animationStateRef = useRef({ currentIndex: 0, isAnimating: false })

  // ========================================================================
  // FUNCIÓN INLINE: Conversión de coordenadas (sin useCallback)
  // ========================================================================
  const toCanvasCoords = (x, y, canvas, scaleFactor) => ({
    x: MARGIN + x * scaleFactor,
    y: canvas.height - MARGIN - y * scaleFactor
  })

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja ejes y grilla (sin useCallback)
  // ========================================================================
  const drawAxes = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    ctx.moveTo(MARGIN, canvas.height - MARGIN)
    ctx.lineTo(canvas.width - MARGIN, canvas.height - MARGIN)
    ctx.moveTo(MARGIN, MARGIN)
    ctx.lineTo(MARGIN, canvas.height - MARGIN)
    ctx.stroke()
    
    ctx.fillStyle = '#333'
    ctx.font = '14px Arial'
    ctx.fillText('X (m)', canvas.width - 80, canvas.height - 20)
    ctx.fillText('Y (m)', 15, 40)
    
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    
    for (let x = MARGIN; x < canvas.width - MARGIN; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, MARGIN)
      ctx.lineTo(x, canvas.height - MARGIN)
      ctx.stroke()
    }
    
    for (let y = MARGIN; y < canvas.height - MARGIN; y += 50) {
      ctx.beginPath()
      ctx.moveTo(MARGIN, y)
      ctx.lineTo(canvas.width - MARGIN, y)
      ctx.stroke()
    }
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja trayectoria (sin useCallback)
  // ========================================================================
  const drawPath = (ctx, canvas, points, scaleFactor, color, lineWidth = 2, dashed = false) => {
    if (!points || points.length === 0) return

    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.setLineDash(dashed ? [5, 5] : [])
    
    ctx.beginPath()
    points.forEach((p, i) => {
      const coords = toCanvasCoords(p.x, p.y, canvas, scaleFactor)
      i === 0 ? ctx.moveTo(coords.x, coords.y) : ctx.lineTo(coords.x, coords.y)
    })
    ctx.stroke()
    ctx.setLineDash([])
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja proyectil (sin useCallback)
  // ========================================================================
  const drawProjectile = (ctx, canvas, position, scaleFactor, color) => {
    const coords = toCanvasCoords(position.x, position.y, canvas, scaleFactor)
    
    ctx.fillStyle = color
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(coords.x, coords.y, 8, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja vector (sin useCallback)
  // ========================================================================
  const drawVector = (ctx, canvas, position, scaleFactor, color) => {
    if (!position.vx || !position.vy) return

    const start = toCanvasCoords(position.x, position.y, canvas, scaleFactor)
    const endX = start.x + position.vx * VECTOR_SCALE
    const endY = start.y - position.vy * VECTOR_SCALE
    
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    
    const angle = Math.atan2(endY - start.y, endX - start.x)
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - ARROW_LENGTH * Math.cos(angle - Math.PI / 6),
      endY - ARROW_LENGTH * Math.sin(angle - Math.PI / 6)
    )
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - ARROW_LENGTH * Math.cos(angle + Math.PI / 6),
      endY - ARROW_LENGTH * Math.sin(angle + Math.PI / 6)
    )
    ctx.stroke()
  }

  // ========================================================================
  // FUNCIÓN INLINE: Dibuja leyenda (sin useCallback)
  // ========================================================================
  const drawLegend = (ctx, canvas, trajectories) => {
    const legendX = canvas.width - 150
    const legendY = 60
    const height = trajectories.length * 25 + 30
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(legendX - 10, legendY - 20, 140, height)
    ctx.strokeStyle = '#333'
    ctx.strokeRect(legendX - 10, legendY - 20, 140, height)
    
    ctx.fillStyle = '#333'
    ctx.font = '14px Arial'
    ctx.fillText('Leyenda:', legendX, legendY)
    
    trajectories.forEach((t, i) => {
      const y = legendY + 20 + i * 20
      
      ctx.strokeStyle = t.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(legendX, y)
      ctx.lineTo(legendX + 20, y)
      ctx.stroke()
      
      ctx.fillStyle = '#333'
      ctx.font = '12px Arial'
      ctx.fillText(t.name, legendX + 25, y + 4)
    })
  }

  // ========================================================================
  // FUNCIÓN INLINE: Calcula factor de escala (sin useCallback)
  // ========================================================================
  const calculateScaleFactor = (trajectories, canvas) => {
    if (!trajectories || trajectories.length === 0) return 1

    const maxRange = Math.max(...trajectories.map(t => 
      t.points?.length > 0 ? Math.max(...t.points.map(p => p.x)) : 0
    ))
    const maxHeight = Math.max(...trajectories.map(t => 
      t.points?.length > 0 ? Math.max(...t.points.map(p => p.y)) : 0
    ))
    
    if (maxRange === 0 && maxHeight === 0) return 1
    
    return Math.min((canvas.width - 100) / maxRange, (canvas.height - 100) / maxHeight)
  }

  // ========================================================================
  // USEEFFECT: Loop de animación único con limpieza correcta
  // ========================================================================
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const scaleFactor = calculateScaleFactor(trajectories, canvas)
    const state = animationStateRef.current

    state.isAnimating = false
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (!trajectories || trajectories.length === 0) {
      drawAxes(ctx, canvas)
      return
    }

    if (trajectories.length > 1 && trajectories.some(t => t.name && t.gravity)) {
      drawAxes(ctx, canvas)
      trajectories.forEach(t => {
        drawPath(ctx, canvas, t.points, scaleFactor, t.color, 2, false)
      })
      drawLegend(ctx, canvas, trajectories)
      return
    }

    if (showTrail) {
      drawAxes(ctx, canvas)
      trajectories.forEach(t => {
        drawPath(ctx, canvas, t.points, scaleFactor, t.color, 2, true)
      })
      return
    }

    const maxPoints = Math.max(...trajectories.map(t => t.points?.length || 0))
    state.currentIndex = 0
    state.isAnimating = true
    const speed = 2

    const animate = () => {
      if (!state.isAnimating || state.currentIndex >= maxPoints) return

      drawAxes(ctx, canvas)

      trajectories.forEach(t => {
        if (t.points && state.currentIndex < t.points.length) {
          const current = t.points[state.currentIndex]
          
          drawPath(ctx, canvas, t.points.slice(0, state.currentIndex + 1), scaleFactor, t.color, 3, false)
          drawProjectile(ctx, canvas, current, scaleFactor, t.color)
          
          if (showVectors && current.vx !== undefined) {
            drawVector(ctx, canvas, current, scaleFactor, t.color)
          }
        }
      })

      state.currentIndex += speed
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      state.isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [trajectories, showTrail, showVectors])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }}
    />
  )
}

export default CanvasRenderer
