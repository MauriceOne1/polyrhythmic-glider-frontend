const LOCALHOST_NAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
const LOCAL_HOST_OVERRIDE_PARAM = 'local-host';

export function isLocalDevelopmentHost(hostname: string): boolean {
  return LOCALHOST_NAMES.has(hostname);
}

export function getEffectiveHostname(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const currentHostname = window.location.hostname;

  if (!isLocalDevelopmentHost(currentHostname)) {
    return currentHostname;
  }

  const overrideHostname = window.location.search
    ? new URLSearchParams(window.location.search).get(LOCAL_HOST_OVERRIDE_PARAM)
    : null;

  if (
    overrideHostname === 'art.polyglider.com' ||
    overrideHostname === 'blog.polyglider.com' ||
    overrideHostname === 'shop.polyglider.com'
  ) {
    return overrideHostname;
  }

  return currentHostname;
}

export function getCurrentAbsoluteUrl(): string {
  if (typeof window === 'undefined') {
    return '/';
  }

  return window.location.href;
}

export function getMainSiteUrl(path = '/'): string {
  if (typeof window === 'undefined') {
    return path;
  }

  if (isLocalDevelopmentHost(window.location.hostname)) {
    return `${window.location.origin}${path}`;
  }

  return `https://polyglider.com${path}`;
}

export function getSubdomainSiteUrl(
  hostname: 'art.polyglider.com' | 'blog.polyglider.com' | 'shop.polyglider.com',
  path = '/',
): string {
  if (typeof window === 'undefined') {
    return path;
  }

  if (isLocalDevelopmentHost(window.location.hostname)) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${window.location.origin}${normalizedPath}?local-host=${hostname}`;
  }

  return `https://${hostname}${path}`;
}
