import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    inicio: "Inicio",
    hosting: "Hosting",
    miPerfil: "Mi perfil",
    misDominios: "Mis dominios",
    soporte: "Soporte",
    carrito: "Carrito",
    iniciarSesion: "Iniciar sesión",
    contacto: "Contacto",
    buscarDominioBtn: "Buscar dominio",
    potenciaOnline: "¡Potencia tu presencia online!",
    encuentraPerfecto: "Encuentra el nombre perfecto para tu sitio web",
    especifico: "Dominio específico",
    generarIA: "Generar Dominio con IA",
    placeholderBuscar: "chibchaweb",
    placeholderIA: "Describe tu idea de negocio",
    puertaDigital: "Tu puerta al mundo digital",
    piePagina: "Navegación del pie de página",
    cerrarSesion: "Cerrar sesión",
    verCarritoLabel: "Ver el carrito de compras"
  },
  en: {
    inicio: "Home",
    hosting: "Hosting",
    miPerfil: "My profile",
    misDominios: "My domains",
    soporte: "Support",
    carrito: "Cart",
    iniciarSesion: "Login",
    contacto: "Contact",
    buscarDominioBtn: "Search domain",
    potenciaOnline: "Power your online presence!",
    encuentraPerfecto: "Find the perfect name for your website",
    especifico: "Specific domain",
    generarIA: "Generate Domain with AI",
    placeholderBuscar: "chibchaweb",
    placeholderIA: "Describe your business idea",
    puertaDigital: "Your gateway to the digital world",
    piePagina: "Footer navigation",
    cerrarSesion: "Logout",
    verCarritoLabel: "View shopping cart"
  }
};

export function LanguageProvider({ children }) {
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('idioma') || 'es';
  });

  useEffect(() => {
    document.documentElement.lang = idioma;
    localStorage.setItem('idioma', idioma);
  }, [idioma]);

  const cambiarIdioma = (nuevoIdioma) => {
    setIdioma(nuevoIdioma);
  };

  const t = (key) => {
    return translations[idioma]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ idioma, cambiarIdioma, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
