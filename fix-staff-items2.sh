#!/bin/bash
sed -i -e '/const staffItems = getEffectiveStaffItems(s, staffFilter); \/\//,/}) || \[\];/c\
      const staffItems = getEffectiveStaffItems(s, staffFilter);' src/AppCore.tsx
