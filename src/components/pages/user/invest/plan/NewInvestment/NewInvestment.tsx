import { memo } from "react";
import Link from "next/link";
import ListBox from "@/components/elements/form/listbox/Listbox";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";

const NewInvestmentBase = ({
  plan,
  duration,
  setDuration,
  amount,
  setAmount,
  invest,
  isLoading,
}) => {
  const { t } = useTranslation();
  const looseToNumber = (value: any) => {
    if (
      typeof value === "string" &&
      (value === "" || value === "." || value.endsWith("."))
    ) {
      return value; // Allow incomplete decimal inputs
    }
    const n = Number.parseFloat(value);
    return Number.isNaN(n) ? value : n;
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold text-muted-800 dark:text-muted-100">
            {t("Investment Plan Details")}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Min Amount")}</p>
            <p className="text-sm text-muted-800 dark:text-muted-100">
              {plan?.minAmount} {plan?.currency}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Max Amount")}</p>
            <p className="text-sm text-muted-800 dark:text-muted-100">
              {plan?.maxAmount} {plan?.currency}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Profit Percentage")}</p>
            <p className="text-success-500">{plan?.profitPercentage}%</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Wallet Type")}</p>
            <Link href={`/user/wallet/${plan?.walletType}`}>
              <span className="text-[#17161a]">{plan?.walletType}</span>
            </Link>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-400">{t("Currency")}</p>
            <Link href={`/user/wallet/${plan?.walletType}/${plan?.currency}`}>
              <span className="text-[#17161a]">{plan?.currency}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <ListBox
            label={t("Duration")}
            options={plan?.durations?.map((duration) => ({
              value: duration.id,
              label: `${duration.duration} ${duration.timeframe}`,
            }))}
            selected={duration}
            setSelected={(e) => setDuration(e)}
          />
        </div>
        <div className="w-full">
          <Input
            label={t("Amount")}
            placeholder={t("Ex: 2600")}
            value={amount}
            onChange={(e) => setAmount(looseToNumber(e.target.value))}
            type="number"
            step="any"
          />
        </div>
      </div>
      <div>
        <Button
          type="button"
          className="w-full"
          color={
            amount && amount >= plan?.minAmount && duration.value
              ? "success"
              : "muted"
          }
          loading={isLoading}
          disabled={
            !amount || // Ensure the amount is provided
            isNaN(amount) || // Avoid invalid numbers
            (plan ? amount < plan.minAmount : false) || // Check min limit
            (plan ? amount > plan?.maxAmount : false) || // Check max limit
            !duration.value // Ensure duration is selected
          }
          onClick={invest}
        >
          <span>{t("Invest")}</span>
        </Button>
      </div>
    </div>
  );
};
export const NewInvestment = memo(NewInvestmentBase);
