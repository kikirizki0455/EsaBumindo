import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/admin-layout";

export default function EditEmployee() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Karyawan</h1>
        <p className="text-gray-500">ID: {id}</p>
        <p className="text-gray-500">Halaman ini sedang dalam pengembangan.</p>
      </div>
    </AdminLayout>
  );
}
