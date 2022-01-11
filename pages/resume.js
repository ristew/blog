import Layout from '../components/layout'
import Head from 'next/head'

function JobSegment() {
  let responsibilities = [
    'Developed all aspects of a cloud video surveillance platform, in particular Node.js backend microservices, core APIs, video device services, and DevOps workflows',
    'Responsible for infrastructure deployment, monitoring, and troubleshooting',
    'Communicate directly with customers to solve complex issues or implement sale-critical features',
    'Monitor and optimize pipelines that ingest and retain petabytes of video',
    'Debug, troubleshoot, and triage in distributed and remote contexts',
    'Set up in-house monitoring systems that catch problems before they reach support',
    'Imbue security into everything that we do, from company-wide standards to code reviews',
    'Operate as a resource for coworkers through tacit knowledge and thought-out engineering debates',
  ];
  return (
    <>
    <div className="text-lg font-semibold mt-4">Work experience</div>
    <div className="font-semibold">Smartvue / Johnson Controls</div>
      <div><span className="italic">2016-present</span><span className="text-sm italic ml-4">(Johnson Controls acquired Smartvue in 2018)</span></div>
    <div className="font-semibold">Senior Software Engineer</div>
    { responsibilities.map(r => <div className="ml-2">{r}</div>) }
    </>
  );
}

function Education() {
  return (
    <>
      <div className="font-semibold text-lg mt-4">Education</div>
      <div>Constantly learning new things from books, blogposts, articles, and academic publications.  More formally...</div>
      <div className="font-semibold">Vanderbilt University</div>
      <div className="ml-2">B.S. Computer Science</div>
      <div className="ml-2 italic text-sm">2013 - 2016</div>
    </>
  );
}

function Projects() {
  const projects = [
    {
      name: 'Trippi',
      link: 'https://gettrippi.com/',
      points: [
        'Only the landing page works now, the backend is no more',
        'A travel itinerary sharing app, written with React and Typescript',
        'Solves a need currently handled by Google docs and other half measures',
        'Owned the backend and collaborated on the front-end with a friend',
        'Accepted into the Harvard iLab',
      ],
    },
    {
      name: 'Untitled Rust gamedev project',
      link: 'https://github.com/ristew/map-game',
      points: [
        'Goal was to develop a geopolitical simulator akin to Victoria 2 but in antiquity',
        'Developed using bevy, but also switched off concurrently with non-ECS version (see iron-game)',
        'Hit a wall trying to come up with simulation logic, which led me to current research rabbit-hole',
      ]
    },
    {
      name: 'Biffle',
      link: 'https://github.com/thefunguys/biffle',
      points: [
        'A brainf*ck meta-interpreter',
        'Created a sort of VM using BF that could jump to certain places in memory and call stored procedures',
        'Learned that I am not a C programmer',
      ]
    },
  ];
  return (
    <>
      <div className="font-semibold text-lg mt-4">Projects</div>
    { projects.map(p => Project(p)) }
    </>
  );
}

function Project({ name, period, points, link }) {
  return (
    <>
      <div><a className="font-semibold underline" href={link}>{name}</a></div>
      <div className="italic">{period}</div>
    { points.map(p => <div className="ml-2">{p}</div>)}
    </>
  );
}

function Skills() {
  let skills = [
    'Linux: daily user for over 10 years',
    'Javascript: the main language I work with',
    'SQL (SQL Server, MySQL, Postgres, SQLite): a lot of querying and a good amount of optimizing',
    'Azure: PaaS with most experience (though my fiancée works at AWS)',
    'Docker, kubernetes: very slowly containerizing at my job',
    'Rust: using personally on and off for 7 years, hopefully some day professionally',
    'Python, Java, C++: have used in real projects, though I tend to avoid Java and C++',
    'HTML/CSS/React/Svelte: well versed in web technologies, this site is done with Next.js/Tailwindcss',
    'Lisp, Ruby, Prolog, C, Nim, Haskell, Lua, PHP: learned at some point, I pick up new languages quickly',
    'Vim, Emacs: I use evil-mode in Emacs for the best of both worlds',
    'Areas of interest: distributed systems, IoT, programming languages, game development, cellular automata, agent based modeling',
  ];
  return (
    <>
      <div className="font-semibold text-lg">Skills</div>
    { skills.map(s => <div className="ml-2">{s}</div>) }
    </>
  );
}
export default function Resume() {
  return (
    <Layout>
        <Head>
          <title>Riley Stewart's resumé</title>
        </Head>
        <section className="font-serif flex-col md:flex-row flex md:justify-between mb-8 md:mb-8">
          <div className="pt-8">
          <div className="font-bold text-3xl italic mb-4"><a href="/">Riley Stewart</a>'s resumé</div>
            <Skills />
            <JobSegment />
            <Projects />
            <Education />
        </div>
        </section>
    </Layout>
  );
}
