import React, { useState, useEffect } from "react";
import { MashImage } from "@/components/elements/MashImage";
import { Icon } from "@iconify/react";
import { LAYOUTS, useLayoutStore } from "@/stores/layout";
import { useTranslation } from "next-i18next";
import { Tooltip } from "../elements/base/tooltips/Tooltip";
import { useDashboardStore } from "@/stores/dashboard";

const LayoutSwitcher = () => {
  const { t } = useTranslation();
  const { setActiveLayout, activeLayout } = useLayoutStore();
  const { settings } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLayout = (e: any) => {
    setActiveLayout(e.target.value);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen((state) => !state);
  };

  if (!isMounted) {
    return null; // Prevent rendering on the server side
  }

  if (settings?.layoutSwitcher !== "true") return null;

  return (
    <div
      className={`group/layouts fixed bottom-5 right-5  ${open ? "z-50" : "z-40"}`}
    >
      <Tooltip content={t("Layout")}>
        <button
          name="layoutSwitcherToggle"
          aria-label="Layout switcher"
          type="button"
          className={`flex items-center rounded-lg border border-muted-200 bg-white p-3 text-start shadow-lg shadow-muted-300/30 transition-all duration-300 hover:border-[#17161a] dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:hover:border-[#17161a] ${
            open
              ? "pointer-events-none translate-y-full opacity-0"
              : "pointer-events-auto translate-y-0 opacity-100"
          }`}
          onClick={handleOpen}
        >
          <Icon
            icon="ph:layout-duotone"
            className="h-6 w-6 shrink-0 text-muted-400 transition-colors duration-300 group-hover/layouts:text-[#17161a]"
          />
        </button>
      </Tooltip>
      <div
        className={`fixed bottom-5 right-5 z-1000 h-[350px] sm:h-[200px] w-[480px] max-w-[90%] sm:max-w-[80%] overflow-hidden rounded-lg border border-muted-200 bg-white shadow-lg shadow-muted-300/30 transition-all duration-300 hover:border-[#17161a] dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30 dark:hover:border-[#17161a] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-muted-200 px-6 dark:border-muted-800">
          <div>
            <h3 className="font-sans font-medium text-muted-800 dark:text-muted-100 text-lg">
              {t("Layout")}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close layout switcher"
            name="layoutSwitcherToggle"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted-100 transition-colors duration-300 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700"
            onClick={handleOpen}
          >
            <Icon
              icon="lucide:x"
              className="h-4 w-4 text-muted-500 dark:text-muted-200"
            />
          </button>
        </div>
        <div className="slimscroll relative grid grid-cols-2 sm:grid-cols-3 gap-6 overflow-y-auto p-6">
          {LAYOUTS.map((layout, index) => (
            <div key={index} className="relative group/radio">
              <input
                type="radio"
                name="layout"
                className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
                value={layout}
                aria-label={layout}
                onChange={handleLayout}
              />
              <div className="relative text-center">
                <div className="relative">
                  <MashImage
                    src={`/img/illustrations/switcher/${layout}.svg`}
                    height={100}
                    width={40}
                    className={`block w-full dark:hidden transition-opacity duration-300 ${
                      activeLayout === layout
                        ? "opacity-100"
                        : "opacity-50 group-hover/radio:opacity-80 group-hover/radio:bg-muted-200 dark:group-hover/radio:bg-muted-800 group-hover/radio:rounded-xs"
                    }`}
                    alt="Layout icon"
                  />
                  <MashImage
                    src={`/img/illustrations/switcher/${layout}-dark.svg`}
                    height={100}
                    width={40}
                    className={`hidden w-full dark:block transition-opacity duration-300 ${
                      activeLayout === layout
                        ? "opacity-100"
                        : "opacity-50 group-hover/radio:opacity-80"
                    }`}
                    alt="Layout icon"
                  />
                  <div
                    className={`absolute right-0 top-0 z-10 h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-success-500 dark:border-muted-950 ${
                      activeLayout === layout ? "flex" : "hidden"
                    }`}
                  >
                    <Icon icon="lucide:check" className="h-3 w-3 text-white" />
                  </div>
                </div>
                <span
                  className={`block font-sans text-xs  ${
                    activeLayout === layout
                      ? "text-[#17161a]"
                      : "text-muted-400"
                  }`}
                >
                  {layout
                    .split("-")
                    .map((word) => {
                      return word.charAt(0).toUpperCase() + word.slice(1);
                    })
                    .join(" ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutSwitcher;
