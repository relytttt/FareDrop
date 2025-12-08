interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  className?: string;
  showDiscount?: boolean;
}

export default function PriceDisplay({
  price,
  originalPrice,
  className = '',
  showDiscount = true,
}: PriceDisplayProps) {
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span className="text-4xl font-bold text-accent-600">
        ${price.toFixed(0)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-xl text-gray-400 line-through">
            ${originalPrice.toFixed(0)}
          </span>
          {showDiscount && discountPercent > 0 && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
