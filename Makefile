# Minimal makefile for Sphinx documentation
#

IMAGE         = ifxvue

.PHONY: Makefile build run container
container:
	docker build -t $(IMAGE) .
run: container
	docker run --rm -it -v `pwd`:/app/frontend $(IMAGE)
build-no-cache:
	rm -rf node_modules/
	npm cache clean --force && npm cache verify
	yarn
	yarn build
build:
	yarn build
