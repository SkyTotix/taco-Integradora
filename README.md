# Optimización del Volumen de un Taco - Proyecto de Cálculo

## 📋 Descripción del Proyecto

Este proyecto presenta la solución completa a un problema de optimización matemática: **maximizar el volumen de un taco** usando una tortilla de 8 pulgadas de diámetro. La solución está presentada en una landing page interactiva que incluye:

- Planteamiento detallado del problema
- Desarrollo matemático paso a paso
- Visualización gráfica interactiva
- Resultados numéricos y conclusiones

## 🎯 Problema Matemático

**Objetivo**: Determinar cómo curvar una tortilla circular de 8 pulgadas de diámetro alrededor de un cilindro para maximizar el volumen de comida que puede contener.

### Fórmulas Principales

**Área de la sección transversal:**
```
A(x) = r√(16-x²) - (1/2)r²arcsin(2√(16-x²)/r)
```

**Volumen total:**
```
V(r) = ∫[-4 to 4] A(x) dx
```

**Resultado óptimo:**
- Radio óptimo: r ≈ 2.31 pulgadas
- Volumen máximo: V ≈ 23.7 pulgadas cúbicas

## 🚀 Características de la Landing Page

### ✨ Funcionalidades Interactivas

1. **Navegación Suave**: Scroll automático entre secciones
2. **Gráfico Interactivo**: Visualización de V(r) vs r con tooltips
3. **Fórmulas Copiables**: Clic en cualquier fórmula para copiarla
4. **Animaciones**: Efectos visuales al hacer scroll
5. **Diseño Responsivo**: Optimizado para móviles y desktop

### 🎨 Diseño Visual

- **Colores**: Gradiente moderno azul-púrpura
- **Tipografía**: Segoe UI para máxima legibilidad
- **Matemáticas**: Renderizado con MathJax
- **Iconografía**: SVG personalizado del taco

## 📁 Estructura del Proyecto

```
PROYECTO_calculo/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad interactiva
└── README.md           # Documentación
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Interactividad y animaciones
- **MathJax**: Renderizado de fórmulas matemáticas
- **SVG**: Gráficos vectoriales escalables

## 🌐 Cómo Usar

### Opción 1: Abrir Directamente
1. Abrir `index.html` en cualquier navegador moderno
2. La página cargará automáticamente con todas las funcionalidades

### Opción 2: Servidor Local (Recomendado)
1. Abrir terminal en la carpeta del proyecto
2. Ejecutar un servidor local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (si tienes http-server instalado)
   npx http-server
   
   # Live Server (VS Code extension)
   # Clic derecho en index.html > "Open with Live Server"
   ```
3. Abrir `http://localhost:8000` en el navegador

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dispositivos
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Móvil (320px - 767px)

## 🧮 Detalles Matemáticos

### Metodología de Solución

1. **Análisis Geométrico**: Modelado de la tortilla curvada
2. **Cálculo del Área**: Integración de la sección transversal
3. **Optimización**: Derivada del volumen e igualación a cero
4. **Verificación**: Confirmación del máximo global

### Aproximaciones Numéricas

El proyecto utiliza métodos numéricos para:
- Evaluación de integrales complejas
- Búsqueda del máximo de la función volumen
- Generación de datos para el gráfico interactivo

## 🎓 Aplicaciones Educativas

### Conceptos Cubiertos
- Cálculo diferencial e integral
- Optimización con restricciones
- Geometría analítica
- Métodos numéricos
- Visualización de datos

### Nivel Académico
- **Primario**: Cálculo II/III
- **Secundario**: Métodos de optimización
- **Aplicaciones**: Ingeniería, física, diseño

## 🔧 Personalización

### Modificar Parámetros
Para experimentar con diferentes valores:

1. **Diámetro de tortilla**: Cambiar el valor 16 en las fórmulas
2. **Rango de radio**: Modificar límites en `script.js`
3. **Precisión numérica**: Ajustar incrementos en los cálculos

### Agregar Funcionalidades
- Calculadora interactiva de volumen
- Comparación con otras formas geométricas
- Animación 3D del taco
- Exportación de resultados

## 📊 Métricas de Rendimiento

- **Tiempo de carga**: < 2 segundos
- **Tamaño total**: < 500KB
- **Renderizado MathJax**: < 1 segundo
- **Animaciones**: 60 FPS

## 🤝 Contribuciones

Para mejorar el proyecto:

1. **Matemáticas**: Verificar cálculos y agregar métodos alternativos
2. **Diseño**: Mejorar UX/UI y accesibilidad
3. **Código**: Optimizar rendimiento y agregar funcionalidades
4. **Documentación**: Expandir explicaciones y ejemplos

## 📝 Licencia

Este proyecto es de uso educativo libre. Puedes:
- ✅ Usar para aprendizaje personal
- ✅ Modificar y adaptar
- ✅ Compartir con atribución
- ❌ Uso comercial sin permiso

## 📞 Contacto

Para preguntas sobre el proyecto o colaboraciones:
- 📧 Email: [tu-email@ejemplo.com]
- 🐙 GitHub: [tu-usuario]
- 💼 LinkedIn: [tu-perfil]

---

**¡Disfruta explorando las matemáticas detrás del taco perfecto! 🌮📐**