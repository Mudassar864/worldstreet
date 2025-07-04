import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import { ObjectTable } from "@/components/elements/base/object-table";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";
const api = "/api/admin/finance/exchange/fee";
interface FeeComparison {
  currency: string;
  totalAmount: number;
  totalCalculatedFee: number;
  totalExchangeFee: number;
  totalExtraFee: number;
}
const columnConfig: ColumnConfigType[] = [
  {
    field: "currency",
    label: "Fee Currency",
    type: "string",
    sortable: true,
  },
  {
    field: "totalAmount",
    label: "Total Amount",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "totalCalculatedFee",
    label: "Calculated Fee",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "totalExchangeFee",
    label: "Exchange Fee",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "totalExtraFee",
    label: "Collectable Fee",
    type: "number",
    precision: 8,
    sortable: true,
  },
];
const ExchangeOrderFeesDashboard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [fees, setFees] = useState<FeeComparison[]>([]);
  const fetchOrderFees = async () => {
    const { data, error } = await $fetch({
      url: api,
      silent: true,
    });
    if (!error) {
      setFees(data.feesComparison);
    }
  };
  const debounceFetchOrderFees = debounce(fetchOrderFees, 100);
  useEffect(() => {
    if (router.isReady) {
      debounceFetchOrderFees();
    }
  }, [router.isReady]);
  return (
    <Layout title={t("Collectable Fee")} color="muted">
      <ObjectTable
        title={t("Collectable Fee")}
        items={fees}
        setItems={setFees}
        columnConfig={columnConfig}
        navSlot={
          <Tooltip content={t("Refresh")}>
            <IconBox
              color="primary"
              onClick={() => fetchOrderFees()}
              size={"sm"}
              shape={"rounded-sm"}
              variant={"pastel"}
              className="cursor-pointer hover:shadow-sm transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-[#17161a] hover:text-muted-100"
              icon="mdi:refresh"
            />
          </Tooltip>
        }
        shape="rounded-sm"
        size="sm"
        filterField="currency"
        initialPerPage={20}
      />
    </Layout>
  );
};
export default ExchangeOrderFeesDashboard;
export const permission = "Access Exchange Fee Management";
