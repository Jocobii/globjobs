import z from 'zod';

const envSchema = z.object({
  VITE_GATEWAY_URI: z.string().url(),
  VITE_GATEWAY_API: z.string().url(),
  VITE_AXIOS_URI: z.string(),
  VITE_GLOBALIZATION_API_URI: z.string().url(),
  VITE_GLOBALIZATION_GRAPHQL_URI: z.string().url(),
  VITE_FIREBASE_API_KEY: z.string(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string(),
  VITE_FIREBASE_DATABASE_URL: z.string().url(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  VITE_GLOBALIZATION_GRAPHQL_SOCKET_URI: z.string().url(),
});

export const env = envSchema.parse(import.meta.env);
