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
