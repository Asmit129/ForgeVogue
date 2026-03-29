const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (fullPath.endsWith('index.css')) {
                // Fix .input-glass
                if (content.includes('color: #fff;')) {
                    content = content.replace(/\.input-glass \{([\s\S]*?)color: #fff;/g, '.input-glass {$1color: var(--text-main);');
                    modified = true;
                }
                if (content.includes('background: rgba(0,0,0,0.2);')) {
                    content = content.replace(/background: rgba\(0,0,0,0\.2\);/g, 'background: var(--glass-light);');
                    modified = true;
                }
                if (content.includes('background: rgba(0,0,0,0.4);')) {
                    content = content.replace(/background: rgba\(0,0,0,0\.4\);/g, 'background: var(--glass-medium);');
                    modified = true;
                }
            }

            // Replace hardcoded dark background values with semantic ones
            const replacements = [
                { regex: /bg-\[\#18181b\]/g, replacement: 'bg-[var(--glass-light)]' },
                { regex: /bg-\[\#050505\]/g, replacement: 'bg-[var(--bg-main)]' },
                { regex: /bg-\[var\(--bg-black\)\].*?text-\[var\(--text-muted\)\]/g, replacement: match => match.replace('bg-[var(--bg-black)]', 'bg-[var(--bg-card)]') },
                { regex: /bg-\[var\(--bg-black\)\].*?text-\[var\(--text-main\)\]/g, replacement: match => match.replace('bg-[var(--bg-black)]', 'bg-[var(--bg-card)]') },
            ];

            for (const { regex, replacement } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }

            // Fix About.jsx specifically where it has `bg-[var(--bg-black)]` sections
            if (fullPath.endsWith('About.jsx') && content.includes('bg-[var(--bg-black)]')) {
                content = content.replace(/bg-\[var\(--bg-black\)\]/g, 'bg-[var(--bg-card)]');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed: ${fullPath.replace(srcDir, '')}`);
            }
        }
    }
}

fixFiles(srcDir);
console.log('Done.');
