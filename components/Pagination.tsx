import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination = ({ 
    currentPage, 
    totalItems, 
    pageSize, 
    onPageChange, 
    onPageSizeChange 
}: PaginationProps) => {
    const t = useTranslations();
    const totalPages = Math.ceil(totalItems / pageSize);
    const listSize = [10, 20, 30, 50];
    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push('...');
            }
        }
        return Array.from(new Set(pages));
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 bg-white border-t border-gray-100 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{t('display')}</span>
                <select 
                    className="border border-gray-300 rounded px-2 py-1 outline-none bg-white cursor-pointer"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    {listSize.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <span>/ {t('total')} <span className="font-semibold">{totalItems}</span></span>
            </div>

            <div className="flex items-center gap-1">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-2.5 h-2.5" />
                </button>

                {renderPageNumbers().map((page, idx) => (
                    typeof page === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-all ${
                                currentPage === page 
                                ? 'bg-[#1e3a5f] text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                            }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={idx} className="px-1 text-gray-400">...</span>
                    )
                ))}

                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;