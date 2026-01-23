import { Mail, Phone } from "lucide-react";

export default function ContactMethodSelector({
  contactMethod,
  onMethodChange,
  disabled = false,
  t = null,
}) {
  // Fallback translations jika t tidak disediakan
  const getLabel = (key, fallback) => {
    return t ? t(key) : fallback;
  };

  return (
    <fieldset className="pb-8 border-b border-gray-200">
      <legend className="text-lg font-bold text-gray-900 mb-4">
        {getLabel(
          "products.preOrder.fields.contactMethod",
          "Metode Kontak Untuk Respons"
        )}
      </legend>

      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">
          Tim kami akan menghubungi Anda melalui metode yang dipilih
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Option */}
          <label
            className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              contactMethod === "email"
                ? "border-[#0c439a] bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="contactMethod"
              value="email"
              checked={contactMethod === "email"}
              onChange={(e) => onMethodChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <div className="flex items-center gap-3 w-full">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  contactMethod === "email"
                    ? "border-[#0c439a] bg-[#0c439a]"
                    : "border-gray-300"
                }`}
              >
                {contactMethod === "email" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div>
                <Mail
                  size={20}
                  className={`mb-1 ${
                    contactMethod === "email"
                      ? "text-[#0c439a]"
                      : "text-gray-600"
                  }`}
                />
                <div className="font-semibold text-gray-900 text-sm">
                  {getLabel("products.preOrder.contactMethods.email", "Email")}
                </div>
                <div className="text-xs text-gray-600">
                  {getLabel(
                    "products.preOrder.contactMethods.emailDesc",
                    "Lebih formal dan tertulis"
                  )}
                </div>
              </div>
            </div>
          </label>

          {/* WhatsApp Option */}
          <label
            className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              contactMethod === "whatsapp"
                ? "border-[#25D366] bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="contactMethod"
              value="whatsapp"
              checked={contactMethod === "whatsapp"}
              onChange={(e) => onMethodChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <div className="flex items-center gap-3 w-full">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  contactMethod === "whatsapp"
                    ? "border-[#25D366] bg-[#25D366]"
                    : "border-gray-300"
                }`}
              >
                {contactMethod === "whatsapp" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div>
                <Phone
                  size={20}
                  className={`mb-1 ${
                    contactMethod === "whatsapp"
                      ? "text-[#25D366]"
                      : "text-gray-600"
                  }`}
                />
                <div className="font-semibold text-gray-900 text-sm">
                  {getLabel(
                    "products.preOrder.contactMethods.whatsapp",
                    "WhatsApp"
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  {getLabel(
                    "products.preOrder.contactMethods.whatsappDesc",
                    "Lebih cepat dan personal"
                  )}
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Tips:</strong> Pilih WhatsApp untuk respons yang lebih
            cepat, atau Email untuk dokumentasi yang lebih lengkap.
          </p>
        </div>
      </div>
    </fieldset>
  );
}
