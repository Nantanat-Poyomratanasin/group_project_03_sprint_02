import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginFirstPopup({
  title = "Login First",
  message,
  onClose,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 lg:absolute lg:right-0 lg:left-auto lg:top-auto lg:translate-x-0 
    mt-2 z-[100] w-[90vw] max-w-[380px] sm:w-[320px] md:w-[380px] rounded-3xl bg-[#FAF6F4] 
    border border-[#EBE3DE] shadow-2xl p-4  md:p-5 sm:p-3  sm:pl-6 font-['Cormorant_Garamond'] navbar-popup-content"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>

      <h3 className="text-lg font-bold text-[#2f1f1b] mb-3">{title}</h3>

      <p className="text-[#878584] mb-3 text-sm">{message}</p>

      <button
        onClick={() => navigate("/login")}
        className="
          w-full
          bg-[#b67662]
          text-white
          mt-1
          py-1
          rounded-full
          hover:bg-[#9f6453]
          transition
        "
      >
        Go To Login
      </button>
    </div>
  );
}
