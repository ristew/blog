import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout({ preview, children }) {
  return (
    <div>
      <Meta />
      <div className="font-serif h-full bg-amber-100 pl-20">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
}
