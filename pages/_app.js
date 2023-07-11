import '../styles/index.css';
import dynamic from 'next/dynamic';
import Banner from '../components/banner';

const DynamicBanner = dynamic(
  () => import('../components/banner'),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }) {
  return <>
           <DynamicBanner />
           <Component {...pageProps} />
         </>
}
