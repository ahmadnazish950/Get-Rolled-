import FilmStrip from "./FilmStrip";
import { Aperture } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-ink">
      <FilmStrip />
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 md:w-[440px] md:flex-none">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <Aperture className="h-6 w-6 text-amber" />
            <span className="font-display text-lg font-semibold text-paper">Roll</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
