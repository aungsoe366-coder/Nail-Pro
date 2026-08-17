const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const search = '<div className="p-4 bg-card border border-border rounded-2xl flex flex-col space-y-4 relative overflow-hidden">';
const idx = content.indexOf(search);

if (idx !== -1) {
    const endSearch = '</div>\n      </div>';
    let endIdx = content.indexOf(endSearch, idx);
    
    // Let's refine the end. We know {updateMsg follows it.
    const updateMsgIdx = content.indexOf('{updateMsg && updateMsg.type', idx);
    
    if (updateMsgIdx !== -1) {
        content = content.substring(0, idx) + content.substring(updateMsgIdx);
        fs.writeFileSync('src/AppCore.tsx', content);
        console.log("Card removed successfully");
    } else {
        console.log("updateMsg not found after card");
    }
} else {
    console.log("Card not found");
}
