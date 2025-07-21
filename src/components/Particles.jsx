import React, { useEffect, useRef, useState } from 'react'
import RhodeIslandSVG from '/main_Rhode_Island.svg'
import gsap from 'gsap'

// Particle 构造函数
class Particle {
  constructor(x, y, id, delay) {
    this.id = id
    this.x = x
    this.y = y
    this.original_x = x
    this.original_y = y
    this.delay = delay
    this.isHovered = false
    this.element = null // 存储对应的DOM元素引用
  }
  
  // 设置DOM元素引用
  setElement(element) {
    this.element = element
  }
  
  // 重置到原始位置
  resetPosition() {
    this.x = this.original_x
    this.y = this.original_y
  }
  
  // 更新悬停状态和位置
  updateHover(mouseX, mouseY, mouseRadius) {
    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    this.isHovered = distance < mouseRadius
    
    if (this.isHovered) {
      // 将粒子推到鼠标半径边缘
      const targetX = mouseX + (dx / distance) * mouseRadius
      const targetY = mouseY + (dy / distance) * mouseRadius
      
      this.x = targetX
      this.y = targetY
      
      // 使用GSAP动画DOM元素
      if (this.element) {
        gsap.to(this.element, {
          attr: {
            cx: targetX,
            cy: targetY
          },
          duration: 0.3,
          ease: "power2.out"
        })
      }
    } else {
      // 重置到原始位置
      if (this.element) {
        gsap.to(this.element, {
          attr: {
            cx: this.original_x,
            cy: this.original_y
          },
          duration: 0.5,
          ease: "power2.out"
        })
      }
      this.resetPosition()
    }
  }
}

// 解析SVG路径并提取所有坐标点
const parseSVGPath = (pathData) => {
  const points = []
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g) || []
  
  let currentX = 0
  let currentY = 0
  
  commands.forEach(command => {
    const type = command[0]
    const coords = command.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
    
    switch (type) {
      case 'M': // Move to (absolute)
        for (let i = 0; i < coords.length; i += 2) {
          if (coords[i] !== undefined && coords[i + 1] !== undefined) {
            currentX = coords[i]
            currentY = coords[i + 1]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'L': // Line to (absolute)
        for (let i = 0; i < coords.length; i += 2) {
          if (coords[i] !== undefined && coords[i + 1] !== undefined) {
            currentX = coords[i]
            currentY = coords[i + 1]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'H': // Horizontal line to (absolute)
        coords.forEach(x => {
          currentX = x
          points.push({ x: currentX, y: currentY })
        })
        break
      case 'V': // Vertical line to (absolute)
        coords.forEach(y => {
          currentY = y
          points.push({ x: currentX, y: currentY })
        })
        break
      case 'C': // Cubic curve to (absolute)
        for (let i = 0; i < coords.length; i += 6) {
          if (coords[i + 4] !== undefined && coords[i + 5] !== undefined) {
            currentX = coords[i + 4]
            currentY = coords[i + 5]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'S': // Smooth cubic curve to (absolute)
        for (let i = 0; i < coords.length; i += 4) {
          if (coords[i + 2] !== undefined && coords[i + 3] !== undefined) {
            currentX = coords[i + 2]
            currentY = coords[i + 3]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'Q': // Quadratic curve to (absolute)
        for (let i = 0; i < coords.length; i += 4) {
          if (coords[i + 2] !== undefined && coords[i + 3] !== undefined) {
            currentX = coords[i + 2]
            currentY = coords[i + 3]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'T': // Smooth quadratic curve to (absolute)
        for (let i = 0; i < coords.length; i += 2) {
          if (coords[i] !== undefined && coords[i + 1] !== undefined) {
            currentX = coords[i]
            currentY = coords[i + 1]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'A': // Arc to (absolute)
        for (let i = 0; i < coords.length; i += 7) {
          if (coords[i + 5] !== undefined && coords[i + 6] !== undefined) {
            currentX = coords[i + 5]
            currentY = coords[i + 6]
            points.push({ x: currentX, y: currentY })
          }
        }
        break
      case 'Z': // Close path
        // Don't add a point for close path
        break
    }
  })
  
  return points
}

// 读取SVG文件并提取路径数据
const readSVGData = async (svgPath) => {
  try {
    const response = await fetch(svgPath)
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status}`)
    }
    
    const svgText = await response.text()
    
    // 解析SVG XML
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
    
    // 查找所有path元素
    const paths = svgDoc.querySelectorAll('path')
    console.log(`Found ${paths.length} path elements in SVG`)
    
    // 也检查其他可能包含路径的元素
    const polygons = svgDoc.querySelectorAll('polygon')
    const polylines = svgDoc.querySelectorAll('polyline')
    const rects = svgDoc.querySelectorAll('rect')
    const circles = svgDoc.querySelectorAll('circle')
    const ellipses = svgDoc.querySelectorAll('ellipse')
    
    console.log(`Found ${polygons.length} polygon elements`)
    console.log(`Found ${polylines.length} polyline elements`)
    console.log(`Found ${rects.length} rect elements`)
    console.log(`Found ${circles.length} circle elements`)
    console.log(`Found ${ellipses.length} ellipse elements`)
    
    const allPoints = []
    
    paths.forEach((path, index) => {
      const d = path.getAttribute('d')
      if (d) {
        const points = parseSVGPath(d)
        console.log(`Path ${index}: ${points.length} points extracted`)
        allPoints.push(...points)
      } else {
        console.log(`Path ${index}: No 'd' attribute found`)
      }
    })
    
    console.log(`Total points extracted: ${allPoints.length}`)
    
    // 检查坐标范围
    if (allPoints.length > 0) {
      const xCoords = allPoints.map(p => p.x)
      const yCoords = allPoints.map(p => p.y)
      const minX = Math.min(...xCoords)
      const maxX = Math.max(...xCoords)
      const minY = Math.min(...yCoords)
      const maxY = Math.max(...yCoords)
      
      console.log(`Coordinate range: X(${minX} to ${maxX}), Y(${minY} to ${maxY})`)
    }
    
    return allPoints
  } catch (error) {
    console.error('Error reading SVG file:', error)
    return []
  }
}

const Particles = () => {
  const [particles, setParticles] = useState([])
  const containerRef = useRef(null)

    useEffect(() => {
    const loadSVGData = async () => {
      // 读取SVG文件
    //   const points = await readSVGData('/main_Rhode_Island.svg')
    const points = await readSVGData('/sm_ptc.svg')

      
      if (points.length > 0) {
        // 为了性能，每1个点取1个
        const sampledPoints = points.filter((_, index) => index%15=== 0)
        
        // 创建粒子数据
        const particleData = sampledPoints.map((point, index) => 
          new Particle(point.x, point.y, index, Math.random() * 2)
        )
        
        setParticles(particleData)
      }
    }
    
    loadSVGData()
  }, [])

  // 鼠标移动处理函数
  const handleMouseMove = (event) => {
    const mouse_radius = 15;
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        particle.updateHover(mouseX, mouseY, mouse_radius)
        return particle
      })
    )
  }

  return (
    <div ref={containerRef} className="particles-container">
      {/* Original SVG */}
      {/* <img 
        src={RhodeIslandSVG} 
        alt="Rhode Island" 
        style={{ 
          position: 'absolute', 
          top: "100px", 
          left: "400px", 
          filter: "invert(1)",
          width: "400px",
          height: "auto"
        }} 
      /> */}
      
      {/* Particle overlay */}
      <svg 
        width="100%" 
        height="100%" 
        style={{ position: 'absolute', top: "100px", left: "400px", filter: "invert(1)" }}
        onMouseMove={handleMouseMove}
      >
        {particles.map((particle) => (
          <circle
            key={particle.id}
            ref={(el) => {
              if (el) particle.setElement(el)
            }}
            cx={particle.x}
            cy={particle.y}
            r="1"
            fill={particle.isHovered ? "#ff0000" : "#e46a13"}
            opacity="0.7"
            style={{
              animationName: particle.isHovered ? "none" : "pulse",
              animationDuration: particle.isHovered ? "0s" : "2s",
              animationTimingFunction: particle.isHovered ? "ease" : "ease-in-out",
              animationIterationCount: particle.isHovered ? "0" : "infinite",
              animationDelay: `${particle.delay}s`,
              transition: "fill 0.2s ease"
            }}
          />
        ))}
      </svg>
      
      {/* <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }
      `}</style> */}
    </div>
  )
}

export default Particles