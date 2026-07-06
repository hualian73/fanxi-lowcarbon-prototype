type LocationLike = Pick<Location, 'hash' | 'pathname'>;

export function normalizeRoutePath(pathname: string, validPaths: readonly string[], fallback = '/dashboard') {
  return validPaths.includes(pathname) ? pathname : fallback;
}

function normalizeBaseUrl(baseUrl: string) {
  if (!baseUrl || baseUrl === './') return '/';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function getRoutePathFromLocation(
  location: LocationLike,
  validPaths: readonly string[],
  fallback = '/dashboard',
  baseUrl = '/',
) {
  const hashPath = location.hash.replace(/^#/, '');
  if (hashPath) {
    return normalizeRoutePath(hashPath, validPaths, fallback);
  }

  const normalizedBase = normalizeBaseUrl(baseUrl);
  let pathname = location.pathname;
  if (normalizedBase !== '/' && pathname.startsWith(normalizedBase)) {
    const stripped = pathname.slice(normalizedBase.length);
    pathname = stripped ? `/${stripped.replace(/^\/+/, '')}` : '/';
  }

  return normalizeRoutePath(pathname, validPaths, fallback);
}

export function getRouteUrl(path: string, baseUrl = '/') {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  return normalizedBase === '/' ? path : `${normalizedBase}#${path}`;
}
