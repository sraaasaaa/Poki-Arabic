import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { CSVData } from '../types/TransVerifyTypes';

interface CSVUploaderProps {
  onEnglishLoad: (data: CSVData[]) => void;
  onArabicLoad: (data: CSVData[]) => void;
  englishLoaded: boolean;
  arabicLoaded: boolean;
}

export const CSVUploader = ({ onEnglishLoad, onArabicLoad, englishLoaded, arabicLoaded }: CSVUploaderProps) => {
  const [loading, setLoading] = useState<'english' | 'arabic' | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'english' | 'arabic') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(type);
    try {
      const content = await file.text();
      const data = parseCSV(content);

      if (type === 'english') onEnglishLoad(data);
      else onArabicLoad(data);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV. Please ensure it has a "text" column.');
    } finally {
      setLoading(null);
      event.target.value = '';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* English Upload */}
      <div className={`bg-white rounded-lg shadow p-6 ${englishLoaded ? 'border-2 border-green-500 bg-green-50' : ''}`}>
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">English CSV</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload the English source file with a "text" column
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e, 'english')}
          className="hidden"
          id="english-upload"
          disabled={loading !== null}
        />
        <label
          htmlFor="english-upload"
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded cursor-pointer 
            ${englishLoaded ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-800 text-white hover:bg-gray-700'}
            ${loading !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="h-4 w-4" />
          {loading === 'english' ? 'Loading...' : englishLoaded ? 'English Loaded' : 'Upload English CSV'}
        </label>

        {englishLoaded && (
          <div className="text-sm text-green-600 font-medium mt-2">
            ✓ English file loaded successfully
          </div>
        )}
      </div>

      {/* Arabic Upload */}
      <div className={`bg-white rounded-lg shadow p-6 ${arabicLoaded ? 'border-2 border-blue-500 bg-blue-50' : ''}`}>
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Arabic CSV</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload the Arabic translation file with a "text" column
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e, 'arabic')}
          className="hidden"
          id="arabic-upload"
          disabled={loading !== null}
        />
        <label
          htmlFor="arabic-upload"
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded cursor-pointer
            ${arabicLoaded ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-800 text-white hover:bg-gray-700'}
            ${loading !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="h-4 w-4" />
          {loading === 'arabic' ? 'Loading...' : arabicLoaded ? 'Arabic Loaded' : 'Upload Arabic CSV'}
        </label>

        {arabicLoaded && (
          <div className="text-sm text-blue-600 font-medium mt-2">
            ✓ Arabic file loaded successfully
          </div>
        )}
      </div>
    </div>
  );
};
