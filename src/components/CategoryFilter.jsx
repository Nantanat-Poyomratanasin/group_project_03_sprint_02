export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 sm:mb-7 sm:gap-3 lg:mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-[0.72rem] font-semibold transition-all duration-300 sm:px-5 sm:py-2 sm:text-xs lg:px-6 lg:text-sm ${
            activeCategory === cat
              ? "border-[#7B5647] bg-[#7B5647] text-white shadow-[0_0_0_3px_rgba(123,86,71,0.25)]"
              : "border-transparent bg-[#B78D76] text-white hover:bg-[#A66858]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
