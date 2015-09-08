WATCHIFY = ./node_modules/.bin/watchify
BROWSERIFY = ./node_modules/.bin/browserify
NPM = npm

run: npm install watchify

build: npm install compile

npm:
	@echo "Checking for npm..."
	@command -v npm >/dev/null 2>&1 || { echo >&2 "Please install Node.js: https://nodejs.org/"; exit 1;  }

install:
	@echo "Checking dependencies..."
	@$(NPM) install

compile:
	@echo "Running Browserify on your files..."
	@$(BROWSERIFY) js/main.js -o js/humblepress.js
	@echo "All done!"

watchify:
	@echo "Running Browserify on your files and watching for changes... (Press CTRL-C to stop)"
	@$(WATCHIFY) --verbose -o js/humblepress.js -- js/main.js

.PHONY: build run watchify compile install npm
