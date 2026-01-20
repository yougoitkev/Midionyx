import { useEffect, useState } from 'react';

export function StatusBar({ isConnected, midiInput, lastMidiActivity }) {
    const [isMidiActive, setIsMidiActive] = useState(false);

    useEffect(() => {
        setIsMidiActive(true);
        const timer = setTimeout(() => setIsMidiActive(false), 200);
        return () => clearTimeout(timer);
    }, [lastMidiActivity]);

    return (
        <div className="status-bar">
            <div className="status-indicator">
                <div className={`led ${isConnected ? 'connected' : ''}`} id="statusLed"></div>
                <span id="statusText">{isConnected ? `Connected: ${midiInput?.name || 'Device'}` : 'Connecting to MIDI...'}</span>
            </div>
            <div className="status-indicator">
                <div className={`led ${isMidiActive ? 'active' : ''}`} id="midiActivityLed"></div>
                <span id="midiActivityText">{isMidiActive ? 'MIDI Active' : 'MIDI Inactive'}</span>
            </div>
        </div>
    );
}
