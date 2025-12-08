import { Deal } from '@/types';
import DealCard from './DealCard';

interface DealGridProps {
  deals: Deal[];
  emptyMessage?: string;
  viewMode?: 'list' | 'tile';
}

export default function DealGrid({ deals, emptyMessage = "No deals found", viewMode = 'tile' }: DealGridProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">✈️</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Check back soon for amazing flight deals!</p>
      </div>
    );
  }

  // List view - vertical stack of compact cards
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} variant="compact" />
        ))}
      </div>
    );
  }

  // Tile view - grid of larger cards (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
