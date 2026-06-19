import { useState, useRef, useEffect } from "react";

import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Trash2,
  Store,
  Clock,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

import HeroBanner from "../../components/home/HeroBanner";
import SidebarFilter from "../../components/home/SidebarFilter";
import CategorySection from "../../components/home/CategorySection";
import ProductGrid from "../../components/home/ProductGrid";
import ShoppingMode from "../../components/home/ShoppingMode";
import RekomendasiSpesial from "../../components/home/RekomendasiSpesial";
import Footer from "../../components/home/Footer";
import LoginPopup from "../../components/home/LoginPopup";

function Home() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const wishlistKey = `wishlist_${currentUser.id}`;
  const cartKey = `cart_${currentUser.id}`;
  const navigate = useNavigate();

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

  // ================= PRODUCT REF =================
  const productRef = useRef(null);

  // ================= CATEGORY =================
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // ================= SHOPPING MODE =================
  const [shoppingMode, setShoppingMode] = useState("PREMIUM");

  // ================= FILTER =================
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000000,
    brands: [],
    ratings: [],
  });

  // ================= LOGIN =================
  const [showLogin, setShowLogin] = useState(false);

  // ================= WISHLIST =================
  const [showWishlist, setShowWishlist] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistDuration, setWishlistDuration] = useState({});
  const [wishlistTimestamps, setWishlistTimestamps] = useState({});
  const [wishlistCountdowns, setWishlistCountdowns] = useState({});

  // ================= CART =================
  const [showCart, setShowCart] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  // ================= TOTAL =================
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0,
  );

  const serviceFee = 2000;

  const total = subtotal + serviceFee;

  // ================= LOAD WISHLIST =================
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    setWishlistItems(savedWishlist);

    // Initialize timestamps for items that don't have one
    const timestamps =
      JSON.parse(
        localStorage.getItem(`wishlist_timestamps_${currentUser.id}`),
      ) || {};

    savedWishlist.forEach((item) => {
      if (!timestamps[item.id]) {
        timestamps[item.id] = Date.now();
      }
    });

    localStorage.setItem(
      `wishlist_timestamps_${currentUser.id}`,
      JSON.stringify(timestamps),
    );
    setWishlistTimestamps(timestamps);
  }, []);

  // ================= LOAD CART =================
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showCart") === "true") {
      setShowCart(true);
    }
  }, [location.search]);

  // ================= COUNTDOWN TIMER =================
  useEffect(() => {
    // Initial calculation
    const calculateCountdowns = () => {
      const newCountdowns = {};

      wishlistItems.forEach((item) => {
        const startTime = wishlistTimestamps[item.id] || Date.now();
        const duration = (wishlistDuration[item.id] || 1) * 24 * 60 * 60 * 1000; // Convert days to ms
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);

        // Calculate hours, days, minutes, seconds
        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        newCountdowns[item.id] = {
          hours,
          days,
          minutes,
          seconds,
          formatted: `${days}D ${hours}H ${minutes}M ${seconds}S`,
        };
      });

      setWishlistCountdowns(newCountdowns);
    };

    // Calculate immediately on first load
    calculateCountdowns();

    // Then set up interval for continuous updates
    const timer = setInterval(calculateCountdowns, 1000);

    return () => clearInterval(timer);
  }, [wishlistItems, wishlistDuration, wishlistTimestamps]);

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {
    if (productRef.current) {
      const topPosition = productRef.current.offsetTop - 120;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="
        bg-[#f5f7fb]
        w-full
        min-h-screen
        overflow-x-hidden
      "
    >
      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        search={search}
        setSearch={setSearch}
        setShowWishlist={setShowWishlist}
        setShowCart={setShowCart}
        onSearch={handleSearch}
        wishlistCount={wishlistItems.length}
        cartCount={cartItems.length}
      />

      {/* ================= MAIN ================= */}
      <main
        className="
          w-full
          max-w-[1920px]
          mx-auto
          px-5
          py-6
        "
      >
        {/* HERO */}
        <HeroBanner
          productRef={productRef}
          scrollToShoppingMode={() => {
            const section = document.getElementById("shopping-mode");

            if (section) {
              section.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
        />

        {/* CONTENT */}
        <div
          className="
            grid
            grid-cols-[260px_1fr]
            gap-6
            mt-6
          "
        >
          {/* SIDEBAR */}
          <div
            className="
              h-fit
            "
          >
            <SidebarFilter filters={filters} setFilters={setFilters} />
          </div>

          {/* RIGHT */}
          <div>
            <CategorySection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <div id="shopping-mode" className="mt-5 scroll-mt-32">
              <ShoppingMode
                shoppingMode={shoppingMode}
                setShoppingMode={setShoppingMode}
              />
            </div>

            <section
              id="products"
              ref={productRef}
              className="mt-5 scroll-mt-32"
            >
              <ProductGrid
                selectedCategory={selectedCategory}
                shoppingMode={shoppingMode}
                filters={filters}
                search={search}
                isCustomer={true}
                setWishlistItems={setWishlistItems}
                setShowWishlist={setShowWishlist}
                setCartItems={setCartItems}
                setShowCart={setShowCart}
              />
            </section>
          </div>
        </div>
        <div className="mt-12">
          <RekomendasiSpesial
            shoppingMode={shoppingMode}
            pageType="customer"
            isCustomer={true}
            setWishlistItems={setWishlistItems}
            setShowWishlist={setShowWishlist}
            setCartItems={setCartItems}
            setShowCart={setShowCart}
            setAuthModal={setShowLogin}
          />
        </div>

        {/* FOOTER */}
        <div className="mt-14">
          <Footer />
        </div>
      </main>

      {/* ================= LOGIN POPUP ================= */}
      <LoginPopup show={showLogin} setShow={setShowLogin} />

      {/* ================= WISHLIST DRAWER ================= */}
      {showWishlist && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setShowWishlist(false)}
            className="
              fixed
              inset-0
              bg-black/40
              z-[998]
            "
          />

          {/* DRAWER */}
          <div
            className="
              fixed
              top-0
              right-0
              w-[420px]
              h-screen
              bg-white
              shadow-2xl
              z-[999]
              overflow-y-auto
            "
          >
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart size={28} className="text-red-500 fill-red-500" />
                <h2 className="text-xl font-black">WISHLIST SAYA</h2>
              </div>

              <button
                onClick={() => setShowWishlist(false)}
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-100
                  text-slate-500
                "
              >
                ✕
              </button>
            </div>

            {/* EMPTY */}
            {wishlistItems.length === 0 && (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-24
                  text-center
                  px-6
                "
              >
                <div
                  className="
                    w-28
                    h-28
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    mb-6
                  "
                >
                  <Heart size={55} className="text-slate-300" />
                </div>

                <h3
                  className="
                    text-3xl
                    font-black
                  "
                >
                  WISHLIST KOSONG
                </h3>

                <p
                  className="
                    text-slate-500
                    mt-4
                    max-w-[280px]
                  "
                >
                  Simpan produk favoritmu untuk dibeli nanti.
                </p>

                <button
                  onClick={() => {
                    setShowWishlist(false);

                    document.getElementById("products")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="
                    mt-8
                    h-14
                    px-10
                    rounded-2xl
                    bg-blue-600
                    text-white
                    font-black
                  "
                >
                  Belanja Sekarang
                </button>
              </div>
            )}

            {/* LIST */}
            <div className="p-6 space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="
                    border
                    rounded-2xl
                    p-4
                    bg-white
                    shadow-sm
                    hover:shadow-md
                    transition-shadow
                  "
                >
                  {/* PRODUCT IMAGE */}
                  <div className="flex gap-4 mb-3">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          w-28
                          h-28
                          rounded-xl
                          object-cover
                          bg-slate-100
                        "
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      {/* STORE INFO */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Store size={14} className="text-slate-400" />
                        <a
                          href={`/store/${item.sellerId}`}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          {item.store?.toUpperCase()}
                        </a>
                      </div>

                      {/* PRODUCT NAME */}
                      <h3 className="font-bold text-sm line-clamp-2 mb-2">
                        {item.name}
                      </h3>

                      {/* PRICE */}
                      <p className="text-lg font-black text-blue-600">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>

                      {/* MODE/STATUS */}
                      {item.mode && (
                        <div className="mt-2 flex items-center gap-1.5 bg-orange-100 text-orange-700 px-2 py-1 rounded-lg w-fit">
                          <Clock size={12} />
                          <span className="text-xs font-bold">
                            {item.mode === "FLASH" ? "⏱️ " : ""}
                            {wishlistCountdowns[item.id]?.formatted ||
                              "0D 0H 0M 0S"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DURATION SLIDER */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-600 block mb-2">
                      DURASI SIMPAN ({wishlistDuration[item.id] || 1}-10 HARI)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={wishlistDuration[item.id] || 1}
                      onChange={(e) =>
                        setWishlistDuration({
                          ...wishlistDuration,
                          [item.id]: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2">
                    {/* TAMBAH CART */}
                    <button
                      onClick={() => {
                        const oldCart =
                          JSON.parse(localStorage.getItem(cartKey)) || [];

                        const isExist = oldCart.find(
                          (cartItem) => cartItem.id === item.id,
                        );

                        let updatedCart = oldCart;

                        if (!isExist) {
                          updatedCart = [
                            ...oldCart,
                            {
                              ...item,
                              qty: 1,
                            },
                          ];

                          localStorage.setItem(
                            cartKey,
                            JSON.stringify(updatedCart),
                          );

                          setCartItems(updatedCart);
                        }

                        const updatedWishlist = wishlistItems.filter(
                          (wishlistItem) => wishlistItem.id !== item.id,
                        );

                        setWishlistItems(updatedWishlist);

                        // Remove timestamp for moved item
                        const timestamps =
                          JSON.parse(
                            localStorage.getItem(
                              `wishlist_timestamps_${currentUser.id}`,
                            ),
                          ) || {};
                        delete timestamps[item.id];
                        localStorage.setItem(
                          `wishlist_timestamps_${currentUser.id}`,
                          JSON.stringify(timestamps),
                        );
                        setWishlistTimestamps(timestamps);

                        localStorage.setItem(
                          wishlistKey,
                          JSON.stringify(updatedWishlist),
                        );
                      }}
                      className="
                        flex-1
                        h-11
                        rounded-xl
                        bg-blue-600
                        text-white
                        font-bold
                        text-sm
                        hover:bg-blue-700
                        transition
                      "
                    >
                      Tambah ke Keranjang
                    </button>

                    {/* HAPUS */}
                    <button
                      onClick={() => {
                        const updated = wishlistItems.filter(
                          (wishlistItem) => wishlistItem.id !== item.id,
                        );

                        setWishlistItems(updated);

                        // Remove timestamp for deleted item
                        const timestamps =
                          JSON.parse(
                            localStorage.getItem(
                              `wishlist_timestamps_${currentUser.id}`,
                            ),
                          ) || {};
                        delete timestamps[item.id];
                        localStorage.setItem(
                          `wishlist_timestamps_${currentUser.id}`,
                          JSON.stringify(timestamps),
                        );
                        setWishlistTimestamps(timestamps);

                        localStorage.setItem(
                          wishlistKey,
                          JSON.stringify(updated),
                        );
                      }}
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-red-50
                        text-red-500
                        flex
                        items-center
                        justify-center
                        hover:bg-red-100
                        transition
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= CART DRAWER ================= */}
      {showCart && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setShowCart(false)}
            className="
              fixed
              inset-0
              bg-black/40
              z-[998]
            "
          />

          {/* DRAWER */}
          <div
            className="
              fixed
              top-0
              right-0
              w-[420px]
              h-screen
              bg-white
              shadow-2xl
              z-[999]
              p-6
              overflow-y-auto
            "
          >
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div
                  className="
        w-12
        h-12
        rounded-2xl
        bg-blue-600
        text-white
        flex
        items-center
        justify-center
        shadow-lg
      "
                >
                  <ShoppingCart size={22} />
                </div>

                <div>
                  <h2 className="text-[20px] font-black text-slate-900">
                    Keranjang Belanja
                  </h2>

                  <p
                    className="
  inline-flex
  items-center
  gap-1.5
  px-2.5
  py-1
  rounded-full
  bg-slate-100
  text-[11px]
  font-bold
  text-slate-500
  uppercase
"
                  >
                    {cartItems.length} Item Terpilih
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="
      text-slate-400
      hover:text-slate-700
      text-3xl
    "
              >
                ✕
              </button>
            </div>

            {/* EMPTY */}
            {cartItems.length === 0 && (
              <div
                className="
                  h-[75vh]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className="
                    w-28
                    h-28
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    mb-8
                  "
                >
                  <ShoppingCart size={50} className="text-slate-300" />
                </div>

                <h3
                  className="
                    text-3xl
                    font-black
                  "
                >
                  KERANJANG KOSONG
                </h3>

                <p
                  className="
                    text-slate-500
                    mt-4
                    max-w-[300px]
                  "
                >
                  Tambahkan produk favoritmu ke keranjang untuk checkout.
                </p>

                <button
                  onClick={() => {
                    setShowCart(false);

                    document.getElementById("products")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="
                    mt-8
                    px-10
                    h-14
                    rounded-2xl
                    bg-blue-600
                    text-white
                    font-black
                  "
                >
                  Belanja Sekarang
                </button>
              </div>
            )}

            {/* LIST */}
            <div className="p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="
    bg-white
    py-4
    border-b
    border-slate-100
  "
                >
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
      w-[120px]
      h-[120px]
      rounded-3xl
      object-cover
      bg-slate-100
      shrink-0
    "
                    />

                    <div className="flex-1">
                      {/* TOP */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div
                            className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1
            rounded-full
            bg-slate-100
            text-[12px]
            font-black
            text-slate-600
            uppercase
          "
                          >
                            🔵 {item.store}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = cartItems.filter(
                              (cartItem) => cartItem.id !== item.id,
                            );

                            setCartItems(updated);

                            localStorage.setItem(
                              cartKey,
                              JSON.stringify(updated),
                            );
                          }}
                          className="
          text-slate-300
          hover:text-red-500
        "
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* TITLE */}
                      <h3
                        className="
  mt-2
  text-[15px]
  leading-tight
  font-extrabold
  text-slate-900
  line-clamp-2
"
                      >
                        {item.name}
                      </h3>

                      {/* CATEGORY */}
                      <p
                        className="
  text-[11px]
  uppercase
  font-semibold
  text-slate-400
  mt-1
"
                      >
                        {item.category}
                      </p>

                      {/* BOTTOM */}
                      <div className="mt-3 flex items-center gap-3">
                        <p
                          className="
    flex-1
    text-[14px]
    font-extrabold
    text-blue-600
    whitespace-nowrap
  "
                        >
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>

                        <div
                          className="
    flex
    items-center
    justify-between
    w-[105px]
    h-[38px]
    px-2
    bg-slate-100
    rounded-full
    shrink-0
  "
                        >
                          <button
                            onClick={() => {
                              const updated = cartItems.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      qty: Math.max(1, (cartItem.qty || 1) - 1),
                                    }
                                  : cartItem,
                              );

                              setCartItems(updated);
                              localStorage.setItem(
                                cartKey,
                                JSON.stringify(updated),
                              );
                            }}
                            className="
      w-6
      h-6
      flex
      items-center
      justify-center
      text-slate-400
      hover:text-slate-700
      font-bold
      text-sm
    "
                          >
                            −
                          </button>

                          <span
                            className="
      w-5
      text-center
      text-sm
      font-bold
      text-slate-900
    "
                          >
                            {item.qty || 1}
                          </span>

                          <button
                            onClick={() => {
                              const updated = cartItems.map((cartItem) =>
                                cartItem.id === item.id
                                  ? {
                                      ...cartItem,
                                      qty: (cartItem.qty || 1) + 1,
                                    }
                                  : cartItem,
                              );

                              setCartItems(updated);
                              localStorage.setItem(
                                cartKey,
                                JSON.stringify(updated),
                              );
                            }}
                            className="
      w-6
      h-6
      flex
      items-center
      justify-center
      text-blue-600
      hover:text-blue-800
      font-bold
      text-sm
    "
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            {cartItems.length > 0 && (
              <div
                className="
    sticky
    bottom-0
    bg-white
    border-t
    border-slate-200
    p-6
  "
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Subtotal</span>

                    <span className="font-black text-slate-600">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">
                      Biaya Layanan
                    </span>

                    <span className="font-black text-slate-600">
                      Rp {serviceFee.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="border-t pt-5 flex justify-between">
                    <span
                      className="
          text-[18px]
          font-black
          uppercase
          tracking-wider
        "
                    >
                      TOTAL BAYAR
                    </span>

                    <span
                      className="
          text-[22px]
          font-black
          text-blue-600
        "
                    >
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false);
                      navigate("/customer/checkout");
                    }}
                    className="
    w-full
    h-[58px]
    rounded-[20px]
    bg-blue-600
    hover:bg-blue-700
    text-white
    text-[18px]
    font-black
    flex
    items-center
    justify-center
    gap-3
    transition
  "
                  >
                    Lanjut ke Pembayaran
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
