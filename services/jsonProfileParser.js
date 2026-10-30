const fs = require('fs');
const path = require('path');

function loadProfile(filename = 'apcMiniMk2.json') {
    const filePath = path.join(__dirname, '../profiles', filename);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const profile = JSON.parse(rawData);

    return {
        deviceName: profile.deviceName,
        deviceType: profile.deviceType,
        colorNameCodes: profile.colorNameCodes.map(item => [item.name, item.code]),
        layouts: profile.layouts,
        
        findColorIndex(colorName) {
            if (!colorName || typeof colorName !== 'string') return -1;
            var buttonLabel = colorName.toLowerCase();
            var index = -1; 
            for (var n = 0; n < this.colorNameCodes.length; n++) {  
                if (!this.colorNameCodes[n] || !this.colorNameCodes[n][0]) continue; // Überspringt ungültige Einträge/Kommentare
                var Search = this.colorNameCodes[n][0].toLowerCase();
                if (Search.length > 2) {
                    if (matchRuleExpl(buttonLabel, "*" + Search + "*")) {
                        index = n;
                        break;
                    }
                } else {
                    if (buttonLabel.length > 3) {
                        if (matchRuleExpl(buttonLabel, "*" + Search + "*")) {
                            if (matchRuleExpl(buttonLabel, "* " + Search) || matchRuleExpl(buttonLabel, Search + " *")) {
                                index = n;
                                break;
                            }
                        }
                    } else {
                        if (matchRuleExpl(buttonLabel, Search)) {
                            index = n;
                            break;
                        }
                    }
                }
            }
            return index;
        },

        buildResetQueue(config) {
            const { ledmatrix, brightness, pageselect, wingselect, wing, darkmode, pageIndex } = config;
            const midiQueue = [];
            const notes = profile.layouts.notes;

            for (var i = 0; i < 120; i++) {
                midiQueue.push({ note: i, velocity: ledmatrix[i], channel: brightness });
            }

            if (pageselect > 0) {
                var currentPageIndex = pageIndex !== undefined ? pageIndex : 0;
                var currentPageNote = notes.page_select.offset + currentPageIndex;

                for (var note = notes.page_select.min; note <= notes.page_select.max; note++) {
                    midiQueue.push({ 
                        note: note, 
                        velocity: (note === currentPageNote) ? 127 : 0, 
                        channel: 0 
                    });
                }
            }

            if (wingselect > 0 && wing == 2) {
                midiQueue.push({ note: notes.wing_select.note, velocity: 127, channel: 0 });
            } else {
                midiQueue.push({ note: notes.wing_select.note, velocity: 0, channel: 0 });
            }

            midiQueue.push({ note: notes.fader_mode_hi.note, velocity: 0, channel: 0 });
            midiQueue.push({ note: notes.fader_mode_lo.note, velocity: 127, channel: 0 });

            if (wing == 0) {
                if (darkmode == 1) {
                    midiQueue.push({ note: 6, velocity: 0, channel: brightness });
                    midiQueue.push({ note: 7, velocity: 1, channel: brightness });
                    midiQueue.push({ note: 14, velocity: 0, channel: brightness });
                    midiQueue.push({ note: 15, velocity: 1, channel: brightness });
                    midiQueue.push({ note: 107, velocity: 127, channel: 0 });
                } else {
                    midiQueue.push({ note: 6, velocity: 0, channel: brightness });
                    midiQueue.push({ note: 7, velocity: 21, channel: brightness });
                    midiQueue.push({ note: 14, velocity: 0, channel: brightness });
                    midiQueue.push({ note: 15, velocity: 45, channel: brightness });
                    midiQueue.push({ note: 107, velocity: 127, channel: 0 });
                }
            }

            return midiQueue;
        }
    };
}

function matchRuleExpl(str, rule) {
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    rule = rule.split("*").map(escapeRegex).join(".*");
    rule = "^" + rule + "$";
    var regex = new RegExp(rule);
    return regex.test(str);
}

module.exports = { loadProfile, matchRuleExpl };