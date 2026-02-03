type ArabicKeyboardProps = {
  onInsert: (char: string) => void;
  buttonSize?: 'sm' | 'md' | 'lg';
};

const KEYS = [
  'ا','أ','إ','آ','ى','ة',
  'ب','ت','ث','ج','ح','خ',
  'د','ذ','ر','ز','س','ش',
  'ص','ض','ط','ظ','ع','غ',
  'ف','ق','ك','ل','م','ن',
  'ه','و','ي','ء','ئ','ؤ',
  'َ','ُ','ِ','ّ','ْ','ً','ٌ','ٍ',
  '،','؛','؟'
];

export function ArabicKeyboard({ onInsert, buttonSize = 'md' }: ArabicKeyboardProps) {
  let sizeClass = 'px-2 py-1.5 text-lg'; // default md
  if (buttonSize === 'sm') sizeClass = 'px-1.5 py-1 text-base';
  if (buttonSize === 'md') sizeClass = 'px-2 py-1.5 text-lg';
  if (buttonSize === 'lg') sizeClass = 'px-2.5 py-2 text-xl';

  const mid = Math.ceil(KEYS.length / 2);
  const rows = [KEYS.slice(0, mid), KEYS.slice(mid)];

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-gray-50 rounded border">
      {rows.map((row, idx) => (
        <div key={idx} className="flex justify-center gap-2"> {/* small gap between letters */}
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onInsert(key)}
              className={`${sizeClass} bg-white border rounded hover:bg-gray-100`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
