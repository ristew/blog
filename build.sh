rm -rf out
bun run template_posts.js
bun build src/*.html src/posts/*.html --outdir=out --sourcemap=linked
