rm -rf out
cp -r public out
bun build src/*.html --outdir=out --sourcemap=linked
bun run template_posts.js
