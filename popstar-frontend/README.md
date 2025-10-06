## Freelance Talent Hub (Frontend)

A responsive React + Vite client for curating freelance creatives and event specialists. Profile managers can browse talent cards, filter by name or specialty, add new profiles with portfolio images, and update or remove existing listings against the ASP.NET Web API backend.

### Features
- Accessible layout with semantic landmarks, keyboard-focused navigation, and live status messaging.
- Talent directory with instant search, profile cards, and optimistic deletion feedback.
- Built-in contact CTA that surfaces email/phone details with a Book Now button for each profile.
- Guided forms for creating and editing talent profiles, including portfolio image uploads.
- Custom design system built with CSS variables to ensure consistent styling and responsive grids.

### Getting Started
```bash
cd popstar-frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a `.env` file if the API runs on another host or port.

The development server runs on `http://localhost:5173` and expects the API running at `http://localhost:5071/api/talent`.

### Build
```bash
npm run build
```


