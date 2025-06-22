import React, { useState } from "react";
import NotificationTabs from "@/components/layouts/shared/NotificationsDropdown/NotificationTabs";
import { Panel } from "@/components/elements/base/panel";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import { useDashboardStore } from "@/stores/dashboard";
const NotificationsDropdownBase = () => {
  const { t } = useTranslation();
  const [isPanelOpened, setIsPanelOpened] = useState(false);
  const { notifications } = useDashboardStore();

  const categories = {
    activity: notifications.filter(
      (notification) => notification.type.toLowerCase() === "activity"
    ),
    system: notifications.filter(
      (notification) => notification.type.toLowerCase() === "system"
    ),
    security: notifications.filter(
      (notification) => notification.type.toLowerCase() === "security"
    ),
  };
  const hasNotifications = Object.values(categories).some(
    (category) => category.length > 0
  );

  return (
    <>
      <div className="group relative text-start">
        {hasNotifications && (
          <span className="absolute right-0.5 top-0.5 z-2 block h-2 w-2 rounded-full bg-[#17161a] "></span>
        )}
        <button
          type="button"
          name="notificationsDropdownToggle"
          aria-label="Notifications dropdown"
          className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-[#17161a] hover:bg-[#17161a]/10 dark:hover:bg-[#17161a]/20 rotate-0"
          onClick={() => setIsPanelOpened(!isPanelOpened)}
        >
          <Icon
            icon="ph:bell-duotone"
            className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-[#17161a]"
          />
        </button>
      </div>

      <Panel
        side="top"
        isOpen={!!isPanelOpened}
        title={t("Notifications")}
        size="xl"
        onClose={() => setIsPanelOpened(false)}
      >
        <NotificationTabs shape="rounded-sm" />
      </Panel>
    </>
  );
};
export const NotificationsDropdown = NotificationsDropdownBase;
