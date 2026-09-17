"use client";

import AdminShell from "@/components/admin/admin-shell";
import PackageForm from "@/components/admin/package-form";

export default function NewPackagePage() {
  return (
    <AdminShell title="Add Package" subtitle="Create a monthly or yearly package">
      <PackageForm />
    </AdminShell>
  );
}
