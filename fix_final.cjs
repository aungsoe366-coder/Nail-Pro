const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

// 1. Date math fix
content = content.replace(
    'prevStart = new Date(currentStart.getTime() - (diffDays * 24 * 60 * 60 * 1000));',
    'prevStart = new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, currentStart.getDate(), 0, 0, 0, 0);'
);
content = content.replace(
    'prevEnd = new Date(currentStart.getTime() - 1);',
    'prevEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 1, currentEnd.getDate(), 23, 59, 59, 999);'
);

// 2. Metrics Block fix
const oldMetrics = `const revGrowth = prevTotalRev > 0 
      ? (((currentTotalRev - prevTotalRev) / prevTotalRev) * 100).toFixed(1)
      : (currentTotalRev > 0 ? '+100' : '0');

    const currentSalesCount = currentSales.length;
    const prevSalesCount = previousSales.length;

    const currentAvgTicket = currentSalesCount > 0 ? Math.round(currentTotalRev / currentSalesCount) : 0;
    const prevAvgTicket = prevSalesCount > 0 ? Math.round(prevTotalRev / prevSalesCount) : 0;

    const ticketGrowth = prevAvgTicket > 0 
      ? (((currentAvgTicket - prevAvgTicket) / prevAvgTicket) * 100).toFixed(1)
      : (currentAvgTicket > 0 ? '+100' : '0');

    // Total Discounts from sales items
    let totalDiscount = 0;
    currentSales.forEach(s => {
      s.items?.forEach(item => {
        if (item.disP && item.disP > 0) {
          totalDiscount += (item.price * item.qty * (item.disP / 100));
        }
      });
    });

    const discountRatio = currentTotalRev > 0 
      ? ((totalDiscount / (currentTotalRev + totalDiscount)) * 100).toFixed(1) 
      : '0.0';

    // Unique Customers or Total Appointments
    const clientCount = currentAppts.length > 0 ? currentAppts.length : currentSalesCount;
    const prevClientCount = previousAppts.length > 0 ? previousAppts.length : prevSalesCount;

    const clientGrowth = prevClientCount > 0 
      ? (((clientCount - prevClientCount) / prevClientCount) * 100).toFixed(1)
      : (clientCount > 0 ? '+100' : '0');

    return {
      totalRevenue: currentTotalRev,
      revenueGrowth: Number(revGrowth) >= 0 ? \`+\${revGrowth}%\` : \`\${revGrowth}%\`,
      isRevUp: Number(revGrowth) >= 0,

      avgTicket: currentAvgTicket,
      ticketGrowth: Number(ticketGrowth) >= 0 ? \`+\${ticketGrowth}%\` : \`\${ticketGrowth}%\`,
      isTicketUp: Number(ticketGrowth) >= 0,

      totalDiscount: Math.round(totalDiscount),
      discountRatio: \`\${discountRatio}%\`,

      clientCount,
      clientGrowth: Number(clientGrowth) >= 0 ? \`+\${clientGrowth}%\` : \`\${clientGrowth}%\`,
      isClientUp: Number(clientGrowth) >= 0
    };`;

const newMetrics = `const getGrowthValue = (current, previous) => {
      if (previous > 0) {
        return ((current - previous) / previous) * 100;
      }
      return current > 0 ? 100 : 0;
    };

    const revGrowthVal = getGrowthValue(currentTotalRev, prevTotalRev);

    const currentSalesCount = currentSales.length;
    const prevSalesCount = previousSales.length;

    const currentAvgTicket = currentSalesCount > 0 ? Math.round(currentTotalRev / currentSalesCount) : 0;
    const prevAvgTicket = prevSalesCount > 0 ? Math.round(prevTotalRev / prevSalesCount) : 0;

    const ticketGrowthVal = getGrowthValue(currentAvgTicket, prevAvgTicket);

    // Total Discounts from sales items
    let totalDiscount = 0;
    currentSales.forEach(s => {
      s.items?.forEach(item => {
        if (item.disP && item.disP > 0) {
          totalDiscount += (item.price * item.qty * (item.disP / 100));
        }
      });
    });

    const discountRatio = currentTotalRev > 0 
      ? ((totalDiscount / (currentTotalRev + totalDiscount)) * 100).toFixed(1) 
      : '0.0';

    // Unique Customers or Total Appointments
    const clientCount = currentAppts.length > 0 ? currentAppts.length : currentSalesCount;
    const prevClientCount = previousAppts.length > 0 ? previousAppts.length : prevSalesCount;

    const clientGrowthVal = getGrowthValue(clientCount, prevClientCount);

    return {
      totalRevenue: currentTotalRev,
      revenueGrowthValue: revGrowthVal,

      avgTicket: currentAvgTicket,
      ticketGrowthValue: ticketGrowthVal,

      totalDiscount: Math.round(totalDiscount),
      discountRatio: \`\${discountRatio}%\`,

      clientCount,
      clientGrowthValue: clientGrowthVal
    };`;

content = content.replace(oldMetrics, newMetrics);


// 3. UI replacement
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

const regex1 = /<span className=\{\`inline-flex items-center gap-1 font-extrabold px-2 py-0\.5 rounded-md \$\{\s*metrics\.isRevUp[\s\S]*?<\/span>/;
const regex2 = /<span className=\{\`inline-flex items-center gap-1 font-extrabold px-2 py-0\.5 rounded-md \$\{\s*metrics\.isTicketUp[\s\S]*?<\/span>/;
const regex4 = /<span className=\{\`inline-flex items-center gap-1 font-extrabold px-2 py-0\.5 rounded-md \$\{\s*metrics\.isClientUp[\s\S]*?<\/span>/;

content = content.replace(regex1, renderTrend('revenueGrowthValue', 'emerald', 'rose'));
content = content.replace(regex2, renderTrend('ticketGrowthValue', 'blue', 'rose'));
content = content.replace(regex4, renderTrend('clientGrowthValue', 'emerald', 'rose'));

fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', content);
console.log("Applied all fixes");
