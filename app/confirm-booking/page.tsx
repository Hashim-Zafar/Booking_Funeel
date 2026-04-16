import ConfirmView from "@/components/main-components/funnel/ConfirmView";

export default async function ConfirmBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ConfirmView token={token ?? null} />;
}
