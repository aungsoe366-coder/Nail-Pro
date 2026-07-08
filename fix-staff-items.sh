#!/bin/bash
sed -i -e 's/const staffItems = s.items?.filter(item => {/const staffItems = getEffectiveStaffItems(s, staffFilter); \/\//g' src/AppCore.tsx
sed -i -e 's/const staffItems = s.items?.filter(item => {/const staffItems = getEffectiveStaffItems(s, name); \/\//g' src/AppCore.tsx
