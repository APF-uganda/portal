function Stepper({ 
  steps, 
  currentStep, 
  completedSteps = [] 
}: { 
  steps: string[]; 
  currentStep: number;
  completedSteps?: number[];
}) {
  return (
    <div className="w-full overflow-x-auto mb-10">
      <div className="flex items-center justify-center gap-4 sm:gap-6 whitespace-nowrap px-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 shrink-0">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                index === currentStep
                  ? "bg-purple-600 text-white"
                  : completedSteps.includes(index)
                  ? "bg-gray-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {step}
            </span>
            {index !== steps.length - 1 && (
              <div className="w-10 h-px bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;