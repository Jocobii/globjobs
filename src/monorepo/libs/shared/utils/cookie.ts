export const get = (cookies: string, name: string) => cookies?.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';

export const getSessionToken = (cookies: string) => get(cookies, 'next-auth.session-token');
