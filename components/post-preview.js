import Avatar from '../components/avatar'
import DateFormatter from '../components/date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'

export default function PostPreview({
  title,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <div className="border-solid border-l-2 border-stone-400 p-8">
      <h3 className="text-2xl mb-3 font-semibold">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:text-stone-500">{title}</a>
        </Link>
      </h3>
      <div className="mb-4 italic">
        <DateFormatter dateString={date} />
      </div>
      <p className="leading-relaxed mb-4">{excerpt}</p>
    </div>
  )
}
