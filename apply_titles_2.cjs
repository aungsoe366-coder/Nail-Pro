const fs = require('fs');

function replaceTitles(file) {
    let content = fs.readFileSync(file, 'utf8');
    const newClass = 'text-2xl font-extrabold tracking-tight text-slate-900 uppercase';

    const replacements = [
        {
            target: '<h2 className="text-2xl font-black tracking-tighter">Security Update</h2>',
            replacement: `<h2 className="${newClass}">Security Update</h2>`
        },
        {
            target: '<h2 className="text-2xl font-black mb-4">Reset Password</h2>',
            replacement: `<h2 className="${newClass} mb-4">Reset Password</h2>`
        },
        {
            target: '<h2 className="text-2xl font-black mb-4">Identity Reset</h2>',
            replacement: `<h2 className="${newClass} mb-4">Identity Reset</h2>`
        }
    ];

    replacements.forEach(r => {
        if (content.includes(r.target)) {
            content = content.replace(r.target, r.replacement);
            console.log(`Replaced in ${file}: ${r.target.substring(0,40)}...`);
        }
    });

    fs.writeFileSync(file, content);
}

replaceTitles('src/AppCore.tsx');
