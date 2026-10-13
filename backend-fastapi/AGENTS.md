# Repository Guidelines

## Project Structure & Module Organization

`main.py` exposes the FastAPI app created in `app/__init__.py`. Keep HTTP endpoints in `app/routers/` and application logic in `app/service/`. Shared configuration, SQLModel models, serializers, enums, and utilities live under `common/`. The `data/` directory holds the GeoLite database and maintenance scripts; `Dockerfile` and `fly.toml` define deployment. There is currently no `tests/` directory.

## Build, Test, and Development Commands

- `python -m pip install -r requirements.txt`: install runtime dependencies. Use Python 3.14, matching the Docker image.
- `uvicorn main:app --reload`: run the API locally; `/docs` exposes its interactive documentation.
- `bash format.sh`: run isort, Black, and Ruff with automatic fixes. Install these tools separately as noted in the script.
- `ruff check .`: check lint issues without changing files.
- `docker build -t url-link-api .`: build the production image. Its default command runs Gunicorn with a Uvicorn worker.

Local runs need PostgreSQL and the settings required by `common/config.py`. Set `USER_LOCAL` to your local username to use the configured local database URL.

## Coding Style & Naming Conventions

Use four-space indentation and follow the existing Black formatting. Name modules and functions with `snake_case`, classes with `PascalCase`, and constants with `UPPER_SNAKE_CASE`. Add route handlers to the appropriate router and keep database operations in the shared model or service layer. Run `bash format.sh` before submitting changes.

## Testing Guidelines

No test framework, coverage threshold, or automated test suite is currently configured. For new behavior, add focused tests under `tests/` named `test_*.py`; use `pytest` and document any new test dependency. Run them with `python -m pytest tests` once the dependency is installed. Verify database-backed changes against a disposable PostgreSQL database.

## Commit & Pull Request Guidelines

Git history contains only `first commit`, so no established commit format can be inferred. Use short, imperative subjects that describe the change. In pull requests, summarize the behavior changed, list verification commands and results, and link relevant issues. Include request/response examples for API changes and call out database or configuration changes.

## Security & Configuration

Keep `.env`, credentials, and database dumps out of commits. Review `data/migration.py` before running it: it drops and recreates the target `public` schema.
