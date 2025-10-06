## Freelance Talent Hub (API)

ASP.NET Core Web API backing the Freelance Talent Hub frontend. It exposes CRUD endpoints for managing talent profiles (photographers, DJs, designers, etc.), stores portfolio metadata in SQLite, and handles image uploads to `wwwroot/images`.

### Endpoints
- `GET /api/talent` - list all talent profiles
- `GET /api/talent/{id}` - retrieve a single profile
- `GET /api/talent/search?name=` - filter by name fragment
- `POST /api/talent` - create a profile with multipart form data (name, category, hourly rate, optional email/phone, optional image)
- `PUT /api/talent/{id}` - update core fields and optionally replace the portfolio image
- `DELETE /api/talent/{id}` - remove a profile (and its stored image)

### Development
```bash
cd PopStarManagerAPI
dotnet run
```

The API listens on `http://localhost:5071` by default and persists data to `TalentHub.db`.
