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
    </div>
  );
}
