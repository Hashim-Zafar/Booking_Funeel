import Link from "next/link";
export default function Home() {
  return (
    <div className=" h-screen flex items-center justify-center">
      <Link
        href="/booking"
        className="border-white rounded-2xl w-fit py-4 px-6 bg-black text-white "
      >
        Book Now
      </Link>
    </div>
  );
}
