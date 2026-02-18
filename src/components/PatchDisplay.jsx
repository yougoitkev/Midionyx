import { useState } from 'react';
import { Info, X } from 'lucide-react';

export function PatchDisplay({
    currentPatch,
    learnMode,
    toggleLearnMode,
    currentPage,
    totalPages,
    createNewPage,
    renamePage,
    deletePage,
    setShowLog
}) {
    const { bankMSB, bankLSB, program } = currentPatch;
    const [showHelp, setShowHelp] = useState(false);

    const getPatchName = () => {
        if (bankMSB === 0 && bankLSB === 0) return `GM Program ${program}`;
        if (bankMSB === 1 && bankLSB === 0) return `Keyboard Program ${program}`;
        if (bankMSB === 0 && bankLSB === 1) return `User Program ${program}`;
        return `Bank ${bankMSB}:${bankLSB} Program ${program}`;
    };

    return (
        <div className="current-patch-container">
            {/* Learn Mode Toggle & Info */}
            <div className="learn-strip">
                <button
                    className={`learn-btn ${learnMode ? 'learning' : ''}`}
                    onClick={toggleLearnMode}
                >
                    {learnMode ? 'EXIT LEARN MODE' : 'ENTER LEARN MODE'}
                </button>
                <button
                    className={`info-btn ${showHelp ? 'active' : ''}`}
                    onClick={() => setShowHelp(!showHelp)}
                    title="How to save patches"
                >
                    <Info size={20} />
                </button>
            </div>

            {/* Steps / Instructions Popup/Tooltip */}
            {showHelp && (
                <div className="instructions-popup">
                    <div className="instructions-header">
                        <h3>How to save patches:</h3>
                        <button onClick={() => setShowHelp(false)} className="close-btn"><X size={16} /></button>
                    </div>
                    <p>1. Click <b>LEARN</b> button to form a connection</p>
                    <p>2. Twist knobs/press keys on hardware to select patch</p>
                    <p>3. Tap any <b>Pad (1-8)</b> to save current settings</p>
                    <p>4. Use <b>Page</b> buttons for more slots</p>
                </div>
            )}

            {/* Popup for Current Patch Data (Only in Learn Mode) */}
            {learnMode && (
                <div className="patch-data-popup">
                    <h2>Incoming Patch Data</h2>
                    <div className="patch-display-compact">
                        <div className="patch-big-number">{program.toString().padStart(3, '0')}</div>
                        <div className="patch-name-scroll">{getPatchName()}</div>
                    </div>

                    <div className="bank-info-compact">
                        <div className="bank-col">
                            <span className="lbl">MSB</span>
                            <span className="val">{bankMSB}</span>
                        </div>
                        <div className="bank-col">
                            <span className="lbl">LSB</span>
                            <span className="val">{bankLSB}</span>
                        </div>
                        <div className="bank-col">
                            <span className="lbl">PC</span>
                            <span className="val">{program}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-management">
                <h3>Page Management</h3>
                <p>Page: <span>{currentPage}</span> / <span>{totalPages}</span></p>
                <div className="page-actions">
                    <button className="btn-purple" onClick={createNewPage}>+ New</button>
                    <button className="btn-purple" onClick={() => {
                        const name = prompt('Enter new page name:');
                        if (name) renamePage(currentPage, name);
                    }}>Rename</button>
                    <button className="btn-purple" onClick={() => deletePage(currentPage)}>Delete</button>
                </div>
            </div>

            <button
                className="btn-small"
                onClick={() => setShowLog(true)}
                style={{ width: '100%', marginTop: '10px' }}
            >
                View MIDI Log
            </button>
        </div>
    );
}
