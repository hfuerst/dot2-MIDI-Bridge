const easymidi = require('easymidi');
const EventEmitter = require('events');

/**
 * Initialisiert eine überwachte MIDI-Verbindung mit automatischem Reconnect.
 * @param {string} inputName - Name des MIDI-Inputs
 * @param {string} outputName - Name des MIDI-Outputs
 * @returns {{midiInput1: EventEmitter, midiOutput1: Object}} Stabile Wrapper für das Hauptskript
 */
function initMidi(inputName, outputName) {
    const searchInput = inputName.toLowerCase();
    const searchOutput = outputName.toLowerCase();

    const wrapperInput = new EventEmitter();
    const wrapperOutput = {
        send: (type, params) => {
            if (actualOutput && isConnected) {
                try { actualOutput.send(type, params); } catch (e) { /* Ignorieren */ }
            }
        }
    };

    let actualInput = null;
    let actualOutput = null;
    let isConnected = false;
    let reconnectInterval = null;

    function findDeviceNames() {
        const inputs = easymidi.getInputs();
        const outputs = easymidi.getOutputs();
        return {
            inputPort: inputs.find(name => name.toLowerCase().includes(searchInput)),
            outputPort: outputs.find(name => name.toLowerCase().includes(searchOutput))
        };
    }

    function tryConnect() {
        const { inputPort, outputPort } = findDeviceNames();

        if (inputPort && outputPort) {
            try {
                console.log(`🎵 [MIDI] Verbinde mit Input:  "${inputPort}"...`);
                actualInput = new easymidi.Input(inputPort);
                actualOutput = new easymidi.Output(outputPort);

                actualInput.on('noteon', (msg) => wrapperInput.emit('noteon', msg));
                actualInput.on('noteoff', (msg) => wrapperInput.emit('noteoff', msg));
                actualInput.on('cc', (msg) => wrapperInput.emit('cc', msg));

                isConnected = true;
                console.log(`\x1b[32m✅ [MIDI] Erfolgreich verbunden!\x1b[0m`);
                
                // 🔥 Sende ein Event an die Hauptdatei, dass die Verbindung bereit ist
                wrapperInput.emit('connect');
                
                if (reconnectInterval) {
                    clearInterval(reconnectInterval);
                    reconnectInterval = null;
                }
                startMonitoring();
            } catch (error) {
                console.error(`\x1b[31m❌ [MIDI] Fehler beim Öffnen der Ports:`, error.message,'\x1b[0m');
                cleanUpAndScheduleReconnect();
            }
        } else {
            cleanUpAndScheduleReconnect();
        }
    }

    function cleanUpAndScheduleReconnect() {
        if (isConnected) {
            console.log(`\x1b[31m🚨 [MIDI] Verbindung verloren oder Gerät nicht bereit.\x1b[0m`);
        }
        isConnected = false;

        // Wir sichern die Instanzen
        const inputToClose = actualInput;
        const outputToClose = actualOutput;
        
        // Die globalen Referenzen SOFORT nullen
        actualInput = null;
        actualOutput = null;

        // 🔥 DIE LÖSUNG: Wir rufen .close() auf Windows GAR NICHT auf,
        // wenn das Gerät abgezogen wurde. Wir kappen nur die JS-Listener.
        if (inputToClose) {
            try {
                // Verhindert, dass alte Events weitergefeuert werden
                inputToClose.removeAllListeners();
                
                // WICHTIG: Unter Windows (win32) zerstören wir nur die Referenz im Speicher.
                // Ein .close() würde den fatalen 'midiInUnprepareHeader'-C++-Absturz triggern.
                if (process.platform === 'win32') {
                    console.log("ℹ️ [MIDI-Schutz] Port-Bereinigung unter Windows (Safe Mode: .close übersprungen).");
                } else {
                    inputToClose.close(); 
                }
            } catch(e) {
                console.log("ℹ️ [MIDI-Schutz] Input konnte nicht geschlossen werden.");
            }
        }
        
        if (outputToClose) {
            try { 
                if (process.platform !== 'win32') {
                    outputToClose.close(); 
                }
            } catch(e) {}
        }

        // Sofort mit der Suche nach dem Gerät fortfahren
        if (!reconnectInterval) {
            console.log(`⏳ [MIDI] Suche nach "${inputName}"... \x1b[33mBitte Gerät einschalten/einstecken.\x1b[0m`);
            reconnectInterval = setInterval(tryConnect, 3000);
        }
    }


    function startMonitoring() {
        const monitorId = setInterval(() => {
            if (!isConnected) {
                clearInterval(monitorId);
                return;
            }
            const { inputPort, outputPort } = findDeviceNames();
            if (!inputPort || !outputPort) {
                clearInterval(monitorId);
                cleanUpAndScheduleReconnect();
            }
        }, 2000);
    }

    tryConnect();

    return { 
        midiInput1: wrapperInput, 
        midiOutput1: wrapperOutput 
    };
}

module.exports = {
    initMidi
};
