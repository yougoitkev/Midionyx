export function Header({ liveMode, toggleLiveMode }) {
    return (
        <div className="header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>MIDIONYX</h1>
                    <p style={{ color: '#38bdf8', fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>Patch changer with pages</p>
                    <p>Unlimited patch storage with page system - 8 pads per page</p>
                </div>
                <button
                    className={`live-mode-btn ${liveMode ? 'active' : ''}`}
                    onClick={toggleLiveMode}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: liveMode ? '#ef4444' : '#334155',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: liveMode ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: liveMode ? 'white' : '#94a3b8',
                        display: 'block'
                    }}></span>
                    {liveMode ? 'LIVE MODE ON' : 'LIVE MODE OFF'}
                </button>
            </div>
        </div>
    );
}
