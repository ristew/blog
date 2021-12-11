import { parseISO, format } from 'date-fns'

export default function DateFormatter({ dateString }) {
  return <time className="italic text-stone-400" dateTime={dateString}>{dateString}</time>
}
