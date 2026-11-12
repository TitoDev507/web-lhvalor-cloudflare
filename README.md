# LH Valor — Plataforma Web Corporativa (Cloudflare Pages)

Aplicación web corporativa de alta conversión para **LH Valor**, diseñada bajo una estética híbrida entre firma de inversión de alto nivel (*Fintech / Value Investing*) y boutique de ingeniería de software (*Tech Services*).

## Estructura del Proyecto

- `index.html`: Estructura semántica HTML5 accesible, metadatos SEO, etiquetas Open Graph, Twitter Cards e iconos SVG inline ligeros.
- `styles.css`: Sistema de diseño en CSS moderno con variables (`:root`), enfoque *Mobile-First*, Flexbox, CSS Grid y microinteracciones sutiles.
- `app.js`: Lógica interactiva modular en JavaScript ES6+ nativo (navegación adaptativa, filtro dual de áreas estratégicas, simulador de interés compuesto al 11% CAGR desde 2021, preselección de área de interés y validación de formulario en tiempo real con integración `mailto:`).
- `_headers`: Configuración nativa de cabeceras de seguridad y caché para la CDN de **Cloudflare Pages**.

## Despliegue en Cloudflare Pages

El proyecto es **100% estático** y no requiere pasos de compilación (*build*) ni dependencias externas:

1. Conecta este repositorio en el panel de **Cloudflare Pages** (*Workers & Pages > Create application > Pages > Connect to Git*).
2. En **Build settings**:
   - **Framework preset:** `None`
   - **Build command:** *(dejar vacío)*
   - **Build output directory:** `/` (raíz del proyecto)
3. Haz clic en **Save and Deploy**.

## Canales de Contacto Integrados

- **Correo directo:** `hectorparedesreche@gmail.com`
- **Perfil oficial en X:** [@HParedesR](https://x.com/HParedesR)
