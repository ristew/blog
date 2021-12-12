import Avatar from '../components/avatar'
import DateFormatter from '../components/date-formatter'
import CoverImage from '../components/cover-image'
import PostTitle from '../components/post-title'

export default function PostHeader({ title, date, author, excerpt }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="italic mb-4">{excerpt}</div>
      <DateFormatter dateString={date} />
    </>
  )
}
