rm -rf out
cp -r public out
bun run template_posts.js
bun build src/*.html --outdir=out --sourcemap=linked
bun build posts/*.html --outdir=out/posts --sourcemap=linked
