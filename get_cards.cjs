const fs = require('fs');

const content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

const regex1 = /<span className=\{\`inline-flex items-center gap-1 font-extrabold px-2 py-0\.5 rounded-md \$\{\s*metrics\.isRevUp[\s\S]*?<\/span>/;
const regex2 = /<span className=\{\`inline-flex items-center gap-1 font-extrabold px-2 py-0\.5 rounded-md \$\{\s*metrics\.isTicketUp[\s\S]*?<\/span>/;
const regex4 = /<span className=\{\`inline-flex items-center gap-1 font-extrabold px-2 py-0\.5 rounded-md \$\{\s*metrics\.isClientUp[\s\S]*?<\/span>/;

let newContent = content;

const renderTrend = (valName, colorPrefixUp, colorPrefixDown) => {
    return `{(() => {
                  const val = metrics.${valName};
                  if (val > 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-${colorPrefixUp}-500/10 text-${colorPrefixUp}-600 dark:text-${colorPrefixUp}-400">
                        <TrendingUp size={12} /> +{val.toFixed(1)}%
                      </span>
                    );
                  } else if (val < 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-${colorPrefixDown}-500/10 text-${colorPrefixDown}-500 dark:text-${colorPrefixDown}-400">
                        <TrendingDown size={12} /> {val.toFixed(1)}%
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-500 dark:text-slate-400">
                        <Minus size={12} /> 0.0%
                      </span>
                    );
                  }
                })()}`;
};

newContent = newContent.replace(regex1, renderTrend('revenueGrowthValue', 'emerald', 'rose'));
newContent = newContent.replace(regex2, renderTrend('ticketGrowthValue', 'blue', 'rose'));
newContent = newContent.replace(regex4, renderTrend('clientGrowthValue', 'emerald', 'rose'));

if (newContent !== content) {
    fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', newContent);
    console.log("Replaced cards");
} else {
    console.log("Could not find cards");
}

