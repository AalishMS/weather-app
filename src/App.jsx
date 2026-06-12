import { useState, useEffect } from 'react'
import CitySearch from './CitySearch'
import './App.css'

const API_KEY = '987c156877d1d787c4ee1698762610d2'

function getWeatherType(code) {
  const prefix = code.slice(0, 2)
  const map = {
    '01': 'clear',
    '02': 'partlyCloudy',
    '03': 'cloudy',
    '04': 'overcast',
    '09': 'rain',
    '10': 'rain',
    '11': 'thunderstorm',
    '13': 'snow',
    '50': 'mist',
  }
  return map[prefix] || 'cloudy'
}

function WeatherIcon({ code, description }) {
  const isNight = code.endsWith('n')
  const type = getWeatherType(code)

  const icons = {
    clear: isNight ? (
      <>
        <path d="M21 14.5A7.5 7.5 0 1 1 9.5 3a5.5 5.5 0 1 0 11.5 11.5z" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
    partlyCloudy: (
      <>
        {!isNight && (
          <>
            <circle cx="17" cy="7" r="2.5" />
            <path d="M17 3.5v1M17 10.5v1M20.5 7h-1M14.5 7h-1M19.6 4.4l-.7.7M14.1 9.9l-.7.7M19.6 9.6l-.7-.7M14.1 4.1l-.7-.7" />
          </>
        )}
        {isNight && <path d="M18 10.5A5 5 0 1 1 10 4a3.5 3.5 0 1 0 8 6.5z" />}
        <path d="M7 18h9a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.5" />
      </>
    ),
    cloudy: (
      <path d="M7 18h9a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.5" />
    ),
    overcast: (
      <>
        <path d="M6 16h10a3.5 3.5 0 0 0 0-7 4.5 4.5 0 0 0-8.6 1.2" />
        <path d="M10 20h8a3 3 0 0 0 0-6" />
      </>
    ),
    rain: (
      <>
        <path d="M7 14h9a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.5" />
        <path d="M9 18v3M13 18v3M17 18v3" />
      </>
    ),
    thunderstorm: (
      <>
        <path d="M7 13h9a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.5" />
        <path d="M13 16l-2 4h3l-2 4" />
      </>
    ),
    snow: (
      <>
        <path d="M7 14h9a4 4 0 0 0 0-8 5 5 0 0 0-9.7 1.5" />
        <path d="M8 18h.01M12 18h.01M16 18h.01M10 20h.01M14 20h.01" />
      </>
    ),
    mist: (
      <>
        <path d="M6 12h12M5 16h14M7 20h10" />
      </>
    ),
  }

  return (
    <svg
      className="weather-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={description}
      role="img"
    >
      {icons[type]}
    </svg>
  )
}

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (cityName, lat = null, lon = null) => {
    if (!cityName.trim()) return

    setLoading(true)
    setError('')

    try {
      const url = lat != null && lon != null
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName.trim())}&appid=${API_KEY}&units=metric`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? 'City not found. Check the spelling and try again.'
            : 'Unable to fetch weather. Please try again later.'
        )
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCitySearch = (query) => {
    fetchWeather(query)
  }

  const handleCitySelect = (name, lat, lon) => {
    fetchWeather(name, lat, lon)
  }

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  useEffect(() => {
    fetchWeather('London')
  }, [])

  return (
    <div className="app">
      <div className="weather-container">
        <div className="header">
          <h1>Weather</h1>
          <p className="date">{formatDate()}</p>
        </div>

        <CitySearch onSearch={handleCitySearch} onSelectCity={handleCitySelect} />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-info">
            <div className="location">
              <h2>{weather.name}</h2>
              <p>{weather.sys.country}</p>
            </div>

            <div className="weather-main">
              <WeatherIcon
                code={weather.weather[0].icon}
                description={weather.weather[0].description}
              />
              <div className="temperature-wrap">
                <div className="temperature">
                  <h1>{Math.round(weather.main.temp)}°</h1>
                  <p className="description">{weather.weather[0].description}</p>
                </div>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <div>
                  <p className="detail-label">Feels Like</p>
                  <p className="detail-value">{Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

              <div className="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                  <circle cx="12" cy="12" r="5"></circle>
                </svg>
                <div>
                  <p className="detail-label">Humidity</p>
                  <p className="detail-value">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <div>
                  <p className="detail-label">Wind Speed</p>
                  <p className="detail-value">{weather.wind.speed} m/s</p>
                </div>
              </div>

              <div className="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
                <div>
                  <p className="detail-label">Pressure</p>
                  <p className="detail-value">{weather.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
