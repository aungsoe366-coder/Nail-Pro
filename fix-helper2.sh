#!/bin/bash
sed -i -e 's/return { ...item, qty: assignment.qty };/return { ...item, qty: assignment.qty, commission: assignment.commission };/g' src/AppCore.tsx
