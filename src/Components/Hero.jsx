import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../Context/LanguageContext'
import './Hero.css'

function Hero() {
  const [dominio, setDominio] = useState('')
  const [tipoDominio, setTipoDominio] = useState('normal') // ← para saber si es IA
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleBuscar = () => {
    if (dominio.trim() !== '') {
      navigate(`/dominios?nombre=${encodeURIComponent(dominio.trim())}&tipo=${tipoDominio}`)
    }
  }

  return (
    <section className={`hero-section ${tipoDominio === 'ia' ? 'modo-ia' : ''}`}>
      <h1 className="hero-title">{t('potenciaOnline')}</h1>
      <p className="hero-subtitle">{t('encuentraPerfecto')}</p>

      {/* Selector de tipo de dominio */}
      <div className="hero-toggle" role="group" aria-label="Seleccionar tipo de búsqueda de dominio">
        <button
          type="button"
          className={tipoDominio === 'normal' ? 'activo' : ''}
          onClick={() => setTipoDominio('normal')}
          aria-pressed={tipoDominio === 'normal'}
        >
          {t('especifico')}
        </button>
        <button
          type="button"
          className={tipoDominio === 'ia' ? 'activo' : ''}
          onClick={() => setTipoDominio('ia')}
          aria-pressed={tipoDominio === 'ia'}
        >
          {t('generarIA')}
        </button>
      </div>

      {/* Input + botón */}
      <div className="hero-search">
        <label htmlFor="hero-search-input" className="sr-only">
          {tipoDominio === 'ia' ? t('placeholderIA') : t('placeholderBuscar')}
        </label>
        <input
          type="text"
          id="hero-search-input"
          placeholder={tipoDominio === 'ia' ? t('placeholderIA') + "..." : t('placeholderBuscar') + ".com"}
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          className="hero-input"
        />
        <button className="hero-button" onClick={handleBuscar} type="button">
          {t('buscarDominioBtn')}
        </button>
      </div>
    </section>
  )
}

export default Hero
