"use client";

import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import PackageForm from "@/components/admin/package-form";

export default function EditPackagePage() {
  const params = useParams();

  return (
    <AdminShell title="Edit Package" subtitle="Update package details and pricing">
      <PackageForm packageId={params.id} />
    </AdminShell>
  );
}
