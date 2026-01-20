export function PadGrid({
    pads,
    currentPage,
    learnMode,
    currentPatch,
    onPadClick,
    clearPage,
    undo,
    canUndo,
    children
}) {
    // Helper to check if patch matches
    const isSelected = (padData) => {
        if (!padData || !currentPatch) return false;
        return padData.bankMSB === currentPatch.bankMSB &&
            padData.bankLSB === currentPatch.bankLSB &&
            padData.program === currentPatch.program;
    };

    const WaveformVisual = () => {
        // Generate pseudo-random bars for visual interest
        const bars = [40, 60, 85, 45, 70, 95, 55, 30, 65, 80, 50, 40];
        return (
            <div className="pad-waveform">
                {bars.map((height, i) => (
                    <div
                        key={i}
                        className="waveform-bar"
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
        );
    };

    // No more JS media queries for layout - handled in CSS
    const renderPad = (padData, index) => {
        const selected = isSelected(padData);
        return (
            <div
                key={index}
                className={`pad ${padData ? 'saved' : ''} ${learnMode ? 'learning' : ''} ${selected ? 'selected' : ''}`}
                onClick={() => onPadClick(index)}
            >
                {padData && <WaveformVisual />}
                <div className="pad-content">
                    <div className="pad-header">
                        <span className="pad-num">{index + 1}</span>
                        <span className="pad-page">P{currentPage}</span>
                    </div>
                    <div className="patch-info">
                        {padData ? (
                            <div className="patch-vals">
                                <span>B:{padData.bankMSB}:{padData.bankLSB}</span>
                                <span>P:{padData.program}</span>
                            </div>
                        ) : (
                            <span className="empty-label">Empty</span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="pads-container">
            <h2>
                <span>Register Pads</span>
                {children}
            </h2>

            <div className="pads-grid" id="padsGrid">
                {pads.map((padData, index) => renderPad(padData, index))}
            </div>

            <div className="log-controls">
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-small" onClick={() => clearPage(currentPage)}>Clear This Page</button>
                    {canUndo && (
                        <button className="btn-small btn-undo" onClick={undo}>
                            Undo Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
