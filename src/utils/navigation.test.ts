import { describe, expect, it } from 'vitest';
import { getRoutePathFromLocation, getRouteUrl, normalizeRoutePath } from './navigation';

const validPaths = ['/dashboard', '/prediction', '/monitor'];

describe('navigation', () => {
  it('normalizes unknown routes to the dashboard', () => {
    expect(normalizeRoutePath('/unknown', validPaths)).toBe('/dashboard');
    expect(normalizeRoutePath('/monitor', validPaths)).toBe('/monitor');
  });

  it('resolves hash routes for GitHub Pages project sites', () => {
    expect(
      getRoutePathFromLocation(
        {
          hash: '#/monitor',
          pathname: '/fanxi-lowcarbon-prototype/',
        },
        validPaths,
        '/dashboard',
        '/fanxi-lowcarbon-prototype/',
      ),
    ).toBe('/monitor');
  });

  it('strips a GitHub Pages base path before matching direct paths', () => {
    expect(
      getRoutePathFromLocation(
        {
          hash: '',
          pathname: '/fanxi-lowcarbon-prototype/prediction',
        },
        validPaths,
        '/dashboard',
        '/fanxi-lowcarbon-prototype/',
      ),
    ).toBe('/prediction');
  });

  it('uses hash URLs only for subpath deployments', () => {
    expect(getRouteUrl('/dashboard', '/')).toBe('/dashboard');
    expect(getRouteUrl('/dashboard', '/fanxi-lowcarbon-prototype/')).toBe(
      '/fanxi-lowcarbon-prototype/#/dashboard',
    );
  });
});
