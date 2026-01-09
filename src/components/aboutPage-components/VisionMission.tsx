import '../../assets/css/VisionMission.css'

function VisionMission() {
  const objectives = [
    { icon: '🎯', text: 'Advocacy & Representation' },
    { icon: '🤝', text: 'Networking & Collaboration' },
    { icon: '📋', text: 'Policy Engagement' },
    { icon: '🎓', text: 'Learning Community' },
    { icon: '👁️', text: 'Public Awareness' },
    { icon: '📚', text: 'Knowledge Hub' },
    { icon: '💼', text: 'Innovation & Talent' },
    { icon: '⚖️', text: 'Practice Enablers' }
  ]

  return (
    <section className="vision-mission">
      <div className="vm-container">
        <div className="vm-card vision-card">
          <div className="vm-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="white"/>
            </svg>
          </div>
          <h3>Our Vision</h3>
          <p>
            To be the leading voice in uplifting standards advancing a strong, 
            ethical and globally competitive accountancy profession in Uganda and beyond.
          </p>
        </div>

        <div className="vm-card mission-card">
          <div className="vm-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="#7c3aed"/>
            </svg>
          </div>
          <h3>Our Mission</h3>
          <p>
            To empower accounting professionals through collaborative, continuous 
            learning, ethical engagement, and advocacy, strengthening the 
            accountancy profession in Uganda.
          </p>
        </div>

        <div className="objectives-card">
          <h3>Our Objectives</h3>
          <div className="objectives-grid">
            {objectives.map((obj, index) => (
              <div key={index} className="objective-item">
                <span className="objective-icon">{obj.icon}</span>
                <span className="objective-text">{obj.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionMission
