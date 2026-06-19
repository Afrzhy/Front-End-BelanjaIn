import { useState, useEffect } from "react";
import { X, Star, Camera, CheckCircle } from "lucide-react";

export default function ReviewModal({ show, onClose, order, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validate image URL
  const isValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
  };

  // Auto-close success modal
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose]);

  if (!show || !order) return null;

  const product = order.products?.[0];

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);

    if (photos.length + files.length > 5) {
      alert("Maksimal 5 foto");
      return;
    }

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...mapped]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({
      orderId: order.id,
      rating,
      review,
      photos,
    });

    setRating(5);
    setReview("");
    setPhotos([]);
    setShowSuccess(true);
  };

  const getLabel = () => {
    switch (rating) {
      case 5:
        return "SANGAT PUAS";
      case 4:
        return "PUAS";
      case 3:
        return "CUKUP";
      case 2:
        return "KURANG PUAS";
      default:
        return "TIDAK PUAS";
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-black text-xl flex items-center gap-2">
                ⭐ BERI ULASAN
              </h2>

              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">
                Berikan penilaian jujur untuk transaksi anda
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* PRODUK */}
          <div className="bg-slate-50 border rounded-2xl p-4 flex items-center gap-4">
            {isValidImageUrl(product?.image) && (
              <img
                src={product?.image}
                alt={product?.name}
                className="w-20 h-20 rounded-xl object-cover border"
              />
            )}

            <div>
              <h3 className="font-black text-sm">{product?.name}</h3>

              <p className="text-blue-600 font-bold text-sm mt-1">
                Rp {Number(product?.price).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* RATING */}
          <div className="border rounded-2xl p-6 text-center">
            <p className="text-[11px] tracking-wider font-black text-slate-400 uppercase mb-4">
              Berikan Rating Produk
            </p>

            <div className="flex justify-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star
                    size={42}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))}
            </div>

            <h4 className="font-black text-orange-500 text-lg">{getLabel()}</h4>

            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }
                />
              ))}
            </div>
          </div>

          {/* ULASAN */}
          <div>
            <label className="text-[11px] tracking-wider font-black uppercase text-slate-500">
              Tulis Ulasan Anda
            </label>

            <textarea
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Apa yang Anda sukai dari produk ini? Bagikan kepuasan Anda..."
              className="
                mt-2
                w-full
                rounded-2xl
                border
                p-4
                resize-none
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* FOTO */}
          <div>
            <label className="text-[11px] tracking-wider font-black uppercase text-slate-500">
              Tambahkan Foto Produk (Opsional)
            </label>

            <div
              className="
                mt-2
                border-2
                border-dashed
                border-slate-200
                rounded-2xl
                p-6
              "
            >
              <input
                id="review-photo"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />

              <div className="text-center">
                <Camera size={32} className="mx-auto text-slate-400 mb-3" />

                <p className="font-bold text-slate-600">Pilih Aset Foto Anda</p>

                <label
                  htmlFor="review-photo"
                  className="
                    inline-block
                    mt-3
                    px-5
                    py-2
                    rounded-xl
                    border
                    cursor-pointer
                    text-sm
                    font-bold
                    hover:bg-slate-50
                  "
                >
                  PILIH FOTO
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt=""
                        className="
                          w-full
                          h-24
                          object-cover
                          rounded-xl
                          border
                        "
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="
                          absolute
                          top-1
                          right-1
                          w-6
                          h-6
                          rounded-full
                          bg-red-500
                          text-white
                          text-xs
                          font-bold
                        "
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-5 flex gap-3">
          <button
            onClick={handleSubmit}
            className="
              flex-1
              h-12
              rounded-xl
              bg-blue-600
              text-white
              font-black
              tracking-wide
              hover:bg-blue-700
            "
          >
            KIRIM ULASAN PRODUK
          </button>

          <button
            onClick={onClose}
            className="
              px-6
              h-12
              rounded-xl
              bg-slate-100
              font-bold
              hover:bg-slate-200
            "
          >
            BATAL
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          {/* SUCCESS MODAL */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 z-10"
            >
              <X size={20} />
            </button>

            {/* CONTENT */}
            <div className="p-8 text-center">
              {/* HEADER */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star size={24} className="fill-yellow-400 text-yellow-400" />
                <h2 className="font-black text-lg">BERI ULASAN</h2>
              </div>

              {/* CHECKMARK */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle
                    size={60}
                    className="text-green-500 fill-green-500"
                  />
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                ULASAN TERKIRIM!
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                Terima kasih banyak atas ulasan berharga Anda. Ulasan telah
                disimpan dan diterbitkan secara real-time!
              </p>

              {/* BUTTON */}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="
                  w-full
                  h-12
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-bold
                  hover:bg-blue-700
                  transition
                  mt-6
                "
              >
                SELESAI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
