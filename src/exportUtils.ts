import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';


export const exportToCSVAndShare = async (
  filename: string,
  headers: string[],
  data: any[][]
): Promise<void> => {
  try {
    const isXlsx = filename.toLowerCase().endsWith('.xlsx');
    
    if (isXlsx) {
       const XLSX = await import('xlsx');
       const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
       const workbook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
       
       if (Capacitor.isNativePlatform()) {
         const base64Data = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
         const fileResult = await Filesystem.writeFile({
           path: filename,
           data: base64Data,
           directory: Directory.Documents
         });
         await Share.share({
           title: filename,
           text: `Here is the exported file: ${filename}`,
           url: fileResult.uri,
           dialogTitle: 'Share Excel File',
         });
       } else {
         XLSX.writeFile(workbook, filename);
       }
       return;
    }

    // Fallback to CSV logic if explicitly requested
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        const cellString = String(cell);
        if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
          return `"${cellString.replace(/"/g, '""')}"`;
        }
        return cellString;
      }).join(','))
    ].join('\n');

    if (Capacitor.isNativePlatform()) {
      const fileResult = await Filesystem.writeFile({
        path: filename,
        data: csvContent,
        directory: Directory.Documents,
        encoding: 'utf8' as any,
      });
      await Share.share({
        title: filename,
        text: `Here is the exported file: ${filename}`,
        url: fileResult.uri,
        dialogTitle: 'Share CSV',
      });
    } else {
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting file:', error);
    throw error;
  }
};
