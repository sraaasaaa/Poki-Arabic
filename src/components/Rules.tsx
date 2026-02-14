export function Rules() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 space-y-6 border-2 border-blue-200">
      <h2
        className="text-3xl font-extrabold"
        style={{ color: '#696054' }}
      >
        Translation Rules
      </h2>
      <div className="bg-white p-6 rounded-lg shadow border border-blue-100">
        <p className="font-semibold">
          <span style={{ color: '#8B7E6B' }}>
            1. Use of Google Translate is allowed and even recommended:
          </span>{' '}
          <span style={{ color: '#000000' }}>
            sometimes the provided translation doesn't make sense, so you may want to translate it in Google Translate and verify that version.
          </span>
        </p>

      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-yellow-100">
        <span className="font-semibold" style={{ color: '#8B7E6B' }}>
          2. Keep all repetitions present in the original sentence.
        </span>
        <br />
        <strong>Example:</strong><br />
        EN: mom, mom, are you okay?<br />
        AR:  أمي، أمي، هل أنتِ بخير؟
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-pink-100">
        <span className="font-semibold" style={{ color: '#8B7E6B' }}>
          3. Exaggerated punctuation must be preserved.
        </span>
        <br />
        <strong>Example:</strong><br />
        EN: I can go to school alone !!!!<br />
        AR:  !!!!أستطيع الذهاب إلى المدرسة وحدي
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-purple-100">
        <span className="font-semibold" style={{ color: '#8B7E6B' }}>
          4. Any punctuation resulting from translation and not in the original English sentence must be removed.
        </span>
        <br />
        <strong>Example:</strong><br />
        EN: when i awoke one day, i asked mom are you here, she said no, the end<br />
        AR: <s style={{ color: 'red' }}>.</s>عندما استيقظت ذات يوم، سألت أمي: هل أنتِ هنا<s style={{ color: 'red' }}>؟</s> فأجابت: لا انتهى
      </div>

    </div>
  );
}
