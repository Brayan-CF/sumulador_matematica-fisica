import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/ui/Navbar'
import Dashboard from './components/ui/Dashboard'
import ProjectileSimulator from './components/physics/ProjectileSimulator'
import HarmonicOscillatorSimulator from './components/physics/HarmonicOscillatorSimulator'
import CollisionSimulator from './components/physics/CollisionSimulator'
import FunctionGrapher from './components/math/FunctionGrapher'
import TransformationSimulator from './components/math/TransformationSimulator'
import VectorFieldSimulator from './components/math/VectorFieldSimulator'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/physics/projectile" element={<ProjectileSimulator />} />
            <Route path="/physics/harmonic-oscillator" element={<HarmonicOscillatorSimulator />} />
            <Route path="/physics/collision" element={<CollisionSimulator />} />
            <Route path="/math/function-grapher" element={<FunctionGrapher />} />
            <Route path="/math/transformations" element={<TransformationSimulator />} />
            <Route path="/math/vector-fields" element={<VectorFieldSimulator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App