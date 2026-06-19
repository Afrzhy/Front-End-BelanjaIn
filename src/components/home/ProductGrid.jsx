import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Sparkles,
  Search,
} from "lucide-react";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";
function ProductGrid({
  selectedCategory,
  shoppingMode,
  filters,
  search = "",
  pageType,
  isCustomer,
  setWishlistItems,
  setShowWishlist,
  setCartItems,
  setShowCart,
  setAuthModal,
}) {
const localProducts = [];

Object.keys(localStorage).forEach((key) => {
  if (key.startsWith("sellerProducts_")) {
    const sellerProducts =
      JSON.parse(localStorage.getItem(key)) || [];

    localProducts.push(...sellerProducts);
  }
});

// HAPUS DUPLIKAT BERDASARKAN ID
const productMap = new Map();

[...products, ...localProducts].forEach(
  (item) => {
    productMap.set(item.id, item);
  }
);

const allProducts = Array.from(
  productMap.values()
);
console.log("Data products.js", products.length);
console.log("Data seller", localProducts.length);
console.log("Semua produk", allProducts);
  const [viewMode, setViewMode] =
    useState("grid");

  const [sortBy, setSortBy] =
    useState("Terbaru");
  const [searchTerm, setSearchTerm] =
  useState("");

  /* ================= FILTER ================= */
let filteredProducts =
  allProducts.filter((item) => {
    console.log("ITEM", item);
    // ================= CATEGORY =================
    const matchCategory =
  selectedCategory === "Semua" ||
  item.category?.toLowerCase() ===
    selectedCategory?.toLowerCase();

    // ================= MODE =================
    const matchMode =
  search.trim() !== ""
    ? true
    : shoppingMode === "SEMUA" ||
      item.mode === shoppingMode;

    // ================= SEARCH =================
    const keyword =
  searchTerm || search;

const matchSearch =
  keyword.trim() === "" ||
  item.name
    ?.toLowerCase()
    .includes(keyword.toLowerCase()) ||
  item.brand
    ?.toLowerCase()
    .includes(keyword.toLowerCase()) ||
  item.category
    ?.toLowerCase()
    .includes(keyword.toLowerCase());

    // ================= PRICE =================
    const matchPrice =
      item.price >=
        filters.minPrice &&
      item.price <=
        filters.maxPrice;

    // ================= BRAND =================
    const matchBrand =
      filters.brands.length === 0
        ? true
        : filters.brands.includes(
            item.brand
          );

    // ================= RATING =================
    const matchRating =
      filters.ratings.length === 0
        ? true
        : filters.ratings.some(
            (rating) =>
              item.rating >= rating
          );

    // ================= RETURN =================
    return (
      matchCategory &&
      matchMode &&
      matchSearch &&
      matchPrice &&
      matchBrand &&
      matchRating
    );
  });

  /* ================= SORT ================= */

  if (sortBy === "Termurah") {

    filteredProducts.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (sortBy === "Termahal") {

    filteredProducts.sort(
      (a, b) =>
        b.price - a.price
    );
  }
console.log(
  "Produk seller 5",
  allProducts.filter(
    (item) => item.sellerId === 5
  )
);
  return (
    <div className="mt-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">

        {/* LEFT */}
        <div>

          <div className="flex items-center gap-3">

            <Sparkles className="text-blue-600" />

            <h2
  className="
    text-[22px]
    font-black
    tracking-tight
    text-slate-900
  "
>
  Produk
</h2>
          </div>

          <p
  className="
    text-[14px]
    text-slate-500
    mt-1
    font-medium
  "
>
            Menampilkan{" "}
            {filteredProducts.length} produk
          </p>

        </div>

        {/* RIGHT */}
<div className="flex items-center gap-3 flex-wrap">

  {/* SEARCH */}
  <div className="relative">
    <Search
      size={18}
      className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-slate-400
      "
    />

    <input
      type="text"
      placeholder="Cari produk..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
      className="
        w-[260px]
        h-[55px]
        pl-11
        pr-4
        rounded-2xl
        bg-white
        border
        border-slate-200
        outline-none
        shadow-sm
        text-sm
        font-medium
        focus:border-blue-500
      "
    />
  </div>

  {/* VIEW */}
  <div
    className="
      h-[55px]
      rounded-2xl
      bg-white
      border
      flex
      overflow-hidden
      shadow-sm
    "
  >
    <button
      onClick={() =>
        setViewMode("grid")
      }
      className={`w-12 flex items-center justify-center transition ${
        viewMode === "grid"
          ? "bg-blue-50 text-blue-600"
          : "text-slate-400"
      }`}
    >
      <LayoutGrid size={18} />
    </button>

    <button
      onClick={() =>
        setViewMode("list")
      }
      className={`w-12 flex items-center justify-center transition ${
        viewMode === "list"
          ? "bg-blue-50 text-blue-600"
          : "text-slate-400"
      }`}
    >
      <List size={18} />
    </button>
  </div>

  {/* SORT */}
  <div className="relative">
    <select
      value={sortBy}
      onChange={(e) =>
        setSortBy(
          e.target.value
        )
      }
      className="
        appearance-none
        w-[150px]
        h-[55px]
        rounded-2xl
        bg-white
        border
        border-slate-200
        px-5
        pr-10
        outline-none
        shadow-sm
        font-semibold
      "
    >
      <option>
        Terbaru
      </option>

      <option>
        Termurah
      </option>

      <option>
        Termahal
      </option>
    </select>

    <ArrowUpDown
      size={16}
      className="
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-slate-400
      "
    />
  </div>

</div>

      </div>

      {/* ================= PRODUCTS ================= */}
      <div
        className={`gap-6 ${
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6"
            : "flex flex-col"
        }`}
      >

        {filteredProducts.map(
          (item) => (
            <ProductCard
  key={item.id}
  item={item}
  viewMode={viewMode}

  isCustomer={isCustomer}

  setCartItems={setCartItems}
  setShowCart={setShowCart}
  setShowWishlist={
    setShowWishlist
  }
  setWishlistItems={
    setWishlistItems
  }
  setAuthModal={
    setAuthModal
  }
/>

          )
        )}

      </div>

    </div>
  );
}

export default ProductGrid;