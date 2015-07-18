BROWSERIFY = ./node_modules/.bin/browserify
NPM = npm

npm:
	@echo "Checking for npm..."
	@command -v npm >/dev/null 2>&1 || { echo >&2 "Please install Node.js: https://nodejs.org/"; exit 1;  }

install:
	@echo "Installing dependencies..."
	@$(NPM) install

compile:
	@echo "Running Browserify on your files..."
	@$(BROWSERIFY) js/main.js -o js/humblepress.js
	@echo "All done!"

build: npm install compile

