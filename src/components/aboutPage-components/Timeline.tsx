function Timeline() {
  const timelineData = [
    {
      
      title: 'Inaugural Meeting and Formation',
      description:
        'The Accountancy Practitioners Forum was officially established, bringing together accounting professionals to strengthen the profession in Uganda.'
    },
    {
      
      title: 'First Annual Conference',
      description:
        'Hosted a landmark conference attracting professionals from across the region, discussing innovations in accounting and best practices for future growth.'
    },
    {
    
      title: 'Launch of CPD Accreditation',
      description:
        'Introduced a structured Continuous Professional Development program, ensuring members maintain and enhance their skills and knowledge.'
    }
  ]

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">

       
        <div className="relative">
        <img
  src="/timelinedates.svg"
  alt="APF Timeline"
  className="w-full scale-120 md:scale-125 origin-center"
/>


          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {timelineData.map((item, index) => (
              <div key={index} className="text-center px-6">
                <h4 className="text-primary text-2xl font-bold mb-2">
                 
                </h4>
                <h5 className="text-slate-800 font-semibold mb-3">
                  {item.title}
                </h5>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Timeline
