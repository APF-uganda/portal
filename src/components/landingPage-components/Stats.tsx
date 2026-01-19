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
      className="flex-1 text-center animate-fade-in-up transition-transform duration-300 hover:-translate-y-2.5 min-w-0 px-1 sm:px-2"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#ede9fe] mb-2 xs:mb-3 sm:mb-4 animate-bounce-slow">
        {icon}
      </div>
      <h3 className="text-[1.5rem] xs:text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] text-secondary mb-1 sm:mb-2 font-bold leading-tight">
        {count}{suffix}
      </h3>
      <p className="text-[#666] text-[0.7rem] xs:text-[0.8rem] sm:text-sm md:text-base px-1 leading-tight">
        {label}
      </p>
    </div>
  )
}

function Stats() {
  return (
    <section className="bg-white py-6 xs:py-8 sm:py-12 px-2 xs:px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex flex-row justify-center items-stretch gap-2 xs:gap-3 sm:gap-4 md:gap-8">
        <StatItem 
          icon={<Users className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />} 
          value={1000} 
          suffix="+" 
          label="Active Members" 
        />
        <StatItem 
          icon={<Calendar className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />} 
          value={10} 
          suffix="+" 
          label="Annual Events" 
        />
        <StatItem 
          icon={<BookOpen className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />} 
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
