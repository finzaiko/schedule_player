install:
	npm i
	cd app && npm i
	cd app && npm run build
	mkdir -p public/assets
	cp app/codebase/* public/assets/
	cp -r app/node_modules/webix public/assets/
	cp -r app/node_modules/@mdi public/assets/

setup:
	$(shell ./install-build.sh)


clean:
	rm -rf public/assets/*