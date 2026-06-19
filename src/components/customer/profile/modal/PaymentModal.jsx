import {
  X,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function PaymentModal({
  show,
  onClose,
  paymentMethod,
  amount,
}) {
  if (!show) return null;

  const vaNumber =
    paymentMethod === "bca"
      ? "8808123456789012"
      : "7008123456789012";

  const copyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    alert("Nomor Virtual Account berhasil disalin");
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        backdrop-blur-sm
        z-[999]
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          bg-white
          w-full
          max-w-md
          max-h-[85vh]
          overflow-y-auto
          rounded-3xl
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            px-5
            py-4
            border-b
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2 className="text-lg font-black">
              Pembayaran Top Up
            </h2>

            <p className="text-xs text-slate-500">
              Selesaikan pembayaran terlebih dahulu
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-9
              h-9
              rounded-xl
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

        {/* CONTENT */}
        <div className="p-5">
          {/* STATUS */}
          <div
            className="
              bg-amber-50
              border
              border-amber-200
              rounded-2xl
              p-3
              flex
              gap-3
            "
          >
            <CheckCircle2
              size={18}
              className="text-amber-500 flex-shrink-0"
            />

            <div>
              <p className="font-bold text-sm text-amber-700">
                Menunggu Pembayaran
              </p>

              <p className="text-xs text-amber-600">
                Lakukan pembayaran sesuai metode yang dipilih
              </p>
            </div>
          </div>

          {/* QRIS */}
          {paymentMethod === "qris" ? (
            <div className="mt-5 text-center">
              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  rounded-xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  mb-3
                "
              >
                <QrCode
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <h3 className="font-black">
                Pembayaran QRIS
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Scan QR menggunakan e-wallet atau
                mobile banking
              </p>

              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=belanjain-payment"
                alt="QRIS"
                className="
                  w-44
                  h-44
                  mx-auto
                  mt-4
                  rounded-2xl
                  border
                  p-2
                  bg-white
                "
              />
            </div>
          ) : (
            <div className="mt-5">
              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-blue-100
                  mx-auto
                  flex
                  items-center
                  justify-center
                "
              >
                <CreditCard
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <h3 className="text-center font-black mt-3">
                Virtual Account
              </h3>

              <p className="text-center text-xs text-slate-500">
                Transfer ke nomor berikut
              </p>

              <div
                className="
                  mt-4
                  bg-slate-50
                  border
                  rounded-2xl
                  p-4
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Nomor VA
                    </p>

                    <h2
                      className="
                        text-lg
                        font-black
                        tracking-wide
                        break-all
                      "
                    >
                      {vaNumber}
                    </h2>
                  </div>

                  <button
                    onClick={copyVA}
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOTAL */}
          <div
            className="
              mt-5
              bg-gradient-to-r
              from-blue-600
              to-indigo-700
              rounded-2xl
              p-4
              text-white
            "
          >
            <p className="text-xs opacity-80">
              Total Pembayaran
            </p>

            <h2 className="text-2xl font-black mt-1">
              Rp {amount.toLocaleString("id-ID")}
            </h2>
          </div>

          {/* INFO */}
          <div
            className="
              mt-4
              bg-green-50
              border
              border-green-200
              rounded-2xl
              p-3
              flex
              gap-2
            "
          >
            <ShieldCheck
              size={18}
              className="text-green-600 flex-shrink-0"
            />

            <div>
              <p className="font-bold text-sm text-green-700">
                Pembayaran Aman
              </p>

              <p className="text-xs text-green-600">
                Setelah pembayaran berhasil,
                saldo akan otomatis masuk ke akun.
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={onClose}
            className="
              w-full
              h-12
              mt-5
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              transition
            "
          >
            Saya Sudah Bayar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;