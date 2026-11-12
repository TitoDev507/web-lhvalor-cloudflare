/**
 * ============================================================================
 * LH VALOR — LÓGICA INTERACTIVA PRINCIPAL (app.js)
 * Arquitectura modular en JavaScript ES6+ nativo, sin dependencias externas.
 * Optimizado para despliegue estático en Cloudflare Pages.
 * ============================================================================
 */

(() => {
  'use strict';

  /**
   * Configuración y constantes globales de la aplicación
   */
  const CONFIG = {
    recipientEmail: 'hectorparedesreche@gmail.com',
    cagrRate: 0.11,
    baseCapital: 100000,
    validInterests: [
      'Inversión en Renta Variable',
      'Servicios Digitales / Web',
      'Ambos',
    ],
    serviceDescriptions: {
      corporativo:
        '<strong>Presencia institucional de élite:</strong> Diseñamos landing pages y portales corporativos rápidos, seguros y adaptados a dispositivos móviles que convierten visitantes en oportunidades reales de negocio.',
      aplicaciones:
        '<strong>Ingeniería de software a medida:</strong> Desarrollamos aplicaciones web interactivas, paneles de gestión, calculadoras financieras y portales de cliente con arquitectura moderna y escalable.',
      optimizacion:
        '<strong>Rendimiento y conversión empresarial:</strong> Modernizamos activos digitales existentes, optimizamos Core Web Vitals, posicionamiento SEO técnico y flujos de captación comercial.',
    },
    messagePlaceholders: {
      'Inversión en Renta Variable':
        'Indícanos tu horizonte de inversión aproximado o cualquier consulta sobre la filosofía y condiciones del Fondo de Renta Variable...',
      'Servicios Digitales / Web':
        'Cuéntanos qué tipo de sitio web corporativo, aplicación a medida o solución digital necesitas para tu empresa...',
      Ambos:
        'Cuéntanos cómo podemos ayudarte tanto en la gestión patrimonial en Renta Variable como en el desarrollo de tu proyecto digital...',
    },
  };

  /**
   * Estado interno para conservar la última consulta generada
   */
  const appState = {
    lastFormattedMailBody: '',
    lastMailtoUrl: '',
  };

  /* ==========================================================================
     1. NAVEGACIÓN PRINCIPAL, MENÚ MÓVIL Y OBSERVADOR DE SECCIONES
     ========================================================================== */
  function initNavbar() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Control de apariencia del header al hacer scroll
    const handleScroll = () => {
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Función para cerrar el menú móvil
    const closeMobileMenu = () => {
      if (!menuToggle || !navMenu) return;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      navMenu.classList.remove('is-open');
    };

    // Alternar menú en dispositivos móviles
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        menuToggle.setAttribute('aria-expanded', String(nextState));
        menuToggle.setAttribute(
          'aria-label',
          nextState ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        );
        navMenu.classList.toggle('is-open', nextState);
      });

      // Cerrar menú al pulsar cualquier enlace interno del menú
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
      });

      // Cerrar con tecla Escape
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
          closeMobileMenu();
          menuToggle.focus();
        }
      });
    }

    // Resaltar enlace activo según la sección visible en pantalla
    const sections = [
      document.getElementById('inicio'),
      document.getElementById('renta-variable'),
      document.getElementById('servicios-digitales'),
      document.getElementById('filosofia'),
      document.getElementById('contacto'),
    ].filter(Boolean);

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const activeId = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                const targetSection = link.getAttribute('data-nav-section');
                link.classList.toggle('active', targetSection === activeId);
              });
            }
          });
        },
        {
          rootMargin: '-28% 0px -55% 0px',
          threshold: 0.05,
        }
      );

      sections.forEach((section) => observer.observe(section));
    }
  }

  /* ==========================================================================
     2. SECCIÓN DUAL INTERACTIVA (LAS DOS PATAS ESTRATÉGICAS)
     ========================================================================== */
  function initStrategicPillars() {
    const filterButtons = document.querySelectorAll('[data-pillar-filter]');
    const pillarsGrid = document.getElementById('pillars-grid');
    const pillarCards = document.querySelectorAll('[data-pillar-category]');
    const heroFocusButtons = document.querySelectorAll('[data-focus-pillar]');

    // Función para aplicar el filtro de visualización de las dos patas
    const applyPillarFilter = (filterValue) => {
      filterButtons.forEach((btn) => {
        const isMatch = btn.getAttribute('data-pillar-filter') === filterValue;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', String(isMatch));
      });

      if (pillarsGrid) {
        pillarsGrid.classList.toggle('single-focus', filterValue !== 'all');
      }

      pillarCards.forEach((card) => {
        const category = card.getAttribute('data-pillar-category');
        const shouldShow = filterValue === 'all' || category === filterValue;
        card.classList.toggle('is-hidden', !shouldShow);
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-pillar-filter') || 'all';
        applyPillarFilter(filterValue);
      });
    });

    // Si se pulsa un botón del Hero o navegación hacia una pata oculta, mostrar todas y resaltar
    const ensurePillarVisibleAndHighlight = (category) => {
      applyPillarFilter('all');
      const targetCard = document.querySelector(
        `[data-pillar-category="${category}"]`
      );
      if (targetCard) {
        targetCard.classList.remove('is-highlighted');
        // Forzar reflow para reiniciar animación
        void targetCard.offsetWidth;
        targetCard.classList.add('is-highlighted');
      }
    };

    heroFocusButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pillar = btn.getAttribute('data-focus-pillar');
        if (pillar) {
          ensurePillarVisibleAndHighlight(pillar);
        }
      });
    });

    // Enlaces del menú que apuntan a #renta-variable o #servicios-digitales
    document
      .querySelectorAll('a[href="#renta-variable"], a[href="#servicios-digitales"]')
      .forEach((anchor) => {
        anchor.addEventListener('click', () => {
          const href = anchor.getAttribute('href');
          if (href === '#renta-variable') {
            ensurePillarVisibleAndHighlight('finance');
          } else if (href === '#servicios-digitales') {
            ensurePillarVisibleAndHighlight('tech');
          }
        });
      });

    // Simulador de Interés Compuesto (11% CAGR) en Pata 1
    const horizonButtons = document.querySelectorAll('[data-years]');
    const simHorizonLabel = document.getElementById('sim-horizon-label');
    const simFinalValue = document.getElementById('sim-final-value');
    const simMultiplier = document.getElementById('sim-multiplier');

    const currencyFormatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });

    const numberFormatter = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const updateCompoundSimulation = (years) => {
      const numericYears = Number(years) || 10;
      const finalAmount =
        CONFIG.baseCapital * Math.pow(1 + CONFIG.cagrRate, numericYears);
      const multiplier = finalAmount / CONFIG.baseCapital;

      if (simHorizonLabel) {
        simHorizonLabel.textContent = `Valor estimado (${numericYears} años)`;
      }
      if (simFinalValue) {
        simFinalValue.textContent = currencyFormatter.format(finalAmount);
      }
      if (simMultiplier) {
        simMultiplier.textContent = `${numberFormatter.format(multiplier)}x`;
      }
    };

    horizonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        horizonButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        updateCompoundSimulation(btn.getAttribute('data-years'));
      });
    });

    // Pestañas interactivas de Servicios Digitales en Pata 2
    const serviceTabs = document.querySelectorAll('[data-service-tab]');
    const servicePreviewText = document.getElementById('service-preview-text');

    serviceTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-service-tab');
        serviceTabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', String(active));
        });

        if (servicePreviewText && key && CONFIG.serviceDescriptions[key]) {
          servicePreviewText.innerHTML = CONFIG.serviceDescriptions[key];
        }
      });
    });
  }

  /* ==========================================================================
     3. PRESELECCIÓN DE ÁREA DE INTERÉS Y FORMULARIO DE CAPTACIÓN DE LEADS
     ========================================================================== */
  function initLeadForm() {
    const form = document.getElementById('lead-form');
    const successBox = document.getElementById('form-success');
    const preselectBanner = document.getElementById('preselect-banner');
    const preselectBannerText = document.getElementById('preselect-banner-text');

    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const selectInteres = document.getElementById('interes');
    const inputMensaje = document.getElementById('mensaje');
    const charCounter = document.getElementById('char-counter');

    const interestPills = document.querySelectorAll('[data-interest-value]');
    const preselectTriggers = document.querySelectorAll('[data-select-interest]');

    const successSubject = document.getElementById('success-subject');
    const successInterest = document.getElementById('success-interest');
    const retryMailtoLink = document.getElementById('retry-mailto-link');
    const copyBodyBtn = document.getElementById('copy-body-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (!form) return;

    /**
     * Sincroniza el selector desplegable, las píldoras visuales y el placeholder del mensaje
     */
    const setInterestArea = (interestValue, showNotification = false) => {
      if (!CONFIG.validInterests.includes(interestValue)) return;

      if (selectInteres) {
        selectInteres.value = interestValue;
      }

      interestPills.forEach((pill) => {
        const isActive =
          pill.getAttribute('data-interest-value') === interestValue;
        pill.classList.toggle('active', isActive);
      });

      if (inputMensaje && CONFIG.messagePlaceholders[interestValue]) {
        inputMensaje.setAttribute(
          'placeholder',
          CONFIG.messagePlaceholders[interestValue]
        );
      }

      if (showNotification && preselectBanner && preselectBannerText) {
        preselectBannerText.textContent = `Área preseleccionada: ${interestValue}`;
        preselectBanner.hidden = false;
      }
    };

    // Eventos en las píldoras dentro del formulario
    interestPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const value = pill.getAttribute('data-interest-value');
        if (value) {
          setInterestArea(value, false);
          validateField('interes');
        }
      });
    });

    // Evento al cambiar el selector desplegable directamente
    if (selectInteres) {
      selectInteres.addEventListener('change', () => {
        setInterestArea(selectInteres.value, false);
        validateField('interes');
      });
    }

    // Botones de las Dos Patas ("Solicitar información del fondo" / "Cotizar proyecto digital")
    preselectTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const targetInterest = trigger.getAttribute('data-select-interest');
        if (!targetInterest) return;

        // Si el formulario estaba oculto tras un envío previo, restaurarlo
        if (form.hidden) {
          form.hidden = false;
          if (successBox) successBox.hidden = true;
        }

        setInterestArea(targetInterest, true);

        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Enfocar el primer campo tras el desplazamiento
        window.setTimeout(() => {
          if (inputNombre && !inputNombre.value.trim()) {
            inputNombre.focus({ preventScroll: true });
          } else if (inputMensaje) {
            inputMensaje.focus({ preventScroll: true });
          }
        }, 450);
      });
    });

    /**
     * Reglas de validación por campo
     */
    const validators = {
      nombre: () => {
        const value = inputNombre ? inputNombre.value.trim() : '';
        if (!value) {
          return 'Por favor, introduce tu nombre y apellidos.';
        }
        if (value.length < 3) {
          return 'El nombre debe contener al menos 3 caracteres.';
        }
        return '';
      },
      email: () => {
        const value = inputEmail ? inputEmail.value.trim() : '';
        if (!value) {
          return 'Por favor, introduce tu correo electrónico.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(value)) {
          return 'Introduce una dirección de correo electrónico válida (ej. nombre@dominio.com).';
        }
        return '';
      },
      telefono: () => {
        const value = inputTelefono ? inputTelefono.value.trim() : '';
        if (!value) return ''; // Campo opcional
        const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
        if (!phoneRegex.test(value)) {
          return 'Introduce un teléfono válido (mínimo 7 dígitos) o déjalo vacío.';
        }
        return '';
      },
      interes: () => {
        const value = selectInteres ? selectInteres.value : '';
        if (!CONFIG.validInterests.includes(value)) {
          return 'Selecciona un área de interés válida.';
        }
        return '';
      },
      mensaje: () => {
        const value = inputMensaje ? inputMensaje.value.trim() : '';
        if (!value) {
          return 'Por favor, escribe brevemente tu consulta o mensaje.';
        }
        if (value.length < 10) {
          return 'Detalla un poco más tu consulta (mínimo 10 caracteres).';
        }
        if (value.length > 1000) {
          return 'El mensaje no puede superar los 1000 caracteres.';
        }
        return '';
      },
    };

    /**
     * Ejecuta la validación visual y accesible de un campo individual
     */
    const validateField = (fieldName) => {
      const validator = validators[fieldName];
      if (!validator) return true;

      const errorMessage = validator();
      const groupEl = document.getElementById(`group-${fieldName}`);
      const errorEl = document.getElementById(`error-${fieldName}`);
      const inputEl = document.getElementById(fieldName);

      if (groupEl) {
        groupEl.classList.toggle('has-error', Boolean(errorMessage));
        const hasValue = inputEl && inputEl.value.trim().length > 0;
        groupEl.classList.toggle('is-valid', !errorMessage && hasValue);
      }

      if (inputEl) {
        inputEl.setAttribute('aria-invalid', String(Boolean(errorMessage)));
      }

      if (errorEl) {
        errorEl.textContent = errorMessage;
      }

      return !errorMessage;
    };

    // Validación en tiempo real al escribir y al salir de cada campo
    ['nombre', 'email', 'telefono', 'mensaje'].forEach((fieldName) => {
      const element = document.getElementById(fieldName);
      if (!element) return;

      element.addEventListener('blur', () => validateField(fieldName));
      element.addEventListener('input', () => {
        const groupEl = document.getElementById(`group-${fieldName}`);
        if (groupEl && groupEl.classList.contains('has-error')) {
          validateField(fieldName);
        } else if (element.value.trim().length > 2) {
          validateField(fieldName);
        }
      });
    });

    // Contador de caracteres en vivo para el campo de mensaje
    if (inputMensaje && charCounter) {
      const updateCounter = () => {
        const currentLength = inputMensaje.value.length;
        charCounter.textContent = `${currentLength} / 1000`;
      };
      inputMensaje.addEventListener('input', updateCounter);
      updateCounter();
    }

    /**
     * Manejo del envío del formulario y apertura de mailto
     */
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fieldOrder = ['nombre', 'email', 'telefono', 'interes', 'mensaje'];
      let firstInvalidField = null;
      let isFormValid = true;

      fieldOrder.forEach((fieldName) => {
        const isValid = validateField(fieldName);
        if (!isValid) {
          isFormValid = false;
          if (!firstInvalidField) {
            firstInvalidField = document.getElementById(fieldName);
          }
        }
      });

      if (!isFormValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      // Recolección de datos validados
      const nombre = inputNombre.value.trim();
      const email = inputEmail.value.trim();
      const telefono = inputTelefono.value.trim() || 'No especificado';
      const interes = selectInteres.value;
      const mensaje = inputMensaje.value.trim();

      // Construcción de asunto y cuerpo estructurado
      const subject = `[LH Valor] Consulta de ${nombre}`;
      const bodyLines = [
        'Hola Héctor (LH Valor),',
        '',
        'Se ha generado una nueva consulta desde la web oficial de LH Valor con los siguientes detalles:',
        '',
        '--------------------------------------------------',
        `• Nombre y Apellidos: ${nombre}`,
        `• Correo electrónico: ${email}`,
        `• Teléfono / WhatsApp: ${telefono}`,
        `• Área de interés: ${interes}`,
        '--------------------------------------------------',
        '',
        'MENSAJE / CONSULTA:',
        mensaje,
        '',
        '--------------------------------------------------',
        'Enviado desde la plataforma web de LH Valor.',
      ];

      const formattedBody = bodyLines.join('\r\n');
      const mailtoUrl = `mailto:${CONFIG.recipientEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(formattedBody)}`;

      appState.lastFormattedMailBody = `Asunto: ${subject}\nPara: ${CONFIG.recipientEmail}\n\n${bodyLines.join(
        '\n'
      )}`;
      appState.lastMailtoUrl = mailtoUrl;

      // Actualizar vista de éxito
      if (successSubject) successSubject.textContent = subject;
      if (successInterest) successInterest.textContent = interes;
      if (retryMailtoLink) retryMailtoLink.setAttribute('href', mailtoUrl);

      form.hidden = true;
      if (preselectBanner) preselectBanner.hidden = true;
      if (successBox) {
        successBox.hidden = false;
      }

      // Disparar apertura del cliente de correo predeterminado
      window.location.href = mailtoUrl;
    });

    // Copiar el cuerpo estructurado al portapapeles como respaldo
    if (copyBodyBtn) {
      copyBodyBtn.addEventListener('click', async () => {
        if (!appState.lastFormattedMailBody) return;
        const copied = await copyTextToClipboard(appState.lastFormattedMailBody);
        if (copied) {
          const originalText = copyBodyBtn.textContent;
          copyBodyBtn.textContent = '¡Consulta copiada al portapapeles!';
          window.setTimeout(() => {
            copyBodyBtn.textContent = originalText;
          }, 2600);
        }
      });
    }

    // Botón para volver a redactar una nueva consulta
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        form.reset();
        ['nombre', 'email', 'telefono', 'interes', 'mensaje'].forEach((name) => {
          const groupEl = document.getElementById(`group-${name}`);
          const errorEl = document.getElementById(`error-${name}`);
          if (groupEl) {
            groupEl.classList.remove('has-error', 'is-valid');
          }
          if (errorEl) {
            errorEl.textContent = '';
          }
        });

        if (charCounter) charCounter.textContent = '0 / 1000';
        setInterestArea('Inversión en Renta Variable', false);

        if (successBox) successBox.hidden = true;
        form.hidden = false;
        if (inputNombre) inputNombre.focus();
      });
    }
  }

  /* ==========================================================================
     4. UTILIDADES DE PORTAPAPELES Y AÑO DINÁMICO
     ========================================================================== */
  async function copyTextToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Alternativa compatible para contextos no HTTPS locales
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch {
      return false;
    }
  }

  function initClipboardAndFooter() {
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async () => {
        const emailToCopy =
          copyEmailBtn.getAttribute('data-copy-value') || CONFIG.recipientEmail;
        const textSpan = copyEmailBtn.querySelector('.copy-email-btn__text');
        const success = await copyTextToClipboard(emailToCopy);

        if (success && textSpan) {
          textSpan.textContent = '¡Copiado!';
          window.setTimeout(() => {
            textSpan.textContent = 'Copiar';
          }, 2200);
        }
      });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = String(new Date().getFullYear());
    }
  }

  /* ==========================================================================
     INICIALIZACIÓN AL CARGAR EL DOM
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initStrategicPillars();
    initLeadForm();
    initClipboardAndFooter();
  });
})();
