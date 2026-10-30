/* FILE: services/midiInitialization.js */
const { sendMidiBatch } = require('./midiSendQueue'); // Importiert den Queue-Service

/**
 * Universeller Hardware-Reset.
 * Holt die gerätespezifischen Befehle aus dem Profil und übergibt sie an die SendQueue.
 * 
 * @param {Object} midiOutput - Das aktive MIDI-Output-Objekt
 * @param {Object} config - Die aktuelle Konfiguration (ledmatrix, brightness etc.)
 * @param {Object} profile - Das geladene Hardware-Profil des Controllers (z.B. apcProfile)
 * @param {Function} onComplete - Callback-Funktion nach Abschluss
 */
function runFullMidiInitialization(midiOutput, config, profile, onComplete) {
    // Holt die hardwarespezifischen MIDI-Befehle universell aus dem übergebenen Profil
    const midiQueue = profile.buildResetQueue(config);

    // Übergibt die gesammelten Befehle an die ausgelagerte Queue
    sendMidiBatch(midiOutput, midiQueue, () => {
        console.log("✅ [MIDIini] Universeller Hardware-Reset über Send-Queue abgeschlossen!");
        if (typeof onComplete === 'function') {
            onComplete();
        }
    });
}

module.exports = {
    runFullMidiInitialization
};
