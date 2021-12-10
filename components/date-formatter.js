import { parseISO, format } from 'date-fns'

export default function DateFormatter({ dateString }) {
  const date = parseISO(dateString)
  return <time className="italic text-stone-400" dateTime={dateString}>{date.toISOString()}</time>
}
