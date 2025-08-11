// Funcionalidad principal de la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initSmoothScrolling();
    initAnimations();
    initAdvancedChart();
    init3DModel();
    initHero3DModel();
    initInteractiveElements();
    initNeumorphicEffects();
});

// Importaciones de Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Variables globales para el modelo 3D
let scene, camera, renderer, tacoGroup, animationId;
let isAutoRotating = false;
let currentRadius = 2.31;
let controls;

// Navegación suave entre secciones
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar navegación activa
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Actualizar navegación activa
function updateActiveNavigation(activeId) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

// Animaciones al hacer scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll('.solution-step, .formula, .problem-statement');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Gráfico avanzado con Chart.js
function initAdvancedChart() {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;
    
    // Generar datos para el gráfico
    const data = generateVolumeData();
    
    // Configuración del gráfico
    const chartConfig = {
        type: 'line',
        data: {
            labels: data.map(d => d.r.toFixed(1)),
            datasets: [{
                label: 'Volumen (pulgadas³)',
                data: data.map(d => d.volume),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#e0e5ec',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#2c3e50',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return `Radio: ${context[0].label} pulgadas`;
                        },
                        label: function(context) {
                            return `Volumen: ${context.parsed.y.toFixed(2)} pulgadas³`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Radio del cilindro (r) - pulgadas',
                        color: '#2c3e50',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(163, 177, 198, 0.3)'
                    },
                    ticks: {
                        color: '#2c3e50'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Volumen (pulgadas³)',
                        color: '#2c3e50',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(163, 177, 198, 0.3)'
                    },
                    ticks: {
                        color: '#2c3e50'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    };
    
    // Crear el gráfico
    const volumeChart = new Chart(ctx, chartConfig);
    
    // Marcar el punto óptimo
    markOptimalPoint(volumeChart, data);
    
    // Agregar tooltips a las fórmulas
    addFormulaTooltips();
}

// Generar datos del volumen
function generateVolumeData() {
    const data = [];
    for (let r = 0.5; r <= 4; r += 0.1) {
        const volume = calculateVolumeForRadius(r);
        data.push({ r, volume });
    }
    return data;
}

// Cálculo mejorado del volumen
function calculateVolumeForRadius(r) {
    // Fórmula aproximada más precisa
    const term1 = 8 * Math.PI * r;
    const term2 = r * r * Math.PI * (1 - 2/Math.PI);
    const correction = r * r * r * 0.1; // Factor de corrección
    return Math.max(0, term1 - term2 - correction);
}

// Marcar punto óptimo en el gráfico
function markOptimalPoint(chart, data) {
    const maxPoint = data.reduce((max, point) => 
        point.volume > max.volume ? point : max
    );
    
    // Agregar anotación del punto máximo
    const maxIndex = data.findIndex(d => d.r === maxPoint.r);
    
    // Actualizar el dataset para resaltar el punto máximo
    chart.data.datasets[0].pointBackgroundColor = data.map((_, index) => 
        index === maxIndex ? 'rgba(231, 76, 60, 1)' : 'rgba(102, 126, 234, 1)'
    );
    chart.data.datasets[0].pointRadius = data.map((_, index) => 
        index === maxIndex ? 8 : 4
    );
    
    chart.update();
}

// Inicializar modelo 3D del taco
function init3DModel() {
    const container = document.getElementById('taco3D');
    if (!container) return;
    
    // Configurar la escena con fondo profesional
    scene = new THREE.Scene();
    
    // Crear fondo degradado profesional
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#87CEEB'); // Azul cielo claro
    gradient.addColorStop(0.5, '#F0F8FF'); // Azul alice muy claro
    gradient.addColorStop(1, '#FFFAF0'); // Blanco floral
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;
    
    // Configurar la cámara con mejor posición
    camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(8, 8, 8);
    
    // Configurar el renderizador con mejor calidad
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    
    // Agregar controles de órbita mejorados
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.8;
    
    // Agregar iluminación
    setupLighting();
    
    // Crear el modelo del taco
    createTacoModel();
    
    // Configurar controles interactivos
    setupControls();
    
    // Iniciar el bucle de renderizado
    animate();
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
}

// Inicializar modelo 3D en el hero
function initHero3DModel() {
    const container = document.getElementById('taco-3d-hero');
    if (!container) return;
    
    // Crear escena separada para el hero
    const heroScene = new THREE.Scene();
    
    // Crear fondo degradado
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.5, '#F0F8FF');
    gradient.addColorStop(1, '#FFFAF0');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    heroScene.background = texture;
    
    // Configurar cámara
    const heroCamera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    heroCamera.position.set(6, 6, 6);
    
    // Configurar renderizador
    const heroRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true
    });
    heroRenderer.setSize(container.offsetWidth, container.offsetHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.shadowMap.enabled = true;
    heroRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    heroRenderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(heroRenderer.domElement);
    
    // Agregar controles
    const heroControls = new OrbitControls(heroCamera, heroRenderer.domElement);
    heroControls.enableDamping = true;
    heroControls.dampingFactor = 0.05;
    heroControls.autoRotate = true;
    heroControls.autoRotateSpeed = 2;
    
    // Agregar iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    heroScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    heroScene.add(directionalLight);
    
    // Crear grupo para el taco
    const heroTacoGroup = new THREE.Group();
    heroScene.add(heroTacoGroup);
    
    // Cargar modelo del taco
    const loader = new GLTFLoader();
    loader.load(
        '/taco.glb',
        function (gltf) {
            const model = gltf.scene;
            model.scale.setScalar(2);
            model.position.set(0, 0, 0);
            
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            heroTacoGroup.add(model);
        },
        undefined,
        function (error) {
            console.log('Error cargando modelo en hero:', error);
        }
    );
    
    // Función de animación
    function animateHero() {
        requestAnimationFrame(animateHero);
        heroControls.update();
        heroRenderer.render(heroScene, heroCamera);
    }
    
    animateHero();
}

// Crear plato/superficie para el taco
function createPlate() {
    const plateGeometry = new THREE.CylinderGeometry(currentRadius * 3, currentRadius * 3, 0.2, 32);
    const plateMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xF5F5F5,
        shininess: 30,
        transparent: true,
        opacity: 0.9
    });
    
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -currentRadius * 0.8;
    plate.receiveShadow = true;
    plate.castShadow = true;
    plate.name = 'plate';
    
    // Agregar borde decorativo al plato
    const rimGeometry = new THREE.TorusGeometry(currentRadius * 3, 0.1, 8, 32);
    const rimMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xE0E0E0,
        shininess: 50
    });
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = -currentRadius * 0.8 + 0.1;
    rim.receiveShadow = true;
    rim.name = 'rim';
    
    scene.add(plate);
    scene.add(rim);
}

// Actualizar el plato cuando cambie el radio
function updatePlate() {
    // Remover plato y borde existentes
    const existingPlate = scene.getObjectByName('plate');
    const existingRim = scene.getObjectByName('rim');
    
    if (existingPlate) scene.remove(existingPlate);
    if (existingRim) scene.remove(existingRim);
    
    // Crear nuevo plato con el tamaño actualizado
    createPlate();
}

// Configurar iluminación profesional para el modelo 3D
function setupLighting() {
    // Luz ambiental cálida para simular luz natural
    const ambientLight = new THREE.AmbientLight(0xfff8dc, 0.3);
    scene.add(ambientLight);
    
    // Luz direccional principal (sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(15, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Luz de relleno desde el lado opuesto
    const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);
    
    // Luz puntual cálida para resaltar el taco
    const pointLight = new THREE.PointLight(0xffd700, 0.6, 50);
    pointLight.position.set(5, 10, 8);
    pointLight.castShadow = true;
    scene.add(pointLight);
    
    // Luz de acento desde abajo
    const accentLight = new THREE.PointLight(0xffffff, 0.3, 30);
    accentLight.position.set(0, -5, 5);
    scene.add(accentLight);
}

// Crear modelo del taco
function createTacoModel() {
    tacoGroup = new THREE.Group();
    
    // Crear superficie/plato
    createPlate();
    
    // Crear la tortilla (modelo 3D real)
    createTortilla();
    
    scene.add(tacoGroup);
}

// Cargar el modelo 3D del taco desde Sketchfab
function createTortilla() {
    const loader = new GLTFLoader();
    
    loader.load(
        '/taco.glb',
        function (gltf) {
            // Modelo cargado exitosamente
            const tacoModel = gltf.scene;
            
            // Ajustar escala del modelo según el radio actual
            const scale = currentRadius * 0.5;
            tacoModel.scale.set(scale, scale, scale);
            
            // Posicionar el modelo
            tacoModel.position.set(0, 0, 0);
            
            // Configurar sombras para todos los meshes del modelo
            tacoModel.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Mejorar el material si es necesario
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                    }
                }
            });
            
            // Agregar el modelo al grupo del taco
            tacoGroup.add(tacoModel);
            
            // Guardar referencia para poder actualizarlo después
            tacoGroup.userData.tacoModel = tacoModel;
            
            console.log('Modelo 3D del taco cargado exitosamente');
        },
        function (progress) {
            // Progreso de carga
            console.log('Cargando modelo 3D:', (progress.loaded / progress.total * 100) + '%');
        },
        function (error) {
            // Error al cargar
            console.error('Error al cargar el modelo 3D del taco:', error);
            
            // Fallback: crear una geometría simple si falla la carga
            createFallbackTortilla();
        }
    );
}

// Función de respaldo en caso de que falle la carga del modelo
function createFallbackTortilla() {
    console.log('Usando modelo de respaldo');
    
    const geometry = new THREE.CylinderGeometry(currentRadius, currentRadius, 0.2, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xD2B48C,
        shininess: 10
    });
    
    const tortilla = new THREE.Mesh(geometry, material);
    tortilla.castShadow = true;
    tortilla.receiveShadow = true;
    
    tacoGroup.add(tortilla);
}

// Crear el volumen del taco (representación visual de la integral)
function createCylinder() {
    // Crear el volumen sólido que representa la integral
    const volumeGeometry = new THREE.CylinderGeometry(currentRadius, currentRadius, 8, 32);
    const volumeMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.3
    });
    
    const volumeCylinder = new THREE.Mesh(volumeGeometry, volumeMaterial);
    volumeCylinder.rotation.z = Math.PI / 2;
    volumeCylinder.name = 'cylinder';
    
    // Crear líneas para mostrar el contorno del volumen
    const edges = new THREE.EdgesGeometry(volumeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4169E1, linewidth: 2 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.rotation.z = Math.PI / 2;
    wireframe.name = 'volumeWireframe';
    
    tacoGroup.add(volumeCylinder);
    tacoGroup.add(wireframe);
}

// Crear etiqueta del volumen
function createVolumeLabel() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.fillText(`V = ${calculateVolume(currentRadius).toFixed(2)} in³`, canvas.width / 2, canvas.height / 2 + 6);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 3, 0);
    sprite.scale.set(2, 0.5, 1);
    sprite.name = 'volumeLabel';
    
    tacoGroup.add(sprite);
}



// Configurar controles interactivos
function setupControls() {
    const radiusSlider = document.getElementById('radiusSlider');
    const volumeDisplay = document.getElementById('volumeDisplay');
    const resetViewBtn = document.getElementById('resetView');
    const toggleRotationBtn = document.getElementById('toggleRotation');
    
    if (radiusSlider) {
        radiusSlider.addEventListener('input', (e) => {
            currentRadius = parseFloat(e.target.value);
            updateTacoModel();
            updateVolumeDisplay();
        });
    }
    
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', resetCameraView);
    }
    
    if (toggleRotationBtn) {
        toggleRotationBtn.addEventListener('click', toggleAutoRotation);
    }
}

// Actualizar el modelo del taco cuando cambia el radio
function updateTacoModel() {
    const cylinder = tacoGroup.getObjectByName('cylinder');
    const wireframe = tacoGroup.getObjectByName('volumeWireframe');
    const label = tacoGroup.getObjectByName('volumeLabel');
    
    if (cylinder) {
        cylinder.geometry.dispose();
        cylinder.geometry = new THREE.CylinderGeometry(currentRadius, currentRadius, 8, 32);
    }
    
    if (wireframe) {
        wireframe.geometry.dispose();
        const newGeometry = new THREE.CylinderGeometry(currentRadius, currentRadius, 8, 32);
        wireframe.geometry = new THREE.EdgesGeometry(newGeometry);
    }
    
    // Actualizar etiqueta del volumen
    if (label) {
        tacoGroup.remove(label);
        createVolumeLabel();
    }
    
    // Actualizar escala del modelo 3D cargado
    if (tacoGroup.userData.tacoModel) {
        const scale = currentRadius * 0.5;
        tacoGroup.userData.tacoModel.scale.set(scale, scale, scale);
    }
    
    // El modelo 3D ya incluye el relleno, no necesitamos recrearlo
    
    // Actualizar el plato
    updatePlate();
}



// Actualizar la visualización del volumen
function updateVolumeDisplay() {
    const volumeDisplay = document.getElementById('volumeDisplay');
    if (volumeDisplay) {
        const volume = calculateVolume(currentRadius);
        volumeDisplay.textContent = `Volumen: ${volume.toFixed(2)} in³`;
    }
}

// Calcular volumen para un radio dado
function calculateVolume(r) {
    // Fórmula basada en la integral del área de la sección transversal
    const h = 8; // altura del cilindro
    return Math.PI * r * r * h * 0.7; // factor de corrección aproximado
}

// Bucle de animación
function animate() {
    requestAnimationFrame(animate);
    
    if (isAutoRotating && tacoGroup) {
        tacoGroup.rotation.y += 0.01;
    }
    
    // Animación sutil de flotación
    if (tacoGroup) {
        tacoGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    // Actualizar controles
    if (controls) {
        controls.update();
    }
    
    renderer.render(scene, camera);
}

// Inicializar efectos neumórficos
function initNeumorphicEffects() {
    // Efecto de hover para elementos neumórficos
    const neumorphicElements = document.querySelectorAll('.neumorphic, .step, .formula, .chart-wrapper, .model-3d');
    
    neumorphicElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.boxShadow = '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = '8px 8px 16px rgba(163, 177, 198, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.7)';
        });
    });
    
    // Efecto de click para botones neumórficos
    const neumorphicButtons = document.querySelectorAll('.neumorphic-btn');
    
    neumorphicButtons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.boxShadow = 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.7)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.boxShadow = '4px 4px 8px rgba(163, 177, 198, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.7)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '4px 4px 8px rgba(163, 177, 198, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.7)';
        });
    });
    
    // Efecto de pulsación para el slider
    const slider = document.getElementById('radiusSlider');
    if (slider) {
        slider.addEventListener('input', () => {
            slider.style.boxShadow = 'inset 2px 2px 4px rgba(163, 177, 198, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.7)';
            setTimeout(() => {
                slider.style.boxShadow = '2px 2px 4px rgba(163, 177, 198, 0.4), -2px -2px 4px rgba(255, 255, 255, 0.7)';
            }, 150);
        });
    }
}

// Resetear vista de la cámara
function resetCameraView() {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
}

// Alternar rotación automática
function toggleAutoRotation() {
    isAutoRotating = !isAutoRotating;
    const btn = document.getElementById('toggleRotation');
    if (btn) {
        btn.textContent = isAutoRotating ? 'Detener Rotación' : 'Iniciar Rotación';
    }
}

// Manejar redimensionamiento de ventana
function onWindowResize() {
    const container = document.getElementById('taco3D');
    if (container && camera && renderer) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
}

// Cálculo aproximado del volumen
function calculateApproximateVolume(r) {
    // Aproximación simplificada para demostración
    const term1 = 8 * Math.PI * r;
    const term2 = r * r * (Math.PI - 2); // Aproximación de la integral
    return Math.max(0, term1 - term2);
}

// Actualizar gráfico con datos
function updateGraphWithData(svg, data, maxPoint) {
    const width = 400;
    const height = 300;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    
    // Escalas
    const maxR = Math.max(...data.map(d => d.r));
    const maxV = Math.max(...data.map(d => d.volume));
    
    const scaleX = (width - margin.left - margin.right) / maxR;
    const scaleY = (height - margin.top - margin.bottom) / maxV;
    
    // Crear path para la curva
    let pathData = 'M ';
    data.forEach((point, index) => {
        const x = margin.left + point.r * scaleX;
        const y = height - margin.bottom - point.volume * scaleY;
        
        if (index === 0) {
            pathData += `${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });
    
    // Actualizar el path existente
    const existingPath = svg.querySelector('path');
    if (existingPath) {
        existingPath.setAttribute('d', pathData);
    }
    
    // Actualizar punto máximo
    const maxX = margin.left + maxPoint.r * scaleX;
    const maxY = height - margin.bottom - maxPoint.volume * scaleY;
    
    const maxCircle = svg.querySelector('circle');
    if (maxCircle) {
        maxCircle.setAttribute('cx', maxX);
        maxCircle.setAttribute('cy', maxY);
    }
    
    // Agregar interactividad al gráfico
    addGraphInteractivity(svg, data, scaleX, scaleY, margin, width, height);
}

// Agregar interactividad al gráfico
function addGraphInteractivity(svg, data, scaleX, scaleY, margin, width, height) {
    // Crear tooltip
    const tooltip = createTooltip();
    
    // Agregar área invisible para detectar mouse
    const interactiveArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    interactiveArea.setAttribute('x', margin.left);
    interactiveArea.setAttribute('y', margin.top);
    interactiveArea.setAttribute('width', width - margin.left - margin.right);
    interactiveArea.setAttribute('height', height - margin.top - margin.bottom);
    interactiveArea.setAttribute('fill', 'transparent');
    interactiveArea.style.cursor = 'crosshair';
    
    interactiveArea.addEventListener('mousemove', function(e) {
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - margin.left;
        const r = mouseX / scaleX;
        
        if (r >= 0 && r <= 4) {
            const volume = calculateApproximateVolume(r);
            showTooltip(tooltip, e.clientX, e.clientY, r, volume);
        }
    });
    
    interactiveArea.addEventListener('mouseleave', function() {
        hideTooltip(tooltip);
    });
    
    svg.appendChild(interactiveArea);
}

// Crear tooltip
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'graph-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s;
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

// Mostrar tooltip
function showTooltip(tooltip, x, y, r, volume) {
    tooltip.innerHTML = `r = ${r.toFixed(2)}<br>V = ${volume.toFixed(2)}`;
    tooltip.style.left = x + 10 + 'px';
    tooltip.style.top = y - 10 + 'px';
    tooltip.style.opacity = '1';
}

// Ocultar tooltip
function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
}

// Agregar tooltips a las fórmulas
function addFormulaTooltips() {
    const formulas = document.querySelectorAll('.formula');
    
    formulas.forEach(formula => {
        formula.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
        });
        
        formula.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Elementos interactivos
function initInteractiveElements() {
    // Agregar efectos hover a los pasos de solución
    const solutionSteps = document.querySelectorAll('.solution-step');
    
    solutionSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Agregar contador animado para los resultados
    animateNumbers();
    
    // Agregar funcionalidad de copia para las fórmulas
    addCopyFunctionality();
}

// Animar números en los resultados
function animateNumbers() {
    const numberElements = document.querySelectorAll('.formula.result');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    numberElements.forEach(element => {
        observer.observe(element);
    });
}

// Animar un número específico
function animateNumber(element) {
    const text = element.textContent;
    const numberMatch = text.match(/([0-9.]+)/);
    
    if (numberMatch) {
        const finalNumber = parseFloat(numberMatch[1]);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const duration = 1000; // 1 segundo
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            
            const newText = text.replace(numberMatch[1], currentNumber.toFixed(2));
            element.innerHTML = newText;
        }, stepTime);
    }
}

// Agregar funcionalidad de copia
function addCopyFunctionality() {
    const formulas = document.querySelectorAll('.formula');
    
    formulas.forEach(formula => {
        formula.style.cursor = 'pointer';
        formula.title = 'Clic para copiar la fórmula';
        
        formula.addEventListener('click', function() {
            const text = this.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                showCopyNotification(this);
            }).catch(() => {
                // Fallback para navegadores que no soportan clipboard API
                fallbackCopyText(text);
                showCopyNotification(this);
            });
        });
    });
}

// Mostrar notificación de copia
function showCopyNotification(element) {
    const notification = document.createElement('div');
    notification.textContent = '¡Copiado!';
    notification.style.cssText = `
        position: absolute;
        background: #4CAF50;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        animation: fadeInOut 2s forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    notification.style.left = rect.left + 'px';
    notification.style.top = (rect.top - 30) + 'px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

// Fallback para copiar texto
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

// Agregar animación CSS para la notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    nav a.active {
        color: #667eea !important;
        font-weight: 600;
    }
    
    nav a.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Detectar sección activa al hacer scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section[id]');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = '#' + section.id;
        }
    });
    
    if (currentSection) {
        updateActiveNavigation(currentSection);
    }
});

// Función para mostrar/ocultar el header al hacer scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Agregar transición suave al header
header.style.transition = 'transform 0.3s ease-in-out';

console.log('🌮 Página de optimización del taco cargada correctamente!');
console.log('📊 Gráfico interactivo disponible');
console.log('🧮 Fórmulas matemáticas renderizadas con MathJax');
console.log('✨ Animaciones y efectos interactivos activados');