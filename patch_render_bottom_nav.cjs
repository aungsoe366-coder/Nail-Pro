const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetStr = `<main className={isPos ? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "w-full flex-1 flex flex-col"}>
 {isPos ? ( children ) : ( <PullToRefresh onRefresh={handleRefresh} isPos={isPos}> {children} </PullToRefresh> )}
 </main>
 </motion.div>`;

const newStr = `<main className={isPos ? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "w-full flex-1 flex flex-col"}>
 {isPos ? ( children ) : ( <PullToRefresh onRefresh={handleRefresh} isPos={isPos}> {children} </PullToRefresh> )}
 </main>
 {renderCustomerBottomNav()}
 </motion.div>`;

let targetClean = targetStr.replace(/\s+/g, ' ');
let codeClean = code.replace(/\s+/g, ' ');

if (codeClean.includes(targetClean)) {
    code = code.replace(/<main className=\{isPos \? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "w-full flex-1 flex flex-col"\}>\s*\{isPos \? \( children \) : \( <PullToRefresh onRefresh=\{handleRefresh\} isPos=\{isPos\}>\s*\{children\}\s*<\/PullToRefresh> \)\}\s*<\/main>\s*<\/motion\.div>/g, 
        `<main className={isPos ? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "w-full flex-1 flex flex-col"}>\n {isPos ? ( children ) : ( <PullToRefresh onRefresh={handleRefresh} isPos={isPos}>\n {children}\n </PullToRefresh> )}\n </main>\n {renderCustomerBottomNav()}\n </motion.div>`);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched renderCustomerBottomNav!");
} else {
    console.log("Could not find target to inject renderCustomerBottomNav.");
}
