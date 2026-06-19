import { CreditCard, Wallet, X, Plus } from "lucide-react";
import { useState } from "react";
import PaymentModal from "./modal/PaymentModal";
function SaldoModal({ show, onClose, saldo, setSaldo }) {
  const [selectedAmount, setSelectedAmount] = useState(50000);
const [customAmount, setCustomAmount] = useState("");


  const [paymentMethod, setPaymentMethod] = useState("bca");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentAmount, setPaymentAmount] = useState(0);

  if (!show) return null;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const history =
    JSON.parse(localStorage.getItem(`saldoHistory_${currentUser?.id}`)) || [];

  const nominalList = [50000, 100000, 200000, 500000];

  const handleTopup = () => {
    const amount =
  customAmount !== ""
    ? Number(customAmount.replace(/\./g, ""))
    : selectedAmount;

    if (!amount || amount < 10000) {
      setErrorMessage("Minimal top up Rp10.000");
      return;
    }

   setErrorMessage("");

setPaymentAmount(amount);
setShowPaymentModal(true);
return;

    const currentSaldo =
      Number(localStorage.getItem(`saldo_${currentUser?.id}`)) || saldo;

    const newSaldo = currentSaldo + amount;

    if (currentUser) {
      localStorage.setItem(`saldo_${currentUser.id}`, newSaldo);
    }

    const newHistory = [
      {
        title: `Top Up ${
          paymentMethod === "bca"
            ? "BCA VA"
            : paymentMethod === "mandiri"
              ? "Mandiri VA"
              : "QRIS"
        }`,
        amount: `+Rp${amount.toLocaleString("id-ID")}`,
        type: "plus",
        date: new Date().toLocaleDateString("id-ID"),
      },
      ...history,
    ];

    localStorage.setItem(
      `saldoHistory_${currentUser?.id}`,
      JSON.stringify(newHistory),
    );

    setSaldo(newSaldo);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
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
    h-[75vh]
    rounded-3xl
    overflow-hidden
    flex
    flex-col
  "
      >
        {/* HEADER */}
        <div
          className="
          bg-white
          border-b
          px-6
          py-4
          flex
          justify-between
          items-center
        "
        >
          <div className="flex gap-3 items-center">
            <div
              className="
              w-10
              h-10
              rounded-xl
              bg-blue-100
              flex
              items-center
              justify-center
            "
            >
              <CreditCard size={18} className="text-blue-600" />
            </div>

            <div>
              <h2
                className="
                text-lg
                font-black
              "
              >
                Dompet Belanjain
              </h2>

              <p
                className="
                text-xs
                uppercase
                font-bold
                text-slate-400
              "
              >
                Gunakan saldo untuk pembayaran
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
            w-9
            h-9
            rounded-lg
            bg-slate-100
            hover:bg-slate-200
            flex
            items-center
            justify-center
          "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
    flex-1
    overflow-y-auto
    p-6
  "
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {/* KIRI */}
            <div>
              <div
                className="
                bg-gradient-to-r
                from-blue-600
                to-indigo-700
                rounded-3xl
                p-8
                text-white
                relative
                overflow-hidden
              "
              >
                <span
                  className="
                  px-3
                  py-1
                  rounded-full
                  bg-white/20
                  text-xs
                  font-bold
                "
                >
                  SALDO DOMPET SAYA
                </span>

                <h1
                  className="
                  text-5xl
                  font-black
                  mt-4
                "
                >
                  Rp {saldo.toLocaleString("id-ID")}
                </h1>

                <p className="mt-6 text-sm">Secure Belanjain Wallet</p>

                <Wallet
                  size={120}
                  className="
                  absolute
                  right-5
                  top-5
                  opacity-10
                "
                />
              </div>

              <h3
                className="
                mt-6
                mb-3
                text-slate-500
                font-black
                tracking-wider
              "
              >
                RIWAYAT SALDO
              </h3>

              <div className="space-y-3">
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <div
                      key={index}
                      className="
                        bg-white
                        border
                        rounded-2xl
                        p-4
                        flex
                        justify-between
                        items-center
                      "
                    >
                      <div className="flex gap-3">
                        <div
                          className="
                            w-10
                            h-10
                            rounded-xl
                            bg-green-100
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Plus size={18} className="text-green-600" />
                        </div>

                        <div>
                          <p className="font-bold">{item.title}</p>

                          <p
                            className="
                              text-xs
                              text-slate-400
                            "
                          >
                            {item.date || "Baru"}
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          text-green-600
                          font-black
                        "
                      >
                        {item.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    className="
                    bg-white
                    rounded-2xl
                    border
                    p-6
                    text-center
                    text-slate-400
                  "
                  >
                    Belum ada riwayat saldo
                  </div>
                )}
              </div>
            </div>

            {/* KANAN */}
            <div
              className="
              bg-white
              rounded-3xl
              border
              p-6
            "
            >
              <h3
                className="
                text-xl
                font-black
                mb-6
              "
              >
                TOP UP DOMPET BELANJAIN
              </h3>

              <p
                className="
                text-xs
                font-bold
                text-slate-500
                mb-3
              "
              >
                PILIH NOMINAL CEPAT
              </p>

              <div className="grid grid-cols-2 gap-3">
                {nominalList.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`
                      h-12
                      rounded-xl
                      border
                      font-bold
                      ${
                        selectedAmount === amount
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : ""
                      }
                    `}
                  >
                    Rp {amount.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>

              <p
                className="
                text-xs
                font-bold
                text-slate-500
                mt-6
                mb-2
              "
              >
                ATAU NOMINAL CUSTOM
              </p>

            <input
  type="text"
  inputMode="numeric"
  value={customAmount}
  onChange={(e) => {
    const rawValue = e.target.value.replace(/\D/g, "");

    setCustomAmount(
      rawValue
        ? Number(rawValue).toLocaleString("id-ID")
        : ""
    );
  }}
  placeholder="Minimal Rp10.000"
  className="
    w-full
    h-12
    border
    rounded-xl
    px-4
    outline-none
    focus:border-blue-500
  "
/>

              <p
                className="
                text-xs
                font-bold
                text-slate-500
                mt-6
                mb-3
              "
              >
                PILIH METODE PEMBAYARAN
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("qris")}
                  className={`w-full p-4 rounded-2xl border text-left ${
                    paymentMethod === "qris" ? "border-blue-600" : ""
                  }`}
                >
                  <p className="font-bold">QRIS / QRIS GPN</p>

                  <p className="text-xs text-slate-400">Scan QR Aman 24 Jam</p>
                </button>

                <button
                  onClick={() => setPaymentMethod("bca")}
                  className={`w-full p-4 rounded-2xl border text-left ${
                    paymentMethod === "bca" ? "border-blue-600" : ""
                  }`}
                >
                  <p className="font-bold">BCA Virtual Account</p>

                  <p className="text-xs text-slate-400">
                    Transfer Nomor VA BCA
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod("mandiri")}
                  className={`w-full p-4 rounded-2xl border text-left ${
                    paymentMethod === "mandiri" ? "border-blue-600" : ""
                  }`}
                >
                  <p className="font-bold">Mandiri Virtual Account</p>

                  <p className="text-xs text-slate-400">
                    Transfer Nomor VA Mandiri
                  </p>
                </button>
              </div>

              {errorMessage && (
                <div className="mb-3 rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleTopup}
                disabled={isSubmitting}
                className={`
                w-full
                h-14
                mt-6
                rounded-2xl
                text-white
                font-black
                transition-all
                duration-200
                ${isSubmitting ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}
              `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-white animate-pulse" />
                    Memproses...
                  </span>
                ) : (
                  "BAYAR SEKARANG"
                )}
              </button>
            </div>
          </div>
        </div>
           </div>
{console.log("showPaymentModal =", showPaymentModal)}
      <PaymentModal
        show={showPaymentModal}
        paymentMethod={paymentMethod}
        amount={paymentAmount}
        onClose={() => {
          const currentSaldo =
            Number(
              localStorage.getItem(`saldo_${currentUser?.id}`)
            ) || saldo;

          const newSaldo = currentSaldo + paymentAmount;

          localStorage.setItem(
            `saldo_${currentUser.id}`,
            newSaldo
          );

          const newHistory = [
            {
              title: `Top Up ${
                paymentMethod === "bca"
                  ? "BCA VA"
                  : paymentMethod === "mandiri"
                  ? "Mandiri VA"
                  : "QRIS"
              }`,
              amount: `+Rp${paymentAmount.toLocaleString(
                "id-ID"
              )}`,
              type: "plus",
              date: new Date().toLocaleDateString("id-ID"),
            },
            ...history,
          ];

          localStorage.setItem(
            `saldoHistory_${currentUser?.id}`,
            JSON.stringify(newHistory)
          );

          setSaldo(newSaldo);

          setShowPaymentModal(false);
          onClose();
        }}
      />
    </div>
  );
}

export default SaldoModal;
