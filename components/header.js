import Link from 'next/link'

export default function Header(props) {
  return (
    <div className="font-serif flex-col flex items-center md:justify-between">
      <h2 className="text-2xl tracking-tight md:tracking-tighter leading-tight p-2">
        <Link href="/">
          <a className="hover:text-stone-500">Riley's Web Page</a>
        </Link>
      </h2>
      <div className="text-sm italic">Curious in the nature of it all</div>
      {props.children}
    </div>
  )
}
