import { useTranslation } from "@/hooks/use-translation";

export default function ProductSpecifications({ product }) {
  const { t } = useTranslation();

  const specifications = [
    {
      category: t(
        "products.productDetail.specificationsData.categories.performance"
      ),
      items: [
        {
          label: t(
            "products.productDetail.specificationsData.items.bondStrength"
          ),
          value: t("products.productDetail.specificationsData.values.high"),
        },
        {
          label: t(
            "products.productDetail.specificationsData.items.dryingTime"
          ),
          value: t("products.productDetail.specificationsData.values.5to10min"),
        },
        {
          label: t(
            "products.productDetail.specificationsData.items.tempResistance"
          ),
          value: t("products.productDetail.specificationsData.values.upTo200C"),
        },
        {
          label: t(
            "products.productDetail.specificationsData.items.durability"
          ),
          value: t(
            "products.productDetail.specificationsData.values.permanent"
          ),
        },
      ],
    },
    {
      category: t(
        "products.productDetail.specificationsData.categories.physical"
      ),
      items: [
        {
          label: t("products.productDetail.specificationsData.items.color"),
          value: t("products.productDetail.specificationsData.values.clear"),
        },
        {
          label: t("products.productDetail.specificationsData.items.viscosity"),
          value: t("products.productDetail.specificationsData.values.medium"),
        },
        {
          label: t("products.productDetail.specificationsData.items.odor"),
          value: t("products.productDetail.specificationsData.values.minimal"),
        },
        {
          label: t("products.productDetail.specificationsData.items.form"),
          value: t("products.productDetail.specificationsData.values.liquid"),
        },
      ],
    },
    {
      category: t(
        "products.productDetail.specificationsData.categories.safety"
      ),
      items: [
        {
          label: t("products.productDetail.specificationsData.items.nonToxic"),
          value: t("products.productDetail.specificationsData.values.yes"),
        },
        {
          label: t(
            "products.productDetail.specificationsData.items.ecoFriendly"
          ),
          value: t("products.productDetail.specificationsData.values.yes"),
        },
        {
          label: t(
            "products.productDetail.specificationsData.items.vocContent"
          ),
          value: t("products.productDetail.specificationsData.values.low"),
        },
        {
          label: t(
            "products.productDetail.specificationsData.items.hypoallergenic"
          ),
          value: t("products.productDetail.specificationsData.values.yes"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {specifications.map((spec, idx) => (
        <div key={idx}>
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            {spec.category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spec.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className="text-gray-900 font-bold text-lg">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Download Button */}
      <div className="pt-8 border-t border-gray-200">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c439a] text-white font-semibold rounded-lg hover:bg-[#0a3478] transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {t("products.productDetail.specificationsData.downloadFull")}
        </button>
      </div>
    </div>
  );
}
