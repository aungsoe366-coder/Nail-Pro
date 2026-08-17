const fs = require('fs');

function replaceTitles(file) {
    let content = fs.readFileSync(file, 'utf8');
    const newClass = 'text-2xl font-extrabold tracking-tight text-slate-900 uppercase';

    const replacements = [
        {
            target: '<h2 className="text-3xl font-serif">Welcome back, {profile?.name || \'Beautiful\'}!</h2>',
            replacement: `<h2 className="${newClass}">Welcome back, {profile?.name || 'Beautiful'}!</h2>`
        },
        {
            target: '<h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">Dashboard</h3>',
            replacement: `<h3 className="${newClass}">Dashboard</h3>`
        },
        {
            target: '<h3 className="text-3xl font-light tracking-tight text-foreground">Monthly <span className="italic font-serif">Summary</span></h3>',
            replacement: `<h3 className="${newClass}">Monthly <span className="italic font-serif">Summary</span></h3>`
        },
        {
            target: '<h3 className="text-4xl font-light tracking-tight text-foreground">Shop <span className="italic font-serif">Expenses</span></h3>',
            replacement: `<h3 className="${newClass}">Shop <span className="italic font-serif">Expenses</span></h3>`
        },
        {
            target: '<h3 className="text-3xl font-light tracking-tight text-foreground">Daily <span className="italic font-serif">Sales List</span></h3>',
            replacement: `<h3 className="${newClass}">Daily <span className="italic font-serif">Sales List</span></h3>`
        },
        {
            target: '<h3 className="text-primary text-2xl font-bold tracking-tight">Staff Commissions</h3>',
            replacement: `<h3 className="${newClass}">Staff Commissions</h3>`
        },
        {
            target: '<h3 className="text-primary text-2xl font-bold tracking-tight">Sales Report</h3>',
            replacement: `<h3 className="${newClass}">Sales Report</h3>`
        },
        {
            target: '<h1 className="text-2xl font-black tracking-tighter">Settings</h1>',
            replacement: `<h1 className="${newClass}">Settings</h1>`
        }
    ];

    replacements.forEach(r => {
        if (content.includes(r.target)) {
            content = content.replace(r.target, r.replacement);
            console.log(`Replaced in ${file}: ${r.replacement}`);
        }
    });

    // Handle multiline regexes
    const apptsRegex = /<h1 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground \[\.midnight_&\]:text-slate-200 leading-none">\s*\{isCustomer \? 'My Appointments' : 'Customer Appointments'\}\s*<\/h1>/;
    if (apptsRegex.test(content)) {
        content = content.replace(apptsRegex, `<h1 className="${newClass}">\n {isCustomer ? 'My Appointments' : 'Customer Appointments'}\n</h1>`);
        console.log(`Replaced AppointmentsPage title in ${file}`);
    }

    const businessRegex = /<h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">\s*Business Analytics\s*<\/h1>/;
    if (businessRegex.test(content)) {
        content = content.replace(businessRegex, `<h1 className="${newClass}">\n Business Analytics\n</h1>`);
        console.log(`Replaced BusinessAnalysisPage title in ${file}`);
    }

    fs.writeFileSync(file, content);
}

replaceTitles('src/AppCore.tsx');
if (fs.existsSync('src/pages/BusinessAnalysisPage.tsx')) {
    replaceTitles('src/pages/BusinessAnalysisPage.tsx');
}
