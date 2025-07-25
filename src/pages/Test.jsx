import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import RhsPanel, { createRhsPanelDom } from '../components/RhsPanel'
import Particles, { createParticlesDom } from '../components/Particles'
import LhsPanel, { createLhsPanelDom } from '../components/LhsPanel'

//大的container里面有很多小的

// Camera-following UI component constructor
class CameraUI {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.uiElements = []
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight
    this.container = null
  }

  // Create a basic div element
  createDiv(text, bgcolor, w, h, fontColor = 'black', fontSize = '16px', strokeColor = 'black', strokeWidth = '0.5px', backdropFilter = 'blur(10px)') {
    const element = document.createElement('div')
    element.style.width = w
    element.style.height = h
    element.style.background = bgcolor
    element.style.color = fontColor
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.style.fontSize = fontSize
    element.innerHTML = text
    element.style.border = `${strokeWidth} solid ${strokeColor}`
    element.style.backdropFilter = backdropFilter
    return element
  }

  // Create container for all UI elements
  createContainer() {
    const containerDiv = document.createElement('div')
    containerDiv.innerHTML = "container"
    containerDiv.style.position = 'relative'
    containerDiv.style.width = '100%'
    containerDiv.style.height = '100%'
    this.container = new CSS3DObject(containerDiv)
    this.scene.add(this.container)
    return this.container
  }


  addUIElement(element, config) {
    const {
      offsetX = 0,
      offsetY = 0,
      offsetZ = -200,
      rotationX = 0,
      rotationY = 0,
      rotationZ = 0,
      responsive = true,  // Enable responsive positioning
      glassEffect = false  // Enable glass morphism effect
    } = config

    // Use the imported function from RhsPanel.jsx
    // const element = createRhsPanelDom()
    const cssObject = new CSS3DObject(element)
    
    // Calculate responsive offset based on screen width
    let adjustedOffsetX = offsetX
    if (responsive) {
      const screenRatio = this.screenWidth / 1920  // Base width of 1920px
      adjustedOffsetX = offsetX * screenRatio
    }
    
    // Set initial position and rotation
    cssObject.position.set(adjustedOffsetX, offsetY, offsetZ)
    cssObject.rotation.set(rotationX, rotationY, rotationZ)
    
    // Always add to scene (more reliable)
    this.scene.add(cssObject)
    
    // Store the element with its configuration
    this.uiElements.push({
      object: cssObject,
      offset: { x: offsetX, y: offsetY, z: offsetZ },
      rotation: { x: rotationX, y: rotationY, z: rotationZ },
      responsive: responsive
    })

    return cssObject
  }

  // Update all UI elements to follow camera
  update() {
    this.uiElements.forEach(uiElement => {
      const { object, offset, rotation, responsive } = uiElement
      
      // Calculate responsive offset based on current screen width
      let adjustedOffsetX = offset.x
      if (responsive) {
        const currentScreenWidth = window.innerWidth
        const screenRatio = currentScreenWidth / 1920
        adjustedOffsetX = offset.x * screenRatio
      }
      
      // Calculate position relative to camera
      const cameraOffset = new THREE.Vector3(adjustedOffsetX, offset.y, offset.z)
      cameraOffset.applyQuaternion(this.camera.quaternion)
      object.position.copy(this.camera.position).add(cameraOffset)
      
      // Apply rotation
      object.rotation.set(rotation.x, rotation.y, rotation.z)
      object.rotation.x += this.camera.rotation.x
      object.rotation.y += this.camera.rotation.y
    })
  }

  // Handle window resize
  onResize() {
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight
  }
}

// Background div creator
const backgroundDiv = () => {
  const imageElement = document.createElement('div')
  imageElement.style.width = '4000px'
  imageElement.style.height = '2000px'
  imageElement.style.backgroundImage = 'url(/home_bg.png)'
  imageElement.style.backgroundSize = 'cover'
  imageElement.style.backgroundPosition = 'center'
  imageElement.style.backgroundRepeat = 'no-repeat'
  imageElement.style.borderRadius = '10px'
  imageElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)' 
  return imageElement
}







const App = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1000

    // CSS3D Renderer
    const cssRenderer = new CSS3DRenderer()
    cssRenderer.setSize(window.innerWidth, window.innerHeight)
    cssRenderer.domElement.style.position = 'absolute'
    cssRenderer.domElement.style.top = '0'
    mountRef.current.appendChild(cssRenderer.domElement)

    // Custom First Person Controls
    let controls = {
      update: () => {} // Placeholder
    }
    
    // Mouse and keyboard state
    let mouseX = 0
    let mouseY = 0
    let isMouseDown = false
    let keys = {}
    
    // Camera rotation
    let rotationX = 0
    let rotationY = 0
    let targetRotationX = 0
    let targetRotationY = 0
    
    // Mouse move handler - automatic following
    const handleMouseMove = (event) => {
      // Calculate mouse position relative to center of screen
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const deltaX = event.clientX - centerX
      const deltaY = event.clientY - centerY
      
      // Convert to rotation (sensitivity can be adjusted)
      const sensitivity = 0.00001  // Reduced from 0.001 to 0.0001
      targetRotationY -= deltaX * sensitivity
      targetRotationX -= deltaY * sensitivity  // 看向四个角
      
      // Limit vertical rotation to 30 degrees (π/6 radians)
      const maxVerticalAngle = Math.PI / 60 
      targetRotationX = Math.max(-maxVerticalAngle, Math.min(maxVerticalAngle, targetRotationX))
      
      // Limit horizontal rotation to 30 degrees (π/6 radians)
      const maxHorizontalAngle = Math.PI / 60 
      targetRotationY = Math.max(-maxHorizontalAngle, Math.min(maxHorizontalAngle, targetRotationY))
    }
    
    // Keyboard handlers
    const handleKeyDown = (event) => {
      keys[event.code] = true
    }
    
    const handleKeyUp = (event) => {
      keys[event.code] = false
    }
    
        // Update function for controls
    controls.update = () => {
      // Smooth interpolation for camera rotation
      const lerpFactor = 0.05  // Adjust this value (0.01 to 0.2) for different smoothness
      rotationX += (targetRotationX - rotationX) * lerpFactor
      rotationY += (targetRotationY - rotationY) * lerpFactor
      
      // Apply rotation to camera
      camera.rotation.x = rotationX
      camera.rotation.y = rotationY
      
      // Handle keyboard movement
      const moveSpeed = 10
      const direction = new THREE.Vector3()
      
      // Apply movement in camera's local space
      direction.applyQuaternion(camera.quaternion)
      direction.multiplyScalar(moveSpeed)
      
      camera.position.add(direction)
      
      // Update all UI elements to follow camera
      cameraUI.update()
      
      // Debug: Log UI elements count
      if (Math.random() < 0.016) {
        console.log('UI elements count:', cameraUI.uiElements.length)
        console.log('Camera position:', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2))
      }

    }
    
    // Add event listeners
    mountRef.current.addEventListener('mousemove', handleMouseMove)
    mountRef.current.addEventListener('keydown', handleKeyDown)
    mountRef.current.addEventListener('keyup', handleKeyUp)
     


 
    // Add background div
    const imageObject = new CSS3DObject(backgroundDiv())
    imageObject.position.set(0, 0, -900)
    scene.add(imageObject)

    
    // Create CameraUI instance
    const cameraUI = new CameraUI(scene, camera)

    // LHS Panel
    const lhsPanel = createLhsPanelDom()
    cameraUI.addUIElement(lhsPanel,{
      offsetX: -430,
      offsetY: -180,
      offsetZ: -700,
      rotationX: 0,
      rotationY: Math.PI/30,
      rotationZ: 0,
    })
    
    // const element = createRhsPanelDom()
    const rhsPanel = createRhsPanelDom() // 创建一个div
    // Add UI elements
    cameraUI.addUIElement(rhsPanel,{
      offsetX: 500,
      offsetY: 0,
      offsetZ: -700,
      rotationX: Math.PI/30,
      rotationY: -Math.PI/6,
      rotationZ: Math.PI/50,
      // offsetX: 07
      // offsetY: 0,
      // offsetZ: -900,
      // rotationX: 0,
      // rotationY: 0,
      // rotationZ: 0,
      // glassEffect: false
    })

    const particles = createParticlesDom()
    const particlesObject = new CSS3DObject(particles)
    particlesObject.position.set(0, 0, 150)
    scene.add(particlesObject)
    
    


    // Background div (black)
    mountRef.current.style.background = 'black'

    // Render loop
    const animate = () => {
        requestAnimationFrame(animate)
        
    // Only update controls if they were initialized successfully
    if (controls) {
    controls.update() // Required for FirstPersonControls to work
    
    // Debug: Log camera position every 60 frames (about once per second)
    if (Math.random() < 0.016) {
        // console.log('Camera position:', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2))
        // console.log('Controls state - movementSpeed:', controls.movementSpeed, 'lookSpeed:', controls.lookSpeed)
    }
    }
        
    cssRenderer.render(scene, camera)
    }

    animate()

             // Handle window resize
     const handleResize = () => {
       camera.aspect = window.innerWidth / window.innerHeight
       camera.updateProjectionMatrix()
       cssRenderer.setSize(window.innerWidth, window.innerHeight)
       cameraUI.onResize()  // Update CameraUI with new screen dimensions
     }
    window.addEventListener('resize', handleResize)

     // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize)
        mountRef.current.removeEventListener('mousemove', handleMouseMove)
        mountRef.current.removeEventListener('keydown', handleKeyDown)
        mountRef.current.removeEventListener('keyup', handleKeyUp)
        mountRef.current.removeChild(cssRenderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />
}

export default App
