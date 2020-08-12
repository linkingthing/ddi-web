VERSION=v1.0.1

build:
	npm run install && npm run build

build-image:
	docker build -t linkingthing/ddi-web:${VERSION} .
	docker image prune -f

clean-image:
	docker rmi linkingthing/ddi-web:${VERSION}