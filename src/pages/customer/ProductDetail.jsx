import {
  Star,
  Heart,
  ShoppingCart,
  MessageCircle,
  CircleAlert,
  Share2,
  ArrowRight,
  ThumbsUp,
  Store,
  Trash2,
  Clock,
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
import { sellers } from "../../data/sellers";
import Navbar from "../../components/customer/CustomerNavbar";
import Footer from "../../components/home/Footer";
import ViewAllReviewsModal from "../../components/customer/ViewAllReviewsModal";
import { products } from "../../data/products";
import { reviews } from "../../data/reviews";
import { useState, useEffect } from "react";
function ProductDetail() {
  // ================= STATE =================
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [followedStores, setFollowedStores] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistDuration, setWishlistDuration] = useState({});
  const [wishlistTimestamps, setWishlistTimestamps] = useState({});
  const [wishlistCountdowns, setWishlistCountdowns] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState(null);
  const [reviewSort, setReviewSort] = useState("terbaru");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [search, setSearch] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 17,
    seconds: 35,
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0,
  );

  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const wishlistKey = `wishlist_${currentUser?.id}`;

    const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    setWishlistItems(savedWishlist);

    // Initialize timestamps for items that don't have one
    const timestamps =
      JSON.parse(
        localStorage.getItem(`wishlist_timestamps_${currentUser?.id}`),
      ) || {};

    savedWishlist.forEach((item) => {
      if (!timestamps[item.id]) {
        timestamps[item.id] = Date.now();
      }
    });

    localStorage.setItem(
      `wishlist_timestamps_${currentUser?.id}`,
      JSON.stringify(timestamps),
    );
    setWishlistTimestamps(timestamps);

    if (currentUser) {
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
      setCartItems(savedCart);
    }
  }, []);
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let savedFollowed = [];

    if (currentUser) {
      try {
        savedFollowed =
          JSON.parse(
            localStorage.getItem(`followedStores_${currentUser.id}`),
          ) || [];
      } catch (error) {
        savedFollowed = [];
      }
    }

    setFollowedStores(savedFollowed);
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();

  // Validate image URL
  const isValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
  };

  const localProducts = [];

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sellerProducts_")) {
      const sellerProducts = JSON.parse(localStorage.getItem(key)) || [];

      localProducts.push(...sellerProducts);
    }
  });

  const allProducts = [...products, ...localProducts];

  const product = allProducts.find((p) => String(p.id) === String(id));
  const seller = sellers.find((s) => s.id === product?.sellerId);

  const productReviews = reviews.filter(
    (review) => review.productId === product?.id,
  );
  const totalReviewCount = productReviews.length;
  const averageRating = totalReviewCount
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
      totalReviewCount
    : 0;
  const ratingSummary = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((review) => Math.round(review.rating) === star)
      .length,
  }));

  const getFilteredReviews = () => {
    let filtered = [...productReviews];

    if (reviewFilter) {
      filtered = filtered.filter((r) => Math.round(r.rating) === reviewFilter);
    }

    if (reviewSort === "tertinggi") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (reviewSort === "terendah") {
      filtered.sort((a, b) => a.rating - b.rating);
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filtered;
  };

  // ================= TIMER EFFECT =================
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return {
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const produkTokoSama = allProducts.filter(
    (p) => p.sellerId === product?.sellerId && p.id !== product?.id,
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Produk Tidak Ditemukan
      </div>
    );
  }
  const handleCart = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang");
      navigate("/login");
      return;
    }

    const cartKey = `cart_${currentUser.id}`;

    const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const exist = oldCart.find((item) => item.id === product.id);

    let updatedCart = [];

    if (exist) {
      updatedCart = oldCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              qty: (item.qty || 1) + quantity,
            }
          : item,
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...product,
          qty: quantity,
        },
      ];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    setCartItems(updatedCart);

    // langsung buka drawer
    setShowCart(true);
  };

  const handleWishlist = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const wishlistKey = `wishlist_${currentUser?.id}`;
    const oldWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

    const exist = oldWishlist.find((item) => item.id === product.id);

    if (exist) {
      setShowWishlist(true);
      return;
    }

    const updatedWishlist = [...oldWishlist, product];

    localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));

    // Initialize timestamps
    const timestamps =
      JSON.parse(
        localStorage.getItem(`wishlist_timestamps_${currentUser?.id}`),
      ) || {};

    if (!timestamps[product.id]) {
      timestamps[product.id] = Date.now();
    }

    localStorage.setItem(
      `wishlist_timestamps_${currentUser?.id}`,
      JSON.stringify(timestamps),
    );

    setWishlistItems(updatedWishlist);
    setWishlistTimestamps(timestamps);
    setWishlistDuration({ ...wishlistDuration, [product.id]: 1 });

    // langsung buka drawer
    setShowWishlist(true);
  };
  const handleBuyNow = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk melakukan pembelian");
      navigate("/login");
      return;
    }

    const cartKey = `cart_${currentUser.id}`;
    const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const exist = oldCart.find((item) => item.id === product.id);

    let updatedCart = [];

    if (exist) {
      updatedCart = oldCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              qty: quantity,
            }
          : item,
      );
    } else {
      updatedCart = [
        {
          ...product,
          qty: quantity,
        },
      ];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    navigate("/customer/checkout");
  };
  const handleChat = () => {
    if (!seller) {
      navigate(`/customer/chat`);
      return;
    }

    navigate(`/customer/chat/${seller.id}`);
  };

  const handleReport = () => {
    alert("Laporan berhasil dikirim");
  };

  const handleFollow = () => {
    const isAlreadyFollowed = followedStores.includes(seller.id);

    let updated = [];

    if (isAlreadyFollowed) {
      updated = followedStores.filter((id) => id !== seller.id);
    } else {
      updated = [...followedStores, seller.id];
    }

    setFollowedStores(updated);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
      localStorage.setItem(
        `followedStores_${currentUser.id}`,
        JSON.stringify(updated),
      );
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.name,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link disalin");
    }
  };

  const isFollowed = followedStores.includes(seller?.id);
  return (
    <div className="bg-white min-h-screen">
      <Navbar
        search={search}
        setSearch={setSearch}
        setShowWishlist={setShowWishlist}
        setShowCart={setShowCart}
        wishlistCount={wishlistItems.length}
        cartCount={cartItems.length}
        onSearch={() => {
          navigate(`/customer?search=${search}`);
        }}
      />

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {/* BREADCRUMB */}
        <div className="text-xs text-slate-400 flex gap-2 mb-6">
          <span
            onClick={() => navigate("/customer")}
            className="cursor-pointer hover:text-black"
          >
            Beranda
          </span>
          <span>/</span>
          <span>Pencarian</span>
          <span>/</span>
          <span className="text-slate-700">{product.name}</span>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)_360px] gap-10 items-start">
          {/* ================= LEFT IMAGE ================= */}
          <div className="sticky top-28">
            <div className="border rounded-2xl p-3 shadow-sm">
              {isValidImageUrl(product.image) && (
                <img
                  src={product.image}
                  className="w-full h-[380px] object-cover rounded-xl"
                />
              )}
            </div>

            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 border rounded-lg overflow-hidden"
                >
                  {isValidImageUrl(product.image) && (
                    <img
                      src={product.image}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= CENTER INFO ================= */}
          <div>
            <h1 className="text-2xl font-black leading-snug">{product.name}</h1>

            <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
              <span>Terjual {product.sold}</span>

              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-black">{product.rating}</span>

              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                Trust {product.trust}%
              </span>
            </div>

            <h2
              className="
 text-2xl
 font-black
 text-black
 leading-none
 mt-6
 "
            >
              Rp {product.price.toLocaleString("id-ID")}
            </h2>

            {/* TABS */}
            <div className="flex gap-8 border-b mt-8">
              {["deskripsi", "info", "ulasan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-semibold ${
                    activeTab === tab
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  {tab === "deskripsi"
                    ? "Deskripsi Produk"
                    : tab === "info"
                      ? "Info"
                      : `Ulasan (${totalReviewCount.toLocaleString("id-ID")})`}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <div className="mt-6 text-sm text-slate-600">
              {activeTab === "deskripsi" && (
                <div className="space-y-2">
                  <p>
                    <b>Kategori:</b> {product.category}
                  </p>
                  <p>
                    <b>Stok:</b> {product.stock}
                  </p>
                  <p>
                    <b>Lokasi:</b> {product.city}
                  </p>
                  <p className="mt-3">{product.description}</p>
                </div>
              )}

              {activeTab === "info" && (
                <div className="space-y-3">
                  <div>
                    <b>Berat/Satuan:</b> {product.beratSatuan}
                  </div>
                  <div>
                    <b>Min. Pembelian:</b> {product.minBeli}
                  </div>
                  <div>
                    <b>Kondisi:</b> {product.kondisi}
                  </div>
                  <div>
                    <b>Asuransi:</b> {product.asuransi}
                  </div>
                  <div>
                    <b>Pemesanan Min:</b> {product.pemesananMin}
                  </div>
                </div>
              )}

              {activeTab === "ulasan" && (
                <div>
                  {totalReviewCount > 0 ? (
                    <div className="space-y-6">
                      {/* Rating Summary */}
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Star
                              size={24}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="text-3xl font-black">
                              {averageRating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-slate-500">
                            {totalReviewCount} ulasan
                          </p>
                        </div>
                        <div className="space-y-2">
                          {ratingSummary.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-2">
                              <span className="w-8 text-sm font-semibold">
                                {star}⭐
                              </span>
                              <div className="flex-1 h-2 bg-slate-200 rounded-full">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{
                                    width: `${totalReviewCount > 0 ? (count / totalReviewCount) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="w-8 text-sm text-slate-500">
                                {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reviews List - Show 3 */}
                      <div className="space-y-4">
                        {productReviews.slice(0, 3).map((review) => (
                          <div
                            key={review.id}
                            className="border rounded-xl p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">
                                    {review.reviewerName}
                                  </h4>
                                  {review.verified && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={`${
                                        i < Math.round(review.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-slate-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-slate-600 mt-2 text-xs">
                                  {review.comment}
                                </p>

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                  <div className="mt-3 grid grid-cols-5 gap-2">
                                    {review.images.map((image, idx) => (
                                      <div
                                        key={`${review.id}-${idx}`}
                                        className="rounded-lg overflow-hidden bg-slate-100 aspect-square cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => setShowReviewModal(true)}
                                      >
                                        <img
                                          src={image}
                                          alt={`Review from ${review.reviewerName}`}
                                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <p className="text-slate-400 text-xs mt-3">
                                  {review.date}
                                </p>
                              </div>
                            </div>
                            {review.helpful > 0 && (
                              <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                                <ThumbsUp size={14} />
                                {review.helpful} orang merasa membantu
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* See All Reviews Button */}
                      {totalReviewCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="w-full py-4 rounded-3xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                        >
                          Lihat Semua Ulasan
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>Belum ada ulasan untuk produk ini</p>
                  )}
                </div>
              )}
            </div>

            {/* ================= STORE INFO ================= */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between border rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {product.store.charAt(0)}
                  </div>

                  <div>
                    <button
                      onClick={() => navigate(`/customer/store/${seller?.id}`)}
                      className="font-bold hover:text-indigo-600"
                    >
                      {product.store}
                    </button>
                    <p className="text-xs text-slate-500">Official Store</p>
                  </div>
                </div>

                <button
                  onClick={handleFollow}
                  className={`
      px-5 py-2 rounded-xl font-bold text-sm transition
      ${isFollowed ? "bg-green-100 text-green-600" : "bg-indigo-600 text-white"}
    `}
                >
                  {isFollowed ? "Followed" : "Follow"}
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="sticky top-28">
            <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-lg">
              <div className="bg-blue-600 text-white px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="font-bold text-sm">Flash</p>
                      <p className="font-bold text-sm">Sale</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-xs mb-1">Berakhir</p>
                    <p className="font-semibold text-xs">Dalam</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="bg-white text-blue-600 px-2 py-1 rounded font-bold text-sm">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <span className="font-bold">:</span>
                    <div className="bg-white text-blue-600 px-2 py-1 rounded font-bold text-sm">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <span className="font-bold">:</span>
                    <div className="bg-white text-blue-600 px-2 py-1 rounded font-bold text-sm">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 space-y-4">
                <div>
                  <h3 className="font-bold text-base">
                    Atur jumlah dan catatan
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm transition hover:bg-slate-100"
                    >
                      -
                    </button>

                    <div className="w-10 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold text-sm">
                      {quantity}
                    </div>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-blue-600 text-sm transition hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Stok Flash Sale :{" "}
                    <span className="font-bold">{product.stock}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-right">
                    <p className="text-slate-400 line-through font-medium text-xs">
                      Rp{" "}
                      {(product.price * quantity * 1.2).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex justify-between items-baseline gap-2">
                    <p className="text-slate-600 font-medium text-sm">
                      Subtotal
                    </p>
                    <h2 className="text-2xl font-black text-slate-900">
                      Rp {(product.price * quantity).toLocaleString("id-ID")}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={handleCart}
                  className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition text-sm"
                >
                  + Keranjang
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition text-sm"
                >
                  Beli Langsung
                </button>
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-4 gap-3 px-5 py-4 text-xs text-center text-slate-600 border-t border-slate-200">
                <button
                  onClick={handleChat}
                  className="flex items-center justify-center gap-1"
                >
                  <MessageCircle size={18} />
                  Chat
                </button>

                <button
                  onClick={handleWishlist}
                  className="flex items-center justify-center gap-1"
                >
                  <Heart size={18} />
                  Wishlist
                </button>

                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center justify-center gap-1"
                >
                  <CircleAlert size={18} />
                  Report
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REKOMENDASI ================= */}
        {/* ================= REKOMENDASI ================= */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase">
              Rekomendasi Untukmu
            </h2>

            <button
              onClick={() => navigate("/customer")}
              className="text-blue-600 font-bold hover:underline"
            >
              LIHAT SEMUA
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {allProducts.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => {
                    navigate(`/customer/product-detail/${item.id}`);
                  }, 300);
                }}
                className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        cursor-pointer
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:scale-105
        "
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {isValidImageUrl(item.image) && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  )}

                  <span
                    className="
            absolute
            top-3
            left-3
            bg-blue-600
            text-white
            text-xs
            font-bold
            px-3
            py-1
            rounded-full
            "
                  >
                    BARU
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-black text-sm line-clamp-2 min-h-[42px]">
                    {item.name}
                  </h3>

                  <p className="text-2xl font-black mt-2">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-semibold">{item.rating}</span>
                    </div>

                    <span>•</span>

                    <span>Terjual {item.sold}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                        {isValidImageUrl(item.image) && (
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
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        {/* STORE INFO */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <Store size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-blue-600">
                            {item.store?.toUpperCase()}
                          </span>
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
                          const currentUser = JSON.parse(
                            localStorage.getItem("currentUser"),
                          );

                          const oldCart =
                            JSON.parse(
                              localStorage.getItem(`cart_${currentUser.id}`),
                            ) || [];

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
                              `cart_${currentUser.id}`,
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

                          const wishlistKey = `wishlist_${currentUser.id}`;
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
                          const currentUser = JSON.parse(
                            localStorage.getItem("currentUser"),
                          );
                          const timestamps =
                            JSON.parse(
                              localStorage.getItem(
                                `wishlist_timestamps_${currentUser?.id}`,
                              ),
                            ) || {};
                          delete timestamps[item.id];
                          localStorage.setItem(
                            `wishlist_timestamps_${currentUser?.id}`,
                            JSON.stringify(timestamps),
                          );
                          setWishlistTimestamps(timestamps);

                          const wishlistKey = `wishlist_${currentUser?.id}`;
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
                      {isValidImageUrl(item.image) && (
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
                      )}

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

                              const currentUser = JSON.parse(
                                localStorage.getItem("currentUser"),
                              );

                              localStorage.setItem(
                                `cart_${currentUser.id}`,
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
                                        qty: Math.max(
                                          1,
                                          (cartItem.qty || 1) - 1,
                                        ),
                                      }
                                    : cartItem,
                                );

                                setCartItems(updated);

                                const currentUser = JSON.parse(
                                  localStorage.getItem("currentUser"),
                                );

                                localStorage.setItem(
                                  `cart_${currentUser.id}`,
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

                                const currentUser = JSON.parse(
                                  localStorage.getItem("currentUser"),
                                );

                                localStorage.setItem(
                                  `cart_${currentUser.id}`,
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
        {showReport && (
          <>
            {/* Overlay */}
            <div
              onClick={() => setShowReport(false)}
              className="fixed inset-0 bg-black/50 z-[999]"
            />

            {/* Modal */}
            <div
              className="
      fixed
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      w-[500px]
      bg-white
      rounded-[30px]
      shadow-2xl
      z-[1000]
      overflow-hidden
    "
            >
              {/* Header */}
              <div className="flex justify-between items-center p-8 border-b">
                <h2 className="text-3xl font-black uppercase">
                  Laporkan Produk
                </h2>

                <button
                  onClick={() => setShowReport(false)}
                  className="text-3xl text-slate-400 hover:text-black"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-8">
                <p className="text-slate-600 font-medium mb-6">
                  Bantu kami menjaga komunitas tetap aman. Berikan alasan
                  mengapa Anda melaporkan produk ini.
                </p>

                <label className="block text-sm font-black uppercase tracking-wider mb-3">
                  Laporkan Produk
                </label>

                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={5}
                  placeholder="Contoh: Produk palsu, deskripsi menyesatkan atau konten tidak pantas."
                  className="
            w-full
            border
            rounded-2xl
            p-4
            resize-none
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
                />

                <button
                  onClick={() => {
                    if (!reportReason.trim()) {
                      alert("Alasan laporan wajib diisi");
                      return;
                    }

                    alert(
                      "Laporan berhasil dikirim. Terima kasih atas laporan Anda.",
                    );

                    setReportReason("");
                    setShowReport(false);
                  }}
                  className="
            w-full
            h-14
            mt-6
            rounded-2xl
            bg-red-600
            hover:bg-red-700
            text-white
            font-black
            text-lg
          "
                >
                  KIRIM LAPORAN
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* REVIEW MODAL */}
      <ViewAllReviewsModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productReviews={productReviews}
        totalReviewCount={totalReviewCount}
        reviewFilter={reviewFilter}
        setReviewFilter={setReviewFilter}
        reviewSort={reviewSort}
        setReviewSort={setReviewSort}
        getFilteredReviews={getFilteredReviews}
      />

      <Footer />
    </div>
  );
}

export default ProductDetail;
