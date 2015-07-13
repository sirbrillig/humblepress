run:
	@echo "Installing dependencies..."
	@echo
	@command -v npm >/dev/null 2>&1 || { echo >&2 "I need npm (part of Node.js) to continue but it's not installed. You can install it here: https://nodejs.org/"; exit 1;  }
	@npm install
	@echo "Starting Grunt to watch for changes... (press Ctrl-C to stop)"
	@echo
	@grunt
