<div align="center">

#  PhyMath Sim - React

### Simulador Interactivo de Física y Matemáticas

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=for-the-badge&logo=bootstrap)

**Universidad Franz Tamayo (UNIFRANZ) - 6to Semestre**  
**Programación Gráfica y Multimedia I**

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Simuladores Disponibles](#-simuladores-disponibles)
- [Equipo](#-equipo)

---

## Descripción

**PhyMath Sim** es una aplicación web interactiva desarrollada con React que permite simular y visualizar conceptos de física y matemáticas de manera dinámica. El proyecto utiliza **Atomic Design** y **Custom Hooks** para una arquitectura escalable y mantenible.

###  Migración Vanilla JS → React

Este proyecto es una **refactorización profesional** de una aplicación original en Vanilla JavaScript usando el patrón MVC. La migración a React mantiene toda la lógica científica intacta mientras moderniza la arquitectura de UI.

---

##  Características

- ⚛️ **Atomic Design**: Componentes organizados en Atoms → Molecules → Templates → Pages
-  **Custom Hooks**: Separación clara entre lógica de negocio y presentación
-  **Tema Claro/Oscuro**: Con persistencia en localStorage
-  **Navegación SPA**: Usando React Router v6
-  **Responsive Design**: Bootstrap 5 + CSS personalizado
-  **Canvas API**: Visualizaciones científicas en tiempo real
-  **Arquitectura Limpia**: Componentes reutilizables, código DRY

---

##  Tecnologías

### **Frontend**
- React 18.2.0 (Functional Components + Hooks)
- Vite 5.0.0 (Build tool ultrarrápido)
- React Router 6.22.3 (SPA routing)
- Bootstrap 5.3.3 + Bootstrap Icons
- MathJS 15.1.0 (Evaluación matemática)

### **Desarrollo**
- ESLint (Linting)
- Vite Plugin React (Fast Refresh)

---

##  Estructura del Proyecto

```
PhyMath-Sim-React/
├── src/
│   ├── components/
│   │   ├── atoms/              # Componentes básicos reutilizables
│   │   │   ├── Slider.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   └── ActionButton.jsx
│   │   ├── molecules/          # Composiciones de átomos
│   │   │   ├── ParameterControl.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── SimulationCanvas.jsx
│   │   │   └── HarmonicOscillatorCanvas.jsx
│   │   ├── templates/          # Layouts reutilizables
│   │   │   └── SimulatorLayout.jsx
│   │   ├── physics/            # Simuladores de física
│   │   │   ├── ProjectileSimulator.jsx
│   │   │   ├── HarmonicOscillatorSimulator.jsx
│   │   │   ├── CollisionSimulator.jsx
│   │   │   └── CanvasRenderer.jsx
│   │   ├── math/               # Simuladores matemáticos
│   │   │   ├── FunctionGrapher.jsx
│   │   │   └── FunctionCanvas.jsx
│   │   └── ui/                 # Componentes de interfaz
│   │       ├── Dashboard.jsx
│   │       └── Navbar.jsx
│   ├── hooks/                  # Custom Hooks (lógica)
│   │   ├── useProjectile.js
│   │   ├── useHarmonicOscillator.js
│   │   ├── useCollision.js
│   │   └── useFunctionGrapher.js
│   ├── contexts/               # Context API
│   │   └── ThemeContext.jsx
│   ├── utils/                  # Lógica pura (Models)
│   │   ├── physics/
│   │   │   ├── ProjectileModel.js
│   │   │   ├── HarmonicOscillatorModel.js
│   │   │   └── CollisionModel.js
│   │   └── math/
│   │       └── FunctionModel.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx                 # Componente raíz
│   └── main.jsx                # Entry point
├── public/                     # Recursos estáticos
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Instalación

### **Prerrequisitos**
- Node.js 18+ (recomendado: 20.x)
- npm o yarn

### **Pasos**

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd PhyMath-Sim-React-MIGRADO
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

4. **Compilar para producción**
   ```bash
   npm run build
   ```

5. **Previsualizar build de producción**
   ```bash
   npm run preview
   ```

---

##  Uso

1. Abre la aplicación en tu navegador
2. Navega por el Dashboard con las tarjetas de módulos
3. Selecciona un simulador desde el menú o las tarjetas
4. Ajusta parámetros usando los controles (sliders, inputs)
5. Visualiza los resultados en tiempo real en el canvas
6. Cambia entre tema claro/oscuro usando el switch en la navbar

---

##  Simuladores Disponibles

### **Física**

#### 1️ **Simulador de Proyectiles**
- Movimiento parabólico con resistencia del aire
- Comparación entre planetas (Tierra, Marte, Luna, Júpiter)
- Visualización de vectores de velocidad
- Cálculos de alcance, altura máxima, tiempo de vuelo

#### 2️ **Oscilador Armónico**
- 5 tipos de osciladores:
  - Péndulo Simple
  - Sistema Masa-Resorte
  - Péndulo Doble (caos determinista)
  - Péndulo Compuesto
  - Resorte Vertical
- Diagramas de espacio de fases
- Gráficos de energía (cinética, potencial, mecánica)
- Análisis de resonancia y amortiguamiento

#### 3️ **Simulador de Colisiones**
- Colisiones elásticas e inelásticas
- 5 presets predefinidos (frontal, oblicua, múltiple, pared, gravedad)
- 6 materiales con diferentes coeficientes de restitución
- Añadir objetos dinámicamente con configuración personalizada
- Estadísticas en tiempo real (momentum, energía cinética)

### **Matemáticas**

#### 4️ **Graficador de Funciones**
- 8 tipos de funciones:
  - Lineal, Cuadrática, Cúbica
  - Seno, Coseno
  - Exponencial, Logarítmica
  - Personalizada (expresiones Math.js)
- Evaluación en puntos específicos
- Visualización de derivadas
- Múltiples funciones simultáneas con toggle de visibilidad
- Control de viewport y zoom

---

##  Arquitectura

### **Atomic Design**

```
Atoms (básicos)
    ↓
Molecules (composiciones)
    ↓
Templates (estructuras)
    ↓
Pages (simuladores finales)
```

### **Flujo de Datos**

```
Usuario interactúa
    ↓
Componente React actualiza estado
    ↓
Custom Hook llama a Model (lógica pura JS)
    ↓
Model calcula y retorna resultado
    ↓
Hook actualiza estado React
    ↓
React re-renderiza automáticamente
```

### **Separación de Responsabilidades**

- **Componentes**: Solo presentación (JSX + props)
- **Hooks**: Lógica de React (estado, efectos, callbacks)
- **Models**: Lógica científica pura (sin dependencias de React)

---

##  Estadísticas del Proyecto

### **Código Refactorizado**

| Simulador | Antes | Después | Reducción |
|-----------|-------|---------|-----------|
| ProjectileSimulator | 261 líneas | 195 líneas | -25% |
| HarmonicOscillator | 949 líneas | 200 líneas | **-79%** ⭐ |
| CollisionSimulator | 769 líneas | 230 líneas | -70% |
| FunctionGrapher | 409 líneas | 180 líneas | -56% |

**Total**: 2,388 líneas → 805 líneas (**-66%** en componentes principales)

### **Infraestructura Reutilizable**

- 3 Atoms (175 líneas)
- 4 Molecules (410 líneas)
- 1 Template (100 líneas)
- **Total**: 685 líneas escritas una vez, reutilizadas en 4 simuladores

### **Valor Agregado**

- 685 líneas de infraestructura × 4 simuladores = **2,740 líneas equivalentes**
- 500 líneas de hooks con lógica separada y testeable
- **Total funcionalidad organizada**: ~3,240 líneas

---

## 👥 Equipo

**Universidad Franz Tamayo (UNIFRANZ)**  
**Programación Gráfica y Multimedia - 6to Semestre**

- **Brayan J. Calderon Fernandez**
- **David Manuel Mamani Huanca**
- **Angel Alejandro Cori Flores**
- **Guido Mendoza Mamani**

---

##  Licencia

Este proyecto es de uso académico para la Universidad Franz Tamayo (UNIFRANZ).

---

##  Agradecimientos

- A los profesores de Programación Gráfica y Multimedia por la guía
- A la comunidad de React por la documentación y recursos
- A Brad Frost por la metodología Atomic Design

---

<div align="center">

**Desarrollado con ❤️ usando React + Vite**

**UNIFRANZ - 2025**

</div>
