const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target = `const QuickDateFilterBar: React.FC<{
  dateFrom: string;
  dateTo: string;
  setDateFrom: (val: string) => void;
  setDateTo: (val: string) => void;
  children?: React.ReactNode;
}> = ({ dateFrom, dateTo, setDateFrom, setDateTo, children }) => {
  const getMode = () => {`;

const replacement = `const QuickDateFilterBar: React.FC<{
  dateFrom: string;
  dateTo: string;
  setDateFrom: (val: string) => void;
  setDateTo: (val: string) => void;
  children?: React.ReactNode;
}> = ({ dateFrom, dateTo, setDateFrom, setDateTo, children }) => {
  const [forceCustom, setForceCustom] = useState(false);
  const getMode = () => {
    if (forceCustom) return 'custom';`;

code = code.replace(target, replacement);

const target2 = `    if (f && to) {
      setDateFrom(f); setDateTo(to);
    }
  };`;

const replacement2 = `    if (type === 'custom') {
      setForceCustom(true);
    } else {
      setForceCustom(false);
      if (f && to) {
        setDateFrom(f); setDateTo(to);
      }
    }
  };`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Filter logic fixed.");
