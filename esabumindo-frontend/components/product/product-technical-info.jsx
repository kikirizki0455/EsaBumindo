import { useTranslation } from "@/hooks/use-translation";

export default function ProductTechnicalInfo({ product }) {
  const { t } = useTranslation();

  const technicalInfo = [
    {
      title: t("products.productDetail.technicalInfo.composition.title"),
      content: t("products.productDetail.technicalInfo.composition.content"),
    },
    {
      title: t("products.productDetail.technicalInfo.application.title"),
      content: t("products.productDetail.technicalInfo.application.content"),
    },
    {
      title: t("products.productDetail.technicalInfo.storage.title"),
      content: t("products.productDetail.technicalInfo.storage.content"),
    },
    {
      title: t("products.productDetail.technicalInfo.certification.title"),
      content: t("products.productDetail.technicalInfo.certification.content"),
    },
  ];

  const usageGuidelines =
    t("products.productDetail.technicalInfo.usageGuidelines.items") || [];
  const safetyItems =
    t("products.productDetail.technicalInfo.safetyInfo.items") || [];

  return (
    <div className="space-y-8">
      {/* Technical Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicalInfo.map((info, idx) => (
          <div
            key={idx}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              {info.title}
            </h4>
            <p className="text-gray-700 leading-relaxed">{info.content}</p>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="bg-gradient-to-br from-[#0c439a]/5 to-[#ca161e]/5 p-8 rounded-lg border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          {t("products.productDetail.technicalInfo.usageGuidelines.title")}
        </h4>
        <ul className="space-y-3">
          {Array.isArray(usageGuidelines) &&
            usageGuidelines.map((guideline, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[#ca161e] font-bold mt-1">•</span>
                <span className="text-gray-700">{guideline}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Safety Info */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
        <h4 className="text-lg font-bold text-amber-900 mb-3">
          ⚠️ {t("products.productDetail.technicalInfo.safetyInfo.title")}
        </h4>
        <p className="text-amber-800 mb-3">
          {t("products.productDetail.technicalInfo.safetyInfo.description")}
        </p>
        <ul className="space-y-2 text-sm text-amber-800">
          {Array.isArray(safetyItems) &&
            safetyItems.map((item, idx) => <li key={idx}>• {item}</li>)}
        </ul>
      </div>

      {/* Contact for More Info */}
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-700 mb-4">
          {t("products.productDetail.technicalInfo.contactSupport.description")}
        </p>
        <button className="inline-block px-6 py-3 bg-[#0c439a] text-white font-semibold rounded-lg hover:bg-[#0a3478] transition-colors">
          {t("products.productDetail.technicalInfo.contactSupport.button")}
        </button>
      </div>
    </div>
  );
}
