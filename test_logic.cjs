const currentStart = new Date(2026, 7, 1); // Aug 1
const currentEnd = new Date(2026, 7, 16, 23, 59, 59, 999); // Aug 16

const diffMs = currentEnd.getTime() - currentStart.getTime();
const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
let prevStart = new Date(currentStart.getTime() - (diffDays * 24 * 60 * 60 * 1000));
let prevEnd = new Date(currentStart.getTime() - 1);

console.log("OLD prevStart:", prevStart);
console.log("OLD prevEnd:", prevEnd);

prevStart = new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, currentStart.getDate(), 0, 0, 0, 0);
prevEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 1, currentEnd.getDate(), 23, 59, 59, 999);

console.log("NEW prevStart:", prevStart);
console.log("NEW prevEnd:", prevEnd);
