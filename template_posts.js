import { base, __ } from 'simulabra';
import { marked } from 'marked';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
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
      }),
      $.Method.new({
        name: 'template',
        do() {
          return `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/src/style.css">
    <title>rileystew.art - ${this.metadata().title}</title>
  </head>
  <body>
    <h3>${this.metadata().title}</h3>
    ${this.html()}
  </body>
</html>
`
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
          const postsDir = join(import.meta.dir, 'posts');
          
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

  if (require.main === module) {
    const parser = $.MarkdownParser.new();
    const repository = $.PostRepository.new({ parser });
    await repository.loadPosts();
    const outDir = join(import.meta.dir, 'out')
    const postsOutDir = join(outDir, 'posts')
    try {
      await mkdir(postsOutDir, { recursive: true });
    } catch (error) {
      console.error('Error creating output directory:', error);
    }
    
    // Write each post to a file
    for (const post of repository.getAllPosts()) {
      const filename = `${post.slug()}.html`;
      const filepath = join(postsOutDir, filename);
      
      try {
        await writeFile(filepath, post.template());
        console.log(`Wrote: ${filepath}`);
      } catch (error) {
        console.error(`Error writing ${filename}:`, error);
      }
    }
    process.exit(0);
  }

}.module({
  name: 'blog.server',
  imports: [base]
}).load();

