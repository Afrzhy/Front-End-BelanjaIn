import { Gift, Ticket, X, ChevronRight, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { products } from "../../../data/products";
import { useNavigate } from "react-router-dom";
function VoucherModal({ show, onClose, vouchers, onVoucherRedeemed }) {
  const navigate = useNavigate();
  console.log(vouchers);
  console.log("MY VOUCHER", vouchers);
  const [selectedVoucher, setSelectedVoucher] = useState(
    () => vouchers?.[0] || null,
  );
  const [vouchersData, setVouchersData] = useState(vouchers);

useEffect(() => {
  setVouchersData(vouchers);

  if (!selectedVoucher && vouchers.length > 0) {
    setSelectedVoucher(vouchers[0]);
  }
}, [vouchers]);

  if (!show) return null;
  console.log("selectedVoucher =", JSON.stringify(selectedVoucher, null, 2));
  const recommendedProducts = products
    .filter((product) => product.price >= (selectedVoucher?.minPurchase || 0))
    .slice(0, 8);
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
          max-w-4xl
          h-[80vh]
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
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >
              <Ticket size={20} className="text-blue-500" />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-black
                  text-slate-900
                "
              >
                Daftar Voucher Saya
              </h2>

              <p
                className="
                  uppercase
                  text-xs
                  font-bold
                  text-slate-400
                  tracking-wider
                "
              >
                Pilih voucher untuk rekomendasi produk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-100
              hover:bg-slate-200
              flex
              items-center
              justify-center
            "
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <div
            className="
              w-[320px]
              border-r
              bg-white
              flex
              flex-col
            "
          >
            <div className="p-4">
              <h3
                className="
                  text-xs
                  uppercase
                  font-black
                  text-slate-400
                "
              >
                Voucher Tersedia ({vouchersData.length})
              </h3>
            </div>

            <div
              className="
                flex-1
                overflow-y-auto
                px-4
                pb-4
                space-y-3
              "
            >
              {vouchersData.map((voucher) => (
                <div
                  key={`voucher-${voucher.id}`}
                  onClick={() => {
                    console.log("Voucher dipilih:", voucher);
                    setSelectedVoucher(voucher);
                  }}
                  className={`
  border
  rounded-2xl
  p-2
  transition
  cursor-pointer
                    ${
                      selectedVoucher?.id === voucher.id
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "bg-white hover:border-blue-500 hover:shadow-lg"
                    }
                    `}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={voucher.image}
                      alt={voucher.code}
                      className="
  w-10
  h-10
  rounded-lg
  object-cover
  flex-shrink-0
"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex gap-1 items-center">
                        <h4
                          className="
    font-black
    text-xs
    truncate
  "
                        >
                          {voucher.code}
                        </h4>

                        <span
                          className="
                            px-1.5
                            py-0.5
                            rounded-sm
                            bg-green-100
                            text-green-700
                            text-[8px]
                            font-bold
                            flex-shrink-0
                          "
                        >
                          GLOBAL
                        </span>
                      </div>

                      <p
                        className="
                          text-blue-600
                          font-bold
                          text-xs
                          line-clamp-1
                        "
                      >
                        {voucher.title}
                      </p>

                      <p
                        className="
    text-slate-400
    text-[10px]
  "
                      >
                        {voucher.pointCost} poin
                      </p>
                    </div>

                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-6
            "
          >
            {vouchers.length > 0 ? (
              <>
                <div
                  className="
    bg-white
    rounded-[32px]
    border
    p-6
    flex
    items-center
    gap-6
  "
                >
                  <img
                    src={selectedVoucher?.image}
                    alt={selectedVoucher?.code}
                    className="
      w-28
      h-28
      rounded-3xl
      object-cover
    "
                  />

                  <div>
                    <h2
                      className="
    text-2xl
    font-black
    text-slate-900
    break-all
  "
                    >
                      {selectedVoucher?.code}
                    </h2>

                    <p
                      className="
                        text-slate-500
                        font-medium
                        mt-3
                      "
                    >
                      Berlaku hingga {selectedVoucher?.expiredAt}
                      {" • "}
                      Min. Belanja Rp{" "}
                      {selectedVoucher?.minPurchase?.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                {/* REKOMENDASI */}
                <div className="mt-8">
                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      mb-5
                    "
                  >
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-blue-500" />

                      <h3
                        className="
      uppercase
      font-black
      text-slate-400
      tracking-widest
    "
                      >
                        Rekomendasi Produk Sesuai Voucher Ini
                      </h3>
                    </div>
                    <span
                      className="
    px-4
    py-2
    rounded-xl
    bg-blue-50
    text-blue-600
    font-bold
    text-sm
  "
                    >
                      Minimal Beli Rp{" "}
                      {selectedVoucher?.minPurchase?.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div
                    className="
                     grid
grid-cols-2
gap-4
                    "
                  >
                    {recommendedProducts.length === 0 && (
                      <div className="bg-white rounded-3xl p-10 text-center">
                        <h3 className="font-black text-xl">
                          Tidak ada produk yang cocok
                        </h3>

                        <p className="text-slate-500 mt-2">
                          Tidak ditemukan produk yang memenuhi minimal belanja
                          voucher ini.
                        </p>
                      </div>
                    )}
                    {recommendedProducts.map((product) => {
                      let finalPrice = product.price;

                      // Diskon persen
                      if (
                        selectedVoucher?.discountPercent &&
                        product.price >= (selectedVoucher?.minPurchase || 0)
                      ) {
                        finalPrice =
                          product.price -
                          (product.price * selectedVoucher.discountPercent) /
                            100;
                      }

                      // Potongan nominal
                      if (
                        selectedVoucher?.discountAmount &&
                        product.price >= (selectedVoucher?.minPurchase || 0)
                      ) {
                        finalPrice =
                          product.price - selectedVoucher.discountAmount;

                        if (finalPrice < 0) {
                          finalPrice = 0;
                        }
                      }

                      return (
                        <div
                          key={product.id}
                          className="
  bg-white
  border
  rounded-3xl
  p-3
  flex
  gap-3
"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="
  w-20
  h-20
  rounded-xl
  object-cover
"
                          />

                          <div className="flex-1">
                            <h4
                              className="
                                    font-black
                                    text-lg
                                    line-clamp-2
                                "
                            >
                              {product.name}
                            </h4>

                            <p
                              className="
                                    text-slate-400
                                    text-sm
                                "
                            >
                              {product.category}
                            </p>

                            <div className="mt-2">
                              {finalPrice !== product.price && (
                                <p className="text-sm text-slate-400 line-through">
                                  Rp {product.price.toLocaleString("id-ID")}
                                </p>
                              )}

                              <p className="text-blue-600 font-black">
                                Rp {finalPrice.toLocaleString("id-ID")}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                navigate(
                                  `/customer/product-detail/${product.id}`,
                                )
                              }
                              className="
    mt-2
    w-full
    h-9
    rounded-xl
    bg-slate-900
    text-white
    font-bold
  "
                            >
                              BELI
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div
                className="
                  h-full
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-slate-400
                "
              >
                <Gift size={80} />

                <h3
                  className="
                    text-2xl
                    font-black
                    mt-4
                  "
                >
                  Belum Ada Voucher
                </h3>

                <p>Tukarkan poin untuk mendapatkan voucher</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoucherModal;
