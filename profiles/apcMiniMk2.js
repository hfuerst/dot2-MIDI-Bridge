/* FILE: profiles/apcMiniMk2.js */

// Original:
//Colornames: Double Words before Single Words, and 2 Letters at the end !!!  (White = 3, Warm = 8, Rose = 4, Citron = 73)
//var colornames = ['Center', 'XPos', 'Pos', 'PEff', 'Eff', 'Black', 'Warm', 'White', 'Deep Red', 'Light Red', 'Red', 'Rot', 'Light Orange', 'Orange', 'Light Yellow', 'Yellow', 'Gelb', 'Fern Green', 'Sea Green', 'Light Green', 'Green', 'Grün', 'Light Cyan', 'Cyan', 'Lavender', 'Light Bl', 'Blue', 'Blau', 'Light Vi', 'Violet', 'Light Mag', 'Magenta', 'Pink', 'CTO', 'CTB', 'Grey', 'Gr', 'Sw', 'Ws', 'Wm', 'Rt', 'Or', 'Ge', 'Gn', 'Tk', 'Cy', 'Bl', 'Vi', 'Ma', 'Pk', 'Solid', 'WLED', 'W', '-P'];
//var colorcodes =;

var colorNameCodes = [
    // by HF
    // long Names must be first, because of Search-Algorithm
    // Double Words before Single Words
    // NOT case sensitive !!  (Here only for easyier reading)

    // Effects
    ['PEff', 76],   // Position Effect (Phaser): 76 = darkGreen
    ['PosEff', 76],
    ['PFX', 76],
    ['PosFX',76],
    ['Eff', 58],    // Color or Dimmer Effect (Phaser): 58 = darkPink
    ['FX', 58],     
    
    // Positions:
    ['Center', 74], // Center Position: 74 = YellowGreen
    ['XPos', 75],   // Extra Position (mostly with Super Priority): 75 = intens Green
    ['Pos', 73],    // Normal Position: 73 = lightGreen

    // MA Colors: 
    // long Names must be first, because of Search-Algorithm
    // (shortcuts follow later)
    ['Black', 119],         // Blackout: 119 = lightCyanWhite
    ['Warm', 8],            // Warm White: 8 = WarmWhite
    ['White', 3],           // 3 = White
    ['Deep Red', 121],      // 121 = darkRed
    ['Light Red', 56],      // 56 = lightRed
    ['Red', 5],             // Red 
    ['Rot', 5],             // Red (German)
    ['Light Orange', 108],  // Light Orange
    ['Orange', 9],          // Orange (German same Word)
    ['Light Yellow', 12],   // Light Yellow
    ['Yellow', 13],         // Yellow
    ['Gelb', 13],           // Yellow (German)
    ['Fern Green', 17],     // Fern Green
    ['Sea Green', 25],      // Sea Green
    ['Light Green', 110],   // Light Green
    ['Green', 21],          // Green
    ['Grün', 21],           // Green (German)
    ['Light Cyan', 32],     // Light Cyan
    ['Cyan', 33],           // Cyan
    ['Lavender', 41],       // Lavender
    ['Light Bl', 36],       // Light Blue
    ['Blue', 45],           //
    ['Blau', 45],           // Blue (German)
    ['Light Vi', 48],       // Light Violett
    ['Violet', 49],         // 
    ['Light Mag', 52],      // Light Magenta
    ['Magenta', 53],        //
    ['Pink', 57],           //
    ['CTO', 108],           // CTO Gel = warm
    ['CTB', 93],            // CTB Gel = cold 
    ['Gray', 1],            // Gray
    
    // Shortcuts 
    // short Names must be last ins this Array!!!
    // dot2-labels must be longer than 3 signs to be found here, 
    // so it is nessessary to have a leading 'Space' before or after the following shortcuts
    // Example: "Singer or" = Singer orange Color

    // DIN 47002 Shortcuts 
    ['sw', 0],  // Schwarz  / Black
    ['br', 126],// Braun    / Brown
    ['ws', 3],  // Weiß     / White
    ['rt', 5],  // Rot      / Red
    ['or', 9],  // Orange   
    ['ge', 13], // Gelb     / Yellow
    ['gn', 21], // Grün     / Green
    ['cy', 33], // Cyan
    ['tk', 33], // Türkis   / Turquoise (same as Cyan)
    ['bl', 45], // Blau     / Blue
    ['vi', 49], // Violett  / violet
    ['gr', 1],  // Grau     / Gray
    ['ma', 53], // Magenta
    ['rs', 57], // Rosa     / Pink

    ['wm', 8],  // Warm (not DIN)

    // IEC 60757 Shortcuts 
    ['BK', 0],  // Black
    ['BN', 126],// Brown
    ['WH', 3],  // White
    ['RD', 5],  // Rot      / Red
    ['OG', 9],  // Orange   
    ['YE', 13], // Gelb     / Yellow
    ['GN', 21], // Grün     / Green
    ['TQ', 33], // Türkis   / Turquoise (sams as Cyan)
    ['BU', 45], // Blau     / Blue
    ['VT', 49], // Violett  / violet
    ['GY', 1],  // Gray
    ['PK', 57], // Pink

    // Specials
    ['Solid', 78],      // Solid WLEDs: 78 = Light GreenBlue
    ['WLED', 42],       // WLED: 42 = dark GreenBlue
    ['Master Speed 1', 58],  // Masterspeed 1 -> Color Effects : redViolet
    ['Master Speed 2', 76],  // Masterspeed 2 -> Position Effects : darkGreen
    ['Alle', 36],        // Select All (don't use 'all' because inside the Word 'Ball' or 'football')

    // Ultra-Shortcuts 
    // recommend to use as first sign in dot2 label !!! 
    // Must be followed by an Space
    // Example: 'W intensity'
    // Bad Example: 'W red' -> will be red, because of Search-Algorithm finds long Names first
    ['W', 42],  // WLEDs

    // Array End
    [' ', 108]   // Space label use color of 'upper Faderbutton Off'
];

//=================================================================

function matchRuleExpl(str, rule) {
    // Returns a Boolean value that indicates whether or not a pattern exists in a searched string.

    // for this solution to work on any string, no matter what characters it has
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  
    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    rule = rule.split("*").map(escapeRegex).join(".*");
  
    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    rule = "^" + rule + "$"
  
    //Create a regular expression object for matching string
    var regex = new RegExp(rule);
  
    //Returns true if it finds a match, otherwise it returns false
    return regex.test(str);
}

//=================================================================

// by HF
function findColorIndex(colorName) {
    //const names = ['Black', 'White', 'Red*', 'Orange', 'Yellow', 'Fern Green', 'Green', 'Sea Green', 'Cyan', 'Lavender', 'Blue', 'Violet', 'Magenta', 'Pink', 'CTO', 'CTB', 'Grey', 'Deep Red'];
    //const index = names.indexOf(colorName);
    
    //---------------------------------------------------------------
    // Original
    //const index = colornames.indexOf(colorName);

    //------------------------------------
    // nocase only
    /*
    const index = arr.findIndex(
        item => colorName.toLowerCase() === colornames.toLowerCase()
    );
    return index;
    */
    
    //------------------------------------
    // nocase and Wildcard
    var buttonLabel = colorName.toLowerCase();
    var index = -1; 
    //for (n = 0; n < colornames.length; n++) {  
    //    var Search = colornames[n].toLowerCase();
    for (var n = 0; n < colorNameCodes.length; n++) {  
        var Search = colorNameCodes[n][0].toLowerCase(); // 🔥 Greift gezielt auf den Textwert an Index 0 des Paares zu
        //------------------------
        if (Search.length > 2 ){
                if (matchRuleExpl(buttonLabel, "*" + Search + "*")){
                    //
                    index = n;
                    break;
                }
        }
        //------------------------
        else {
            if (buttonLabel.length > 3){
                if (matchRuleExpl(buttonLabel, "*" + Search + "*")){
                    if (matchRuleExpl(buttonLabel, "* " + Search)){
                        //
                        index = n;
                        break;
                    };
                    if (matchRuleExpl(buttonLabel, Search + " *")){
                        //
                        index = n;
                        break;
                    };
                };
            }
            else{
                if (matchRuleExpl(buttonLabel, Search)){
                    //
                    index = n;
                    break;
                };
            }
        }
        //------------------------

        /*
        //debug
        if (colorName == "Mitte Zentriert"){
            console.log('');
            console.log('n............: '+n);
            //console.log('');
            console.log('colorName....: '+colorName);
            console.log('buttonLabel.: '+buttonLabel);
            //console.log('');
            console.log('colornames[n]: '+colornames[n]);
            console.log('Search.......: '+Search);
            console.log('index........: '+index+'\n\n');
            alert('stop');
        }
        */
        
    }

    return index;
}


//=================================================================

// Baut die hardwarespezifischen MIDI-Befehle für das APC mini mk2 zusammen
function buildResetQueue(config) {
    const { ledmatrix, brightness, pageselect, wingselect, wing, darkmode, pageIndex } = config;
    const midiQueue = [];

    // 1. Grund-LED-Matrix (0-119) vorbereiten
    for (var i = 0; i < 120; i++) {
        midiQueue.push({ note: i, velocity: ledmatrix[i], channel: brightness });
    }

    // 2. Page-Select Tasten (112-116) direkt anhand der aktuellen Page berechnen
    // Scene Buttons 'Clip Stop', 'Solo', 'Mute', 'Rec Arm', 'Select'
    if (pageselect > 0) {
        var currentPageIndex = pageIndex !== undefined ? pageIndex : 0;
        var currentPageNote = 112 + currentPageIndex;

        for (var note = 112; note <= 116; note++) {
            midiQueue.push({ 
                note: note, 
                velocity: (note === currentPageNote) ? 127 : 0, 
                channel: 0 
            });
        }
    }

    // 3. Wing-Select LEDs vorbereiten
    // Scene Button "Drum"
    // by HF
    if (wingselect > 0 && wing == 2) {
        midiQueue.push({ note: 117, velocity: 127, channel: 0 });
    } else {
        midiQueue.push({ note: 117, velocity: 0, channel: 0 });
    }

    // 4. Fader-Buttons (HI / LO) vorbereiten
    // Scene Buttons 'Note', 'Stop all Clips'
    midiQueue.push({ note: 118, velocity: 0, channel: 0 });//fader buttons select HI
    midiQueue.push({ note: 119, velocity: 127, channel: 0 });//fader buttons select LO

    // 5. color Go+ Go- Pause buttons (nur bei Wing 0)
    if (wing == 0) {
        if (darkmode == 1) {
            midiQueue.push({ note: 6, velocity: 0, channel: brightness });//off
            midiQueue.push({ note: 7, velocity: 1, channel: brightness });//Mid button
            midiQueue.push({ note: 14, velocity: 0, channel: brightness });//off
            midiQueue.push({ note: 15, velocity: 1, channel: brightness });//Top button
            midiQueue.push({ note: 107, velocity: 127, channel: 0 });// dot - Go button
        }
        else {
            midiQueue.push({ note: 6, velocity: 0, channel: brightness });//off
            midiQueue.push({ note: 7, velocity: 21, channel: brightness });//Mid button
            midiQueue.push({ note: 14, velocity: 0, channel: brightness });//off
            midiQueue.push({ note: 15, velocity: 45, channel: brightness });//Top button
            midiQueue.push({ note: 107, velocity: 127, channel: 0 });// dot - Go button
        }
    }

    return midiQueue;
}

//=================================================================

module.exports = {
    colorNameCodes: colorNameCodes,
    findColorIndex: findColorIndex,
    matchRuleExpl: matchRuleExpl,
    buildResetQueue: buildResetQueue
};

//=================================================================
//=================================================================
//=================================================================
