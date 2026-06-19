import {
  Wallet,
  Sparkles,
  Zap,
} from "lucide-react";

function ShoppingMode({
  shoppingMode,
  setShoppingMode,
}) {

  const modes = [
    {
      name: "HEMAT",
      desc: "Harga terbaik",
      icon: <Wallet size={26} />,
    },

    {
      name: "PREMIUM",
      desc: "Produk pilihan",
      icon: <Sparkles size={26} />,
    },

    {
      name: "FLASH",
      desc: "Promo cepat",
      icon: <Zap size={26} />,
    },
  ];

  return (
    <div className="mt-10">

      <div className="bg-white rounded-[30px] shadow-sm border p-5 flex items-center justify-between">

        {/* LEFT */}
        <div>

          <h2 className="text-[24px] font-black tracking-tight text-slate-900">
            PERSONALIZED SHOPPING MODE
          </h2>

          <p className="text-slate-400 mt-1 font-medium text-sm">
            Sesuaikan pengalaman belanja Anda berdasarkan prioritas hari ini.
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {modes.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                setShoppingMode(item.name)
              }
              className={`w-[120px] h-[82px] rounded-[24px] border flex flex-col items-center justify-center duration-300 hover:scale-105 ${
                shoppingMode === item.name
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                  : "bg-[#f7f8fc] border-transparent text-slate-500 hover:bg-slate-100"
              }`}
            >

              {/* ICON */}
              <div>
                {item.icon}
              </div>

              {/* TITLE */}
              <p className="mt-2 text-[12px] font-black tracking-[2px]">
                {item.name}
              </p>

              {/* DESC */}
              <span
                className={`text-[10px] mt-1 ${
                  shoppingMode === item.name
                    ? "text-slate-300"
                    : "text-slate-400"
                }`}
              >
                {item.desc}
              </span>

            </button>
          ))}

        </div>

      </div>

    </div>
  );
}

export default ShoppingMode;