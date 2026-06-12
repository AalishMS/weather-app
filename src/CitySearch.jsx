import { useState, useEffect, useRef } from 'react'
import './CitySearch.css'

const API_KEY = '987c156877d1d787c4ee1698762610d2'

function CitySearch({ onSearch, onSelectCity }) {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const debounceTimerRef = useRef(null)
  const suggestionsRef = useRef(null)
  const abortControllerRef = useRef(null)
  const suggestionRefs = useRef([])

  const fetchSuggestions = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
        { signal: controller.signal }
      )
      if (!response.ok) throw new Error()
      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(data.length > 0)
      setLoadingSuggestions(false)
    } catch (err) {
      if (err.name === 'AbortError') return
      console.warn('City suggestions failed:', err.message)
      setSuggestions([])
      setShowSuggestions(false)
      setLoadingSuggestions(false)
    }
  }

  const handleCityChange = (e) => {
    const value = e.target.value
    setCity(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (value.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      setLoadingSuggestions(false)
      return
    }

    setLoadingSuggestions(true)
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value.trim())
    }, 300)
  }

  const handleSuggestionSelect = (suggestion) => {
    setCity(suggestion.name)
    setSuggestions([])
    setShowSuggestions(false)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    onSelectCity(suggestion.name, suggestion.lat, suggestion.lon)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          handleSuggestionSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    setSelectedIndex(-1)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    onSearch(city)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <div className="search-wrapper" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={handleCityChange}
          onKeyDown={handleKeyDown}
          className="search-input"
          aria-label="City name"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-controls="suggestions-listbox"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          autoComplete="off"
        />
        {loadingSuggestions && <span className="suggestion-loading" />}
        <button type="submit" className="search-button" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <ul id="suggestions-listbox" className="suggestions-dropdown" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={`${s.lat}-${s.lon}`}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={selectedIndex === i}
              className="suggestion-item"
              ref={(el) => { suggestionRefs.current[i] = el }}
              onClick={() => handleSuggestionSelect(s)}
            >
              <span className="suggestion-name">{s.name}</span>
              <span className="suggestion-meta">
                {s.state ? `${s.state}, ` : ''}{s.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CitySearch
