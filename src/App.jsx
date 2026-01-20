import { useState, useEffect } from 'react';
import { useMidi } from './hooks/useMidi';
import { usePages } from './hooks/usePages';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { PatchDisplay } from './components/PatchDisplay';
import { PadGrid } from './components/PadGrid';
import { PageNavigation } from './components/PageNavigation';
import { MidiLog } from './components/MidiLog';

function App() {
    const {
        isConnected, midiInput, midiOutput, lastMidiActivity, midiLogs,
        sendMidiMessage, clearLogs, currentPatch, setPatch
    } = useMidi();

    const {
        pages, currentPage, totalPages, goToPage, nextPage, prevPage,
        createNewPage, renamePage, deletePage, clearPage, undo, canUndo, savePatchToPad, getPadData, isLoaded
    } = usePages();

    const [learnMode, setLearnMode] = useState(false);
    const [liveMode, setLiveMode] = useState(false);

    const toggleLearnMode = () => {
        setLearnMode(!learnMode);
    };

    const toggleLiveMode = () => {
        setLiveMode(!liveMode);
    };

    // Lock scroll in Live Mode
    useEffect(() => {
        if (liveMode) {
            document.body.style.overflow = 'hidden';
            // Prevent touch move to stop bounce scroll on iOS
            const preventDefault = (e) => e.preventDefault();
            document.body.addEventListener('touchmove', preventDefault, { passive: false });
            return () => {
                document.body.style.overflow = '';
                document.body.removeEventListener('touchmove', preventDefault);
            };
        } else {
            document.body.style.overflow = '';
        }
    }, [liveMode]);

    const handlePadClick = (index) => {
        if (learnMode) {
            // Save current patch to pad
            const patchData = {
                ...currentPatch,
                timestamp: Date.now(),
                page: currentPage
            };
            savePatchToPad(currentPage, index, patchData);
        } else {
            // Load patch from pad
            const patchData = getPadData(currentPage, index);
            if (patchData) {
                // Send MIDI
                if (midiOutput && isConnected) {
                    // Bank Select
                    // Note: Channel is hardcoded to 1 (0x0) for now, similar to original logic
                    // Original logic used 0xB3 (Channel 4) for output?
                    // Let's check original code.
                    // Line 1032: midiOutput.send([0xB3, 0x00, patchData.bankMSB]);
                    // Line 1037: midiOutput.send([0xC3, programMidi]);
                    // So it was using Channel 4 (0x3).
                    // I should probably stick to that or make it configurable.
                    // I'll stick to Channel 4 (0xB3, 0xC3) to match original behavior.

                    sendMidiMessage([0xB3, 0x00, patchData.bankMSB]); // MSB Ch 4
                    sendMidiMessage([0xB3, 0x20, patchData.bankLSB]); // LSB Ch 4

                    const programMidi = Math.max(0, Math.min(127, patchData.program - 1));
                    sendMidiMessage([0xC3, programMidi]); // PC Ch 4
                }
                // Update display
                setPatch(patchData);
            }
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.key.toUpperCase();
            const keyMap = {
                '1': 0, '2': 1, '3': 2, '4': 3,
                '5': 4, '6': 5, '7': 6, '8': 7,
                '9': 8, '0': 9,
                'A': 10, 'B': 11, 'C': 12,
                'D': 13, 'E': 14, 'F': 15
            };

            if (key in keyMap) {
                e.preventDefault();
                handlePadClick(keyMap[key]);
            }

            if (e.key === 'Escape' && learnMode) {
                setLearnMode(false);
            }

            if (e.key === ' ') {
                e.preventDefault();
                toggleLearnMode();
            }

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevPage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextPage();
            }

            if (e.ctrlKey) {
                if (e.key === 'PageUp') {
                    e.preventDefault();
                    prevPage();
                } else if (e.key === 'PageDown') {
                    e.preventDefault();
                    nextPage();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [learnMode, currentPage, isLoaded, currentPatch, midiOutput, isConnected]);

    if (!isLoaded) return <div className="loading">Loading...</div>;

    const currentPads = pages[currentPage]?.pads || Array(16).fill(null);

    return (
        <div className={`container ${liveMode ? 'live-mode' : ''}`}>
            {/* Show a simplified header or just the toggle in live mode if needed, 
                but per plan we might want to hide regular header. 
                However, we need a way to exit Live Mode. 
                Let's include the button inside the main view for now or keep Header visible but styled differently.
                Actually, the plan said "Hide Header ... in Live Mode".
                So we need a persistent "Exit Live Mode" button visible somewhere else OR 
                allow the Header to render a minimal version.
                For now, let's keep Header but let CSS hide parts of it, 
                OR conditionally render a "Exit Live Button" floating if header is gone.
                
                Let's stick to the plan: Hide Header.
                But wait, if we hide the header, where is the button to turn it OFF?
                Better to keep the Header but maybe compact it, or move the toggle out of the header?
                
                Let's render a Floating "Exit Live Mode" button if liveMode is ON, 
                and render Header only if liveMode is OFF.
            */}
            {liveMode && (
                <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 2000 }}>
                    <button
                        onClick={toggleLiveMode}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#ef4444',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                        }}
                    >
                        EXIT LIVE MODE
                    </button>
                </div>
            )}
            {!liveMode && <Header liveMode={liveMode} toggleLiveMode={toggleLiveMode} />}

            <StatusBar
                isConnected={isConnected}
                midiInput={midiInput}
                lastMidiActivity={lastMidiActivity}
            />

            <div className="main-controls">
                <PatchDisplay
                    currentPatch={currentPatch}
                    learnMode={learnMode}
                    toggleLearnMode={toggleLearnMode}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    createNewPage={createNewPage}
                    renamePage={renamePage}
                    deletePage={deletePage}
                />

                <PadGrid
                    pads={currentPads}
                    currentPage={currentPage}
                    learnMode={learnMode}
                    currentPatch={currentPatch}
                    onPadClick={handlePadClick}
                    clearPage={clearPage}
                    undo={undo}
                    canUndo={canUndo}
                >
                    <PageNavigation
                        currentPage={currentPage}
                        totalPages={totalPages}
                        goToPage={goToPage}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        liveMode={liveMode}
                    />
                </PadGrid>
            </div>

            <div className="midi-log-wrapper" style={{ padding: '0 30px 30px' }}>
                <MidiLog logs={midiLogs} clearLogs={clearLogs} />
            </div>

            <div className="footer">
                MIDIONYX patch changer | Unlimited Pages | Web MIDI API | Works with Chrome, Edge, Opera
            </div>
        </div>
    );
}

export default App;
