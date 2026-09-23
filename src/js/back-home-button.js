(() => {
  const scriptUrl = document.currentScript?.src;

  const markCurrentAdultStudy = () => {
    const studyLinks = document.querySelectorAll('.adult-studies-page .sidebar ul li a[href]');
    const currentFile = window.location.pathname.split('/').pop();

    studyLinks.forEach((link) => {
      const targetFile = new URL(link.getAttribute('href'), document.baseURI).pathname.split('/').pop();
      if (targetFile === currentFile) link.setAttribute('aria-current', 'page');
    });
  };

  const addBackHomeButton = () => {
    if (document.querySelector('[data-back-home-button]')) return;

    const homeHref = scriptUrl
      ? new URL('../../index.html', scriptUrl).href
      : 'index.html';
    const button = document.createElement('a');
    const arrow = document.createElement('span');
    const label = document.createElement('span');

    button.href = homeHref;
    button.className = 'back-home-button';
    button.dataset.backHomeButton = 'true';
    button.setAttribute('aria-label', 'Back to CPC New Haven home');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '←';
    label.textContent = 'Home';
    button.append(arrow, label);
    document.body.append(button);
    markCurrentAdultStudy();

    const style = document.createElement('style');
    style.textContent = `
      .back-home-button {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 1000;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 42px;
        padding: 10px 15px;
        border: 1px solid rgba(255, 255, 255, 0.38);
        border-radius: 999px;
        background: #123e5d;
        box-shadow: 0 8px 22px rgba(9, 38, 59, 0.22);
        color: #fff;
        font-family: inherit;
        font-size: 0.92rem;
        font-weight: 700;
        line-height: 1;
        text-decoration: none;
        transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
      }

      .back-home-button:hover,
      .back-home-button:focus-visible {
        transform: translateY(-2px);
        background: #0b5f78;
        box-shadow: 0 12px 28px rgba(9, 38, 59, 0.28);
      }

      .back-home-button:focus-visible {
        outline: 3px solid #b9dbe8;
        outline-offset: 3px;
      }

      @media (max-width: 640px) {
        .back-home-button {
          right: 16px;
          bottom: 16px;
          min-height: 40px;
          padding: 10px 14px;
        }
      }
    `;
    document.head.append(style);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addBackHomeButton, { once: true });
  } else {
    addBackHomeButton();
  }
})();
