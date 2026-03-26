import { redirect } from "next/navigation";

export default async function EditOperationalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/buildings/${id}/edit/operational-details/operational-schedule-temperature`);
}
