import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-2xl font-bold tracking-tight"
    >
      <span className="text-cyan-400">Sentinel</span>
      <span className="text-white">AI</span>
    </Link>
  );
}