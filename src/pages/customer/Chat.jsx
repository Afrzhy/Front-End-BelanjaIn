import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Smile,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { chats } from "../../data/chat";
import { sellers } from "../../data/sellers";

function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const customerChats = chats.filter(
    (chat) => chat.customerId === currentUser?.id,
  );

  const activeChat =
    customerChats.find((chat) => chat.sellerId === Number(id)) ||
    customerChats[0] ||
    null;

  const activeSeller =
    activeChat && sellers.find((seller) => seller.id === activeChat.sellerId);

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8]">
      <div className="h-screen w-full flex bg-white overflow-hidden">
        {/* ===================================================== */}
        {/* SIDEBAR */}
        {/* ===================================================== */}

        <div
          className="
            w-[420px]
            bg-white
            border-r
            border-slate-200
            flex
            flex-col
            shrink-0
          "
        >
          {/* HEADER */}
          <div className="px-6 py-8 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/customer")}
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    shadow-sm
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ArrowLeft size={20} />
                </button>

                <h1
                  className="
                    text-[32px]
                    font-black
                    text-slate-900
                  "
                >
                  Pesan
                </h1>
              </div>

              <button>
                <MoreVertical size={22} className="text-slate-400" />
              </button>
            </div>

            {/* SEARCH */}
            <div
              className="
                mt-6
                h-14
                rounded-2xl
                bg-[#F3F5F9]
                px-5
                flex
                items-center
              "
            >
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Cari percakapan..."
                className="
                  bg-transparent
                  outline-none
                  px-4
                  flex-1
                  text-sm
                "
              />
            </div>
          </div>

          {/* CHAT LIST */}
          <div className="flex-1 overflow-y-auto">
            {customerChats
              .filter((chat) => {
                const seller = sellers.find((s) => s.id === chat.sellerId);
                return seller && seller.logo;
              })
              .map((chat) => {
                const seller = sellers.find((s) => s.id === chat.sellerId);

                const lastMessage = chat.messages[chat.messages.length - 1];

                const isActive = activeChat?.id === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => navigate(`/customer/chat/${chat.sellerId}`)}
                    className={`
                    mx-3
                    mt-3
                    p-4
                    rounded-[28px]
                    cursor-pointer
                    transition
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#5B3DF5] text-white shadow-xl"
                        : "hover:bg-slate-50"
                    }
                  `}
                  >
                    <div className="flex gap-4">
                      {/* LOGO */}
                      <div className="relative">
                        <div
                          className="
                          w-16
                          h-16
                          rounded-2xl
                          overflow-hidden
                        "
                        >
                          <img
                            src={seller?.logo}
                            alt={seller?.name}
                            className="
                            w-full
                            h-full
                            object-cover
                          "
                          />
                        </div>

                        <span
                          className="
                          absolute
                          -bottom-1
                          -right-1
                          w-4
                          h-4
                          bg-emerald-500
                          border-2
                          border-white
                          rounded-full
                        "
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3
                            className="
                            font-black
                            truncate
                          "
                          >
                            {seller?.name}
                          </h3>

                          <span
                            className={`
                            text-[11px]
                            font-bold
                            ${isActive ? "text-white/80" : "text-slate-400"}
                          `}
                          >
                            JUN 16
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <p
                            className={`
                            text-sm
                            truncate
                            ${isActive ? "text-white/80" : "text-slate-500"}
                          `}
                          >
                            {lastMessage?.text}
                          </p>

                          <span
                            className={`
                            text-[10px]
                            px-2
                            py-1
                            rounded-md
                            font-bold
                            ${
                              isActive
                                ? "bg-white text-indigo-600"
                                : "bg-emerald-100 text-emerald-600"
                            }
                          `}
                          >
                            DIBACA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ===================================================== */}
        {/* EMPTY STATE */}
        {/* ===================================================== */}

        {!activeChat ? (
          <div
            className="
              flex-1
              bg-[#F5F6F8]
              flex
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <div
                className="
                  w-40
                  h-40
                  rounded-[40px]
                  bg-white
                  mx-auto
                  shadow-sm
                  flex
                  items-center
                  justify-center
                "
              >
                <MessageCircle size={70} className="text-indigo-600" />
              </div>

              <h2
                className="
                  text-5xl
                  font-black
                  mt-8
                "
              >
                Pesan Anda
              </h2>

              <p
                className="
                  mt-5
                  text-slate-500
                  text-lg
                  max-w-xl
                "
              >
                Pilih percakapan dari sidebar untuk mulai berkirim pesan dengan
                pembeli atau penjual secara instan.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ===================================================== */}
            {/* CHAT PANEL */}
            {/* ===================================================== */}

            <div className="flex-1 flex flex-col">
              {/* TOP BAR */}
              <div
                className="
                  h-[105px]
                  bg-white
                  border-b
                  px-7
                  flex
                  items-center
                  justify-between
                "
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="
                        w-14
                        h-14
                        rounded-2xl
                        overflow-hidden
                      "
                    >
                      <img
                        src={activeSeller?.logo}
                        alt=""
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    </div>

                    <span
                      className="
                        absolute
                        -bottom-1
                        -right-1
                        w-4
                        h-4
                        bg-emerald-500
                        border-2
                        border-white
                        rounded-full
                      "
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {activeSeller?.name}
                    </h2>

                    <p
                      className="
                        text-xs
                        font-black
                        tracking-[2px]
                        text-emerald-600
                      "
                    >
                      ONLINE
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div
                className="
                  flex-1
                  overflow-y-auto
                  bg-[#F5F6F8]
                  p-8
                "
              >
                <div className="flex justify-center mb-10">
                  <div
                    className="
                      px-5
                      py-2
                      bg-white
                      rounded-full
                      text-xs
                      font-bold
                      tracking-[2px]
                      text-slate-500
                      shadow-sm
                    "
                  >
                    HARI INI
                  </div>
                </div>

                {activeChat.messages.map((message, index) => {
                  const isCustomer = message.senderId === currentUser?.id;

                  return (
                    <div
                      key={index}
                      className={`flex mb-6 ${isCustomer ? "justify-end" : ""}`}
                    >
                      <div
                        className={`
                            max-w-[520px]
                            px-6
                            py-4
                            rounded-[24px]
                            ${
                              isCustomer
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-slate-700 rounded-tl-none shadow-sm"
                            }
                          `}
                      >
                        <p>{message.text}</p>

                        <span
                          className={`
                              block
                              mt-2
                              text-xs
                              ${isCustomer ? "text-blue-100" : "text-slate-400"}
                            `}
                        >
                          {message.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT */}
              <div
                className="
                  h-[95px]
                  border-t
                  bg-white
                  px-8
                  flex
                  items-center
                "
              >
                <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-2">
                  <Paperclip size={18} />
                </button>

                <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-4">
                  <ImageIcon size={18} />
                </button>

                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  className="
                    flex-1
                    h-14
                    bg-[#F3F5F9]
                    rounded-full
                    px-6
                    outline-none
                  "
                />

                <button className="ml-4 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Smile size={18} />
                </button>

                <button
                  className="
                    ml-3
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
