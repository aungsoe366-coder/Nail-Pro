const fs = require('fs');

let content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

// 1. Date logic
const oldDateLogicStart = 'const diffMs = currentEnd.getTime() - currentStart.getTime();';
const oldDateLogicEnd = 'periodLabel = `${customStartDate} to ${customEndDate}`;';

const dateLogicIdx1 = content.indexOf(oldDateLogicStart);
const dateLogicIdx2 = content.indexOf(oldDateLogicEnd) + oldDateLogicEnd.length;
if (dateLogicIdx1 !== -1 && dateLogicIdx2 !== -1) {
    const newDateLogic = `prevStart = new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, currentStart.getDate(), 0, 0, 0, 0);
      prevEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 1, currentEnd.getDate(), 23, 59, 59, 999);
      periodLabel = \`\${customStartDate} to \${customEndDate}\`;`;
    content = content.substring(0, dateLogicIdx1) + newDateLogic + content.substring(dateLogicIdx2);
    console.log("Date logic replaced");
} else {
    console.log("Date logic not found");
}

// 2. Metrics logic
const oldMetricsStart = 'const revGrowth = prevTotalRev > 0 ';
const oldMetricsEnd = 'isClientUp: Number(clientGrowth) >= 0\n    };';

const metricsIdx1 = content.indexOf(oldMetricsStart);
const metricsIdx2 = content.indexOf(oldMetricsEnd) + oldMetricsEnd.length;
if (metricsIdx1 !== -1 && metricsIdx2 !== -1) {
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
    content = content.substring(0, metricsIdx1) + newMetrics + content.substring(metricsIdx2);
    console.log("Metrics logic replaced");
} else {
    console.log("Metrics logic not found");
}

fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', content);
