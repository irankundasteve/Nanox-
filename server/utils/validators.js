import Category from '../models/Category.js';

export function sanitizeText(value = '') {
  return String(value).replace(/[<>]/g, '').trim();
}

export function isHttpsUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function validatePortfolioInput(payload, { categoryOptional = false } = {}) {
  const errors = {};
  const title = sanitizeText(payload.title);
  const description = sanitizeText(payload.description || '');
  const category = sanitizeText(payload.category || '');
  const imageUrl = sanitizeText(payload.imageUrl || '');

  if (!title) errors.title = 'title is required';
  if (title.length > 100) errors.title = 'title max length is 100';
  if (description.length > 500) errors.description = 'description max length is 500';

  if (!categoryOptional || category) {
    if (!category) errors.category = 'category is required';
    if (category.length > 50) errors.category = 'category max length is 50';
    if (category) {
      const categoryDoc = await Category.findOne({ name: category }).lean();
      if (!categoryDoc) errors.category = 'category must match an existing category';
    }
  }

  if (!imageUrl) errors.imageUrl = 'imageUrl is required';
  if (imageUrl && !isHttpsUrl(imageUrl)) errors.imageUrl = 'imageUrl must be a valid HTTPS URL';

  return {
    errors,
    sanitized: {
      title,
      description,
      category,
      imageUrl,
      isFeatured: Boolean(payload.isFeatured),
    },
  };
}

export function validateCategoryName(name) {
  const sanitized = sanitizeText(name);
  const errors = {};
  if (!sanitized) errors.name = 'name is required';
  if (sanitized.length > 50) errors.name = 'name max length is 50';
  return { errors, sanitized };
}


export function isValidCtaLink(value) {
  const v = sanitizeText(value || '');
  if (!v) return false;
  if (v.startsWith('/')) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateAboutInput(payload) {
  const headline = sanitizeText(payload.headline);
  const introParagraph = sanitizeText(payload.introParagraph);
  const artisticVision = sanitizeText(payload.artisticVision);
  const experienceCredentials = sanitizeText(payload.experienceCredentials);
  const ctaText = sanitizeText(payload.ctaText);
  const ctaLink = sanitizeText(payload.ctaLink);

  const errors = {};
  if (!headline) errors.headline = 'headline is required';
  if (headline.length > 150) errors.headline = 'headline max length is 150';

  if (!introParagraph) errors.introParagraph = 'introParagraph is required';
  if (introParagraph.length > 1000) errors.introParagraph = 'introParagraph max length is 1000';

  if (!artisticVision) errors.artisticVision = 'artisticVision is required';
  if (artisticVision.length > 2000) errors.artisticVision = 'artisticVision max length is 2000';

  if (!experienceCredentials) errors.experienceCredentials = 'experienceCredentials is required';
  if (experienceCredentials.length > 2000) errors.experienceCredentials = 'experienceCredentials max length is 2000';

  if (!ctaText) errors.ctaText = 'ctaText is required';
  if (ctaText.length > 50) errors.ctaText = 'ctaText max length is 50';

  if (!ctaLink) errors.ctaLink = 'ctaLink is required';
  else if (!isValidCtaLink(ctaLink)) errors.ctaLink = 'ctaLink must be a valid URL';

  return {
    errors,
    sanitized: {
      headline,
      introParagraph,
      artisticVision,
      experienceCredentials,
      ctaText,
      ctaLink,
    },
  };
}


export function validateServiceInput(payload) {
  const title = sanitizeText(payload.title);
  const description = sanitizeText(payload.description);
  const details = sanitizeText(payload.details || '');
  const pricing = sanitizeText(payload.pricing || '');

  const errors = {};
  if (!title) errors.title = 'title is required';
  if (title.length > 100) errors.title = 'title max length is 100';

  if (!description) errors.description = 'description is required';
  if (description.length > 500) errors.description = 'description max length is 500';

  if (details.length > 2000) errors.details = 'details max length is 2000';
  if (pricing.length > 2000) errors.pricing = 'pricing max length is 2000';

  return {
    errors,
    sanitized: { title, description, details, pricing },
  };
}


const emailRegex = /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:(?:[a-zA-Z0-9-])+\.)+[a-zA-Z]{2,}$/;

export function validateContactSubmissionInput(payload) {
  const name = sanitizeText(payload.name);
  const email = sanitizeText(payload.email).toLowerCase();
  const phone = sanitizeText(payload.phone || '');
  const message = sanitizeText(payload.message);

  const errors = {};
  if (!name) errors.name = 'name is required';
  if (name.length > 100) errors.name = 'name max length is 100';

  if (!email) errors.email = 'email is required';
  else if (!emailRegex.test(email)) errors.email = 'email must be valid';

  if (phone.length > 20) errors.phone = 'phone max length is 20';

  if (!message) errors.message = 'message is required';
  if (message.length > 2000) errors.message = 'message max length is 2000';

  return {
    errors,
    sanitized: { name, email, phone, message },
  };
}

export function validateContactStatus(status) {
  const sanitized = sanitizeText(status || '').toLowerCase();
  const allowed = new Set(['new', 'read', 'archived']);
  const errors = {};
  if (!allowed.has(sanitized)) errors.status = 'status must be one of: new, read, archived';
  return { errors, sanitized };
}
