import React from "react";
import {
  X,
  Clipboard,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export default function OrderDetailModal({
  show,
  onClose,
  order,
  onOpenTracking,
  onOpenComplaint,
  onBuyAgain,
}) {
  if (!show || !order) return null;

  const steps = ["Dibuat", "Lunas", "Diproses", "Dikirim", "Selesai"];
  const getStatusIndex = (status) => {
    const normalized = (status || "").toLowerCase().trim();
    if (normalized.includes("menunggu")) return 0;
    if (normalized.includes("dibuat")) return 0;
    if (normalized.includes("lunas")) return 1;
    if (normalized.includes("diproses")) return 2;
    if (normalized.includes("dikirim")) return 3;
    if (normalized.includes("selesai")) return 4;
    return 0;
  };

  const statusIndex = getStatusIndex(order.status);
  const shippingCost = order.shipping || 15000;
  const total = Number(order.total || 0) + Number(shippingCost || 0);
  const shippingName =
    order.shippingName ||
    order.shippingAddress?.name ||
    order.userName ||
    order.name ||
    "Penerima";
  const shippingAddress =
    typeof order.shippingAddress === "string"
      ? order.shippingAddress
      : order.shippingAddress?.address || order.address || order.alamat || "-";
  const formatDate = (date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="
  relative
  bg-white
  w-[95%]
  max-w-2xl
  h-[88vh]
  rounded-2xl
  shadow-2xl
  z-10
  overflow-hidden
  flex
  flex-col
"
      >
        <div className="border-b bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-800">
                DETAIL TRANSAKSI
              </h3>

              <p className="text-[11px] text-slate-400">
                Informasi lengkap pemesanan
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 max-h-[76vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <div className="text-xs uppercase tracking-[2px] text-slate-500 mb-2">
                No. Invoice
              </div>
              <div className="text-sm text-slate-600 font-bold">
                #ORD-{order.id}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-[2px] text-slate-500 mb-2">
                Tanggal Pembelian
              </div>
              <div className="text-sm text-slate-600 font-bold">
                {formatDate(order.date)}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200">
            <div className="text-sm font-bold mb-2">Status Pemesanan</div>
            <div className="text-[13px] text-slate-600 font-semibold mb-6">
              {order.status}
            </div>
            <div className="relative py-4">
              <div className="absolute left-6 right-6 top-1/2 h-px bg-slate-200" />
              <div className="relative flex items-center justify-between gap-3">
                {steps.map((step, idx) => {
                  const completed = idx <= statusIndex;
                  return (
                    <div
                      key={step}
                      className="relative flex flex-col items-center gap-3 text-center min-w-[70px]"
                    >
                      <div
                        className={`z-10 flex h-8w-8 items-center justify-center rounded-full border ${completed ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-300 border border-slate-200"}`}
                      >
                        {completed ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                      </div>
                      <div
                        className={`text-[11px] uppercase ${completed ? "text-slate-700 font-semibold" : "text-slate-400"}`}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-sm font-bold">
            Daftar Produk ({order.products.length})
          </div>

          <div className="space-y-3">
            {order.products.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-[2px] text-slate-400 mb-1">
                      {p.sellerName || "Toko"}
                    </div>
                    <div className="font-bold text-sm truncate">{p.name}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      {p.rating && <span>⭐ {p.rating}</span>}
                      {p.sold && <span>Terjual {p.sold}</span>}
                      {p.trust && <span>Trust {p.trust}%</span>}
                    </div>
                  </div>
                  <div className="text-sm font-bold">{p.qty || 1}x</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex item4-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-1" />
                <div>
                  <div className="text-xs uppercase tracking-[2px] text-slate-500">
                    Alamat Pengiriman
                  </div>
                  <div className="font-semibold text-sm mt-2">
                    {shippingName}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {shippingAddress}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-blue-600 mt-1" />
                <div>
                  <div className="text-xs uppercase tracking-[2px] text-slate-500">
                    Metode Pembayaran
                  </div>
                  <div className="font-semibold text-sm mt-2">
                    {order.paymentMethod || "-"}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    {order.paymentStatus || "LUNAS"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Rincian Pembayaran</div>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Total Harga ({order.products.length} Barang)</span>
                <span>
                  Rp {Number(order.total || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Ongkos Kirim</span>
                <span>Rp {Number(shippingCost).toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold">TOTAL BELANJA</div>
              <div className="text-lg text-blue-600 font-extrabold">
                Rp {Number(total).toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => onOpenComplaint?.(order)}
              className="h-10 rounded-xl bg-pink-50 text-pink-600 font-bold"
            >
              Komplain
            </button>

            <button
              onClick={() => onOpenTracking?.(order)}
              className="h-10 rounded-xl border font-bold"
            >
              Lacak
            </button>

            <button
              onClick={() => onBuyAgain?.(order)}
              className="h-10 rounded-xl bg-blue-600 text-white font-bold"
            >
              Beli Lagi
            </button>

            <button
              onClick={onClose}
              className="h-10 rounded-xl border font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
