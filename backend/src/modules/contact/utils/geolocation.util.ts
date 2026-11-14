export interface ResolvedLocation {
  ipAddress?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Extracts the real client IP address from request headers or socket.
 */
export function extractClientIp(req: any): string {
  if (!req) return '127.0.0.1';

  const forwarded = req.headers?.['x-forwarded-for'];
  let ip = '';

  if (typeof forwarded === 'string') {
    ip = forwarded.split(',')[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    ip = forwarded[0].trim();
  } else if (req.headers?.['x-real-ip']) {
    ip = String(req.headers['x-real-ip']).trim();
  } else if (req.headers?.['cf-connecting-ip']) {
    ip = String(req.headers['cf-connecting-ip']).trim();
  } else if (req.socket?.remoteAddress) {
    ip = req.socket.remoteAddress;
  } else if (req.ip) {
    ip = req.ip;
  }

  // Normalize IPv6 mapped IPv4 address
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  return ip || '127.0.0.1';
}

/**
 * Checks whether an IP address is private, loopback, or local.
 */
export function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.trim();

  if (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === 'localhost' ||
    clean === '0.0.0.0'
  ) {
    return true;
  }

  // IPv4 private ranges
  // 10.0.0.0 - 10.255.255.255
  if (/^10\./.test(clean)) return true;
  // 172.16.0.0 - 172.31.255.255
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  // 192.168.0.0 - 192.168.255.255
  if (/^192\.168\./.test(clean)) return true;
  // 169.254.0.0 - 169.254.255.255 (link-local)
  if (/^169\.254\./.test(clean)) return true;

  // IPv6 local / link-local / unique local
  if (/^(fc|fd|fe80)/i.test(clean)) return true;

  return false;
}

/**
 * Asynchronously resolves location details (city, region, country, coordinates)
 * using public IP geolocation APIs with timeout and fallback.
 * Never throws an error; returns safe fallback if lookup fails.
 */
export async function resolveLocationFromIp(ip: string): Promise<ResolvedLocation> {
  const result: ResolvedLocation = {
    ipAddress: ip,
  };

  if (!ip) return result;

  if (isPrivateOrLocalIp(ip)) {
    result.city = 'Local / Development';
    result.region = 'Localhost';
    result.country = 'Local Network';
    result.countryCode = 'LOCAL';
    return result;
  }

  // Primary: ipwho.is (Free, HTTPS, no key required)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.success !== false) {
        result.city = data.city || undefined;
        result.region = data.region || undefined;
        result.country = data.country || undefined;
        result.countryCode = data.country_code || undefined;
        if (typeof data.latitude === 'number') result.latitude = data.latitude;
        if (typeof data.longitude === 'number') result.longitude = data.longitude;
        return result;
      }
    }
  } catch {
    // Silently proceed to fallback
  }

  // Fallback: ip-api.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,regionName,city,lat,lon`,
      {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      },
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        result.city = data.city || undefined;
        result.region = data.regionName || undefined;
        result.country = data.country || undefined;
        result.countryCode = data.countryCode || undefined;
        if (typeof data.lat === 'number') result.latitude = data.lat;
        if (typeof data.lon === 'number') result.longitude = data.lon;
        return result;
      }
    }
  } catch {
    // Keep base result if external lookup fails
  }

  return result;
}
