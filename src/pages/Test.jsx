import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import RhsPanel, { createRhsPanelDom } from '../components/RhsPanel'
import Particles, { createParticlesDom } from '../components/Particles'
import LhsPanel, { createLhsPanelDom } from '../components/LhsPanel'
import home_bg from '../assets/home_bg.webp'
import { mx_bilerp_0 } from 'three/src/nodes/materialx/lib/mx_noise.js'

//大的container里面有很多小的

const originalOffsetX = 400
const originalOffsetY = 0
const originalOffsetZ = -700

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
      responsive = true,  // Enable responsive positioning (can be boolean or object like {x: true, y: false, z: true})
      responsiveX = null,  // Override responsive for X axis
      responsiveY = null,  // Override responsive for Y axis
      responsiveZ = null,  // Override responsive for Z axis
      baseWidth = 1660,    // Base screen width for responsive calculations
      glassEffect = false,  // Enable glass morphism effect
      invertOffset = false,  // Invert all offset directions (multiply by -1)
      invertOffsetX = null,  // Override invert for X axis
      invertOffsetY = null,  // Override invert for Y axis
      invertOffsetZ = null,   // Override invert for Z axis
      responsiveFactorX = 0.25,  // Factor for X axis responsive adjustment (offset change per pixel difference)
      responsiveFactorY = 0.1,   // Factor for Y axis responsive adjustment
      responsiveFactorZ = 0.1,     // Factor for Z axis responsive adjustment
      mobileBreakpoint = 431,  // Screen width breakpoint for mobile adjustments
      mobileOffsetX = null,  // Override offsetX when screen width < mobileBreakpoint
      mobileOffsetY = null,  // Override offsetY when screen width < mobileBreakpoint
      mobileOffsetZ = null,   // Override offsetZ when screen width < mobileBreakpoint
      mobileRotationX = null,  // Override rotationX when screen width < mobileBreakpoint
      mobileRotationY = null,  // Override rotationY when screen width < mobileBreakpoint
      mobileRotationZ = null   // Override rotationZ when screen width < mobileBreakpoint
    } = config

    // Use the imported function from RhsPanel.jsx
    // const element = createRhsPanelDom()
    const cssObject = new CSS3DObject(element)

    // Calculate responsive offsets based on screen width using the same logic as updateResponsiveOffsets
    const currentScreenWidth = this.screenWidth
    const isMobile = currentScreenWidth < mobileBreakpoint

    // Use mobile offsets if screen is below breakpoint and mobile offsets are provided
    const effectiveOffsetX = (isMobile && mobileOffsetX !== null) ? mobileOffsetX : offsetX
    const effectiveOffsetY = (isMobile && mobileOffsetY !== null) ? mobileOffsetY : offsetY
    const effectiveOffsetZ = (isMobile && mobileOffsetZ !== null) ? mobileOffsetZ : offsetZ

    // Use mobile rotations if screen is below breakpoint and mobile rotations are provided
    const effectiveRotationX = (isMobile && mobileRotationX !== null) ? mobileRotationX : rotationX
    const effectiveRotationY = (isMobile && mobileRotationY !== null) ? mobileRotationY : rotationY
    const effectiveRotationZ = (isMobile && mobileRotationZ !== null) ? mobileRotationZ : rotationZ

    const screenDiff = (currentScreenWidth - baseWidth) * 1.1

    // Determine which axes should be responsive
    let responsiveXAxis = responsiveX !== null ? responsiveX : (typeof responsive === 'object' ? responsive.x !== false : responsive)
    let responsiveYAxis = responsiveY !== null ? responsiveY : (typeof responsive === 'object' ? responsive.y !== false : responsive)
    let responsiveZAxis = responsiveZ !== null ? responsiveZ : (typeof responsive === 'object' ? responsive.z !== false : responsive)

    // Determine which axes should be inverted
    let invertX = invertOffsetX !== null ? invertOffsetX : invertOffset
    let invertY = invertOffsetY !== null ? invertOffsetY : invertOffset
    let invertZ = invertOffsetZ !== null ? invertOffsetZ : invertOffset

    // Use custom responsive factors for each axis (same as updateResponsiveOffsets)
    let adjustedOffsetX = responsiveXAxis ? effectiveOffsetX + responsiveFactorX * screenDiff : effectiveOffsetX
    let adjustedOffsetY = responsiveYAxis ? effectiveOffsetY + responsiveFactorY * screenDiff : effectiveOffsetY
    let adjustedOffsetZ = responsiveZAxis ? effectiveOffsetZ + responsiveFactorZ * screenDiff : effectiveOffsetZ

    // Apply inversion if needed
    if (invertX) adjustedOffsetX *= -1
    if (invertY) adjustedOffsetY *= -1
    if (invertZ) adjustedOffsetZ *= -1

    // Set initial position and rotation
    cssObject.position.set(adjustedOffsetX, adjustedOffsetY, adjustedOffsetZ)
    // cssObject.position.set(offsetX, offsetY, offsetZ)
    cssObject.rotation.set(effectiveRotationX, effectiveRotationY, effectiveRotationZ)

    // Always add to scene (more reliable)
    this.scene.add(cssObject)

    // Store the element with its configuration
    this.uiElements.push({
      object: cssObject,
      offset: { x: offsetX, y: offsetY, z: offsetZ },
      rotation: { x: rotationX, y: rotationY, z: rotationZ },
      responsive: { x: responsiveXAxis, y: responsiveYAxis, z: responsiveZAxis },
      baseWidth: baseWidth,
      invertOffset: { x: invertX, y: invertY, z: invertZ },
      adjustedOffset: { x: adjustedOffsetX, y: adjustedOffsetY, z: adjustedOffsetZ },
      responsiveFactor: { x: responsiveFactorX, y: responsiveFactorY, z: responsiveFactorZ },
      mobileBreakpoint: mobileBreakpoint,
      mobileOffset: { x: mobileOffsetX, y: mobileOffsetY, z: mobileOffsetZ },
      mobileRotation: { x: mobileRotationX, y: mobileRotationY, z: mobileRotationZ }
    })

    return cssObject
  }

  // Update all UI elements to follow camera (without recalculating responsive offsets)
  update() {
    this.uiElements.forEach((uiElement) => {
      const { object, rotation, adjustedOffset, mobileBreakpoint = 431, mobileRotation = { x: null, y: null, z: null } } = uiElement

      // Use pre-calculated adjusted offset (calculated in updateResponsiveOffsets)
      if (adjustedOffset) {
        const cameraOffset = new THREE.Vector3(adjustedOffset.x, adjustedOffset.y, adjustedOffset.z)
        cameraOffset.applyQuaternion(this.camera.quaternion)
        object.position.copy(this.camera.position).add(cameraOffset)
      }

      // Determine effective rotation based on screen width
      const isMobile = this.screenWidth < mobileBreakpoint
      const effectiveRotationX = (isMobile && mobileRotation.x !== null) ? mobileRotation.x : rotation.x
      const effectiveRotationY = (isMobile && mobileRotation.y !== null) ? mobileRotation.y : rotation.y
      const effectiveRotationZ = (isMobile && mobileRotation.z !== null) ? mobileRotation.z : rotation.z

      // Apply rotation
      object.rotation.set(effectiveRotationX, effectiveRotationY, effectiveRotationZ)
      object.rotation.x += this.camera.rotation.x
      object.rotation.y += this.camera.rotation.y
    })
  }

  // Update responsive offsets based on current screen width (call this on resize)
  updateResponsiveOffsets() {
    const previousScreenWidth = this.screenWidth
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    // Log screen width change (only when it changes significantly)
    if (Math.abs(this.screenWidth - previousScreenWidth) > 10) {
      console.log(`[CameraUI] Screen width changed: ${previousScreenWidth}px → ${this.screenWidth}px`)
    }

    this.uiElements.forEach((uiElement, index) => {
      const {
        offset,
        responsive,
        baseWidth = 1660,
        invertOffset = { x: false, y: false, z: false },
        responsiveFactor = { x: 0.25, y: 0.1, z: 0.1 },
        mobileBreakpoint = 431,
        mobileOffset = { x: null, y: null, z: null }
      } = uiElement

      // Calculate responsive offsets based on current screen width
      const currentScreenWidth = window.innerWidth
      const isMobile = currentScreenWidth < mobileBreakpoint
      const screenRatio = currentScreenWidth / baseWidth
      const screenDiff = currentScreenWidth - baseWidth

      // Use mobile offsets if screen is below breakpoint and mobile offsets are provided
      const effectiveOffsetX = (isMobile && mobileOffset.x !== null) ? mobileOffset.x : offset.x
      const effectiveOffsetY = (isMobile && mobileOffset.y !== null) ? mobileOffset.y : offset.y
      const effectiveOffsetZ = (isMobile && mobileOffset.z !== null) ? mobileOffset.z : offset.z

      // Use custom responsive factors for each axis
      let adjustedOffsetX = responsive.x ? effectiveOffsetX + responsiveFactor.x * screenDiff : effectiveOffsetX
      let adjustedOffsetY = responsive.y ? effectiveOffsetY + responsiveFactor.y * screenDiff : effectiveOffsetY
      let adjustedOffsetZ = responsive.z ? effectiveOffsetZ + responsiveFactor.z * screenDiff : effectiveOffsetZ
      // Apply inversion if needed
      if (invertOffset.x) adjustedOffsetX *= -1
      if (invertOffset.y) adjustedOffsetY *= -1
      if (invertOffset.z) adjustedOffsetZ *= -1

      // Store adjusted offset for use in update()
      uiElement.adjustedOffset = { x: adjustedOffsetX, y: adjustedOffsetY, z: adjustedOffsetZ }

      // Debug log for responsive elements when screen width changes
      if (Math.abs(this.screenWidth - previousScreenWidth) > 10 && (responsive.x || responsive.y || responsive.z)) {
        console.log(`[CameraUI] Element ${index} responsive update:`, {
          screenWidth: `${previousScreenWidth}px → ${this.screenWidth}px`,
          isMobile: isMobile,
          baseWidth: baseWidth,
          screenRatio: screenRatio.toFixed(3),
          originalOffset: { x: offset.x, y: offset.y, z: offset.z },
          effectiveOffset: { x: effectiveOffsetX, y: effectiveOffsetY, z: effectiveOffsetZ },
          adjustedOffset: { x: adjustedOffsetX.toFixed(2), y: adjustedOffsetY.toFixed(2), z: adjustedOffsetZ.toFixed(2) },
          responsive: responsive
        })
      }
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
  imageElement.style.backgroundImage = `url(${home_bg})`
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
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 20000);
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
      update: () => { } // Placeholder
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
        // console.log('UI elements count:', cameraUI.uiElements.length)
        // console.log('Camera position:', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2))
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
    cameraUI.addUIElement(lhsPanel, {
      offsetX: -430,
      offsetY: -180,
      offsetZ: -700,
      rotationX: 0,
      rotationY: Math.PI / 30,
      rotationZ: 0,
      responsive: true,
      responsiveFactorX: -0.25,  // Negative factor: moves left when screen gets wider
      responsiveFactorY: 0.1,
      responsiveFactorZ: 0.1,
      mobileBreakpoint: 431,  // Apply mobile offsets when width < 426px
      mobileOffsetX: -400,  // Adjust X position for mobile (move closer to center)
      mobileOffsetY: 320,  // Keep Y position same
      mobileOffsetZ: -700,  // Keep Z position same
    })

    // const element = createRhsPanelDom()
    const rhsPanel = createRhsPanelDom() // 创建一个div

    // Adjust RhsPanel size (optional - can also modify CSS)
    const rhsPanelElement = rhsPanel.querySelector('.rhs-panel-3d') || rhsPanel
    if (rhsPanelElement) {
      // Set custom size (uncomment and adjust as needed)
      // rhsPanelElement.style.width = '35vw'  // or '400px', '500px', etc.
      // rhsPanelElement.style.height = '50vh' // or '600px', '700px', etc.
    }

    // Add UI elements
    cameraUI.addUIElement(rhsPanel, {
      offsetX: originalOffsetX,
      offsetY: originalOffsetY,
      offsetZ: originalOffsetZ,
      rotationX: Math.PI / 30,
      rotationY: -Math.PI / 6,
      rotationZ: Math.PI / 50,
      mobileBreakpoint: 431,  // Apply mobile rotation when width < 431px
      mobileRotationZ: 0,  // Set rotationZ to 0 on mobile
      // Responsive options:
      // - responsive: true (default) - all axes scale with screen width
      // - responsive: {x: true, y: false, z: true} - control each axis individually
      // - responsiveX: true/false - override X axis responsiveness
      // - responsiveY: true/false - override Y axis responsiveness
      // - responsiveZ: true/false - override Z axis responsiveness
      // - baseWidth: 1920 (default) - base screen width for calculations
      responsive: true,  // All offsets will scale with screen width
      // responsive: {x: true, y: false, z: true},  // Only X and Z scale, Y stays fixed
      // responsiveX: true,  // Override: only X scales
      // baseWidth: 1920,  // Custom base width (default: 1920px)
    })

    const particles = createParticlesDom()
    const particlesObject = new CSS3DObject(particles)
    particlesObject.position.set(0, 0, -100)
    scene.add(particlesObject)




    // Background div (black)
    mountRef.current.style.background = 'black'

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Only update controls if they were initialized successfully
      if (controls) {
        controls.update() // Required for FirstPersonControls to work

        // Update all UI elements to follow camera and respond to screen size changes
        cameraUI.update()

      }

      cssRenderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      console.log(`[Resize] Window resized: ${newWidth}x${newHeight}`)

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      cssRenderer.setSize(newWidth, newHeight)

      // Update responsive offsets based on new screen size
      cameraUI.updateResponsiveOffsets()

      // Update UI element positions with new offsets
      cameraUI.update()
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
