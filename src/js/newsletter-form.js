// Keep native HTML POST submission and validation as the no-JavaScript fallback.
(() => {
  function initializeNewsletterForms() {
    document.querySelectorAll('form.neumorphic-form[action="https://formspree.io/f/xpwaqlwd"]').forEach((form) => {
      const firstName = form.elements.namedItem('first_name');
      const lastName = form.elements.namedItem('last_name');
      const email = form.elements.namedItem('email');
      const button = form.querySelector('button[type="submit"]');
      if (!firstName || !lastName || !email || !button) return;

      function updateButton() {
        button.disabled = !firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !form.matches(':valid');
      }

      form.addEventListener('input', updateButton);
      form.addEventListener('change', updateButton);
      form.addEventListener('reset', () => setTimeout(updateButton, 0));
      window.addEventListener('pageshow', updateButton);
      updateButton();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNewsletterForms);
  } else {
    initializeNewsletterForms();
  }
})();
