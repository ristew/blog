import '../styles/index.css';
import Banner from '../components/banner';

export default function MyApp({ Component, pageProps }) {
  return <>
           <Banner />
           <Component {...pageProps} />
         </>
}
