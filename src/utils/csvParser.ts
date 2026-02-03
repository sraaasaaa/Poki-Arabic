import { CSVData } from '../types/TransVerifyTypes';

export const parseCSV = (content: string): CSVData[] => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const textIndex = headers.findIndex(h => h === 'text');
  
  if (textIndex === -1) throw new Error('CSV must contain a "text" column');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    return {
      text: values[textIndex] || '',
      textVerified: '',
      verified: false
    };
  });
};

export const generateCSV = (data: CSVData[]): string => {
  const headers = ['text', 'text_verified', 'verified'];
  const rows = data.map(item => 
    `"${item.text}","${item.textVerified || ''}","${item.verified ? 'true' : 'false'}"`
  );
  return [headers.join(','), ...rows].join('\n');
};

export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};