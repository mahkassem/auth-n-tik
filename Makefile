# auth-n-tik Application Makefile
# Author: Mahmoud Kassem

# Default shell for command execution
SHELL := /bin/zsh

# Variables
WEB_DIR := packages/web
API_DIR := packages/api

# Colors for pretty output
CYAN := "\033[0;36m"
GREEN := "\033[0;32m"
YELLOW := "\033[0;33m"
NC := "\033[0m" # No Color

.PHONY: help install install-all install-web install-api
.PHONY: docker-up docker-down docker-restart
.PHONY: web-dev web-start web-build web-lint
.PHONY: api-dev api-start api-build api-lint api-dev-env api-prod-env api-test-env api-test api-test-e2e
.PHONY: build-all lint-all start-all dev-all start-stack stop-all
.PHONY: patch minor major patch-web minor-web major-web patch-api minor-api major-api
.PHONY: patch-all minor-all major-all

# Help command
help:
	@echo $(CYAN)"\nauth-n-tik Makefile Commands:"$(NC)
	@echo $(YELLOW)"Installation:"$(NC)
	@echo "  make install      - Install dependencies for root project"
	@echo "  make install-all  - Install dependencies for all projects (root, web, api)"
	@echo "  make install-web  - Install dependencies for web only"
	@echo "  make install-api  - Install dependencies for api only"
	@echo
	@echo $(YELLOW)"Docker Commands:"$(NC)
	@echo "  make docker-up     - Start Docker services"
	@echo "  make docker-down   - Stop Docker services"
	@echo "  make docker-restart - Restart Docker services"
	@echo
	@echo $(YELLOW)"Web Commands:"$(NC)
	@echo "  make web-dev   - Run web in development mode"
	@echo "  make web-start - Run web in production mode"
	@echo "  make web-build - Build web application"
	@echo "  make web-lint  - Lint web application"
	@echo
	@echo $(YELLOW)"API Commands:"$(NC)
	@echo "  make api-dev   - Run API in development mode"
	@echo "  make api-start - Run API in production mode"
	@echo "  make api-build - Build API application" 
	@echo "  make api-lint  - Lint API application"
	@echo
	@echo $(YELLOW)"Combined Commands:"$(NC)
	@echo "  make build-all   - Build web and API applications"
	@echo "  make lint-all    - Lint web and API applications"
	@echo "  make dev-all     - Run both web and API in development mode"
	@echo "  make start-all   - Run both web and API in production mode"
	@echo "  make start-stack - Start Docker and run dev-all (full development environment)"
	@echo "  make stop-all    - Stop all running services (Docker, web, API)"
	@echo
	@echo $(YELLOW)"Version Management:"$(NC)
	@echo "  make patch       - Increment patch version (e.g., 0.1.0 → 0.1.1)"
	@echo "  make minor       - Increase minor version (e.g., 0.0.1 → 0.1.0)"
	@echo "  make major       - Increase major version (e.g., 0.1.21 → 1.0.0)"
	@echo "  make patch-web   - Increment patch version for web package and root"
	@echo "  make minor-web   - Increase minor version for web package and root"
	@echo "  make major-web   - Increase major version for web package and root"
	@echo "  make patch-api   - Increment patch version for api package and root"
	@echo "  make minor-api   - Increase minor version for api package and root"
	@echo "  make major-api   - Increase major version for api package and root"
	@echo "  make patch-all   - Increment patch version for both web and api packages"
	@echo "  make minor-all   - Increase minor version for both web and api packages"
	@echo "  make major-all   - Increase major version for both web and api packages"
	@echo

# Default command
.DEFAULT_GOAL := help

# Installation commands
install:
	@echo $(GREEN)"Installing root dependencies..."$(NC)
	npm install

install-web:
	@echo $(GREEN)"Installing web dependencies..."$(NC)
	cd $(WEB_DIR) && npm install

install-api:
	@echo $(GREEN)"Installing API dependencies..."$(NC)
	cd $(API_DIR) && npm install

install-all: install install-web install-api
	@echo $(GREEN)"All dependencies installed successfully!"$(NC)

# Docker commands
docker-up:
	@echo $(GREEN)"Starting Docker services..."$(NC)
	docker-compose up -d
	@echo $(GREEN)"Docker services started in the background"$(NC)

docker-down:
	@echo $(GREEN)"Stopping Docker services..."$(NC)
	docker-compose down
	@echo $(GREEN)"Docker services stopped"$(NC)

docker-restart: docker-down docker-up
	@echo $(GREEN)"Docker services restarted successfully!"$(NC)

# Web commands
web-dev:
	@echo $(GREEN)"Starting web in development mode..."$(NC)
	@make stop-all
	cd $(WEB_DIR) && npm run dev

web-start:
	@echo $(GREEN)"Starting web in production mode..."$(NC)
	cd $(WEB_DIR) && npm run start

web-build:
	@echo $(GREEN)"Building web application..."$(NC)
	cd $(WEB_DIR) && npm run build

web-lint:
	@echo $(GREEN)"Linting web application..."$(NC)
	cd $(WEB_DIR) && npm run lint

# API commands
api-dev:
	cd $(API_DIR) && npm run start:dev

api-start:
	cd $(API_DIR) && npm run start:prod

api-build:
	cd $(API_DIR) && npm run build

api-lint:
	cd $(API_DIR) && npm run lint

# API environment-specific commands
api-dev-env:
	@echo $(GREEN)"Starting API in development environment..."$(NC)
	cd $(API_DIR) && NODE_ENV=development npm run start:dev

api-prod-env:
	@echo $(GREEN)"Starting API in production environment..."$(NC)
	cd $(API_DIR) && NODE_ENV=production npm run start:prod

api-test-env:
	@echo $(GREEN)"Starting API in test environment..."$(NC)
	cd $(API_DIR) && NODE_ENV=test npm run start

api-test:
	@echo $(GREEN)"Running API tests..."$(NC)
	cd $(API_DIR) && NODE_ENV=test npm run test

api-test-e2e:
	@echo $(GREEN)"Running API e2e tests..."$(NC)
	cd $(API_DIR) && NODE_ENV=test npm run test:e2e

# Combined commands
build-all:
	@echo $(GREEN)"Building all applications..."$(NC)
	npm run build:all

lint-all:
	@echo $(GREEN)"Linting all applications..."$(NC)
	npm run lint:all

# Run both web and API in development mode
dev-all:
	@echo $(GREEN)"Starting web and API in development mode..."$(NC)
	@make docker-up
	@echo $(GREEN)"Running both services concurrently. Press Ctrl+C to stop."$(NC)
	npm run dev:all

# Run both web and API in production mode
start-all:
	@echo $(GREEN)"Starting web and API in production mode..."$(NC)
	@echo $(YELLOW)"Use 'make docker-up' first if you need the database"$(NC)
	@echo $(GREEN)"Starting API and web servers..."$(NC)
	npm run start:api & npm run start:web

# Start the complete stack: docker + web + api
start-stack: docker-up
	@echo $(GREEN)"Starting complete development stack..."$(NC)
	@make stop-all
	@sleep 2  # Give Docker time to initialize
	make dev-all

# Stop all running processes
stop-all:
	@echo $(YELLOW)"Stopping all running services..."$(NC)
	@pkill -f "node.*start:dev" || true
	@pkill -f "node.*next dev" || true
	@pkill -f "node.*start" || true
	@echo $(YELLOW)"Killing processes on ports 3000 and 8000..."$(NC)
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@make docker-down
	@echo $(GREEN)"All services stopped"$(NC)

# Version management commands
.PHONY: patch minor major

patch:
	@echo $(GREEN)"Incrementing patch version..."$(NC)
	@current_version=$$(node -e "const pkg = require('./package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	if [ "$$patch" -ge "9" ]; then \
		if [ "$$minor" -ge "9" ]; then \
			new_major=$$((major + 1)); \
			new_version="$$new_major.0.0"; \
		else \
			new_minor=$$((minor + 1)); \
			new_version="$$major.$$new_minor.0"; \
		fi; \
	else \
		new_patch=$$((patch + 1)); \
		new_version="$$major.$$minor.$$new_patch"; \
	fi; \
	echo $(YELLOW)"Current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	echo $(GREEN)"Version updated successfully!"$(NC)

minor:
	@echo $(GREEN)"Increasing minor version..."$(NC)
	@current_version=$$(node -e "const pkg = require('./package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	new_minor=$$((minor + 1)); \
	new_version="$$major.$$new_minor.0"; \
	echo $(YELLOW)"Current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	echo $(GREEN)"Version updated successfully!"$(NC)

major:
	@echo $(GREEN)"Increasing major version..."$(NC)
	@current_version=$$(node -e "const pkg = require('./package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	new_major=$$((major + 1)); \
	new_version="$$new_major.0.0"; \
	echo $(YELLOW)"Current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	echo $(GREEN)"Version updated successfully!"$(NC)

# Web package version commands
patch-web:
	@echo $(GREEN)"Incrementing patch version for web package and root..."$(NC)
	# Update web package
	@current_version=$$(node -e "const pkg = require('./$(WEB_DIR)/package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	if [ "$$patch" -ge "9" ]; then \
		if [ "$$minor" -ge "9" ]; then \
			new_major=$$((major + 1)); \
			new_version="$$new_major.0.0"; \
		else \
			new_minor=$$((minor + 1)); \
			new_version="$$major.$$new_minor.0"; \
		fi; \
	else \
		new_patch=$$((patch + 1)); \
		new_version="$$major.$$minor.$$new_patch"; \
	fi; \
	echo $(YELLOW)"Web package current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./$(WEB_DIR)/package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./$(WEB_DIR)/package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	# Also patch root package
	@make patch
	echo $(GREEN)"Version updated successfully for web package and root!"$(NC)

minor-web:
	@echo $(GREEN)"Increasing minor version for web package and root..."$(NC)
	# Update web package
	@current_version=$$(node -e "const pkg = require('./$(WEB_DIR)/package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	new_minor=$$((minor + 1)); \
	new_version="$$major.$$new_minor.0"; \
	echo $(YELLOW)"Web package current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./$(WEB_DIR)/package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./$(WEB_DIR)/package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	# Also update root package with same version
	@make minor
	echo $(GREEN)"Version updated successfully for web package and root!"$(NC)

major-web:
	@echo $(GREEN)"Increasing major version for web package and root..."$(NC)
	# Update web package
	@current_version=$$(node -e "const pkg = require('./$(WEB_DIR)/package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	new_major=$$((major + 1)); \
	new_version="$$new_major.0.0"; \
	echo $(YELLOW)"Web package current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./$(WEB_DIR)/package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./$(WEB_DIR)/package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	# Also update root package with same version
	@make major
	echo $(GREEN)"Version updated successfully for web package and root!"$(NC)

# API package version commands
patch-api:
	@echo $(GREEN)"Incrementing patch version for api package and root..."$(NC)
	# Update api package
	@current_version=$$(node -e "const pkg = require('./$(API_DIR)/package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	if [ "$$patch" -ge "9" ]; then \
		if [ "$$minor" -ge "9" ]; then \
			new_major=$$((major + 1)); \
			new_version="$$new_major.0.0"; \
		else \
			new_minor=$$((minor + 1)); \
			new_version="$$major.$$new_minor.0"; \
		fi; \
	else \
		new_patch=$$((patch + 1)); \
		new_version="$$major.$$minor.$$new_patch"; \
	fi; \
	echo $(YELLOW)"API package current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./$(API_DIR)/package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./$(API_DIR)/package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	# Also update root package with same version
	@make patch
	echo $(GREEN)"Version updated successfully for api package and root!"$(NC)

minor-api:
	@echo $(GREEN)"Increasing minor version for api package and root..."$(NC)
	# Update api package
	@current_version=$$(node -e "const pkg = require('./$(API_DIR)/package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	new_minor=$$((minor + 1)); \
	new_version="$$major.$$new_minor.0"; \
	echo $(YELLOW)"API package current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./$(API_DIR)/package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./$(API_DIR)/package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	# Also update root package with same version
	@make minor
	echo $(GREEN)"Version updated successfully for api package and root!"$(NC)

major-api:
	@echo $(GREEN)"Increasing major version for api package and root..."$(NC)
	# Update api package
	@current_version=$$(node -e "const pkg = require('./$(API_DIR)/package.json'); console.log(pkg.version)"); \
	IFS='.' read -r major minor patch <<< "$$current_version"; \
	new_major=$$((major + 1)); \
	new_version="$$new_major.0.0"; \
	echo $(YELLOW)"API package current version: $$current_version → New version: $$new_version"$(NC); \
	node -e "const fs = require('fs'); const pkg = require('./$(API_DIR)/package.json'); pkg.version = '$$new_version'; fs.writeFileSync('./$(API_DIR)/package.json', JSON.stringify(pkg, null, 2) + '\n')"; \
	# Also update root package with same version
	@make major
	echo $(GREEN)"Version updated successfully for api package and root!"$(NC)

# Version commands for all packages
patch-all:
	@echo $(GREEN)"Incrementing patch version for both web and api packages..."$(NC)
	@make patch-web
	@make patch-api
	@echo $(GREEN)"Patch version updated successfully for all packages!"$(NC)

minor-all:
	@echo $(GREEN)"Increasing minor version for both web and api packages..."$(NC)
	@make minor-web
	@make minor-api
	@echo $(GREEN)"Minor version updated successfully for all packages!"$(NC)

major-all:
	@echo $(GREEN)"Increasing major version for both web and api packages..."$(NC)
	@make major-web
	@make major-api
	@echo $(GREEN)"Major version updated successfully for all packages!"$(NC)
