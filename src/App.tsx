import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { TranslationCard } from './components/TranslationCard';
import { Download, Upload } from 'lucide-react';
import { TranslationPair } from './types/TransVerifyTypes';
import { generateCSV, downloadCSV } from './utils/csvParser';
import { Rules } from './components/Rules'

const STORAGE_KEY = 'transVerifyData';
const CHUNK_SIZE = 500;

export default function App() {
  const [pairs, setPairs] = useState<TranslationPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string | null>(null);

  const [englishRows, setEnglishRows] = useState<string[]>([]);
  const [arabicRows, setArabicRows] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.pairs?.length > 0) {
          setPairs(parsed.pairs);
          setCurrentIndex(parsed.currentIndex || 0);
        }
      } catch (err) {
        console.error('Error loading from localStorage:', err);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (pairs.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ pairs, currentIndex })
      );
    }
  }, [pairs, currentIndex]);

  const handleCSVUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEnglish: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const rows: string[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      chunkSize: CHUNK_SIZE,
      chunk: (results) => {
        results.data.forEach((row: any) => {
          rows.push(row.text || '');
        });
        setLoadingProgress(`Loaded ${rows.length} rows from ${file.name}...`);
      },
      complete: () => {
        setLoadingProgress(null);
        if (isEnglish) setEnglishRows(rows);
        else setArabicRows(rows);
      },
      error: (err) => console.error('CSV parse error:', err),
    });
  };

  useEffect(() => {
    if (
      pairs.length === 0 &&
      englishRows.length > 0 &&
      arabicRows.length > 0
    ) {
      const minLength = Math.min(englishRows.length, arabicRows.length);

      const newPairs: TranslationPair[] = Array.from(
        { length: minLength },
        (_, i) => ({
          id: i,
          en: englishRows[i],
          ar: arabicRows[i],
          arVerified: '',
          verified: false,
        })
      );

      setPairs(newPairs);
      setCurrentIndex(0);
    }
  }, [englishRows, arabicRows, pairs.length]);

  const handleSave = (arabicText: string) => {
    setPairs((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        arVerified: arabicText,
        verified: true,
      };
      return updated;
    });
    setCurrentIndex(findNextUnverified(currentIndex + 1));
  };

  const handleSkip = () =>
    setCurrentIndex(findNextUnverified(currentIndex + 1));

  const handlePrevious = () =>
    currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  const findNextUnverified = (start: number) => {
    for (let i = start; i < pairs.length; i++) {
      if (!pairs[i].verified) return i;
    }
    return Math.max(0, start - 1);
  };

  const handleExport = () => {
    const csv = generateCSV(
      pairs.map((p) => ({
        text: p.arVerified || '',
      }))
    );
    downloadCSV(csv, 'arabic_translations_reviewed.csv');
  };

  const verifiedCount = pairs.filter((p) => p.verified).length;
  const currentPair = pairs[currentIndex] || null;

  if (!isLoaded || pairs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Upload CSV Files
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <span className="font-semibold">English CSV</span>

            <label className="btn btn-blue">
              Choose English CSV
              <input
                type="file"
                accept=".csv"
                onChange={e => handleCSVUpload(e, true)}
                hidden
              />
            </label>

          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="font-semibold">Arabic CSV</span>
            <label className="btn btn-green">
              Choose Arabic CSV
              <input
                type="file"
                accept=".csv"
                onChange={e => handleCSVUpload(e, false)}
                hidden
              />
            </label>

          </div>
        </div>

        {loadingProgress && (
          <p className="text-gray-500 mt-2">{loadingProgress}</p>
        )}

        <p className="text-gray-500 text-sm text-center max-w-md">
          Upload both CSV files once. Your progress will be saved automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p
              className="mt-2 font-bold text-xl"
              style={{ color: '#696054' }}
            >
              Verify and correct Arabic translations
            </p>
          </div>

          <button onClick={handleExport} className="btn btn-primary">
            <Download size={16} />
            Export Reviewed
          </button>

        </div>

        <TranslationCard
          pair={currentPair}
          currentIndex={currentIndex}
          total={pairs.length}
          verifiedCount={verifiedCount}
          onSave={handleSave}
          onSkip={handleSkip}
          onPrevious={handlePrevious}
          canGoPrevious={currentIndex > 0}
        />
        <Rules />


      </div>
    </div>
  );
}
