import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const exportToCSVAndShare = async (
  filename: string,
  headers: string[],
  data: any[][]
): Promise<void> => {
  try {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        const cellString = String(cell);
        // Escape quotes and wrap in quotes if there are commas or quotes
        if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
          return `"${cellString.replace(/"/g, '""')}"`;
        }
        return cellString;
      }).join(','))
    ].join('\n');

    if (Capacitor.isNativePlatform()) {
      // 1. Save to device
      const fileResult = await Filesystem.writeFile({
        path: filename,
        data: csvContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      // 2. Share
      await Share.share({
        title: filename,
        text: `Here is the exported file: ${filename}`,
        url: fileResult.uri,
        dialogTitle: 'Share CSV',
      });
    } else {
      // Web fallback
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};
