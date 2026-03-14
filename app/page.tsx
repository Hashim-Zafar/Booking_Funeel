"use client";
import Link from "next/link";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    console.log("A");
    setTimeout(() => {
      console.log("B");
      Promise.resolve().then(() => {
        console.log("C");
      });
    }, 0);
    Promise.resolve().then(() => {
      console.log("D");
    });
    console.log("E");
  }, []);
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
