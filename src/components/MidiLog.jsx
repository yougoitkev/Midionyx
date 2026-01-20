import { useEffect, useRef } from 'react';

export function MidiLog({ logs, clearLogs }) {
    const logContainerRef = useRef(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="midi-log-container">
            <h2>MIDI Activity Log</h2>
            <div className="log-controls">
                <button className="btn-small" onClick={clearLogs}>Clear Log</button>
                <span id="logCount">{logs.length} messages</span>
            </div>
            <div className="log-messages" ref={logContainerRef}>
                {logs.map(log => (
                    <div key={log.id} className={`log-message ${log.type}`}>
                        [{log.timestamp}] {log.direction === 'SYS' ? '' : `${log.direction}: `}{log.message}
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="log-message info">System initialized. Listening for MIDI messages...</div>
                )}
            </div>
        </div>
    );
}
