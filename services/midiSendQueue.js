/**
 * Verarbeitet eine Liste von MIDI-Befehlen in kleinen Paketen asynchron,
 * um den MIDI-Bus nicht zu überlasten und Node.js flüssig zu halten.
 * 
 * @param {Object} midiOutput - Das aktive MIDI-Output-Objekt
 * @param {Array} midiQueue - Array aus Objekten [{note, velocity, channel}, ...]
 * @param {Function} [onComplete] - Optionale Callback-Funktion, wenn alle Befehle gesendet wurden
 */
function sendMidiBatch(midiOutput, midiQueue, onComplete) {
    if (!midiQueue || midiQueue.length === 0) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    const BATCH_SIZE = 15; // Anzahl Befehle pro Durchgang
    let index = 0;

    function sendNextBatch() {
        const end = Math.min(index + BATCH_SIZE, midiQueue.length);
        
        for (let i = index; i < end; i++) {
            const cmd = midiQueue[i];
            try {
                midiOutput.send('noteon', { 
                    note: cmd.note, 
                    velocity: cmd.velocity, 
                    channel: cmd.channel 
                });
            } catch (e) {
                console.error("🚨 [Queue-Error] Fehler beim Senden des MIDI-Befehls:", e.message);
            }
        }

        index = end;

        if (index < midiQueue.length) {
            // Reicht das nächste Paket verzögerungsfrei in den Node.js Event-Loop ein
            setTimeout(sendNextBatch, 1);
        } else {
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }
    }

    // Startet die Verarbeitung
    sendNextBatch();
}

module.exports = {
    sendMidiBatch
};
