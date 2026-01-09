import '../../assets/css/NewsCard.css'

interface NewsCardProps {
  image: string
  tag: string
  title: string
  description: string
  date: string
  readTime: string
  onReadMore?: () => void
}

function NewsCard({ image, tag, title, description, date, readTime, onReadMore }: NewsCardProps) {
  return (
    <div className="news-card">
      <img src={image} alt={title} />
      <span className="news-tag">{tag}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="news-date">{date} • {readTime}</p>
      <button className="read-more" onClick={onReadMore}>
        Read More
      </button>
    </div>
  )
}

export default NewsCard
