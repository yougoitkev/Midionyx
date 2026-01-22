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
                <button className="nav-btn" onClick={prevPage} disabled={currentPage <= 1} title="Previous Page">PRV</button>
                <div className="page-info">
                    PAGE <span>{currentPage}</span> / <span>{totalPages}</span>
                </div>
                <button className="nav-btn" onClick={nextPage} disabled={currentPage >= totalPages} title="Next Page">NXT</button>
            </div>
        </div>
    );
}
