// ============================================================================
// PHYMATH-SIM: CANVAS DE CAMPO VECTORIAL
// ============================================================================
// PROPÓSITO: Renderiza vectores con flechas y magnitudes coloreadas
// ============================================================================

import React, { useRef, useEffect } from 'react'

function VectorFieldCanvas({ 
  vectors, 
  showArrows = true, 
  showMagnitude = false,
  width = 800, 
  height = 600 
}) {
  const canvasRef = useRef(null)

  // ========================================================================
  // USEEFFECT: Renderizado optimizado con RAF
  // ========================================================================
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderFrame = () => {
      const ctx = canvas.getContext('2d')

      // Limpiar
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, width, height)

      // Dibujar grid de fondo
      ctx.strokeStyle = '#e9ecef'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Dibujar vectores (batch rendering para mejor performance)
      if (vectors && vectors.length > 0) {
        vectors.forEach(v => {
          const mag = Math.min(v.magnitude, 2)
          
          // Color según magnitud
          if (showMagnitude) {
            const intensity = Math.min(mag / 2, 1)
            const r = Math.floor(intensity * 220 + 35)
            const g = Math.floor((1 - intensity) * 110 + 35)
            const b = 253
            ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
          } else {
            ctx.strokeStyle = '#0d6efd'
          }

          ctx.lineWidth = 2

          if (showArrows) {
            // Dibujar flecha
            const endX = v.x + v.vx * 10
            const endY = v.y + v.vy * 10
            
            // Línea principal
            ctx.beginPath()
            ctx.moveTo(v.x, v.y)
            ctx.lineTo(endX, endY)
            ctx.stroke()

            // Punta de flecha
            const angle = Math.atan2(v.vy, v.vx)
            const arrowSize = 5
            
            ctx.beginPath()
            ctx.moveTo(endX, endY)
            ctx.lineTo(
              endX - arrowSize * Math.cos(angle - Math.PI / 6),
              endY - arrowSize * Math.sin(angle - Math.PI / 6)
            )
            ctx.moveTo(endX, endY)
            ctx.lineTo(
              endX - arrowSize * Math.cos(angle + Math.PI / 6),
              endY - arrowSize * Math.sin(angle + Math.PI / 6)
            )
            ctx.stroke()
          } else {
            // Dibujar solo puntos
            ctx.fillStyle = ctx.strokeStyle
            ctx.beginPath()
            ctx.arc(v.x, v.y, 3, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      }
    }

    const rafId = requestAnimationFrame(renderFrame)
    return () => cancelAnimationFrame(rafId)
  }, [vectors, showArrows, showMagnitude, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: 'auto',
        border: '2px solid #0d6efd',
        borderRadius: '8px',
        background: 'white'
      }}
    />
  )
}

export default VectorFieldCanvas
