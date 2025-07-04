import { memo, useState } from "react";
import ListBox from "@/components/elements/form/listbox/Listbox";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useTransferStore } from "@/stores/user/wallet/transfer";
import { useTranslation } from "next-i18next";
import Input from "@/components/elements/form/input/Input";
import Link from "next/link";

const SelectTransferTypeBase = () => {
  const { t } = useTranslation();
  const { setStep, setTransferType, transferType, setClientId } =
    useTransferStore();
  const transferTypes = [
    { value: "client", label: "Transfer to Client Wallet" },
    { value: "wallet", label: "Transfer Between Wallets" },
  ];
  const [selectedTransferType, setSelectedTransferType]: any =
    useState(transferType);

  const [clientId, setLocalClientId] = useState("");

  const handleContinue = () => {
    setTransferType(selectedTransferType);
    if (selectedTransferType.value === "client") {
      setClientId(clientId);
    }
    setStep(2);
  };

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select Transfer Type")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Choose the type of transfer you want to make")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-8 pb-8">
        <ListBox
          selected={selectedTransferType}
          options={transferTypes}
          setSelected={setSelectedTransferType}
        />
        {selectedTransferType.value === "client" && (
          <div className="mt-4">
            <Input
              type="text"
              value={clientId}
              placeholder={t("Enter Client ID")}
              label={t("Client ID")}
              required
              onChange={(e) => setLocalClientId(e.target.value)}
            />
          </div>
        )}
        <div className="mt-6">
          <Button
            type="button"
            color="primary"
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={
              selectedTransferType.value === "client" && clientId === ""
            }
          >
            {t("Continue")}
            <Icon icon="mdi:chevron-right" className="h-5 w-5" />
          </Button>
        </div>
        <hr className="my-6 border-t border-muted-200 dark:border-muted-800" />
        <div className="text-center">
          <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
            <span>{t("Having any trouble")}</span>
            <Link
              href="#"
              className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-[#17161a] hover:underline focus:underline focus:outline-hidden"
            >
              {t("Contact us")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const SelectTransferType = memo(SelectTransferTypeBase);
