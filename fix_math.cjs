const fs = require('fs');

let content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

// 1. Fix date math for custom
const oldDateLogic = `const diffMs = currentEnd.getTime() - currentStart.getTime();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      prevStart = new Date(currentStart.getTime() - (diffDays * 24 * 60 * 60 * 1000));
      prevEnd = new Date(currentStart.getTime() - 1);`;
const newDateLogic = `prevStart = new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, currentStart.getDate(), 0, 0, 0, 0);
      prevEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 1, currentEnd.getDate(), 23, 59, 59, 999);`;
content = content.replace(oldDateLogic, newDateLogic);

// 2. Fix metrics calculation
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

fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', content);
