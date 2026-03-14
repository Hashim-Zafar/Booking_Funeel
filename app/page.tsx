import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Landing Page Under Development
        </h1>

        <p className="text-gray-600">
          This landing page is currently a placeholder. For real clients, the
          page can be fully customized to match your brand, messaging, and
          marketing goals.
        </p>

        <p className="text-gray-600">
          In the meantime, you can explore the core feature of the system — the
          automated booking funnel designed to capture leads, qualify them, and
          schedule calls seamlessly.
        </p>

        <div className="pt-4">
          <Link
            href="/booking"
            className="inline-block bg-black text-white px-6 py-4 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Try the Booking Funnel
          </Link>
        </div>
      </div>
    </main>
  );
}
