import { memo, useCallback, useMemo, useState } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import { useWithdrawStore } from "@/stores/user/wallet/withdraw";
import { useTranslation } from "next-i18next";
import { useDashboardStore } from "@/stores/dashboard";

const LoadingIndicator = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <Icon
          icon="mdi:loading"
          className="h-12 w-12 animate-spin text-[#17161a]"
        />
        <p className="text-xl text-[#17161a]">
          {t("Processing withdrawal...")}
        </p>
      </div>
    </div>
  );
};

const WithdrawDetails = ({
  selectedWithdrawMethod,
  selectedCurrency,
  withdrawAmount,
  balance,
  fee,
  minFee,
  totalWithdraw,
  remainingBalance,
}) => {
  const { t } = useTranslation();
  return (
    <div className="card-dashed text-sm mt-5">
      <div className="text-md mb-2 font-semibold text-muted-800 dark:text-muted-100">
        {selectedWithdrawMethod?.chain} {t("Network Withdraw Information")}
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Min Amount")}</p>
        <p
          className={
            !withdrawAmount ||
            withdrawAmount < selectedWithdrawMethod?.limits?.withdraw?.min
              ? "text-red-500"
              : "text-muted-600 dark:text-muted-300"
          }
        >
          {selectedWithdrawMethod?.limits?.withdraw?.min || 0}{" "}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">{t("Max Amount")}</p>
        <p className="text-muted-600 dark:text-muted-300">
          {balance || selectedWithdrawMethod?.limits?.withdraw?.max}{" "}
        </p>
      </div>
      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Withdraw Fee")}{" "}
          {minFee > 0 && (withdrawAmount * fee) / 100 < minFee && (
            <span className="text-muted-600 dark:text-muted-300">
              {t("Min Fee")} ({minFee})
            </span>
          )}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{fee}</p>
      </div>

      <div className="flex justify-between border-b border-dashed pb-2 border-muted-300 dark:border-muted-700 mb-2">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Total Withdraw")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">{totalWithdraw}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-muted-600 dark:text-muted-300">
          {t("Remaining Balance")}
        </p>
        <p className="text-muted-600 dark:text-muted-300">
          {remainingBalance > 0 ? remainingBalance : `--`} {selectedCurrency}
        </p>
      </div>
    </div>
  );
};

const calculateFees = (method, amount, spotWithdrawFee = 0) => {
  let fee = 0;
  let percentageFee = 0;
  let minFee = 0;

  // Fixed Fee
  if (method.fixedFee) {
    fee += method.fixedFee;
  }

  // Percentage Fee from the method
  if (method.percentageFee) {
    percentageFee = method.percentageFee;
    fee += (percentageFee * amount) / 100;
  }

  // Handle combined percentage fee: system percentage + spotWithdrawFee
  const combinedPercentageFee =
    parseFloat(method.fee?.percentage || "0") +
    parseFloat(spotWithdrawFee.toString());
  if (combinedPercentageFee > 0) {
    fee += (combinedPercentageFee * amount) / 100;
  }

  // Minimum Fee logic
  minFee = parseFloat(method.fee?.min || 0);
  if (minFee > 0) {
    fee = Math.max(minFee, fee);
  }

  return { fee, minFee };
};

const WithdrawForm = ({ selectedCurrency, onBack, onWithdraw, loading }) => {
  const { settings } = useDashboardStore();
  const {
    withdrawAmount,
    setWithdrawAmount,
    withdrawAddress,
    setWithdrawAddress,
    currencies,
    selectedWithdrawMethod,
  } = useWithdrawStore();

  // Get the current spotWithdrawFee from settings
  const spotWithdrawFee = parseFloat(settings?.spotWithdrawFee || 0);

  // Local state to handle input as a string
  const [inputValue, setInputValue] = useState(withdrawAmount.toString());

  const balance = useMemo(() => {
    return (
      currencies
        .find((currency) => currency.value === selectedCurrency)
        ?.label.split(" - ")[1] || 0
    );
  }, [currencies, selectedCurrency]);

  const handleChangeAddress = useCallback(
    (e) => {
      setWithdrawAddress(e.target.value);
    },
    [setWithdrawAddress]
  );

  const handleChangeAmount = useCallback(
    (e) => {
      const value = e.target.value;
      // Update local input value
      setInputValue(value);

      // Only update the store if the value is a valid number
      if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
        setWithdrawAmount(parseFloat(value) || 0);
      }
    },
    [setWithdrawAmount]
  );

  // Calculate fee with spotWithdrawFee included
  const { fee, minFee } = useMemo(() => {
    return calculateFees(
      selectedWithdrawMethod,
      withdrawAmount || 0,
      spotWithdrawFee
    );
  }, [selectedWithdrawMethod, withdrawAmount, spotWithdrawFee]);

  const totalWithdraw = useMemo(
    () => (withdrawAmount || 0) + fee,
    [withdrawAmount, fee]
  );

  const remainingBalance = useMemo(
    () => balance - totalWithdraw,
    [balance, totalWithdraw]
  );

  const isWithdrawValid = useMemo(() => {
    return (
      withdrawAmount > 0 &&
      withdrawAddress &&
      remainingBalance >= 0 &&
      withdrawAmount >= (selectedWithdrawMethod?.limits?.withdraw?.min || 0) &&
      withdrawAmount <=
        (balance || selectedWithdrawMethod?.limits?.withdraw?.max)
    );
  }, [
    withdrawAmount,
    withdrawAddress,
    remainingBalance,
    balance,
    selectedWithdrawMethod,
  ]);

  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {selectedCurrency} {t("Withdraw Confirmation")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Enter the amount you want to withdraw")}
        </p>
      </div>
      <div className="mx-auto mb-4 w-full max-w-md rounded-sm px-8 pb-8">
        <Input
          type="text"
          value={withdrawAddress}
          placeholder={t("Enter address")}
          label={t("Address")}
          required
          onChange={handleChangeAddress}
        />

        <Input
          type="text"
          value={inputValue}
          placeholder={t("Enter amount")}
          label={t("Amount")}
          min="0"
          max={balance || selectedWithdrawMethod?.limits?.withdraw?.max}
          step={selectedWithdrawMethod?.limits?.withdraw?.min || "any"}
          required
          onChange={handleChangeAmount}
          error={
            withdrawAmount &&
            withdrawAmount <
              (selectedWithdrawMethod?.limits?.withdraw?.min || 0)
              ? "Amount is less than minimum"
              : undefined ||
                withdrawAmount >
                  (balance || selectedWithdrawMethod?.limits?.withdraw?.max)
              ? "Amount exceeds your balance"
              : undefined
          }
        />
        <WithdrawDetails
          selectedWithdrawMethod={selectedWithdrawMethod}
          selectedCurrency={selectedCurrency}
          withdrawAmount={withdrawAmount}
          balance={balance}
          fee={fee}
          minFee={minFee}
          totalWithdraw={totalWithdraw}
          remainingBalance={remainingBalance}
        />
        <div className="mx-auto mt-8! max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button type="button" size="lg" onClick={onBack} disabled={loading}>
              <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              {t("Go Back")}
            </Button>
            <Button
              type="button"
              color="primary"
              size="lg"
              onClick={onWithdraw}
              disabled={!isWithdrawValid || loading}
            >
              {t("Withdraw")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WithdrawAmountBase = () => {
  const {
    loading,
    setStep,
    selectedCurrency,
    handleWithdraw,
    setSelectedWithdrawMethod,
  } = useWithdrawStore();

  if (loading) return <LoadingIndicator />;

  return (
    <WithdrawForm
      selectedCurrency={selectedCurrency}
      onBack={() => {
        setSelectedWithdrawMethod(null);
        setStep(3);
      }}
      onWithdraw={handleWithdraw}
      loading={loading}
    />
  );
};

export const WithdrawAmount = memo(WithdrawAmountBase);
