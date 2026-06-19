import React from "react";
import { X, Copy, Check, Truck } from "lucide-react";

export default function TrackingModal({ show, onClose, order }) {
  if (!show || !order) return null;

  const shippingName = order.shippingName || order.userName || "Penerima";

  const shippingAddress =
    typeof order.shippingAddress === "string"
      ? order.shippingAddress
      : order.shippingAddress?.address || order.address || "-";

  const trackingNumber = order.resi || order.trackingNumber || "JNE03";

  const expedition = order.courier || order.expedisi || "JNE EXPRESS";

  const service =
    order.courierService || order.service || "Layanan Reguler (REG)";

  const getDefaultHistory = () => {
    const orderStatus = (order.status || "").toLowerCase();

    // Base history array
    const baseHistory = [
      {
        title: "Pesanan Berhasil Dibuat",
        desc: "Pesanan berhasil dibuat.",
        date: new Date(),
      },
      {
        title: "Pembayaran Terverifikasi",
        desc: "Pembayaran berhasil diverifikasi.",
        date: new Date(),
      },
      {
        title: "Pesanan Diproses Penjual",
        desc: "Penjual sedang mengemas produk.",
        date: new Date(),
      },
    ];

    // Add pickup status
    if (orderStatus.includes("dikirim") || orderStatus.includes("selesai")) {
      baseHistory.push({
        title: "Paket Siap Diambil [Pickup]",
        desc: "Paket siap diambil oleh kurir JNE Express.",
        date: new Date(),
      });
    }

    // Add courier status
    if (orderStatus.includes("dikirim") || orderStatus.includes("selesai")) {
      baseHistory.push({
        title: "Kurir Sedang Mengirimkan Paket",
        desc: "Paket sedang dibawa oleh kurir JNE Express ke alamat penerima.",
        date: new Date(),
      });
    }

    // Add completed status
    if (orderStatus.includes("selesai")) {
      baseHistory.push({
        title: "Paket Berhasil Diterima [Selesai]",
        desc: `Paket diterima langsung oleh ${shippingName}. Kondisi aman, tidak ada cacat eksternal. Terima kasih!`,
        date: new Date(),
      });
    }

    return baseHistory.reverse();
  };

  const history = order.history?.length
    ? [...order.history].reverse()
    : getDefaultHistory();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
    relative
    z-10
    bg-white
    w-[90%]
    max-w-2xl
    max-h-[85vh]
    rounded-3xl
    shadow-2xl
    overflow-y-auto
  "
      >
        {/* HEADER */}

        <div className="border-b bg-white px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-wider text-lg">
                <Truck size={18} />
                Lacak Pengiriman Paket
              </h2>

              <p className="text-[10px] uppercase tracking-[2px] text-slate-400 mt-1">
                Status realtime kurir & perjalanan logistik
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div>
            {/* CARD INFO */}

            <div className="border rounded-2xl bg-slate-50 p-5">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
                    Jasa Ekspedisi
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-red-500 text-white px-3 py-1 rounded font-black text-[10px]">
                      {expedition}
                    </div>

                    <span className="font-semibold text-sm">{service}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
                    No. Resi Pengiriman
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-black text-sm">{trackingNumber}</span>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(trackingNumber)
                      }
                    >
                      <Copy size={15} className="text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
                  Alamat Penerima
                </p>

                <div className="mt-2">
                  <h4 className="font-bold text-sm">{shippingName}</h4>

                  <p className="text-sm text-slate-500 mt-1">
                    {shippingAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mt-5">
              <h3 className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mb-5">
                Progress Pengiriman
              </h3>

              <div className="relative flex justify-between">
                <div className="absolute left-[10%] right-[10%] top-4 h-[2px] bg-slate-200" />

                {["Diproses", "Pickup", "Kurir", "Selesai"].map((item, idx) => {
                  const orderStatus = (order.status || "").toLowerCase();
                  let isCompleted = false;
                  let isActive = false;

                  // Determine if stage is completed or active based on order status
                  if (orderStatus.includes("dikirim")) {
                    // For DIKIRIM status: Diproses, Pickup, Kurir are completed, Kurir is active
                    if (idx <= 1) isCompleted = true; // Diproses, Pickup
                    if (idx === 2) isActive = true; // Kurir - active/in progress
                  } else if (orderStatus.includes("selesai")) {
                    // For SELESAI status: All stages completed
                    isCompleted = true;
                  } else if (orderStatus.includes("diproses")) {
                    // For DIPROSES status: Only Diproses completed
                    if (idx === 0) isCompleted = true;
                    if (idx === 0) isActive = true; // Diproses - active
                  }

                  return (
                    <div
                      key={item}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive
                            ? "bg-blue-100 animate-pulse"
                            : isCompleted
                              ? "bg-green-100"
                              : "bg-slate-100"
                        }`}
                      >
                        <Check
                          size={14}
                          className={`${
                            isActive
                              ? "text-blue-600"
                              : isCompleted
                                ? "text-green-600"
                                : "text-slate-300"
                          }`}
                        />
                      </div>

                      <span
                        className={`text-[10px] font-semibold mt-2 ${
                          isActive
                            ? "text-blue-600"
                            : isCompleted
                              ? "text-slate-700"
                              : "text-slate-400"
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HISTORY */}
            <div className="mt-6">
              <h3 className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mb-4">
                Histori Perjalanan
              </h3>

              <div className="pr-2">
                <div className="space-y-6">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      {/* TIMELINE */}

                      <div className="flex flex-col items-center">
                        <div className="relative flex items-center justify-center">
                          {idx === 0 && (
                            <>
                              <span className="absolute w-5 h-5 rounded-full bg-blue-400 animate-ping" />
                              <span className="absolute w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                            </>
                          )}

                          <span
                            className={`relative rounded-full ${
                              idx === 0
                                ? "w-4 h-4 bg-blue-600"
                                : "w-3 h-3 bg-slate-300"
                            }`}
                          />
                        </div>

                        {idx !== history.length - 1 && (
                          <div className="w-[2px] flex-1 bg-slate-200 mt-1" />
                        )}
                      </div>

                      {/* CONTENT */}

                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800">
                          {item.title}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1">
                          {item.desc}
                        </p>
                      </div>

                      {/* DATE */}

                      <div className="text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(item.date).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="border-t bg-white p-3">
          <button
            onClick={onClose}
            className="
      w-full
      h-10
      rounded-xl
      bg-blue-600
      text-white
      font-bold
      hover:bg-blue-700
      transition
    "
          >
            Tutup Pelacakan
          </button>
        </div>
      </div>
    </div>
  );
}
