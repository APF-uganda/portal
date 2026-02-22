import { useEffect, useState, useRef } from 'react'
import { Users, Calendar, BookOpen, BarChart3 } from 'lucide-react'

interface StatItemProps {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
}

// Internal component for the animated counter
function StatItem({ icon, value, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    )
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      setCount(0)
      const duration = 2000
      const steps = 60
      const increment = value / steps
      
      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setCount(Math.min(Math.floor(increment * currentStep), value))
        } else {
          clearInterval(timer)
          setCount(value)
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  return (
    <div ref={elementRef} className="flex-1 text-center transition-transform duration-300 hover:-translate-y-2.5 min-w-0 px-1">
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-[#ede9fe] mb-4 animate-bounce-slow">
        {icon}
      </div>
      <h3 className="text-[1.5rem] sm:text-[2.5rem] text-secondary mb-2 font-bold leading-tight">
        {count}{suffix}
      </h3>
      <p className="text-[#666] text-[0.7rem] sm:text-base uppercase tracking-wider font-medium">
        {label}
      </p>
    </div>
  )
}

// Main Stats Section
function Stats({ data }: { data: any[] }) {
  
  // Logic to assign icons based on keywords in the CMS label
  const getDynamicIcon = (label: string = "") => {
    const text = label.toLowerCase();
    const className = "w-6 h-6 sm:w-10 sm:h-10 text-primary";
    
    if (text.includes('member') || text.includes('people')) return <Users className={className} />;
    if (text.includes('event') || text.includes('year')) return <Calendar className={className} />;
    if (text.includes('resource') || text.includes('book')) return <BookOpen className={className} />;
    return <BarChart3 className={className} />;
  };

  // Hardcoded fallback data in case CMS fails or is empty
  const defaultStats = [
    { value: 1000, label: "Active Members" },
    { value: 10, label: "Annual Events" },
    { value: 100, label: "Resources Shared" }
  ];

  const statsToDisplay = data && data.length > 0 ? data : defaultStats;

  return (
    <section className="bg-white py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-row justify-center items-stretch gap-2 sm:gap-8">
        {statsToDisplay.map((item: any, index: number) => (
          <StatItem 
            key={index}
            icon={getDynamicIcon(item.label)} 
            value={Number(item.value)} 
            suffix="+" 
            label={item.label} 
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Stats