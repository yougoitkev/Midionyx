import { useEffect, useState } from 'react';

export function PatchDisplay({
    currentPatch,
    learnMode,
    toggleLearnMode,
    currentPage,
    totalPages,
    createNewPage,
    renamePage,
    deletePage
}) {
    const { bankMSB, bankLSB, program } = currentPatch;

    const getPatchName = () => {
        if (bankMSB === 0 && bankLSB === 0) return `GM Program ${program}`;
        if (bankMSB === 1 && bankLSB === 0) return `Keyboard Program ${program}`;
        if (bankMSB === 0 && bankLSB === 1) return `User Program ${program}`;
        return `Bank ${bankMSB}:${bankLSB} Program ${program}`;
    };

    return (
        <div className="current-patch">
            <h2>Current Patch from Keyboard</h2>
            <div className="patch-display">
                <div className="patch-number" id="currentPatchNumber">{program.toString().padStart(3, '0')}</div>
                <div className="patch-name" id="currentPatchName">{getPatchName()}</div>
            </div>

            <div className="bank-info">
                <div className="bank-item">
                    <div className="label">BANK MSB</div>
                    <div className="value">{bankMSB}</div>
                </div>
                <div className="bank-item">
                    <div className="label">BANK LSB</div>
                    <div className="value">{bankLSB}</div>
                </div>
                <div className="bank-item">
                    <div className="label">PROGRAM</div>
                    <div className="value">{program}</div>
                </div>
            </div>

            <div className="learn-controls">
                <button
                    className={`learn-btn ${learnMode ? 'learning' : ''}`}
                    onClick={toggleLearnMode}
                >
                    {learnMode ? 'EXIT LEARN MODE' : 'ENTER LEARN MODE'}
                </button>
                <div className="instructions">
                    <h3>How to save patches:</h3>
                    <p>1. Click LEARN button to enter Learn Mode<br />
                        2. Use rotary knob on your keyboard to select a patch<br />
                        3. Click any pad (1-8) to save current patch<br />
                        4. Switch pages for more storage (8 pads per page)</p>
                </div>

                <div className="page-management">
                    <h3>Page Management</h3>
                    <p>Page: <span>{currentPage}</span> / <span>{totalPages}</span></p>
                    <div className="page-actions">
                        <button className="btn-purple" onClick={createNewPage}>+ New Page</button>
                        <button className="btn-purple" onClick={() => {
                            const name = prompt('Enter new page name:');
                            if (name) renamePage(currentPage, name);
                        }}>Rename Page</button>
                        <button className="btn-purple" onClick={() => deletePage(currentPage)}>Delete Page</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
