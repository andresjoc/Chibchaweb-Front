import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faGlobe, faBrain } from '@fortawesome/free-solid-svg-icons'
import './Hero.css'

function Hero() {
  const [dominio, setDominio] = useState('')
  const [tipoDominio, setTipoDominio] = useState('normal') // ← para saber si es IA
  const navigate = useNavigate()

  const handleBuscar = () => {
    if (dominio.trim() !== '') {
      navigate(`/dominios?nombre=${encodeURIComponent(dominio.trim())}&tipo=${tipoDominio}`)
    }
  }

  return (
    <section className={`hero-section ${tipoDominio === 'ia' ? 'modo-ia' : ''}`}>
      <h1 className="hero-title">¡Potencia tu presencia online!</h1>
      <p className="hero-subtitle">Encuentra el nombre perfecto para tu sitio web</p>

      {/* Selector de tipo de dominio */}
      <div className="hero-toggle" role="group" aria-label="Seleccionar tipo de búsqueda de dominio">
        <button
          type="button"
          className={tipoDominio === 'normal' ? 'activo' : ''}
          onClick={() => setTipoDominio('normal')}
          aria-pressed={tipoDominio === 'normal'}
        >
          <FontAwesomeIcon icon={faGlobe} className="btn-icon" aria-hidden="true" /> Dominio específico
        </button>
        <button
          type="button"
          className={tipoDominio === 'ia' ? 'activo' : ''}
          onClick={() => setTipoDominio('ia')}
          aria-pressed={tipoDominio === 'ia'}
        >
          <FontAwesomeIcon icon={faBrain} className="btn-icon" aria-hidden="true" /> IA
        </button>
      </div>

      {/* Input + botón */}
      <div className="hero-search">
        <label htmlFor="hero-search-input" className="sr-only">
          {tipoDominio === 'ia' ? "Describe tu idea de dominio" : "Buscar nombre de dominio específico"}
        </label>
        <input
          type="text"
          id="hero-search-input"
          placeholder={tipoDominio === 'ia' ? "Describe tu idea..." : "tusitio.com"}
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          className="hero-input"
        />
        <button className="hero-button" onClick={handleBuscar} type="button">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="btn-icon" aria-hidden="true" /> Buscar dominio
        </button>
      </div>
    </section>
  )
}

export default Hero
