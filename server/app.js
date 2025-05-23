import { base, __ } from 'simulabra';
import { marked } from 'marked';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

await async function (_, $) {
  $.Class.new({
    name: 'MarkdownParser',
    slots: [
      $.Var.new({ name: 'marked', default: () => marked }),
      $.Method.new({
        name: 'parse',
        do: function parse(markdown) {
          return this.marked().parse(markdown);
        }
      }),
      $.Method.new({
        name: 'extractFrontmatter',
        do: function extractFrontmatter(content) {
          const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
          const match = content.match(frontmatterRegex);
          
          if (match) {
            const frontmatter = {};
            const lines = match[1].split('\n');
            
            for (const line of lines) {
              const colonIndex = line.indexOf(':');
              if (colonIndex > -1) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();
                
                if (value.startsWith("'") && value.endsWith("'")) {
                  value = value.slice(1, -1);
                } else if (value.startsWith('"') && value.endsWith('"')) {
                  value = value.slice(1, -1);
                }
                
                if (key === 'author') {
                  const nameMatch = value.match(/name:\s*(.+)/);
                  if (nameMatch) {
                    frontmatter[key] = { name: nameMatch[1].trim() };
                  }
                } else {
                  frontmatter[key] = value;
                }
              }
            }
            
            return {
              metadata: frontmatter,
              content: match[2]
            };
          }
          
          return {
            metadata: {},
            content
          };
        }
      })
    ]
  });

  $.Class.new({
    name: 'Post',
    slots: [
      $.Var.new({ name: 'slug' }),
      $.Var.new({ name: 'rawContent' }),
      $.Var.new({ name: 'metadata', default: () => ({}) }),
      $.Var.new({ name: 'markdown' }),
      $.Var.new({ name: 'html' }),
      $.Method.new({
        name: 'toJSON',
        do() {
          return {
            html: this.html(),
            metadata: this.metadata(),
            slug: this.slug()
          };
        }
      })
    ]
  });

  $.Class.new({
    name: 'PostRepository',
    slots: [
      $.Var.new({ name: 'posts', default: () => new Map() }),
      $.Var.new({ name: 'parser' }),
      $.Method.new({
        name: 'loadPosts',
        do: async function loadPosts() {
          this.posts().clear();
          const postsDir = join(import.meta.dir, '..', 'posts');
          
          try {
            const files = await readdir(postsDir);
            const markdownFiles = files.filter(file => file.endsWith('.md'));
            
            for (const file of markdownFiles) {
              const filePath = join(postsDir, file);
              const content = await Bun.file(filePath).text();
              const slug = file.slice(0, -3);
              
              const { metadata, content: markdown } = this.parser().extractFrontmatter(content);
              const html = this.parser().parse(markdown);
              
              const post = $.Post.new({
                slug,
                rawContent: content,
                metadata,
                markdown,
                html
              });
              
              this.posts().set(slug, post);
            }
          } catch (error) {
            console.error('Error loading posts:', error);
          }
        }
      }),
      $.Method.new({
        name: 'getPost',
        do: function getPost(slug) {
          return this.posts().get(slug);
        }
      }),
      $.Method.new({
        name: 'getAllPosts',
        do: function getAllPosts() {
          return Array.from(this.posts().values()).sort((a, b) => {
            const dateA = a.metadata().date ? new Date(a.metadata().date) : new Date(0);
            const dateB = b.metadata().date ? new Date(b.metadata().date) : new Date(0);
            return dateB - dateA;
          });
        }
      })
    ]
  });

  $.Class.new({
    name: 'BlogServer',
    slots: [
      $.Var.new({ name: 'port', default: 3000 }),
      $.Var.new({ name: 'repository' }),
      $.Var.new({ name: 'server' }),
      $.Method.new({
        name: 'handleRequest',
        do: async function handleRequest(req) {
          const url = new URL(req.url);
          const path = url.pathname;
          this.log('handle', path);
          const headers = { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          };
          if (req.method === "OPTIONS") {
            return new Response(null, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "86400",
              },
            });
          }
          if (path === '/') {
            const posts = this.repository().getAllPosts();
            const json = posts.map(p => ({ name: p.slug(), metadata: p.metadata() }));
            return new Response(JSON.stringify(json), { headers });
          }
          
          if (path.startsWith('/')) {
            const slug = path.replace(/\//g, '');
          this.log('slug',slug);
            const post = this.repository().getPost(slug);
            
            if (post) {
              return new Response(JSON.stringify(post.toJSON()), { headers });
            }
          }
          
          return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers });
        }
      }),
      $.Method.new({
        name: 'start',
        do: async function start() {
          await this.repository().loadPosts();
          
          this.server(Bun.serve({
            port: this.port(),
            fetch: this.handleRequest.bind(this)
          }));
          
          console.log(`Blog server running at http://localhost:${this.port()}`);
        }
      })
    ]
  });

  if (require.main === module) {
    const parser = $.MarkdownParser.new();
    const repository = $.PostRepository.new({ parser });

    const server = $.BlogServer.new({
      port: 3000,
      repository,
    });

    await server.start();
  }

}.module({
  name: 'blog.server',
  imports: [base]
}).load();

