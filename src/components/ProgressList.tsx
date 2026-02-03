import { TranslationPair } from '../types/TransVerifyTypes';
import { CheckCircle, Circle, SkipForward } from 'lucide-react';

interface ProgressListProps {
  pairs: TranslationPair[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const ProgressList = ({ pairs, currentIndex, onSelectIndex }: ProgressListProps) => {
  const getStatusIcon = (pair: TranslationPair) => {
    if (pair.verified) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (pair.arVerified) return <SkipForward className="h-4 w-4 text-yellow-500" />;
    return <Circle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusColor = (pair: TranslationPair, index: number) => {
    if (index === currentIndex) return 'bg-blue-100 border-blue-500';
    if (pair.verified) return 'bg-green-50 border-green-200';
    if (pair.arVerified) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">All Entries</h3>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {pairs.map((pair, index) => (
          <div
            key={pair.id}
            onClick={() => onSelectIndex(index)}
            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getStatusColor(pair, index)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(pair)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Entry #{index + 1}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {pair.en.substring(0, 100)}...
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
