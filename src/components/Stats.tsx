import './Stats.css'

function Stats() {
  return (
    <section className="stats">
      <div className="stat-item">
        <div className="stat-icon">👥</div>
        <h3>1000+</h3>
        <p>Active Members</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">📅</div>
        <h3>10+</h3>
        <p>Annual Events</p>
      </div>
      <div className="stat-item">
        <div className="stat-icon">📢</div>
        <h3>100+</h3>
        <p>Resources Shared</p>
      </div>
    </section>
  )
}

export default Stats
