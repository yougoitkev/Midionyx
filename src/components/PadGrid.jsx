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
        // More "Ableton-like" fixed-width bars
        const bars = [30, 70, 45, 90, 65, 40, 85, 55];
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
        // Battery style: simple numeric or alphanumeric labels, minimal visual noise
        return (
            <div
                key={index}
                className={`pad pad-${index + 1} ${padData ? 'saved' : ''} ${learnMode ? 'learning' : ''} ${selected ? 'selected' : ''}`}
                onClick={() => onPadClick(index)}
            >
                {padData && <WaveformVisual />}
                <div className="pad-content">
                    <div className="pad-header">
                        <span className="pad-num">{index + 1}</span>
                    </div>
                    <div className="patch-info">
                        {padData ? (
                            <div className="patch-vals">
                                <span className="patch-name">{padData.name || 'PATCH'}</span>
                                <span className="patch-meta">
                                    <span className="label-tiny">B</span> {padData.bankMSB}:{padData.bankLSB}
                                    <span className="label-tiny"> P</span> {padData.program}
                                </span>
                            </div>
                        ) : (
                            <span className="empty-label">EMPTY</span>
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
