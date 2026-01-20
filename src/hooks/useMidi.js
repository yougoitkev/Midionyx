import { useState, useEffect, useCallback, useRef } from 'react';

export function useMidi() {
    const [midiAccess, setMidiAccess] = useState(null);
    const [midiInput, setMidiInput] = useState(null);
    const [midiOutput, setMidiOutput] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMidiActivity, setLastMidiActivity] = useState(Date.now());
    const [midiLogs, setMidiLogs] = useState([]);

    // Patch State
    const [currentBankMSB, setCurrentBankMSB] = useState(0);
    const [currentBankLSB, setCurrentBankLSB] = useState(0);
    const [currentProgram, setCurrentProgram] = useState(0);

    const logMidiMessage = useCallback((direction, status, data1, data2) => {
        const timestamp = new Date().toLocaleTimeString();
        const channel = (status & 0x0F) + 1;
        const messageType = status >> 4;

        let messageTypeStr = '';
        switch (messageType) {
            case 0x8: messageTypeStr = 'Note Off'; break;
            case 0x9: messageTypeStr = 'Note On'; break;
            case 0xB: messageTypeStr = 'Control Change'; break;
            case 0xC: messageTypeStr = 'Program Change'; break;
            default: messageTypeStr = `0x${messageType.toString(16)}`; break;
        }

        let message = '';
        if (messageType === 0xC) {
            message = `Ch ${channel} ${messageTypeStr}: ${data1 + 1}`;
        } else if (messageType === 0xB) {
            const ccNames = {
                0: 'Bank Select MSB',
                32: 'Bank Select LSB'
            };
            const ccName = ccNames[data1] || `CC${data1}`;
            message = `Ch ${channel} ${ccName}: ${data2}`;
        } else {
            message = `Ch ${channel} ${messageTypeStr}: ${data1} ${data2 !== undefined ? data2 : ''}`;
        }

        const newLog = {
            id: Date.now() + Math.random(),
            timestamp,
            direction,
            message,
            type: direction === 'IN' ? 'incoming' : 'outgoing'
        };

        setMidiLogs(prev => {
            const newLogs = [...prev, newLog];
            if (newLogs.length > 50) newLogs.shift();
            return newLogs;
        });
    }, []);

    const logSystemMessage = useCallback((text, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = {
            id: Date.now() + Math.random(),
            timestamp,
            direction: 'SYS',
            message: text,
            type
        };
        setMidiLogs(prev => {
            const newLogs = [...prev, newLog];
            if (newLogs.length > 50) newLogs.shift();
            return newLogs;
        });
    }, []);

    const handleMidiMessage = useCallback((event) => {
        const [status, data1, data2] = event.data;
        const messageType = status >> 4;

        setLastMidiActivity(Date.now());
        logMidiMessage('IN', status, data1, data2);

        // Update Patch State
        if (messageType === 0xB) { // Control Change
            if (data1 === 0) { // Bank MSB
                setCurrentBankMSB(data2);
            } else if (data1 === 32) { // Bank LSB
                setCurrentBankLSB(data2);
            }
        } else if (messageType === 0xC) { // Program Change
            setCurrentProgram(data1 + 1);
        }
    }, [logMidiMessage]);

    const findMidiDevices = useCallback((access) => {
        let input = null;
        let output = null;

        // Find input
        for (const entry of access.inputs.values()) {
            if (entry.name.toLowerCase().includes('go:keys') ||
                entry.name.toLowerCase().includes('roland')) {
                input = entry;
                break;
            }
        }
        if (!input) input = access.inputs.values().next().value;

        // Find output
        for (const entry of access.outputs.values()) {
            if (entry.name.toLowerCase().includes('go:keys') ||
                entry.name.toLowerCase().includes('roland')) {
                output = entry;
                break;
            }
        }

        setMidiInput(input);
        setMidiOutput(output);

        if (input) {
            logSystemMessage(`Listening to: ${input.name}`, 'info');
            setIsConnected(true);
            input.onmidimessage = handleMidiMessage;
        } else {
            logSystemMessage('No MIDI input device found', 'warning');
            setIsConnected(false);
        }
    }, [handleMidiMessage, logSystemMessage]);

    useEffect(() => {
        if (!navigator.requestMIDIAccess) {
            logSystemMessage('Web MIDI API not supported', 'warning');
            return;
        }

        navigator.requestMIDIAccess({ sysex: false })
            .then(access => {
                setMidiAccess(access);
                logSystemMessage('MIDI access granted', 'info');
                findMidiDevices(access);

                access.onstatechange = (e) => {
                    logSystemMessage(`Device ${e.port.name} ${e.port.state}`, 'info');
                    findMidiDevices(access);
                };
            })
            .catch(err => {
                logSystemMessage(`MIDI Error: ${err.message}`, 'warning');
            });
    }, [findMidiDevices, logSystemMessage]);

    const sendMidiMessage = useCallback((bytes) => {
        if (midiOutput) {
            midiOutput.send(bytes);
            // Log outgoing message (simplified parsing for log)
            const [status, data1, data2] = bytes;
            logMidiMessage('OUT', status, data1, data2);
        }
    }, [midiOutput, logMidiMessage]);

    const clearLogs = useCallback(() => {
        setMidiLogs([]);
        logSystemMessage('Log cleared', 'info');
    }, [logSystemMessage]);

    return {
        isConnected,
        midiInput,
        midiOutput,
        lastMidiActivity,
        midiLogs,
        sendMidiMessage,
        clearLogs,
        currentPatch: {
            bankMSB: currentBankMSB,
            bankLSB: currentBankLSB,
            program: currentProgram
        },
        setPatch: (patch) => {
            setCurrentBankMSB(patch.bankMSB);
            setCurrentBankLSB(patch.bankLSB);
            setCurrentProgram(patch.program);
        }
    };
}
