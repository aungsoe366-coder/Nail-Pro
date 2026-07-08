#!/bin/bash
sed -i -e '2979d' src/AppCore.tsx
sed -i -e '2960i};' src/AppCore.tsx
