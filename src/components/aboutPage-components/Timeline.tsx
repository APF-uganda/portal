import '../../assets/css/Timeline.css'

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
    <section className="timeline">
      <div className="timeline-container">
        {timelineData.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              <div className="timeline-circle"></div>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-year">{item.year}</h3>
              <h4 className="timeline-title">{item.title}</h4>
              <p className="timeline-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Timeline
