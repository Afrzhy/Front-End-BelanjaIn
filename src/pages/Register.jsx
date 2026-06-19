import {
  User,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  Store,
  X,
  ShoppingBag,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronDown,
  Package,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.jpeg";

function Register({ setAuthModal }) {
  // ================= NAVIGATE =================
  const navigate = useNavigate();

  // ================= ROLE =================
  const [role, setRole] = useState("pembeli");

  // ================= SUCCESS =================
  const [success, setSuccess] = useState(false);

  // ================= PASSWORD =================
  const [showPassword, setShowPassword] = useState(false);

  // ================= CATEGORY =================
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showCategory, setShowCategory] = useState(false);

  // ================= FORM =================
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    phone: "",
    email: "",
    toko: "",
    password: "",
  });

  const [registerError, setRegisterError] = useState("");

  const [loadingRegister, setLoadingRegister] = useState(false);

  const categories = [
    "Elektronik",
    "Fashion",
    "Makanan & Minuman",
    "Kesehatan",
    "Lainnya",
  ];

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= REGISTER =================
  const handleRegister = (e) => {
    e.preventDefault();

    const { nama, alamat, phone, email, toko, password } = formData;

    if (!nama || !alamat || !phone || !email || !password) {
      setRegisterError("Semua form wajib diisi!");
      return;
    }

    if (role === "penjual" && (!toko || !selectedCategory)) {
      setRegisterError("Lengkapi data toko!");
      return;
    }

    setRegisterError("");
    setLoadingRegister(true);

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...formData,
        role,
        category: selectedCategory,
      }),
    );

    setSuccess(true);

    setTimeout(() => {
      setLoadingRegister(false);
      setSuccess(false);

      setAuthModal("login");
    }, 2000);
  };

  // ================= GOOGLE =================
  const handleGoogleRegister = (codeResponse) => {
    // Auto-register sebagai pembeli
    const newUser = {
      id: "google_user_" + Date.now(),
      nama: "Google User",
      email: "user@gmail.com",
      phone: "0812345678",
      alamat: "Jakarta",
      toko: null,
      password: "google_login",
      role: "pembeli",
      loginMethod: "google",
    };

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...newUser,
      }),
    );

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setAuthModal(null);
      navigate("/customer");
    }, 1500);
  };

  const handleGoogleError = () => {
    setRegisterError("Gagal daftar dengan Google");
  };

  // Google login hook
  const googleRegister = useGoogleLogin({
    onSuccess: handleGoogleRegister,
    onError: handleGoogleError,
    flow: "implicit",
  });

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        px-4
        py-5
      "
    >
      {/* ================= SUCCESS NOTIFICATION ================= */}
      {success && (
        <div
          className="
          fixed
          top-6
          right-6
          z-[999]
          bg-white
          border
          border-green-200
          rounded-2xl
          shadow-2xl
          px-5
          py-4
          flex
          items-center
          gap-3
          animate-bounce
        "
        >
          <CheckCircle2 size={22} className="text-green-500" />

          <div>
            <h3 className="text-sm font-black text-slate-800">
              Daftar Berhasil
            </h3>

            <p className="text-xs text-slate-500">
              Berhasil daftar menggunakan Google
            </p>
          </div>
        </div>
      )}

      {/* ================= CARD ================= */}
      <div
        className="
relative
z-10
w-full
max-w-[860px]
h-[700px]
rounded-[28px]
overflow-hidden
bg-white
shadow-[0_25px_80px_rgba(0,0,0,0.45)]
grid
md:grid-cols-[45%_55%]
"
      >
        {/* ================= LEFT ================= */}
        <div
          className="
hidden
md:flex
relative
bg-gradient-to-br
from-[#08142e]
via-[#071a45]
to-[#020817]
px-10
py-12
flex-col
justify-center
"
        >
          {/* CONTENT */}
          <div className="flex flex-col">
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="BelanjIn Logo" className="h-12 w-auto" />
              <h1 className="text-2xl font-black text-white">
                Belanja
                <span className="text-blue-300">In</span>
              </h1>
            </div>

            {/* TITLE */}
            <div className="mt-14">
              <h2
                className="
text-white
text-[48px]
leading-[58px]
font-black
tracking-[-1px]
"
              >
                Mulai
                <br />
                Petualangan
                <br />
                Belanjamu
              </h2>

              <p
                className="
mt-6
text-[15px]
leading-[30px]
text-slate-300
max-w-[320px]
"
              >
                Gabung dengan jutaan pengguna lainnya dan nikmati promo
                eksklusif setiap hari.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div
          className="
            relative
            bg-white
            overflow-y-auto
          "
        >
          {/* CONTENT */}
          <div
            className="
px-10
py-9
min-h-full
"
          >
            {/* CLOSE */}
            <button
              onClick={() => setAuthModal(null)}
              className="
absolute
top-6
right-6
w-9
h-9
rounded-xl
bg-slate-100
hover:bg-slate-200
flex
items-center
justify-center
duration-300
"
            >
              <X size={18} />
            </button>

            {/* TITLE */}
            <h1
              className="
text-[40px]
font-black
tracking-[-1px]
text-slate-900
"
            >
              Bergabung
              <br />
              Sekarang
            </h1>

            <p
              className="
                text-sm
                text-slate-500
                mt-3
                leading-6
              "
            >
              Daftar sebagai {role === "pembeli" ? "Pembeli" : "Penjual"} untuk
              mulai berbelanja
            </p>

            {/* ROLE */}
            <div
              className="
                mt-7
                bg-slate-100
                rounded-2xl
                p-1
                flex
                gap-2
              "
            >
              {/* PEMBELI */}
              <button
                type="button"
                onClick={() => setRole("pembeli")}
                className={`

flex-1
h-14
rounded-2xl
font-bold
flex
items-center
justify-center
gap-3

${role === "pembeli" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}

`}
              >
                <ShoppingBag size={18} />
                Pembeli
              </button>

              {/* PENJUAL */}
              <button
                type="button"
                onClick={() => setRole("penjual")}
                className={`

flex-1
h-14
rounded-2xl
font-bold
flex
items-center
justify-center
gap-3

${role === "penjual" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}

`}
              >
                <Store size={18} />
                Penjual
              </button>
            </div>

            {/* ALERT */}
            {role === "penjual" && (
              <div
                className="
mt-6
bg-emerald-50
border
border-emerald-200
rounded-2xl
p-4
text-sm
leading-6
text-emerald-700
"
              >
                💡 Pengingat: Pendaftar harus sudah memiliki akun pembeli
                terlebih dahulu untuk membuka toko.
              </div>
            )}

            {/* ================= FORM ================= */}
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              {registerError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {registerError}
                </div>
              )}
              {/* NAMA */}
              <div>
                <label
                  className="
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  Nama Lengkap
                </label>

                <div
                  className="
                    mt-3
                    h-14
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <User size={22} className="text-slate-400" />

                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Contoh: John Doe"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-sm
                    "
                  />
                </div>
              </div>

              {/* ALAMAT */}
              <div>
                <label
                  className="
                  text-sm
                  font-bold
                    text-slate-700
                  "
                >
                  Alamat Lengkap
                </label>

                <div
                  className="
                    mt-3
                    h-14
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <MapPin size={22} className="text-slate-400" />

                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Jl. Raya No. 123, Jakarta"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-sm
                    "
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  className="
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  No Handphone
                </label>

                <div
                  className="
                    mt-3
                    h-14
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <Phone size={22} className="text-slate-400" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-sm
                    "
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  className="
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  Email
                </label>

                <div
                  className="
                    mt-3
                    h-14
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <Mail size={22} className="text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-sm
                    "
                  />
                </div>
              </div>

              {/* TOKO */}
              {role === "penjual" && (
                <>
                  <div>
                    <label
                      className="
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      Nama Toko
                    </label>

                    <div
                      className="
                        mt-3
                        h-14
                        rounded-2xl
                        bg-slate-100
                        border
                        border-slate-200
                        px-5
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <Store size={22} className="text-slate-400" />

                      <input
                        type="text"
                        name="toko"
                        value={formData.toko}
                        onChange={handleChange}
                        placeholder="Contoh: Toko Berkah Jaya"
                        className="
                          w-full
                          bg-transparent
                          outline-none
                          text-sm
                        "
                      />
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="relative">
                    <label
                      className="
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      Kategori Bisnis
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCategory(!showCategory)}
                      className="
                        mt-3
                        w-full
                        h-14
                        rounded-2xl
                        bg-slate-100
                        border
                        border-slate-200
                        px-5
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div className="flex items-center gap-4">
                        <Package size={22} className="text-slate-400" />

                        <span
                          className={`
                            text-sm
                            ${
                              selectedCategory
                                ? "text-slate-700"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {selectedCategory || "Pilih Kategori"}
                        </span>
                      </div>

                      <ChevronDown size={22} className="text-slate-400" />
                    </button>

                    {/* DROPDOWN */}
                    {showCategory && (
                      <div
                        className="
                          absolute
                          top-[110px]
                          left-0
                          w-full
                          bg-white
                          border
                          border-slate-200
                          rounded-2xl
                          shadow-2xl
                          overflow-hidden
                          z-50
                        "
                      >
                        {categories.map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(item);

                              setShowCategory(false);
                            }}
                            className="
                                w-full
                                px-6
                                h-14
                                text-left
                                text-sm
                                hover:bg-blue-50
                                duration-200
                              "
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* PASSWORD */}
              <div>
                <label
                  className="
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  Kata Sandi
                </label>

                <div
                  className="
                    mt-3
                    h-14
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <LockKeyhole size={22} className="text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-sm
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={22} className="text-slate-400" />
                    ) : (
                      <Eye size={22} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loadingRegister}
                className={`
                  w-full
                  h-14
                  rounded-2xl
                  text-white
                  font-bold
                  mt-8
                  shadow-lg
                  duration-300
                  ${loadingRegister ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
                `}
              >
                {loadingRegister ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Memuat {role === "pembeli" ? "Pembeli" : "Penjual"}...
                  </span>
                ) : role === "pembeli" ? (
                  "Daftar sebagai Pembeli"
                ) : (
                  "Daftar sebagai Penjual"
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-5 my-8">
              <div className="flex-1 h-[1px] bg-slate-200" />

              <span className="text-slate-400 text-sm font-semibold">ATAU</span>

              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            {/* GOOGLE */}
            <button
              onClick={() => googleRegister()}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-slate-200
                bg-white
                hover:bg-slate-50
                mt-6
                flex
                items-center
                justify-center
                gap-3
                duration-300
                hover:shadow-md
                font-semibold
                text-slate-700
              "
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />

              <span>Lanjutkan dengan Google</span>
            </button>

            {/* LOGIN */}
            <p
              className="
                text-center
                text-sm
                text-slate-500
                mt-8
              "
            >
              Sudah punya akun?
              <button
                onClick={() => setAuthModal("login")}
                className="
                  text-blue-600
                  font-bold
                  ml-2
                "
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
