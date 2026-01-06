## Freelance Talent Hub API

ASP.NET Core Web API for Freelance Talent Hub. Provides CRUD endpoints for talent profiles (photographers, DJs, designers, etc.), stores data in SQLite, and saves uploaded images to `wwwroot/images`. The React + Vite frontend lives in `popstar-frontend`.

### Project overview
- Full-stack app for managing freelance talent profiles with search, CRUD, and portfolio image uploads.
- Frontend client for browsing and maintaining listings, backed by a REST API.
- Lightweight local setup with separate dev servers for client and API.

### Tech stack
- Frontend: React 19, Vite, React Router, Axios, Bootstrap, CSS variables
- Backend: ASP.NET Core Web API (.NET 8), SQLite, file uploads

### Endpoints
- `GET /api/talent` - list all talent profiles
- `GET /api/talent/{id}` - retrieve a single profile
- `GET /api/talent/search?name=` - filter by name fragment
- `POST /api/talent` - create a profile with multipart form data (name, category, hourly rate, optional email/phone, optional image)
- `PUT /api/talent/{id}` - update core fields and optionally replace the portfolio image
- `DELETE /api/talent/{id}` - remove a profile (and its stored image)

### Requirements
- .NET SDK 8.0 (or compatible)

### How to run
```bash
cd PopStarManagerAPI
dotnet run
```

The API listens on `http://localhost:5071` by default.

### How to run the full project
Run the API and frontend in separate terminals:

```bash
cd PopStarManagerAPI
dotnet run
```

```bash
cd popstar-frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5071`. If you need a different host or port, create `popstar-frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5071
```

The frontend runs at `http://localhost:5173`.

### Data and storage
- SQLite database file: `TalentHub.db`
- Uploaded images: `wwwroot/images`
