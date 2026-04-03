const normalizeUrl = (value) => value.replace(/\/+$/, '');

const isLocalhostHost = (host) => host === 'localhost' || host === '127.0.0.1';

export const getApiBaseUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredApiUrl) {
    return normalizeUrl(configuredApiUrl);
  }

  if (typeof window !== 'undefined') {
    if (isLocalhostHost(window.location.hostname)) {
      return 'http://localhost:5000/api';
    }
    return `${normalizeUrl(window.location.origin)}/api`;
  }

  return 'http://localhost:5000/api';
};

export const getSocketBaseUrl = () => {
  const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  if (configuredSocketUrl) {
    return normalizeUrl(configuredSocketUrl).replace(/\/api$/, '');
  }

  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredApiUrl) {
    return normalizeUrl(configuredApiUrl).replace(/\/api$/, '');
  }

  if (typeof window !== 'undefined') {
    if (isLocalhostHost(window.location.hostname)) {
      return 'http://localhost:5000';
    }
    return normalizeUrl(window.location.origin);
  }

  return 'http://localhost:5000';
};