#!/bin/bash
sed -i -e '/staffName?: string;/a\  staffAssignments?: { name: string, qty: number }[];' src/types.ts
