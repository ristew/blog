import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
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
          <title>Riley Stewart's blog</title>
        </Head>
          <section className="font-serif flex-col md:flex-row flex md:justify-between mb-8 md:mb-8">
            <div className="pt-8">
              <div className="font-bold text-3xl italic">Sententiae scribendae</div>
              <div className="text-xl italic">The blog of Riley Stewart</div>
              <br/>
              <p>A software engineer with his head in the cloud.</p>
              <p>I'm interested in complexity, the ancient world, wellness, and computing.</p>
              <p>I live in Seattle with my cat, dog, and future wife.</p>
              <a className="text-sm link" href="mailto:me@rileystew dot art">email</a>
              <span> </span>
              <a className="text-sm link" href="https://www.linkedin.com/in/riley-stewart-b582a4a0/">linkedin</a>
              <span> </span>
              <a className="text-sm link" href="https://github.com/ristew">github</a>
              <span> </span>
              <a className="text-sm link" href="/resume">resume</a>
            </div>
          </section>
          <section className="font-serif flex-col flex md:justify-between mt-16 mb-16 md:mb-12">
            {<MoreStories posts={allPosts} />}
          </section>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
