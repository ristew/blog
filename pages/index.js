import MoreStories from '../components/more-stories'
import Layout from '../components/layout'
import Header from '../components/header'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'

export default function Index({ allPosts }) {
  return (
    <>
      <Layout>
        <Head>
          <title>Riley Stewart</title>
        </Head>
          <section className="font-serif flex-col md:flex-row flex md:justify-between mb-8 md:mb-8">
          </section>
          <section className="font-serif flex-col flex md:justify-between mt-8 mb-8 md:mb-12">
          <Header>
            <a className="text-sm link" href="/about">about</a>
          </Header>
          {<MoreStories posts={allPosts} />}
          </section>

        {/* <a className="text-sm link" href="mailto:me@rileystew dot art">email</a> */}
        {/* <span> </span> */}
        {/* <a className="text-sm link" href="https://www.linkedin.com/in/riley-stewart-b582a4a0/">linkedin</a> */}
        {/* <span> </span> */}
        {/* <a className="text-sm link" href="/resume">resume</a> */}
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'draft',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]).filter(post => !post.draft)

  return {
    props: { allPosts },
  }
}
