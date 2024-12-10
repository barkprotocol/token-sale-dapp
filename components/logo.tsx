import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
        alt="BARK logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="font-semibold text-xl font-inter">BARK</span>
    </Link>
  );
}

