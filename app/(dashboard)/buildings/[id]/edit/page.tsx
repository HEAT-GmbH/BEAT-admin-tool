import { redirect } from "next/navigation";

export default async function EditBuildingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/buildings/${id}/edit/building-information/building-name-location`);
}
