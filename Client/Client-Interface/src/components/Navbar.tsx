import { ShoppingBag } from "lucide-react";

export default function NavBar() {
  return (
    <header className="w-full border-b border-gray-100 bg-[#f8f5ef]">
      <nav className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-[11px] bg-[#ff4d00] rotate-6" />
          <span className="text-[28px] font-black tracking-[-1.5px] text-[#111]">
            Fl<span className="text-[#ff4d00]">oo</span>ds
          </span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#menu"
            className="text-[14px] font-medium text-[#ff4d00] transition"
          >
            MENU
          </a>
          <a
            href="#popular"
            className="text-[14px] font-medium text-[#111] transition hover:text-[#ff4d00]"
          >
            POPULAR
          </a>

          <a
            href="#story"
            className="text-[14px] font-medium text-[#111] transition hover:text-[#ff4d00]"
          >
            STORY
          </a>

          <a
            href="#hours"
            className="text-[14px] font-medium text-[#111] transition hover:text-[#ff4d00]"
          >
            HOURS
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          
          {/* Cart */}
          <button
            aria-label="Shopping cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-[#f8f5ef]"
          >
            <ShoppingBag
              size={19}
              strokeWidth={1.7}
              className="text-[#111]"
            />

            {/* Badge */}
            <span className="absolute -right-0.5 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4d00] text-[11px] font-bold text-white">
              2
            </span>
          </button>

          {/* Order Button */}
          <a
            href="#order"
            className="flex h-11 items-center rounded-full bg-[#ff4d00] px-6 text-[14px] font-bold italic text-white transition hover:bg-[#e84400]"
          >
            ORDER NOW
          </a>
        </div>
      </nav>
    </header>
  );
}