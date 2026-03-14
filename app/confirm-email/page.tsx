export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">📩</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Check Your Email
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          We’ve sent you a confirmation email. Please open your inbox and click
          the **Confirm Booking** button to finalize your appointment.
        </p>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 text-sm mb-6">
          Your booking will only be confirmed after you click the confirmation
          link in the email.
        </div>

        {/* Steps */}
        <div className="text-left text-sm text-gray-600 space-y-2 mb-6">
          <p>1️⃣ Open your email inbox</p>
          <p>
            2️⃣ Find the email titled{" "}
            <span className="font-semibold">"Confirm Your Booking"</span>
          </p>
          <p>
            3️⃣ Click the <span className="font-semibold">Confirm Booking</span>{" "}
            button
          </p>
        </div>

        {/* Tip */}
        <p className="text-xs text-gray-500">
          Didn’t receive the email? Check your spam or promotions folder.
        </p>
      </div>
    </div>
  );
}
