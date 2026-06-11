# Weather App

A minimalist, dark-themed weather application built with React and Vite. Get real-time weather data for any city worldwide with a clean, elegant interface.

## Features

- **Real-time weather** — Live data from the OpenWeather API
- **Global search** — Find weather for any city
- **Dark & minimal UI** — Clean, subdued design with subtle noise texture
- **Weather icons** — Custom SVG icons for every condition (clear, cloudy, rain, snow, thunderstorm, mist)
- **Responsive** — Works seamlessly on mobile and desktop
- **Smooth animations** — Fade-in and slide-up transitions
- **Key metrics** — Temperature, feels like, humidity, wind speed, pressure

## Tech Stack

- React 19
- Vite 7
- OpenWeather API
- CSS custom properties

## Getting Started

```bash
git clone https://github.com/AalishMS/weather-app.git
cd weather_app
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. The app defaults to showing London's weather; use the search bar to look up any city.

### API Key

The app ships with a demo API key. For production, get your own free key at [openweathermap.org/api](https://openweathermap.org/api) and replace the `API_KEY` in `src/App.jsx`.

## Build

```bash
npm run build
npm run preview
```

Static output goes to the `dist/` directory.

## Project Structure

```
weather_app/
├── src/
│   ├── App.jsx        # Main app component
│   ├── App.css        # App styles
│   ├── index.css      # Global styles & variables
│   └── main.jsx       # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Deployment

[![Deployed on Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://weather-app-rouge-one-78.vercel.app)

Deployed via Vercel with automatic CI/CD on push to `master`.

## License

MIT
