import { useEffect, useState, useRef } from 'react'
import './Stats.css'

interface StatItemProps {
  icon: string
  value: number
  suffix: string
  label: string
}

function StatItem({ icon, value, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      setCount(0) // Reset count when becoming visible
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      const stepDuration = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setCount(Math.min(Math.floor(increment * currentStep), value))
        } else {
          clearInterval(timer)
          setCount(value)
        }
      }, stepDuration)

      return () => clearInterval(timer)
    } else {
      setCount(0) // Reset when not visible
    }
  }, [isVisible, value])

  return (
    <div ref={elementRef} className="stat-item">
      <div className="stat-icon">{icon}</div>
      <h3>{count}{suffix}</h3>
      <p>{label}</p>
    </div>
  )
}

function Stats() {
  return (
    <section className="stats">
      <StatItem icon="👥" value={1000} suffix="+" label="Active Members" />
      <StatItem icon="📅" value={10} suffix="+" label="Annual Events" />
      <StatItem icon="📢" value={100} suffix="+" label="Resources Shared" />
    </section>
  )
}

export default Stats
