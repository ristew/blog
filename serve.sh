./build.sh
bun x http-server ./out &
bun build src/*.html --outdir=out --sourcemap=linked --watch
