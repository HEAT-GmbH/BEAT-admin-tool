import { redirect } from "next/navigation";

export default function OperationalDetailsPage() {
  redirect(
    "/add-building/operational-details/operational-schedule-temperature",
  );
}
