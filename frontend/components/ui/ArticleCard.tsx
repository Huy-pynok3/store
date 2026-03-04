interface ArticleCardProps {
  title: string
  category: string
  views: string
  gradient: string
  icon: string
}

export default function ArticleCard({ title, category, views, gradient, icon }: ArticleCardProps) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <div className={`w-full h-32 ${gradient} rounded mb-2 flex items-center justify-center`}>
        <i className={`${icon} text-white text-4xl`}></i>
      </div>
      <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
        {title}
      </h4>
      <p className="text-xs text-gray-600">
        Bài viết: <span className="text-primary">{category}</span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        <i className="far fa-eye"></i> {views}
      </p>
    </div>
  )
}
