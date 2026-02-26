/**
 * Generate placeholder image URL from placehold.co
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @param {string} text - Text to display
 * @returns {string} Placeholder URL
 */
export const getPlaceholder = (width, height, text) => {
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/1e293b/94a3b8?text=${encodedText}`;
};

/**
 * Image fallback types with appropriate placeholders
 */
export const FALLBACK_TYPES = {
  POSTER: (width = 500, height = 750) => getPlaceholder(width, height, 'No+Poster'),
  BACKDROP: (width = 1280, height = 720) => getPlaceholder(width, height, 'No+Image'),
  PROFILE: (width = 500, height = 500) => getPlaceholder(width, height, 'No+Photo'),
  LOGO: (width = 200, height = 200) => getPlaceholder(width, height, 'No+Logo'),
  FLAG: (width = 64, height = 48) => getPlaceholder(width, height, 'N/A'),
  STILL: (width = 500, height = 281) => getPlaceholder(width, height, 'No+Image'),
  NETWORK: (width = 200, height = 200) => getPlaceholder(width, height, 'Network'),
  COMPANY: (width = 300, height = 150) => getPlaceholder(width, height, 'Company'),
};

/**
 * Handle image error by setting fallback
 * @param {Event} e - Error event
 * @param {string} fallbackType - Type from FALLBACK_TYPES
 */
export const handleImageError = (e, fallbackType = 'BACKDROP') => {
  if (e.target.dataset.fallbackApplied) return; // Prevent infinite loop
  e.target.dataset.fallbackApplied = 'true';
  e.target.src = FALLBACK_TYPES[fallbackType]();
};
