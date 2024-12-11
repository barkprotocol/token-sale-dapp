import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
        alt="BARK Token logo"
        width={43}
        height={43}
        className="rounded-full"
      />
      <span className="font-bold text-3xl font-inter">BARK</span>
    </Link>
  );
}