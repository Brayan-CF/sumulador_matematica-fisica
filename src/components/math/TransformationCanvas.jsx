// ============================================================================
// PHYMATH-SIM: CANVAS DE TRANSFORMACIÓN
// ============================================================================
// PROPÓSITO: Dibuja forma original y transformada en canvas
// ============================================================================

import React, { useRef, useEffect } from 'react'

function TransformationCanvas({ originalShape, transformedShape, width = 800, height = 600 }) {
  const canvasRef = useRef(null)

  // ========================================================================
  // USEEFFECT: Renderizado optimizado con RAF
  // ========================================================================
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderFrame = () => {
      const ctx = canvas.getContext('2d')
      const centerX = width / 2
      const centerY = height / 2

      // Limpiar
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, width, height)

      // Dibujar ejes
      ctx.strokeStyle = '#dee2e6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.moveTo(centerX, 0)
      ctx.lineTo(centerX, height)
      ctx.stroke()

      // Dibujar forma original (gris claro)
      if (originalShape && originalShape.length > 0) {
        ctx.strokeStyle = '#adb5bd'
        ctx.fillStyle = 'rgba(173, 181, 189, 0.2)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX + originalShape[0].x, centerY + originalShape[0].y)
        for (let i = 1; i < originalShape.length; i++) {
          ctx.lineTo(centerX + originalShape[i].x, centerY + originalShape[i].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }

      // Dibujar forma transformada (azul)
      if (transformedShape && transformedShape.length > 0) {
        ctx.strokeStyle = '#0d6efd'
        ctx.fillStyle = 'rgba(13, 110, 253, 0.3)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(centerX + transformedShape[0].x, centerY + transformedShape[0].y)
        for (let i = 1; i < transformedShape.length; i++) {
          ctx.lineTo(centerX + transformedShape[i].x, centerY + transformedShape[i].y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
    }

    const rafId = requestAnimationFrame(renderFrame)
    return () => cancelAnimationFrame(rafId)
  }, [originalShape, transformedShape, width, height])

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

export default TransformationCanvas
