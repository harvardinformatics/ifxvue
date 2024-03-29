# Minimal makefile for Sphinx documentation
#

IMAGE         = ifxvue

.PHONY: Makefile build run container
container:
	docker build -t $(IMAGE) . 
run: container
	docker run --rm -it -p 8080:8080 -v `pwd`:/app $(IMAGE)
build-no-cache:
	rm -rf node_modules/
	npm cache clean --force && npm cache verify
	npm install .
	npm run-script build
build:
	npm run-script build
serve:
	yarn serve
