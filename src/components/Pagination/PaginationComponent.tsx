type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const PaginationComponent = ({
                                 currentPage,
                                 totalPages,
                                 onPageChange,
                             }: PaginationProps) => {
    const maxPages = Math.min(totalPages, 500);

    const getPageItems = () => {
        const items: (number | string)[] = [];
        const delta = 2;

        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(maxPages - 1, currentPage + delta);

        items.push(1);
        if (rangeStart > 2) items.push("dots-left");

        for (let i = rangeStart; i <= rangeEnd; i++) {
            items.push(i);
        }

        if (rangeEnd < maxPages - 1) items.push("dots-right");
        if (maxPages > 1) items.push(maxPages);

        return items;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 my-10 select-none">
            {/* Prev */}
            {currentPage > 1 ? (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-sm font-medium transition-colors hover:bg-slate-800 cursor-pointer"
                >
                    Prev
                </button>
            ) : (
                <span className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-sm font-medium opacity-40 cursor-not-allowed">
                    Prev
                </span>
            )}

            {/* Pages */}
            <div className="flex items-center gap-1.5">
                {getPageItems().map((item) => {
                    if (typeof item === "string") {
                        return (
                            <span key={item} className="px-2 text-slate-500 font-bold select-none">
                                ...
                            </span>
                        );
                    }

                    const isActive = item === currentPage;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPageChange(item)}
                            className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                isActive
                                    ? "bg-white text-slate-950 font-bold shadow-lg scale-105"
                                    : "bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            {/* Next */}
            {currentPage < maxPages ? (
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-sm font-medium transition-colors hover:bg-slate-800 cursor-pointer"
                >
                    Next
                </button>
            ) : (
                <span className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-sm font-medium opacity-40 cursor-not-allowed">
                    Next
                </span>
            )}
        </div>
    );
};

export default PaginationComponent;