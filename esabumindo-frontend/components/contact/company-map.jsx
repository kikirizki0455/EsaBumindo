"use client"; // kalau Next.js 13+ dengan app dir, atau bisa abaikan kalau pakai pages dir

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function CompanyMap() {
  // koordinat untuk PT ESABUMINDO (sekitar Pasar Kemis, Tangerang)
  const center = { lat: -6.196, lng: 106.586 }; // ← gunakan koordinat yg sesuai alamat

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
