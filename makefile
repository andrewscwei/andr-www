.PHONY: all test clean build run

COLOR_PREFIX = "\\033["
COLOR_RESET = "$(COLOR_PREFIX)0m"
COLOR_BLACK = "$(COLOR_PREFIX)0;30m"
COLOR_RED = "$(COLOR_PREFIX)0;31m"
COLOR_GREEN = "$(COLOR_PREFIX)0;32m"
COLOR_YELLOW = "$(COLOR_PREFIX)0;33m"
COLOR_BLUE = "$(COLOR_PREFIX)0;34m"
COLOR_PURPLE = "$(COLOR_PREFIX)0;35m"
COLOR_CYAN = "$(COLOR_PREFIX)0;36m"
COLOR_LIGHT_GRAY = "$(COLOR_PREFIX)0;37m"

namespace:=andrewscwei
project:=andr-www
image:=$(namespace)/$(project)
version:=$(shell cat package.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
env:=production
net:=bridge
host:=$(shell echo $$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'))
port:=8080

ENV:=$(shell echo $$(([[ "$(env)" = "dev" ]] || [[ "$(env)" = "devel" ]] || [[ "$(env)" = "development" ]]) && echo "development" || echo "production"))
SUFFIX:=$(shell echo $$(([[ "$(ENV)" = "development" ]]) && echo "-dev" || echo $(SUFFIX)))

all: build

clean: CONTAINERS:=$(shell echo $$(docker ps -a -q))
clean: IMAGE_NAME:=$(shell echo $(subst /,\\/,$(image)))
clean: IMAGES:=$(shell echo $$(docker images | awk '$$1 ~ /^$(IMAGE_NAME)$$/ {print $$3}'))
clean:
	@docker system prune -f
	@COUNT=$(strip $(shell echo $(CONTAINERS) | wc -w)); \
	if [[ "$$COUNT" != "0" ]]; then \
		echo $(COLOR_YELLOW)"Removing $$COUNT container(s)..."$(COLOR_RESET); \
		docker stop $(CONTAINERS); \
		docker rm $(CONTAINERS); \
	else \
		echo $(COLOR_YELLOW)"No running containers to remove"$(COLOR_RESET); \
	fi
	@COUNT=$(strip $(shell echo $(IMAGES) | wc -w)); \
	if [[ "$$COUNT" != "0" ]]; then \
		echo $(COLOR_YELLOW)"Removing $$COUNT image(s)..."$(COLOR_RESET); \
		docker rmi -f $(IMAGES); \
	else \
		echo $(COLOR_YELLOW)"No images with name "$(COLOR_CYAN)$(IMAGE_NAME)$(COLOR_YELLOW)" to remove"$(COLOR_RESET); \
	fi

build: ENVIRONMENT_VAR_MAPPING:=" \
	--build-arg NODE_ENV=$(ENV) \
	--build-arg GOOGLE_ANALYTICS_ID=$$GOOGLE_ANALYTICS_ID \
	--build-arg SSR_ENABLED=$$SSR_ENABLED \
	--build-arg PRISMIC_API_ENDPOINT=$$PRISMIC_API_ENDPOINT \
	--build-arg PRISMIC_ACCESS_TOKEN=$$PRISMIC_ACCESS_TOKEN"
build:
	@echo "Building "$(COLOR_CYAN)"$(image):$(version)$(SUFFIX)"$(COLOR_RESET)"..."
	@echo
	@docker build -f dockerfile --rm=false $$(echo $(ENVIRONMENT_VAR_MAPPING)) -t $(image):latest$(SUFFIX) .
	@docker tag $(image):latest$(SUFFIX) $(image):$(version)$(SUFFIX)

test:
	@echo "Testing "$(COLOR_CYAN)"$(image):latest$(SUFFIX)"$(COLOR_RESET)"..."
	@echo
	@docker run -it --rm --net=$(net) $$([[ "$(net)" = "bridge" ]] && echo "-e DB_HOST=$(host)" || echo "") -t $(image):latest$(SUFFIX) npm test

run: VOLUME_MAPPING:=$(shell echo " \
	-v $$(pwd)/app:/var/$(project)/app \
	-v $$(pwd)/app.js:/var/$(project)/app.js \
	-v $$(pwd)/logs:/var/$(project)/logs \
	-v $$(pwd)/config:/var/$(project)/config")
run: ENVIRONMENT_VAR_MAPPING:=" \
	-e GOOGLE_ANALYTICS_ID=$$GOOGLE_ANALYTICS_ID \
	-e SSR_ENABLED=$$SSR_ENABLED \
	-e PRISMIC_API_ENDPOINT=$$PRISMIC_API_ENDPOINT \
	-e PRISMIC_ACCESS_TOKEN=$$PRISMIC_ACCESS_TOKEN"
run:
	@echo "Running "$(COLOR_CYAN)"$(image):latest$(SUFFIX)"$(COLOR_RESET)"..."
	@echo

ifeq ($(ENV), development)
	@docker run -it --rm --net=$(net) -p $(port):$(port) --name sybl $$(echo $(VOLUME_MAPPING)) $$(echo $(ENVIRONMENT_VAR_MAPPING)) $(image):latest$(SUFFIX)
else
	@docker run -it --rm --net=$(net) -p $(port):$(port) --name sybl $$(echo $(ENVIRONMENT_VAR_MAPPING)) $(image):latest$(SUFFIX)
endif
