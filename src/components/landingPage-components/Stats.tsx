import { useEffect, useState, useRef } from 'react'
import { Users, Calendar, BookOpen } from 'lucide-react'

interface StatItemProps {
  icon: React.ReactNode
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
      setCount(0)
      const duration = 2000
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
      setCount(0)
    }
  }, [isVisible, value])

  return (
    <div 
      ref={elementRef} 
      className="text-center animate-fade-in-up transition-transform duration-300 hover:-translate-y-2.5"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#ede9fe] mb-4 animate-bounce-slow">
        {icon}
      </div>
      <h3 className="text-[2.5rem] text-secondary mb-2 font-bold">
        {count}{suffix}
      </h3>
      <p className="text-[#666]">
        {label}
      </p>
    </div>
  )
}

function Stats() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around gap-8">
        <StatItem 
          icon={<Users className="w-10 h-10 text-primary" />} 
          value={1000} 
          suffix="+" 
          label="Active Members" 
        />
        <StatItem 
          icon={<Calendar className="w-10 h-10 text-primary" />} 
          value={10} 
          suffix="+" 
          label="Annual Events" 
        />
        <StatItem 
          icon={<BookOpen className="w-10 h-10 text-primary" />} 
          value={100} 
          suffix="+" 
          label="Resources Shared" 
        />
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Stats
