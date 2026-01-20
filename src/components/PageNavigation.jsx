import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export function PageNavigation({ currentPage, totalPages, goToPage, nextPage, prevPage, liveMode }) {
    const getPageButtons = () => {
        const buttons = [];
        const maxVisible = 5;
        const pagesToShow = new Set([1, totalPages]);

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pagesToShow.add(i);
        }

        const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
        let lastPage = 0;

        sortedPages.forEach(pageNum => {
            if (pageNum > lastPage + 1) {
                buttons.push(<span key={`ellipsis-${pageNum}`} style={{ color: '#64748b', padding: '0 5px' }}>...</span>);
            }
            buttons.push(
                <button
                    key={pageNum}
                    className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                    onClick={() => goToPage(pageNum)}
                >
                    {pageNum}
                </button>
            );
            lastPage = pageNum;
        });

        return buttons;
    };

    if (liveMode) {
        return (
            <div className="live-navigation" style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000 }}>
                <button
                    className="nav-btn-live"
                    onClick={prevPage}
                    disabled={currentPage <= 1}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '2px solid #38bdf8',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <ChevronUp size={32} />
                </button>
                <div className="page-info" style={{ textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '5px', color: '#fff', fontWeight: 'bold' }}>
                    P{currentPage}
                </div>
                <button
                    className="nav-btn-live"
                    onClick={nextPage}
                    disabled={currentPage >= totalPages}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '2px solid #38bdf8',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <ChevronDown size={32} />
                </button>
            </div>
        );
    }

    return (
        <div className="pages-controls">
            <div className="page-buttons">
                {getPageButtons()}
            </div>
            <div className="pages-nav">
                <button className="nav-btn" onClick={prevPage} disabled={currentPage <= 1} title="Previous Page">←</button>
                <div className="page-info">
                    Page <span>{currentPage}</span> of <span>{totalPages}</span>
                </div>
                <button className="nav-btn" onClick={nextPage} disabled={currentPage >= totalPages} title="Next Page">→</button>
            </div>
        </div>
    );
}
