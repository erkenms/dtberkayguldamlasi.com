(() => {
  'use strict';

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    const setOpen = (isOpen) => {
      nav.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Clinic gallery lightbox ---------- */
  const SWIPE_THRESHOLD_PX = 48;

  function initGallery() {
    const figures = document.querySelectorAll('.gallery-grid figure');
    const lightbox = document.querySelector('.gallery-lightbox');
    if (!figures.length || !lightbox) return;

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxFigure = lightbox.querySelector('.lightbox-figure');

    const photos = Array.from(figures, (figure) => {
      const image = figure.querySelector('img');
      return { image, caption: figure.querySelector('figcaption')?.textContent ?? '' };
    });

    let activeIndex = 0;

    const show = (index) => {
      activeIndex = (index + photos.length) % photos.length;
      const { image, caption } = photos[activeIndex];
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = caption;
    };

    const showPrevious = () => show(activeIndex - 1);
    const showNext = () => show(activeIndex + 1);

    const open = (index) => {
      show(index);
      lightbox.showModal();
      lightbox.focus();
    };

    // Make each thumbnail behave like a button.
    figures.forEach((figure, index) => {
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', `Fotoğrafı büyüt: ${photos[index].caption || photos[index].image.alt}`);

      figure.addEventListener('click', () => open(index));
      figure.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(index);
        }
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.querySelector('.lightbox-previous').addEventListener('click', showPrevious);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);

    // Clicking the backdrop (the dialog itself, outside its children) closes it.
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    // Escape is handled natively by <dialog>.
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    });

    // Horizontal swipe on touch/pen devices.
    let swipeStart = null;

    lightboxFigure.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') swipeStart = { x: event.clientX, y: event.clientY };
    });

    lightboxFigure.addEventListener('pointerup', (event) => {
      if (!swipeStart) return;
      const deltaX = event.clientX - swipeStart.x;
      const deltaY = event.clientY - swipeStart.y;
      swipeStart = null;

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) showNext();
        else showPrevious();
      }
    });

    lightboxFigure.addEventListener('pointercancel', () => {
      swipeStart = null;
    });
  }

  initMobileMenu();
  initGallery();
})();
