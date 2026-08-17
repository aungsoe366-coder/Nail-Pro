const fs = require('fs');
const content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

const splitToken = "};mo } from 'react';";
const idx = content.indexOf(splitToken);
if (idx !== -1) {
    const originalPart = content.substring(idx + 2);
    const originalFile = "import React, { useState, useEffect, useMe" + originalPart;
    fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', originalFile);
    console.log("Recovered REAL!");
} else {
    // maybe it's "};o } from 'react';"
    const split2 = "};o } from 'react';";
    const idx2 = content.indexOf(split2);
    if (idx2 !== -1) {
       const originalPart = content.substring(idx2 + 2);
       const originalFile = "import React, { useState, useEffect, useMem" + originalPart;
       fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', originalFile);
       console.log("Recovered REAL with o!");
    } else {
       console.log("Could not find split token");
    }
}
