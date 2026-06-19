import {
  MessageSquare,
  Bell,
  EyeOff,
  UserX,
  Languages,
  FileText,
  X,
  Star,
  Info,
  ChevronRight,
  Trash2,
  CircleHelp,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { MdOutlineAlternateEmail } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { languages } from "../../../../data/language";
import logo from "../../../../assets/logo.jpeg";
import { useState } from "react";
const Switch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`
      relative
      w-14
      h-8
      rounded-full
      duration-300
      ${checked ? "bg-blue-600" : "bg-slate-300"}
    `}
  >
    <span
      className={`
        absolute
        top-1
        h-6
        w-6
        bg-white
        rounded-full
        duration-300
        ${checked ? "left-7" : "left-1"}
      `}
    />
  </button>
);

function PengaturanModal({
  activeModal,
  setActiveModal,
  currentText,
  chatSettings,
  setChatSettings,
  notifSettings,
  setNotifSettings,
  privacySettings,
  setPrivacySettings,
  language,
  setLanguage,
}) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [openPolicy, setOpenPolicy] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([
    { avatar: "T", name: "Toko Murah Rejeki" },
    { avatar: "U", name: "User_Hacker99" },
    { avatar: "S", name: "Spam_Seller_01" },
  ]);

  const handleUnblock = (index) => {
    setBlockedUsers(blockedUsers.filter((_, i) => i !== index));
  };

  if (!activeModal) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="
            bg-white
            rounded-3xl
            w-full
            max-w-lg
            p-6
          "
        >
          <div className="flex justify-between items-start border-b pb-5 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                {activeModal === "chat" && (
                  <MessageSquare size={28} className="text-blue-600" />
                )}
                {activeModal === "notif" && (
                  <Bell size={28} className="text-blue-600" />
                )}
                {activeModal === "privacy" && (
                  <EyeOff size={28} className="text-blue-600" />
                )}
                {activeModal === "blocked" && (
                  <UserX size={28} className="text-blue-600" />
                )}
                {activeModal === "language" && (
                  <Languages size={28} className="text-blue-600" />
                )}
                {activeModal === "rules" && (
                  <FileText size={28} className="text-blue-600" />
                )}
                {activeModal === "values" && (
                  <Star size={28} className="text-blue-600" />
                )}
                {activeModal === "info" && (
                  <Info size={28} className="text-blue-600" />
                )}
                {activeModal === "delete" && (
                  <Trash2 size={28} className="text-blue-600" />
                )}
                {activeModal === "help" && (
                  <CircleHelp size={28} className="text-blue-600" />
                )}
                {activeModal === "policy" && (
                  <FileText size={28} className="text-blue-600" />
                )}
              </div>

              <div>
                <h2 className="font-black text-[18px] leading-none text-slate-900">
                  {activeModal === "logout"
                    ? currentText.logoutTitle
                    : activeModal === "delete"
                      ? currentText.deleteTitle
                      : activeModal === "policy"
                        ? currentText.policyTitle
                        : activeModal === "values"
                          ? currentText.valuesTitle
                          : activeModal === "info"
                            ? currentText.infoTitle
                            : activeModal === "help"
                              ? currentText.helpTitle
                              : activeModal === "rules"
                                ? currentText.rulesTitle
                                : activeModal === "language"
                                  ? currentText.language
                                  : activeModal === "blocked"
                                    ? currentText.blockedUsersTitle
                                    : activeModal === "privacy"
                                      ? currentText.privacySettingsTitle
                                      : activeModal === "notif"
                                        ? currentText.notifSettingsTitle
                                        : currentText.chatSettingsTitle}
                </h2>

                <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[1.5px] mt-1">
                  {currentText.accountSettings}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="
                w-12
                h-12
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
              "
            >
              <X className="text-slate-500" />
            </button>
          </div>
          {activeModal === "chat" && (
            <div className="space-y-5">
              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.chatNotif}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.chatNotifDesc}
                  </p>
                </div>
                <Switch
                  checked={chatSettings.notifChat}
                  onChange={() =>
                    setChatSettings({
                      ...chatSettings,
                      notifChat: !chatSettings.notifChat,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.statusOnline}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.statusOnlineDesc}
                  </p>
                </div>
                <Switch
                  checked={chatSettings.statusOnline}
                  onChange={() =>
                    setChatSettings({
                      ...chatSettings,
                      statusOnline: !chatSettings.statusOnline,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.enterSend}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.enterSendDesc}
                  </p>
                </div>
                <Switch
                  checked={chatSettings.enterSend}
                  onChange={() =>
                    setChatSettings({
                      ...chatSettings,
                      enterSend: !chatSettings.enterSend,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.autoReply}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.autoReplyDesc}
                  </p>
                </div>
                <Switch
                  checked={chatSettings.autoReply}
                  onChange={() =>
                    setChatSettings({
                      ...chatSettings,
                      autoReply: !chatSettings.autoReply,
                    })
                  }
                />
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-black
                  tracking-wide
                  hover:bg-blue-700
                  duration-300
                "
              >
                {currentText.saveChat}
              </button>
            </div>
          )}
          {activeModal === "notif" && (
            <div className="space-y-5">
              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.promo}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.promoDesc}
                  </p>
                </div>
                <Switch
                  checked={notifSettings.promo}
                  onChange={() =>
                    setNotifSettings({
                      ...notifSettings,
                      promo: !notifSettings.promo,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.orderUpdate}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.orderUpdateDesc}
                  </p>
                </div>
                <Switch
                  checked={notifSettings.pesanan}
                  onChange={() =>
                    setNotifSettings({
                      ...notifSettings,
                      pesanan: !notifSettings.pesanan,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.newsletter}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.newsletterDesc}
                  </p>
                </div>
                <Switch
                  checked={notifSettings.newsletter}
                  onChange={() =>
                    setNotifSettings({
                      ...notifSettings,
                      newsletter: !notifSettings.newsletter,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.access}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.accessDesc}
                  </p>
                </div>
                <Switch
                  checked={notifSettings.akses}
                  onChange={() =>
                    setNotifSettings({
                      ...notifSettings,
                      akses: !notifSettings.akses,
                    })
                  }
                />
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-slate-950
                  text-white
                  font-black
                  tracking-wider
                  hover:bg-black
                  duration-300
                "
              >
                {currentText.savePreferences}
              </button>
            </div>
          )}
          {activeModal === "privacy" && (
            <div className="space-y-5">
              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.privateAccount}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.privateAccountDesc}
                  </p>
                </div>
                <Switch
                  checked={privacySettings.privateAccount}
                  onChange={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      privateAccount: !privacySettings.privateAccount,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.hideHistory}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.hideHistoryDesc}
                  </p>
                </div>
                <Switch
                  checked={privacySettings.hideHistory}
                  onChange={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      hideHistory: !privacySettings.hideHistory,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.biometric}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.biometricDesc}
                  </p>
                </div>
                <Switch
                  checked={privacySettings.biometric}
                  onChange={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      biometric: !privacySettings.biometric,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-[15px] leading-none">
                    {currentText.personalizedAds}
                  </h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {currentText.personalizedAdsDesc}
                  </p>
                </div>
                <Switch
                  checked={privacySettings.personalizedAds}
                  onChange={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      personalizedAds: !privacySettings.personalizedAds,
                    })
                  }
                />
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-black
                  text-lg
                  tracking-wide
                  hover:bg-blue-700
                  duration-300
                "
              >
                {currentText.savePrivacy}
              </button>
            </div>
          )}
          {activeModal === "blocked" && (
            <div className="space-y-4">
              {blockedUsers.length > 0 ? (
                blockedUsers.map((user, index) => (
                  <div
                    key={index}
                    className="
                      bg-white
                      border
                      border-slate-200
                      rounded-3xl
                      p-4
                      flex
                      items-center
                      justify-between
                      shadow-sm
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-slate-100
                        flex
                        items-center
                        justify-center
                        font-black
                        text-slate-500
                        text-lg
                      "
                      >
                        {user.avatar}
                      </div>

                      <h4 className="font-black text-[15px] text-slate-800">
                        {user.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleUnblock(index)}
                      className="
                      px-5
                      h-10
                      rounded-xl
                      bg-red-600
                      text-white
                      font-black
                      hover:bg-red-700
                      duration-200
                      active:scale-95
                    "
                    >
                      {currentText.unblockButton}
                    </button>
                  </div>
                ))
              ) : (
                <p
                  className="
                  text-center
                  text-[14px]
                  font-black
                  text-slate-500
                  py-8
                "
                >
                  Tidak ada pengguna yang diblokir
                </p>
              )}

              {blockedUsers.length > 0 && (
                <p
                  className="
                  text-center
                  text-[13px]
                  font-black
                  tracking-wider
                  text-slate-400
                  pt-2
                "
                >
                  {currentText.blockedFooter}
                </p>
              )}
            </div>
          )}
          {activeModal === "language" && (
            <div className="space-y-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id);
                    localStorage.setItem("language", JSON.stringify(lang.id));
                    setActiveModal(null);
                  }}
                  className={`
                    w-full
                    h-20
                    rounded-3xl
                    px-6
                    flex
                    items-center
                    justify-between
                    border
                    duration-200
                    ${
                      language === lang.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100"
                    }
                  `}
                >
                  <span className="font-black text-[24px]">{lang.name}</span>

                  {language === lang.id && (
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
          {activeModal === "help" && (
            <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
              {/* Banner */}
              <div className="bg-[#F3F6FF] border border-slate-200 rounded-2xl p-3 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <CircleHelp size={18} className="text-blue-600" />
                </div>

                <div>
                  <h4 className="font-black text-[#0B1739] text-xs leading-none">
                    BUTUH BANTUAN CEPAT?
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1.5 leading-5">
                    CS BelanjaIn siap melayani 24/7
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="
          bg-white
          border
          rounded-2xl
          p-3
          hover:bg-slate-50
          transition
        "
                >
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <FaWhatsapp size={16} className="text-green-600" />
                    </div>

                    <div>
                      <p className="text-[9px] font-black tracking-wider text-slate-400 leading-none">
                        WHATSAPP
                      </p>

                      <p className="text-xs font-bold text-slate-700 leading-tight">
                        Hubungi CS
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:support@belanjain.com"
                  className="
          bg-white
          border
          rounded-2xl
          p-3
          hover:bg-slate-50
          transition
        "
                >
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <MdOutlineAlternateEmail
                        size={16}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-black tracking-wider text-slate-400 leading-none">
                        EMAIL
                      </p>

                      <p className="text-xs font-bold text-slate-700 leading-tight">
                        Kirim Email
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              {/* FAQ Header */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-black text-[#0B1739] text-sm tracking-wide">
                  ARTIKEL BANTUAN
                </h3>

                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full shrink-0">
                  3
                </span>
              </div>

              {/* FAQ 1 */}
              <div className="border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  className="
          w-full
          p-3
          flex
          items-center
          justify-between
          bg-slate-50
          gap-2
        "
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-600 text-[8px] font-black shrink-0">
                      PENJUAL
                    </span>

                    <h4 className="font-black text-xs text-left truncate">
                      CARA MENDAFTAR AKUN PENJUAL BARU
                    </h4>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`duration-300 shrink-0 ${
                      openFaq === 1 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === 1 && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 text-xs text-slate-600 leading-5">
                        Masuk ke menu akun, lalu ketuk tombol "Buka Toko". Isi
                        formulir legalitas nama toko, detail alamat pengiriman,
                        dan rekening bank Anda.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FAQ 2 */}
              <div className="border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  className="
          w-full
          p-3
          flex
          items-center
          justify-between
          bg-slate-50
          gap-2
        "
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-600 text-[8px] font-black shrink-0">
                      PEMBELI
                    </span>

                    <h4 className="font-black text-xs text-left truncate">
                      METODE PEMBAYARAN RESMI DI BELANJAIN
                    </h4>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`duration-300 shrink-0 ${
                      openFaq === 2 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === 2 && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 text-xs text-slate-600 leading-5">
                        BelanjaIn mendukung pembayaran kartu kredit, virtual
                        account bank transfer, saldo Dompet BelanjaIn, serta
                        pembayaran instan QRIS.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FAQ 3 */}
              <div className="border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  className="
          w-full
          p-3
          flex
          items-center
          justify-between
          bg-slate-50
          gap-2
        "
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-600 text-[8px] font-black shrink-0">
                      PENJUAL
                    </span>

                    <h4 className="font-black text-xs text-left truncate">
                      SISTEM PENCAIRAN SALDO PENGHASILAN
                    </h4>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`duration-300 shrink-0 ${
                      openFaq === 3 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === 3 && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 text-xs text-slate-600 leading-5">
                        Penjual dapat mencairkan dana setelah status transaksi
                        selesai oleh pembeli. Proses pencairan memakan waktu
                        maksimal 1x24 jam kerja.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="
        w-full
        h-12
        rounded-2xl
        bg-[#07142E]
        text-white
        font-bold
        text-sm
        tracking-wide
        hover:opacity-90
        mt-2
      "
              >
                KEMBALI
              </button>
            </div>
          )}
          {activeModal === "rules" && (
            <div className="flex flex-col h-full">
              <div className="space-y-8 py-4 border-t border-gray-200">
                {[
                  {
                    no: 1,
                    title: "Sopan Santun",
                    desc: "Selalu gunakan bahasa yang sopan dalam berkomunikasi dengan penjual atau pembeli lain.",
                  },
                  {
                    no: 2,
                    title: "Keamanan Data",
                    desc: "Dilarang membagikan informasi kontak pribadi (nomor HP, alamat) di fitur chat umum.",
                  },
                  {
                    no: 3,
                    title: "Anti-Spam",
                    desc: "Dilarang mengirim pesan promosi massal atau konten yang tidak relevan dengan produk.",
                  },
                  {
                    no: 4,
                    title: "Review Jujur",
                    desc: "Berikan ulasan berdasarkan pengalaman nyata untuk membantu komunitas.",
                  },
                ].map((item) => (
                  <div key={item.no} className="flex gap-4">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                      {item.no}
                    </div>

                    <div>
                      <h4 className="text-[15px] font-bold text-[#0B1739]">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[13px] text-[#64748B] leading-7">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="mt-8 w-full bg-[#07142E] text-white font-bold tracking-wider py-4 rounded-2xl hover:opacity-90 transition"
              >
                SAYA MENGERTI
              </button>
            </div>
          )}
          {activeModal === "policy" && (
            <div className="space-y-4">
              {/* Syarat & Ketentuan */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden">
                <button
                  onClick={() => setOpenPolicy(openPolicy === 1 ? null : 1)}
                  className="
          w-full
          h-16
          px-6
          bg-slate-50
          flex
          items-center
          justify-between
        "
                >
                  <h4 className="font-black text-[16px] text-[#1E293B]">
                    Syarat & Ketentuan
                  </h4>

                  <ChevronRight
                    size={20}
                    className={`text-slate-400 duration-300 ${
                      openPolicy === 1 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openPolicy === 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 text-sm text-slate-600 leading-7 bg-white">
                        Syarat & Ketentuan resmi platform BelanjaIn. Segala
                        aktivitas transaksi tunduk pada peraturan perlindungan
                        konsumen Indonesia.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Kebijakan Privasi */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden">
                <button
                  onClick={() => setOpenPolicy(openPolicy === 2 ? null : 2)}
                  className="
          w-full
          h-16
          px-6
          bg-slate-50
          flex
          items-center
          justify-between
        "
                >
                  <h4 className="font-black text-[16px] text-[#1E293B]">
                    Kebijakan Privasi
                  </h4>

                  <ChevronRight
                    size={20}
                    className={`text-slate-400 duration-300 ${
                      openPolicy === 2 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openPolicy === 2 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 text-sm text-slate-600 leading-7 bg-white">
                        Syarat dan Ketentuan penggunaan platform BelanjaIn.
                        Segala data transaksi terekam secara aman. Hak Cipta
                        dilindungi undang-undang.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Kebijakan Pengembalian */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden">
                <button
                  onClick={() => setOpenPolicy(openPolicy === 3 ? null : 3)}
                  className="
          w-full
          h-16
          px-6
          bg-slate-50
          flex
          items-center
          justify-between
        "
                >
                  <h4 className="font-black text-[16px] text-[#1E293B]">
                    Kebijakan Pengembalian
                  </h4>

                  <ChevronRight
                    size={20}
                    className={`text-slate-400 duration-300 ${
                      openPolicy === 3 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openPolicy === 3 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 text-sm text-slate-600 leading-7 bg-white">
                        Kebijakan Pengembalian resmi platform BelanjaIn. Segala
                        aktivitas transaksi tunduk pada peraturan perlindungan
                        konsumen Indonesia.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ketentuan Pembayaran */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden">
                <button
                  onClick={() => setOpenPolicy(openPolicy === 4 ? null : 4)}
                  className="
          w-full
          h-16
          px-6
          bg-slate-50
          flex
          items-center
          justify-between
        "
                >
                  <h4 className="font-black text-[16px] text-[#1E293B]">
                    Ketentuan Pembayaran
                  </h4>

                  <ChevronRight
                    size={20}
                    className={`text-slate-400 duration-300 ${
                      openPolicy === 4 ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openPolicy === 4 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 text-sm text-slate-600 leading-7 bg-white">
                        Ketentuan Pembayaran resmi platform BelanjaIn. Segala
                        aktivitas transaksi tunduk pada peraturan perlindungan
                        konsumen Indonesia.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tombol */}
              <button
                onClick={() => setActiveModal(null)}
                className="
        w-full
        h-14
        rounded-2xl
        bg-[#07142E]
        text-white
        font-black
        tracking-[3px]
        hover:opacity-90
      "
              >
                KEMBALI
              </button>
            </div>
          )}
          {activeModal === "values" && (
            <div className="space-y-8">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className="
          w-20 h-20
          rounded-3xl
          bg-[#FFF8E8]
          border
          border-[#F3D78C]
          shadow-sm
          flex
          items-center
          justify-center
        "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#F5A000"
                    viewBox="0 0 24 24"
                    className="w-10 h-10"
                  >
                    <path d="M12 2l2.9 6.26 6.9.59-5.2 4.51 1.56 6.64L12 16.9 5.84 20l1.56-6.64L2.2 8.85l6.9-.59L12 2z" />
                  </svg>
                </div>
              </div>

              {/* Judul */}
              <div className="text-center">
                <h3 className="text-[18px] font-black text-[#0F172A]">
                  Nilai Pengalaman Anda
                </h3>

                <p className="mt-2 text-[14px] text-[#64748B]">
                  Ulasan Anda akan langsung tampil di Dashboard Admin Pusat!
                </p>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#F5B301"
                      viewBox="0 0 24 24"
                      className="w-12 h-12"
                    >
                      <path d="M12 2l2.9 6.26 6.9.59-5.2 4.51 1.56 6.64L12 16.9 5.84 20l1.56-6.64L2.2 8.85l6.9-.59L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div>
                <p
                  className="
          text-[13px]
          font-black
          tracking-wider
          text-slate-400
          mb-3
        "
                >
                  CATATAN / KOMENTAR ANDA
                </p>

                <textarea
                  rows={4}
                  placeholder="Ceritakan pengalaman belanja atau jualan Anda disini..."
                  className="
          w-full
          rounded-3xl
          border
          border-slate-200
          bg-slate-50
          p-5
          resize-none
          outline-none
        "
                />
              </div>

              {/* Button */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="
          h-14
          rounded-3xl
          bg-slate-100
          font-black
          text-slate-700
        "
                >
                  BATAL
                </button>

                <button
                  onClick={() => {
                    setActiveModal(null);
                  }}
                  className="
    h-14
    rounded-3xl
    bg-blue-600
    text-white
    font-black
    shadow-lg
    hover:bg-blue-700
    duration-300
  "
                >
                  KIRIM ULASAN
                </button>
              </div>
            </div>
          )}{" "}
          {activeModal === "info" && (
            <div className="space-y-5">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <div
                  className="
          w-28 h-28
          rounded-[30px]
          bg-white
          shadow-lg
          flex items-center justify-center
          overflow-hidden
        "
                >
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <h3 className="mt-5 text-[22px] font-black text-slate-900">
                  Belanjain
                </h3>

                <p className="text-blue-600 font-black tracking-widest text-sm">
                  VERSION 1.0.0 (BUILD 001)
                </p>
              </div>

              {/* Menu */}
              <div className="space-y-3 mt-6">
                <button
                  className="
          w-full
          h-16
          rounded-3xl
          bg-slate-50
          border
          border-slate-200
          px-5
          flex items-center justify-between
        "
                >
                  <span className="font-bold text-slate-700">
                    Periksa Pembaruan
                  </span>

                  <span
                    className="
            px-4 py-1
            rounded-xl
            border
            border-blue-200
            text-blue-600
            text-xs
            font-black
          "
                  >
                    Terbaru
                  </span>
                </button>

                <button
                  className="
          w-full
          h-16
          rounded-3xl
          bg-slate-50
          border
          border-slate-200
          px-5
          flex items-center justify-between
        "
                >
                  <span className="font-bold text-slate-700">
                    Lisensi Sumber Terbuka
                  </span>

                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Footer */}
              <p
                className="
        text-center
        text-xs
        font-black
        tracking-[2px]
        text-slate-400
        pt-4
      "
              >
                © 2026. SEMUA HAK DILINDUNGI.
              </p>
            </div>
          )}
          {activeModal === "delete" && (
            <div className="space-y-6">
              {/* Warning Box */}
              <div className="bg-red-50 border border-red-100 rounded-3xl p-5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </div>

                <div>
                  <h4 className="font-black text-[18px] text-[#0B1739]">
                    Peringatan Kritis
                  </h4>

                  <p className="text-red-500 text-[14px] mt-2 leading-7">
                    Penghapusan akun bersifat permanen. Seluruh koin, voucher,
                    dan riwayat pesanan Anda akan hilang selamanya.
                  </p>
                </div>
              </div>

              {/* Alasan */}
              <div>
                <p className="text-[13px] font-black tracking-[2px] text-slate-400 uppercase mb-3">
                  Alasan Penghapusan
                </p>

                <select
                  className="
          w-full
          h-14
          px-5
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          font-semibold
          text-slate-700
          outline-none
          focus:border-red-500
        "
                >
                  <option>Ingin membuat akun baru</option>
                  <option>Kekhawatiran privasi</option>
                  <option>Aplikasi sulit digunakan</option>
                  <option>Lainnya</option>
                </select>
              </div>

              {/* Button */}
              <button
                className="
        w-full
        h-16
        rounded-2xl
        bg-red-600
        text-white
        font-black
        text-xl
        shadow-lg
        shadow-red-200
        hover:bg-red-700
        duration-300
      "
              >
                Hapus Akun Sekarang
              </button>
            </div>
          )}
          {activeModal === "logout" && (
            <div className="space-y-4">
              <p>{currentText.logoutPrompt}</p>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setActiveModal(null);
                  navigate("/");
                }}
                className="
                w-full
                h-12
                bg-red-500
                text-white
                rounded-xl
                font-bold
              "
              >
                {currentText.logoutButton}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PengaturanModal;
