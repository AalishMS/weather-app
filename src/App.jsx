import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = '987c156877d1d787c4ee1698762610d2'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error('City not found')
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

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather(city)
  }

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  }

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  useEffect(() => {
    // Load default city on mount
    fetchWeather('London')
  }, [])

  return (
    <div className="app">
      <div className="weather-container">
        <div className="header">
          <h1>Weather App</h1>
          <p className="date">{formatDate()}</p>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </form>

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
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                className="weather-icon"
              />
              <div className="temperature">
                <h1>{Math.round(weather.main.temp)}°</h1>
                <p className="description">{weather.weather[0].description}</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <div>
                  <p className="detail-label">Feels Like</p>
                  <p className="detail-value">{Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

              <div className="detail-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                  <circle cx="12" cy="12" r="5"></circle>
                </svg>
                <div>
                  <p className="detail-label">Humidity</p>
                  <p className="detail-value">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="detail-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <div>
                  <p className="detail-label">Wind Speed</p>
                  <p className="detail-value">{weather.wind.speed} m/s</p>
                </div>
              </div>

              <div className="detail-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
