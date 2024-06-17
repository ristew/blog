import Layout from '../components/layout'
import Head from 'next/head'

export default function About() {
  return (
    <Layout>
        <Head>
        </Head>
        <section className="font-serif flex-col md:flex-row flex md:justify-between mb-8 md:mb-8">
          <div className="pt-8">
          <div className="font-bold text-3xl italic mb-4">About me</div>
            <p>If you're reading this page and you want to know more about the human being named Riley Stewart, you're in the right place.</p>
            <p>I'm a technologist living in Seattle interested in computing - mostly programming, artificial intelligence, user interfaces, and games, though I try to dabble in everything. </p>
            <p>By day I am a software engineer working on cloud video surveillance systems.</p>
            <p>Otherwise, I enjoy spending time with my wife, cat, and dog, marinating in nature, and reading whatever book my intuition demands.</p>
        </div>
        </section>
    </Layout>
  );
}
