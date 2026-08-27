// @ts-nocheck
import { BookOpen, Compass, Settings, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type PlayerTab = "lessons" | "explore" | "recommends" | "settings";

const tabs = [
  { id: "lessons", labelKey: "nav.lessons", icon: BookOpen },
  { id: "explore", labelKey: "nav.explore", icon: Compass },
  { id: "recommends", labelKey: "nav.recommends", icon: Sparkles },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
] as const;

/**
 * Floating tab bar for the Video player page. Same look/motion as the original
 * app, but it switches local state instead of navigating routes.
 */
export function BottomTabs({
  active,
  onChange,
}: {
  active: PlayerTab;
  onChange: (tab: PlayerTab) => void;
}) {
  const { t, i18n } = useTranslation();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pill, setPill] = useState({ x: 0, w: 0, h: 0, ready: false });

  const activeIndex = tabs.findIndex((tab) => tab.id === active);

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const el = itemRefs.current[activeIndex];
      if (!list || !el) {
        setPill((p) => ({ ...p, ready: false }));
        return;
      }
      const lr = list.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      setPill({ x: er.left - lr.left, w: er.width, h: er.height, ready: true });
    };
    measure();
    const timer = window.setTimeout(measure, 340);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [activeIndex, i18n.language]);

  useEffect(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) return;
    fonts.ready.then(() => window.dispatchEvent(new Event("resize")));
  }, []);

  return (
    <nav
      aria-label={t("nav.primary")}
      className="animate-rise-in sticky bottom-5 z-40 mx-auto w-fit px-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul
        ref={listRef}
        className="shadow-lift transition-smooth relative flex items-stretch gap-1 rounded-full border border-border/70 bg-card/85 p-1.5 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70"
      >
        <span
          aria-hidden
          className="shadow-soft pointer-events-none absolute left-0 top-1/2 rounded-full bg-primary"
          style={{
            width: pill.w,
            height: pill.h,
            opacity: pill.ready ? 1 : 0,
            transform: `translate3d(${pill.x}px, -50%, 0)`,
            transition:
              "transform 520ms cubic-bezier(0.16,1,0.3,1), width 420ms cubic-bezier(0.16,1,0.3,1), opacity 240ms ease-out",
          }}
        />
        {tabs.map(({ id, labelKey, icon: Icon }, i) => {
          const isActive = id === active;
          return (
            <li
              key={id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative z-10"
            >
              <button
                type="button"
                onClick={() => onChange(id as PlayerTab)}
                aria-current={isActive ? "page" : undefined}
                className={`press flex items-center gap-2 rounded-full px-4 py-2.5 text-xs tracking-wide transition-[color,background-color] duration-300 ease-out ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isActive ? "-rotate-6 scale-110" : "rotate-0 scale-100"
                  }`}
                  strokeWidth={1.5}
                />
                <span className={isActive ? "inline" : "hidden sm:inline"}>{t(labelKey)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
