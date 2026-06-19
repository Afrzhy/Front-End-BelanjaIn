import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  MessageSquare,
  ChevronRight,
  Clock,
} from "lucide-react";
import OrderDetailModal from "../../components/customer/OrderDetailModal";
import TrackingModal from "../../components/customer/TrackingModal";
import ReviewModal from "../../components/customer/ReviewModal";
import ComplaintModal from "../../components/customer/ComplaintModal";
import { orders as ordersData } from "../../data/orders";
import { products } from "../../data/products";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);

  const handleBuyAgain = (order) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const cartKey = currentUser?.id ? `cart_${currentUser.id}` : "cart";
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const updatedCart = [...currentCart];

    order.products.forEach((product) => {
      const existing = updatedCart.find((item) => item.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + (product.qty || 1);
      } else {
        updatedCart.push({
          ...product,
          qty: product.qty || 1,
        });
      }
    });

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    navigate("/customer?showCart=true");
  };

  const handleReviewSubmit = (payload) => {
    // update orders state and persist to localStorage for current user
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === payload.orderId) {
          const updated = {
            ...o,
            review: payload,
            history: [
              ...(o.history || []),
              {
                title: "Ulasan Dikirim",
                desc: payload.review || "Ulasan produk dikirim",
                date: new Date().toISOString(),
              },
            ],
          };
          return updated;
        }
        return o;
      });

      // persist to localStorage for current user
      try {
        const currentUser =
          JSON.parse(localStorage.getItem("currentUser")) || {};
        if (currentUser?.id) {
          const key = `orders_${currentUser.id}`;
          localStorage.setItem(key, JSON.stringify(next));
        }
      } catch (e) {
        console.error(e);
      }

      return next;
    });

    setShowReview(false);
  };

  const handleComplaintSubmit = (payload) => {
    // update orders state and persist to localStorage for current user
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === payload.orderId) {
          const updated = {
            ...o,
            previousStatus: o.status || "",
            status: "KOMPLAIN",
            complaint: payload,
            history: [
              ...(o.history || []),
              {
                title: "Laporan Komplain Dikirim",
                desc: payload.details || payload.reason,
                date: payload.date,
              },
            ],
          };
          return updated;
        }
        return o;
      });

      // persist to localStorage for current user
      try {
        const currentUser =
          JSON.parse(localStorage.getItem("currentUser")) || {};
        if (currentUser?.id) {
          const key = `orders_${currentUser.id}`;
          localStorage.setItem(key, JSON.stringify(next));
        }
      } catch (e) {
        console.error(e);
      }

      return next;
    });

    setShowComplaint(false);
  };

  const handleCancelComplaint = (orderId) => {
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === orderId) {
          const restored = {
            ...o,
            status: o.previousStatus || "SELESAI",
            previousStatus: undefined,
            complaint: undefined,
            history: [
              ...(o.history || []),
              {
                title: "Komplain Dibatalkan",
                desc: "Pengguna membatalkan laporan komplain.",
                date: new Date().toISOString(),
              },
            ],
          };
          return restored;
        }
        return o;
      });

      try {
        const currentUser =
          JSON.parse(localStorage.getItem("currentUser")) || {};
        if (currentUser?.id) {
          const key = `orders_${currentUser.id}`;
          localStorage.setItem(key, JSON.stringify(next));
        }
      } catch (e) {
        console.error(e);
      }

      return next;
    });
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    if (!currentUser?.id) return;

    const orderKey = `orders_${currentUser.id}`;
    const saved = JSON.parse(localStorage.getItem(orderKey)) || [];

    const staticOrders = ordersData
      .filter((order) => {
        const isSameUserId = String(order.userId) === String(currentUser.id);
        const isSameCustomer =
          currentUser.name && order.customer === currentUser.name;
        return isSameUserId || isSameCustomer;
      })
      .map((order) => {
        const product =
          products.find((item) => item.id === order.productId) || {};
        return {
          ...order,
          userId: order.userId || currentUser.id,
          userName: order.userName || currentUser.name,
          shippingName: currentUser.name,
          shippingAddress: order.address,
          products: [
            {
              id: product.id || order.productId,
              name: product.name || "Produk tidak ditemukan",
              image: product.image || "",
              price: product.price || order.total,
              qty: 1,
              sellerId: product.sellerId || order.sellerId || null,
              category: product.category || order.category || "",
              sellerName: product.store || "Toko",
              city: product.city || "",
              rating: product.rating || 0,
              trust: product.trust || 0,
              sold: product.sold || 0,
              stock: product.stock || 0,
              mode: product.mode || "HEMAT",
              description: product.description || "",
              infoPenting: product.infoPenting || "",
              beratSatuan: product.beratSatuan || "",
              minBeli: product.minBeli || "1 Buah",
              kondisi: product.kondisi || "Baru",
              asuransi: product.asuransi || "Opsional",
              pemesananMin: product.pemesananMin || "1 Buah",
            },
          ],
        };
      });

    const savedOrderIds = new Set(saved.map((order) => order.id));
    const mergedOrders = [
      ...saved,
      ...staticOrders.filter((order) => !savedOrderIds.has(order.id)),
    ];

    setOrders(mergedOrders.reverse());
  }, []);

  const tabs = [
    "Semua",
    "Menunggu Pembayaran",
    "Diproses",
    "Dikirim",
    "Selesai",
    "Komplain",
  ];

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (activeTab !== "Semua") {
      data = data.filter((o) => {
        const status = (o.status || "").toLowerCase().trim();

        const tab = activeTab.toLowerCase().trim();

        return status === tab;
      });
    }
    if (search.trim()) {
      data = data.filter((order) =>
        order.products.some((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }

    return data;
  }, [orders, search, activeTab]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu pembayaran":
        return `
    bg-amber-50
    text-amber-600
    border
    border-amber-200
  `;

      case "diproses":
        return `
    bg-blue-50
    text-blue-600
    border
    border-blue-200
  `;

      case "dikirim":
        return "bg-purple-100 text-purple-600";

      case "selesai":
        return "bg-green-100 text-green-600";

      case "komplain":
        return "bg-red-100 text-red-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  const getSellerIdFromItem = (item) => {
    if (item?.sellerId) return item.sellerId;
    const category = (item?.category || "").toLowerCase();
    if (category.includes("elektronik")) return 5;
    if (category.includes("fashion")) return 3;
    if (category.includes("rumah") || category.includes("tangga")) return 4;
    const sellerName = (item?.sellerName || "").toLowerCase();
    if (sellerName.includes("tech galaxy")) return 5;
    if (sellerName.includes("urban wear")) return 3;
    if (sellerName.includes("home living")) return 4;
    return null;
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen">
      {/* HEADER */}

      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/customer")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>

            <h1 className="font-black text-lg uppercase tracking-[1px]">
              Daftar Transaksi
            </h1>
          </div>

          <div className="w-[280px] relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi..."
              className="
              w-full
              h-9
              rounded-lg
              bg-slate-100
              pl-10
              outline-none
              font-semibold
              text-sm
              "
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* FILTER */}

        <div className="flex gap-3 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 h-8 rounded-full text-xs font-bold uppercase tracking-wide duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* EMPTY */}

        {filteredOrders.length === 0 && (
          <>
            {activeTab === "Komplain" ? (
              <div
                className="
          bg-white
          rounded-[32px]
          border
          border-dashed
          border-slate-200
          min-h-[450px]
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-6
        "
              >
                <div
                  className="
            w-20
            h-20
            rounded-full
            bg-slate-100
            flex
            items-center
            justify-center
            mb-6
          "
                >
                  <div
                    className="
              w-9
              h-9
              rounded-full
              border-[3px]
              border-rose-500
              text-rose-500
              flex
              items-center
              justify-center
              font-black
              text-xl
            "
                  >
                    !
                  </div>
                </div>

                <h2
                  className="
            text-3xl
            font-black
            uppercase
            tracking-wider
            text-slate-900
          "
                >
                  Belum Ada Komplain Yang Anda Masukkan
                </h2>

                <p
                  className="
            mt-4
            text-slate-500
            max-w-3xl
            text-lg
          "
                >
                  Semua pesanan berjalan lancar. Anda dapat mengajukan komplain
                  pada detail transaksi jika terdapat masalah.
                </p>

                <button
                  onClick={() => setActiveTab("Semua")}
                  className="
            mt-8
            h-14
            px-10
            rounded-2xl
            bg-rose-600
            text-white
            font-black
            uppercase
            shadow-lg
            hover:bg-rose-700
            transition
          "
                >
                  Lihat Semua Transaksi
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <Package size={64} className="mx-auto text-slate-300 mb-6" />

                <h1 className="text-2xl lg:text-3xl font-black">
                  Tidak ada transaksi
                </h1>

                <p className="text-slate-500 mt-3">
                  Belum ada transaksi pada kategori ini.
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col gap-8">
          {filteredOrders.map((order, index) => {
            const isSimpleCard =
              order.status?.toLowerCase().includes("menunggu") ||
              order.status?.toLowerCase().includes("diproses");

            return (
              <div
                key={index}
                className={
                  isSimpleCard
                    ? "bg-white rounded-3xl border border-slate-200 overflow-hidden"
                    : "bg-white rounded-2xl overflow-hidden border shadow-sm"
                }
              >
                {/* TOP */}

                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Package size={18} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[11px] tracking-widest text-slate-400 font-bold uppercase">
                            BELANJA
                          </p>

                          <h2 className="font-black text-base text-slate-900">
                            {new Date(order.date).toISOString().split("T")[0]}
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColor(order.status)}`}
                      >
                        <Clock size={12} />
                        {order.status}
                      </div>

                      <p className="text-slate-400 text-sm">#ORD-{order.id}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div>
                      <div className="grid lg:grid-cols-[1fr_220px] bg-slate-50 rounded-2xl overflow-hidden border">
                        <div className="p-4">
                          {order.products.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover"
                              />

                              <div className="flex-1 min-w-0">
                                <h3 className="font-extrabold text-base truncate">
                                  {item.name}
                                </h3>

                                <p className="text-slate-500 text-sm">
                                  barang x Rp{" "}
                                  {Number(item.price).toLocaleString("id-ID")}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  const sellerId = getSellerIdFromItem(item);
                                  if (sellerId) {
                                    navigate(`/customer/chat/${sellerId}`);
                                  } else {
                                    navigate("/customer/chat");
                                  }
                                }}
                                className="
              hidden lg:flex
              items-center
              gap-2
              h-10
              px-5
              rounded-full
              bg-blue-50
              border
              border-blue-200
              text-blue-600
              font-extrabold
              text-[11px]
              tracking-wide
              uppercase
              hover:bg-blue-100
              transition
            "
                              >
                                <MessageSquare size={13} />
                                CHAT SELLER
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="border-l bg-white px-6 flex flex-col justify-center">
                          <p className="text-sm text-slate-500">
                            Total Belanja
                          </p>

                          <h3 className="text-base font-black text-slate-900 mt-1">
                            Rp {Number(order.total).toLocaleString("id-ID")}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="border-t bg-slate-50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 text-blue-600"
                      >
                        <span className="font-extrabold text-sm tracking-[2px]">
                          LIHAT DETAIL TRANSAKSI
                        </span>
                        <ChevronRight size={16} />
                      </button>

                      {(order.status || "")
                        .toLowerCase()
                        .includes("selesai") && (
                        <>
                          {order.review ? (
                            <div className="text-green-600 font-extrabold text-sm tracking-[2px] uppercase flex items-center gap-1">
                              ULASAN SELESAI
                              <span className="text-yellow-500">✓</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowReview(true);
                              }}
                              className="
            text-blue-600
            font-extrabold
            text-sm
            tracking-[2px]
            uppercase
            flex
            items-center
            gap-1
            hover:text-blue-700
          "
                            >
                              BERI ULASAN
                              <span className="text-yellow-500">⭐</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {(() => {
                        const st = (order.status || "").toLowerCase();

                        // MENUNGGU PEMBAYARAN: only Lihat Detail (left) and Beli Lagi
                        if (st.includes("menunggu")) {
                          return (
                            <>
                              <button
                                onClick={() => handleBuyAgain(order)}
                                className="
                                h-11
                                px-6
                                rounded-xl
                                bg-white
                                border
                                border-slate-300
                                text-slate-700
                                font-extrabold
                                text-xs
                                tracking-wider
                                uppercase
                                hover:bg-slate-50
                                transition
                              "
                              >
                                BELI LAGI
                              </button>
                            </>
                          );
                        }

                        // DIPROSES: same as menunggu (lihat detail + beli lagi)
                        if (st.includes("diproses")) {
                          return (
                            <button
                              onClick={() => handleBuyAgain(order)}
                              className="
                              h-11
                              px-6
                              rounded-xl
                              bg-white
                              border
                              border-slate-300
                              text-slate-700
                              font-extrabold
                              text-xs
                              tracking-wider
                              uppercase
                              hover:bg-slate-50
                              transition
                            "
                            >
                              BELI LAGI
                            </button>
                          );
                        }

                        // DIKIRIM: show Lacak, Beli Lagi
                        if (st.includes("dikirim")) {
                          return (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowTracking(true);
                                }}
                                className="
                                h-11
                                px-6
                                rounded-xl
                                bg-blue-600
                                text-white
                                font-extrabold
                                text-xs
                                tracking-wider
                                uppercase
                                shadow-md
                                hover:bg-blue-700
                                transition
                                "
                              >
                                LACAK PESANAN
                              </button>
                              <button
                                onClick={() => handleBuyAgain(order)}
                                className="
                                h-11
                                px-6
                                rounded-xl
                                bg-white
                                border
                                border-slate-300
                                text-slate-700
                                font-extrabold
                                text-xs
                                tracking-wider
                                uppercase
                                hover:bg-slate-50
                                transition
                              "
                              >
                                BELI LAGI
                              </button>
                            </>
                          );
                        }

                        // KOMPLAIN: show detail, beri ulasan, komplain, beli lagi, lacak
                        if (st.includes("komplain")) {
                          return (
                            <>
                              <button
                                onClick={() => handleCancelComplaint(order.id)}
                                className="
                                  h-11
                                  px-6
                                  rounded-xl
                                  bg-red-50
                                  border
                                  border-red-200
                                  text-red-600
                                  font-extrabold
                                  text-xs
                                  tracking-wider
                                  uppercase
                                  hover:bg-red-100
                                  hover:border-red-300
                                  transition
                                "
                              >
                                BATALKAN KOMPLAIN
                              </button>
                              <button
                                onClick={() => handleBuyAgain(order)}
                                className="
                                h-11
                                px-6
                                rounded-xl
                                bg-white
                                border
                                border-slate-300
                                text-slate-700
                                font-extrabold
                                text-xs
                                tracking-wider
                                uppercase
                                hover:bg-slate-50
                                transition
                              "
                              >
                                BELI LAGI
                              </button>
                            </>
                          );
                        }

                        // default: keep previous buttons (komplain, beli lagi, lacak)
                        return (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowComplaint(true);
                              }}
                              className="
                            h-11
                            px-6
                            rounded-xl
                            bg-red-50
                            border
                            border-red-200
                            text-red-600
                            font-extrabold
                            text-xs
                            tracking-wider
                            uppercase
                            hover:bg-red-100
                            transition
                            "
                            >
                              KOMPLAIN
                            </button>
                            <button
                              onClick={() => handleBuyAgain(order)}
                              className="
                              h-11
                              px-6
                              rounded-xl
                              bg-white
                              border
                              border-slate-300
                              text-slate-700
                              font-extrabold
                              text-xs
                              tracking-wider
                              uppercase
                              hover:bg-slate-50
                              transition
                            "
                            >
                              BELI LAGI
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowTracking(true);
                              }}
                              className="
                            h-11
                            px-6
                            rounded-xl
                            bg-blue-600
                            text-white
                            font-extrabold
                            text-xs
                            tracking-wider
                            uppercase
                            shadow-md
                            hover:bg-blue-700
                            transition
                            "
                            >
                              LACAK PESANAN
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OrderDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        order={selectedOrder}
        onOpenTracking={(o) => {
          setSelectedOrder(o);
          setShowModal(false);
          setShowTracking(true);
        }}
        onOpenComplaint={(o) => {
          setSelectedOrder(o);
          setShowModal(false);
          setShowComplaint(true);
        }}
        onBuyAgain={(o) => {
          setSelectedOrder(o);
          setShowModal(false);
          handleBuyAgain(o);
        }}
      />

      <TrackingModal
        show={showTracking}
        onClose={() => setShowTracking(false)}
        order={selectedOrder}
      />
      <ReviewModal
        show={showReview}
        onClose={() => setShowReview(false)}
        order={selectedOrder}
        onSubmit={handleReviewSubmit}
      />
      <ComplaintModal
        show={showComplaint}
        onClose={() => setShowComplaint(false)}
        order={selectedOrder}
        onSubmit={handleComplaintSubmit}
      />
    </div>
  );
}

export default Orders;
