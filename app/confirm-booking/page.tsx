import ConfirmView from "@/components/ConfirmView";

export default async function ConfirmBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ConfirmView token={token ?? null} />;
}
