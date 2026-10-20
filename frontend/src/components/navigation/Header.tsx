import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E7E0D6] bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Link wrapping logo and text mark */}
        <Link
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 rounded-sm"
          href="/"
        >
          <div className="relative h-11 w-11 flex-shrink-0">
            <Image
              alt="Hunar logo showing hand-held paintbrush shaping the letter H"
              className="object-contain"
              fill
              priority
              src="/assets/logo-compact.png"
            />
          </div>
          <div className="flex flex-col select-none">
            <span className="font-serif text-lg font-bold tracking-tight text-[#C85A32]">
              Hunar
            </span>
            <span className="text-[9px] font-medium tracking-wide uppercase text-[#635C53] -mt-0.5">
              By Flytech
            </span>
          </div>
        </Link>
        {/* Navigation items below */}
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard/customer"
            className="text-xs font-semibold text-[#1E2229] hover:text-[#C85A32] transition-colors"
          >
            Bazaar
          </Link>
          <Link
            href="/dashboard/seller"
            className="text-xs font-semibold text-[#1E2229] hover:text-[#C85A32] transition-colors"
          >
            Studio
          </Link>
          <Link
            href="/opportunities"
            className="text-xs font-semibold text-[#1E2229] hover:text-[#C85A32] transition-colors"
          >
            Radar Gigs
          </Link>
          <Link
            href="/onboarding"
            className="px-3.5 py-1.5 rounded-sm bg-[#1E2229] text-white text-xs font-medium hover:bg-[#111418] transition-colors"
          >
            Create Hunar Card
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
