import {
  Wallet,
  ShieldCheck,
  Star,
  Sparkles,
  RotateCcw,
} from "lucide-react";

function SidebarFilter({ filters, setFilters }) {
  const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Logitech",
    "Nike",
    "Adidas",
  ];

  const ratings = [5, 4, 3];

  /* =========================
     BRAND
  ========================= */
  const handleBrandChange = (brand) => {
    const exists = filters.brands.includes(brand);

    if (exists) {
      setFilters({
        ...filters,
        brands: filters.brands.filter(
          (item) => item !== brand
        ),
      });
    } else {
      setFilters({
        ...filters,
        brands: [...filters.brands, brand],
      });
    }
  };

  /* =========================
     RATING
  ========================= */
  const handleRatingChange = (rating) => {
    const exists = filters.ratings.includes(rating);

    if (exists) {
      setFilters({
        ...filters,
        ratings: filters.ratings.filter(
          (item) => item !== rating
        ),
      });
    } else {
      setFilters({
        ...filters,
        ratings: [...filters.ratings, rating],
      });
    }
  };

  /* =========================
     RESET
  ========================= */
  const handleReset = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 5000000,
      brands: [],
      ratings: [],
    });
  };

  return (
    <div className="space-y-5">
      {/* ================= HEADER ================= */}
      <div
        className="
          bg-[#f4f6fa]
          border
          border-slate-200
          rounded-[30px]
          p-6
        "
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles
            size={14}
            className="text-blue-500"
          />

          <h2
            className="
              text-[14px]
              font-black
              uppercase
              tracking-[2px]
              text-slate-800
            "
          >
            Saring Produk
          </h2>
        </div>

        <p
          className="
            text-[12px]
            font-semibold
            text-slate-500
            leading-relaxed
          "
        >
          Filter barang di bawah sesuai
          dengan spesifikasi yang Anda cari.
        </p>
      </div>

      {/* ================= HARGA ================= */}
      <div
        className="
          bg-[#f8f9fb]
          border
          border-slate-200
          rounded-[30px]
          p-5
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            pb-4
            border-b
            border-slate-200
          "
        >
          <Wallet
            size={14}
            className="text-blue-500"
          />

          <h2
            className="
              text-[12px]
              font-black
              uppercase
              tracking-[3px]
              text-slate-500
            "
          >
            Harga
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {/* MIN */}
          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[3px]
                text-slate-400
                mb-2
              "
            >
              Minimum
            </p>

            <div className="relative">
              <span
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[11px]
                  font-black
                  text-slate-500
                "
              >
                Rp
              </span>

              <input
                type="text"
                value={filters.minPrice.toLocaleString(
                  "id-ID"
                )}
                onChange={(e) => {
                  const value = Number(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  );

                  setFilters({
                    ...filters,
                    minPrice: value || 0,
                  });
                }}
                className="
                  w-full
                  h-10
                  rounded-xl
                  bg-[#eef1f5]
                  px-10
                  text-[12px]
                  font-bold
                  text-slate-700
                  outline-none
                  border
                  border-transparent
                  focus:border-blue-400
                "
              />
            </div>
          </div>

          {/* MAX */}
          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[3px]
                text-slate-400
                mb-2
              "
            >
              Maksimum
            </p>

            <div className="relative">
              <span
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[11px]
                  font-black
                  text-slate-500
                "
              >
                Rp
              </span>

              <input
                type="text"
                value={filters.maxPrice.toLocaleString(
                  "id-ID"
                )}
                onChange={(e) => {
                  let value = Number(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  );

                  if (value > 5000000) {
                    value = 5000000;
                  }

                  setFilters({
                    ...filters,
                    maxPrice: value || 0,
                  });
                }}
                className="
                  w-full
                  h-10
                  rounded-xl
                  bg-[#eef1f5]
                  px-10
                  text-[12px]
                  font-bold
                  text-slate-700
                  outline-none
                  border
                  border-transparent
                  focus:border-blue-400
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BRAND ================= */}
      <div
        className="
          bg-[#f8f9fb]
          border
          border-slate-200
          rounded-[30px]
          p-5
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            pb-4
            border-b
            border-slate-200
          "
        >
          <ShieldCheck
            size={14}
            className="text-blue-500"
          />

          <h2
            className="
              text-[12px]
              font-black
              uppercase
              tracking-[3px]
              text-slate-500
            "
          >
            Merek Populer
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {brands.map((brand) => (
            <label
              key={brand}
              className="
                flex
                items-center
                gap-2
                h-9
                px-3
                rounded-xl
                bg-[#eef1f5]
                cursor-pointer
                text-[11px]
                font-bold
                text-slate-700
              "
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(
                  brand
                )}
                onChange={() =>
                  handleBrandChange(brand)
                }
                className="w-3.5 h-3.5"
              />

              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* ================= RATING ================= */}
      <div
        className="
          bg-[#f8f9fb]
          border
          border-slate-200
          rounded-[30px]
          p-5
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            pb-4
            border-b
            border-slate-200
          "
        >
          <Star
            size={14}
            className="text-blue-500"
          />

          <h2
            className="
              text-[12px]
              font-black
              uppercase
              tracking-[3px]
              text-slate-500
            "
          >
            Rating
          </h2>
        </div>

        <div className="space-y-3 mt-5">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="
                flex
                items-center
                justify-between
                h-9
                px-3
                rounded-xl
                bg-[#eef1f5]
                cursor-pointer
              "
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(
                    rating
                  )}
                  onChange={() =>
                    handleRatingChange(rating)
                  }
                  className="w-3.5 h-3.5"
                />

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={10}
                      fill={
                        star <= rating
                          ? "#fbbf24"
                          : "none"
                      }
                      className={
                        star <= rating
                          ? "text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <span
                className="
                  text-[10px]
                  font-black
                  text-slate-400
                "
              >
                {rating}+
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ================= RESET ================= */}
      <button
        onClick={handleReset}
        className="
          w-full
          h-12
          rounded-[20px]
          bg-slate-900
          hover:bg-slate-800
          text-white
          text-[12px]
          font-black
          uppercase
          tracking-[2px]
          transition-all
          duration-300
          flex
          items-center
          justify-center
          gap-2
          shadow-lg
          hover:scale-[1.02]
        "
      >
        <RotateCcw size={14} />
        Reset Filter
      </button>
    </div>
  );
}

export default SidebarFilter;