type StarsRatingProps = {
    voteAverage: number;
};

const StarsRatingComponent = ({ voteAverage }: StarsRatingProps) => {
    const rating = voteAverage ? Number(voteAverage.toFixed(1)) : 0;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5" title={`${rating} / 10`}>
                {Array.from({ length: 10 }).map((_, index) => {
                    const starValue = index + 1;

                    let fillPercent = 0;
                    if (rating >= starValue) {
                        fillPercent = 100;
                    } else if (rating > index) {
                        fillPercent = (rating - index) * 100;
                    }

                    return (
                        <div key={index} className="relative w-4 h-4 text-zinc-600">
                            {/* grey background star */}
                            <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>

                            {/* yellow filled star */}
                            {fillPercent > 0 && (
                                <div
                                    className="absolute inset-0 overflow-hidden text-amber-400"
                                    style={{ width: `${fillPercent}%` }}
                                >
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <span className="text-amber-300 font-bold text-sm">
        {rating} <span className="text-zinc-500 font-normal text-xs">/ 10</span>
      </span>
        </div>
    );
};

export default StarsRatingComponent;