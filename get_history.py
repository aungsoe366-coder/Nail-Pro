import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

start = text.find('export const HistoryPage: React.FC = () => {')
end = text.find('export const StaffCommissionsPage: React.FC = () => {')

with open('/tmp/history_component.tsx', 'w') as f:
    f.write(text[start:end])
print("Extracted to /tmp/history_component.tsx")
