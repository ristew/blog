import Link from 'next/link'

export default function Header() {
  return (
    <div className="font-serif flex-col md:flex-row flex items-center md:justify-between">
      <h2 className="text-2xl tracking-tight md:tracking-tighter leading-tight mb-12 p-2">
        <Link href="/">
          <a className="hover:text-stone-500">Sententiae scribendae</a>
        </Link>
      </h2>
    </div>
  )
}
