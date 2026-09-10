/**
 * Validation utilities for institutional credentials.
 * Strict business rule: Only emails with the domain .universidadlatino.edu.mx are permitted.
 */

export const INSTITUTIONAL_DOMAIN = '@universidadlatino.edu.mx';
export const INSTITUTIONAL_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*universidadlatino\.edu\.mx$/i;

// Common personal or generic domains to detect specifically
export const PERSONAL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'proton.me',
  'protonmail.com',
  'aol.com',
  'mail.com',
];

/**
 * Validates if the email belongs strictly to the institutional domain .universidadlatino.edu.mx.
 * Returns null if valid, or the mandatory error string if invalid.
 */
export function validateInstitutionalEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Por favor, utiliza tu correo institucional válido';
  }

  // Exact regex validation for .universidadlatino.edu.mx
  if (!INSTITUTIONAL_EMAIL_REGEX.test(trimmed)) {
    return 'Por favor, utiliza tu correo institucional válido';
  }

  return null;
}

/**
 * Returns true if the string ends with or contains a common personal email domain
 */
export function isPersonalEmailDomain(email: string): boolean {
  const lower = email.trim().toLowerCase();
  return PERSONAL_DOMAINS.some((domain) => lower.includes(`@${domain}`));
}
