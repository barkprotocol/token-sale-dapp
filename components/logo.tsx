import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group transition-colors duration-300">
      <div className="relative w-11 h-11 overflow-hidden rounded-full border-2 border-transparent group-hover:border-bark-accent">
        <Image
          src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
          alt="BARK Token logo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <span className="font-bold text-2xl sm:text-3xl font-inter text-bark-primary group-hover:text-bark-accent transition-colors duration-300">
        BARK
      </span>
    </Link>
  );
}