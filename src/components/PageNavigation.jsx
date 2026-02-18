import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export function PageNavigation({ currentPage, totalPages, goToPage, nextPage, prevPage, liveMode }) {
    const getPageButtons = () => {
        const buttons = [];
        // Battery-style: Often A-H, but we have 1-32. 
        // We'll treat them as a "Cell Matrix" selector.
        for (let i = 1; i <= totalPages; i++) {
            // Calculate pseudo "Bank" letter for fun/aesthetic? 
            // 32 pages is a lot. Let's keep numbers but maybe grouped?
            // Actually, Battery 4 has a 12x16 grid or similar.
            // Let's just render clean cells.
            buttons.push(
                <button
                    key={i}
                    className={`page-cell ${i === currentPage ? 'active' : ''}`}
                    onClick={() => goToPage(i)}
                    title={`Go to Page ${i}`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };


    return (
        <div className="pages-controls">
            <div className="page-buttons">
                {getPageButtons()}
            </div>
            <div className="pages-nav">
                <button className="nav-btn" onClick={prevPage} disabled={currentPage <= 1} title="Previous Page">PRV</button>
                <div className="page-info">
                    PAGE <span>{currentPage}</span> / <span>{totalPages}</span>
                </div>
                <button className="nav-btn" onClick={nextPage} disabled={currentPage >= totalPages} title="Next Page">NXT</button>
            </div>
        </div>
    );
}
