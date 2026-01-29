# FindTeam Backend API

FastAPI backend for finding football teammates.

## Features

- Google OAuth authentication
- User profile management
- Post creation for finding teams/players
- Search functionality
- MySQL database integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
- `DATABASE_URL`: MySQL connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `SECRET_KEY`: JWT secret key

3. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the provided script:
```bash
./run.sh
```

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Database Setup

Create a MySQL database named `findteam` and update the `DATABASE_URL` in `.env` file.

## Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`
6. Copy client ID and secret to `.env` file
