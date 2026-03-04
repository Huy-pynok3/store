interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-[30px] h-[30px] border border-gray-200 bg-white rounded-sm flex items-center justify-center text-xs text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-chevron-left text-xs"></i>
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-[30px] h-[30px] rounded-sm flex items-center justify-center text-xs ${
            page === currentPage
              ? 'bg-primary text-white border border-primary'
              : 'border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-[30px] h-[30px] border border-gray-200 bg-white rounded-sm flex items-center justify-center text-xs text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-chevron-right text-xs"></i>
      </button>
    </div>
  )
}
