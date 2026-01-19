function Timeline() {
  const timelineData = [
    {
      year: '2005',
      title: 'Inaugural Meeting and Formation',
      description: 'The Accountancy Practitioners Forum was officially established, bringing together accounting professionals to strengthen the profession in Uganda.'
    },
    {
      year: '2010',
      title: 'First Annual Conference',
      description: 'Hosted a landmark conference attracting professionals from across the region, discussing innovations in accounting and best practices for future growth.'
    },
    {
      year: '2015',
      title: 'Launch of CPD Accreditation',
      description: 'Introduced a structured Continuous Professional Development program, ensuring members maintain and enhance their skills and knowledge.'
    }
  ]

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 relative">
          <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-primary z-0" />
          {timelineData.map((item, index) => (
            <div key={index} className="flex-1 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary border-4 border-white shadow-lg" />
              </div>
              <div className="text-center">
                <h5 className="text-primary text-2xl font-bold mb-2">
                  {item.year}
                </h5>
                <h6 className="text-[#1e293b] text-base font-semibold mb-3">
                  {item.title}
                </h6>
                <p className="text-[#6b7280] text-sm leading-[1.7]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline
