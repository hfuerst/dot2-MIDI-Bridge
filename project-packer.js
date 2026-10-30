// project-packer.js
const fs = require('fs');
const path = require('path');

// Speicherort für das Ergebnis
const OUTPUT_FILE = path.join(__dirname, 'full_project_context.txt');

// Diese Ordner und Dateien werden durchsucht
const TARGET_DIRS = ['services', 'profiles', 'api', 'config'];
const TARGET_FILES = ['dot2-midi-controller.js', 'package.json'];

let outputContext = `==================================================\n`;
outputContext += `   PROJECT CONTEXT - GENERATED: ${new Date().toISOString()}\n`;
outputContext += `==================================================\n\n`;

// 1. Einzelne Hauptdateien einlesen
TARGET_FILES.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        appendFileContent(filePath, file);
    }
});

// 2. Unterordner rekursiv durchsuchen
TARGET_DIRS.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        scanDirectory(dirPath);
    }
});

function scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.relative(__dirname, fullPath);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.json') || item.endsWith('.html'))) {
            appendFileContent(fullPath, relativePath);
        }
    });
}

function appendFileContent(filePath, relativePath) {
    console.log(`Packing: ${relativePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    outputContext += `\n/* FILE: ${relativePath} */\n`;
    outputContext += `// ==================================================\n`;
    outputContext += content;
    outputContext += `\n// END OF FILE: ${relativePath}\n`;
    outputContext += `// ==================================================\n\n`;
}

// In Datei schreiben
fs.writeFileSync(OUTPUT_FILE, outputContext, 'utf8');
console.log(`\n✅ Fertig! Kontext gespeichert in: ${OUTPUT_FILE}`);
