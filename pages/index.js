import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Header from '../components/header'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'

export default function Index({ allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout>
        <Head>
          <title>Sententiae scribendae</title>
        </Head>
        <Header>
          <div className="">
            <a className="text-sm link" href="https://twitter.com/riley_stews">twitter</a>
            <span> </span>
            <a className="text-sm link" href="https://github.com/ristew">github</a>
            <span> </span>
            <a className="text-sm link" href="https://news.ycombinator.com/user?id=rileyphone">hn</a>
          </div>
        </Header>
          <section className="font-serif flex-col md:flex-row flex md:justify-between mb-8 md:mb-8">
          </section>
          <section className="font-serif flex-col flex md:justify-between mt-8 mb-8 md:mb-12">
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
