const fs = require('fs');

let content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

const oldMetricsRegex = /const revGrowth = prevTotalRev > 0[\s\S]*?isClientUp: Number\(clientGrowth\) >= 0\s*\n\s*\};/;

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

if (oldMetricsRegex.test(content)) {
    content = content.replace(oldMetricsRegex, newMetrics);
    fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', content);
    console.log("Metrics replaced properly!");
} else {
    console.log("Could not find metrics block to replace");
}
