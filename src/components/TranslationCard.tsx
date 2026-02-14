import { useEffect, useRef, useState } from 'react';
import { ArabicKeyboard } from './ArabicKeyboard';
import { TranslationPair } from '../types/TransVerifyTypes';
import { Copy } from 'lucide-react';


type Props = {
  pair: TranslationPair | null;
  currentIndex: number;
  total: number;
  verifiedCount: number;
  onSave: (text: string) => void;
  onSkip: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
};



export function TranslationCard({
  pair,
  currentIndex,
  total,
  verifiedCount,
  onSave,
  onSkip,
  onPrevious,
  canGoPrevious,
}: Props) {
  const [arabic, setArabic] = useState('');
  const englishRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (pair) {
      setArabic(pair.arVerified || pair.ar || '');
    }
  }, [pair]);

  useEffect(() => {
    if (englishRef.current) {
      englishRef.current.style.height = 'auto';
      englishRef.current.style.height =
        englishRef.current.scrollHeight + 'px';
    }
  }, [pair]);

  const insertChar = (char: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const updated =
      arabic.slice(0, start) + char + arabic.slice(end);

    setArabic(updated);

    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + char.length;
    });
  };
  const progressPercent = Math.round((verifiedCount / total) * 100);

  const copyEnglishToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pair?.en || '');
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  if (!pair) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{verifiedCount} verified</span>
          <span>{progressPercent}%</span>
        </div>

        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>


      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="label">English</label>

          <button
            onClick={copyEnglishToClipboard}
            className="btn-icon"
            title="Copy English text"
            aria-label="Copy English text"
          >
            <Copy />
          </button>
        </div>

        <p className="text-gray-900 text-sm leading-relaxed">
          {pair.en}
        </p>
      </div>


      <div>
        <label className="font-semibold mb-1 block">Arabic</label>
        <textarea
          ref={textareaRef}
          value={arabic}
          onChange={(e) => setArabic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSave(arabic);
            }
          }}
          className="w-full border rounded-lg p-2 resize-none text-right"
          rows={4}
          dir="rtl"
        />

      </div>

      <ArabicKeyboard buttonSize="lg" onInsert={insertChar} />

      <div className="flex justify-between pt-2">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="btn btn-danger"
        >
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="btn btn-secondary"
          >
            Skip
          </button>
          <button
            onClick={() => onSave(arabic)}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
