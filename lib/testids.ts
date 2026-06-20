// Single source of truth for data-testid values shared by components and tests.
// Import in JSX:   data-testid={testIds.contact.submit}
// Import in specs: page.getByTestId(testIds.contact.submit)
export const testIds = {
  sections: {
    hero: 'hero-section',
    about: 'about-section',
    skills: 'skills-section',
    testing: 'testing-section',
    contact: 'contact-section',
  },
  hero: {
    title: 'hero-title',
    scrollCue: 'hero-scroll-cue',
  },
  contact: {
    form: 'contact-form',
    nameInput: 'contact-name-input',
    emailInput: 'contact-email-input',
    messageInput: 'contact-message-input',
    submit: 'contact-submit',
    nameError: 'contact-name-error',
    emailError: 'contact-email-error',
    messageError: 'contact-message-error',
    charCount: 'contact-char-count',
    toast: 'contact-toast',
    rateLimitBanner: 'contact-rate-limit-banner',
    errorBanner: 'contact-error-banner',
  },
} as const
