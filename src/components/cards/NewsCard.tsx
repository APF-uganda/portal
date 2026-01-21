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
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <div className="h-[200px] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="inline-block text-gray-600 text-xs font-medium mb-3">
          {tag}
        </span>
        <h3 className="text-gray-800 text-lg font-bold mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {description}
        </p>
        <div className="mt-auto">
          <p className="text-gray-500 text-xs mb-3">
            {date} • {readTime}
          </p>
          <button
            onClick={onReadMore}
            className="text-purple-700 font-semibold text-sm hover:text-purple-800 transition-colors"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
