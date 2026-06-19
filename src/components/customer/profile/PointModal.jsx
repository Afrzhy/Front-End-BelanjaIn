import { X, Trophy, Coins, Clock3, Plus } from "lucide-react";
import { useState } from "react";

import { vouchers as defaultVouchers } from "../../../data/vouchers";

function PointModal({ show, onClose, points, history, redeemVoucher }) {
  const [globalVouchers] = useState(() => {
    if (typeof window === "undefined") return defaultVouchers;
    const stored = localStorage.getItem("vouchers_global");
    return stored ? JSON.parse(stored) : defaultVouchers;
  });
  const [redeemingVoucherId, setRedeemingVoucherId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const ownedVoucher =
    JSON.parse(localStorage.getItem(`myVoucher_${currentUser?.id}`)) || [];

  if (!show) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/50
        z-50
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          bg-slate-50
          w-full
          max-w-3xl
          rounded-3xl
          overflow-hidden
          h-[80vh]
          flex
          flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            bg-white
            border-b
            px-6
            py-4
            flex
            justify-between
            items-center
            z-10
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                w-9 h-9
                rounded-lg
                bg-orange-100
                flex
                items-center
                justify-center
              "
            >
              <Trophy size={18} className="text-orange-500" />
            </div>

            <div>
              <h2 className="font-black text-lg text-slate-800">
                Koin & Loyalitas
              </h2>

              <p className="text-xs text-slate-400">
                Kumpulkan poin untuk voucher
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-8
              h-8
              rounded-lg
              bg-slate-100
              hover:bg-slate-200
              flex
              items-center
              justify-center
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* SCROLL AREA */}
        <div
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {/* POINT CARD */}
          <div
            className="
              bg-gradient-to-r
              from-orange-500
              to-amber-500
              rounded-3xl
              p-8
              text-white
              relative
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                right-5
                top-5
                opacity-10
              "
            >
              <Coins size={120} />
            </div>

            <p className="text-sm uppercase">Total Poin Saat Ini</p>

            <h1 className="text-5xl font-black mt-2">
              {points.toLocaleString()}
            </h1>

            <p className="mt-3 text-sm opacity-90">
              Belanja lebih banyak untuk mendapatkan poin tambahan.
            </p>
          </div>

          {/* VOUCHER */}
          <h3 className="font-black text-slate-700 mt-8 mb-4">
            Tukarkan Poin Dengan Voucher
          </h3>

          {errorMessage && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            {globalVouchers.map((voucher) => {
              const alreadyOwned = ownedVoucher.some(
                (v) => v.code === voucher.code,
              );
              const isRedeeming = redeemingVoucherId === voucher.id;

              const handleVoucherClick = () => {
                if (points < voucher.pointCost) {
                  setErrorMessage("Poin tidak cukup untuk menukar voucher.");
                  return;
                }
                setErrorMessage("");
                setRedeemingVoucherId(voucher.id);
                redeemVoucher(voucher);
                setTimeout(() => setRedeemingVoucherId(null), 800);
              };

              return (
                <div
                  key={voucher.id}
                  className="
                    bg-white
                    rounded-2xl
                    border
                    p-5
                    shadow-sm
                  "
                >
                  <img
                    src={voucher.image}
                    alt={voucher.title}
                    className="
                      w-14
                      h-14
                      rounded-xl
                      object-cover
                      mb-3
                    "
                  />

                  <h4
                    className="
                      font-black
                      text-base
                      text-slate-900
                      mb-1
                    "
                  >
                    {voucher.code}
                  </h4>

                  <p
                    className="
                      text-slate-500
                      text-xs
                      leading-relaxed
                      mb-4
                      min-h-[32px]
                    "
                  >
                    {voucher.title}
                  </p>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Coins size={16} className="text-orange-500" />
                        <span className="text-orange-500 font-black text-sm">
                          {voucher.pointCost} Poin
                        </span>
                      </div>

                      <button
  onClick={handleVoucherClick}
  disabled={isRedeeming || points < voucher.pointCost}
  className={`
    px-3
    h-8
    rounded-full
    text-[11px]
    font-semibold
    transition
    whitespace-nowrap
    ${
      isRedeeming
        ? "bg-blue-400 text-white cursor-wait"
        : points >= voucher.pointCost
          ? "bg-slate-900 text-white hover:bg-black"
          : "bg-slate-200 text-slate-400 cursor-not-allowed"
    }
  `}
>
  {isRedeeming ? "PROSES..." : "TUKAR"}
</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* HISTORY */}
          <h3 className="font-black text-slate-700 mt-10 mb-4">
            Riwayat Aktivitas Poin
          </h3>

          <div
            className="
              bg-white
              rounded-3xl
              overflow-hidden
              border
            "
          >
            {history.length > 0 ? (
              history.map((item, index) => (
                <div
                  key={index}
                  className="
                    px-6
                    py-5
                    border-b
                    last:border-b-0
                    flex
                    justify-between
                    items-center
                  "
                >
                  <div className="flex gap-4">
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-full
                        flex
                        items-center
                        justify-center
                        ${item.type === "plus" ? "bg-green-100" : "bg-red-100"}
                      `}
                    >
                      {item.type === "plus" ? (
                        <Plus size={18} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-500" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">{item.title}</p>

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          text-xs
                          text-slate-400
                        "
                      >
                        <Clock3 size={12} />
                        {item.date || "-"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-bold ${
                      item.type === "plus" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.point}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400">
                Belum ada riwayat poin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointModal;
