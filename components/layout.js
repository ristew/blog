import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'
import Banner from '../components/banner'

export default function Layout({ preview, children }) {
  return (
    <div>
      <Meta />
      <div id="layout-content" className="font-serif bg-amber-50 pl-5 pr-5 md:pl-20 md:pr-20">
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
