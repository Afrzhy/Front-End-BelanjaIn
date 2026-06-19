import { X, RotateCcw } from "lucide-react";
import { useState } from "react";
import { categoryData } from "../../data/categoryData";

function CategorySection({ selectedCategory, setSelectedCategory }) {
  const [showAll, setShowAll] = useState(false);

  const categories = categoryData;

  return (
    <>
      {/* CATEGORY */}
      <div className="grid grid-cols-7 gap-5">
        {categories.slice(0, 6).map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedCategory(item.name)}
               className={`w-full h-[115px] rounded-[20px] border flex flex-col items-center justify-center gap-2 cursor-pointer duration-300 hover:scale-105 ${
                selectedCategory === item.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              {/* ICON */}
              <div
                className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center ${
                  selectedCategory === item.name ? "bg-white/10" : item.color
                }`}
              >
                <Icon size={28} />
              </div>

              {/* TEXT */}
              <p className="font-black text-[15px] text-center leading-tight px-2">
                {item.name}
              </p>
            </div>
          );
        })}

        {/* MORE */}
        <div
          onClick={() => setShowAll(true)}
          className="w-full h-[115px] rounded-[20px] border bg-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-lg duration-300"
        >
          <div className="w-[54px] h-[54px] rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-500">
            ...
          </div>

          <p className="font-black text-[15px] uppercase">Lainnya</p>
        </div>
      </div>

      {/* MODAL */}
      {showAll && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-y-auto px-4 py-10">
          {/* WRAPPER */}
          <div className="min-h-full flex items-start justify-center">
            {/* BOX */}
            <div className="w-full max-w-[700px] bg-[#f8f9fc] rounded-[30px] overflow-hidden shadow-2xl">
              {/* HEADER */}
              <div className="px-7 py-6 border-b bg-white flex items-start justify-between">
                <div>
                  <h2 className="text-[30px] font-black">Kategori</h2>

                  <p className="uppercase tracking-[3px] text-slate-400 font-bold text-xs mt-2">
                    Pilih kategori belanja
                  </p>
                </div>

                {/* CLOSE */}
                <button
                  onClick={() => setShowAll(false)}
                  className="w-12 h-12 rounded-2xl border bg-[#f8f9fc] flex items-center justify-center text-slate-500 hover:bg-slate-100 duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-6 grid grid-cols-3 gap-5 max-h-[420px] overflow-y-auto">
                {categories.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedCategory(item.name);
                        setShowAll(false);
                      }}
                      className={`h-[125px] rounded-[22px] border flex flex-col items-center justify-center gap-4 cursor-pointer duration-300 hover:scale-105 ${
                        selectedCategory === item.name
                          ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                          : "bg-white hover:shadow-lg"
                      }`}
                    >
                      {/* ICON */}
                      <div
                        className={`w-[50px] h-[50px] rounded-2xl flex items-center justify-center ${
                          selectedCategory === item.name
                            ? "bg-white/10"
                            : item.color
                        }`}
                      >
                        <Icon size={28} />
                      </div>

                      {/* TEXT */}
                      <p className="font-black text-[14px] text-center leading-tight px-2">
                        {item.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t bg-white">
                <button
                  onClick={() => {
                    setSelectedCategory("Semua");

                    setShowAll(false);
                  }}
                  className="w-full h-[58px] rounded-[18px] border bg-[#f8f9fc] font-black tracking-[2px] text-slate-600 hover:bg-slate-100 duration-300"
                >
                  LIHAT SEMUA PRODUK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CategorySection;
