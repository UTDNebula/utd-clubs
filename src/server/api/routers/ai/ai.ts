import { GoogleGenAI } from '@google/genai';

const GEMINI_SERVICE_ACCOUNT = Boolean(process.env.GEMINI_SERVICE_ACCOUNT)
  ? (JSON.parse(process.env.GEMINI_SERVICE_ACCOUNT ?? '') as {
      client_email: string;
      private_key: string;
    })
  : { client_email: '', private_key: '' };

export const ai = new GoogleGenAI({
  vertexai: true,
  project: 'jupiter-459023',
  location: 'us-central1',
  googleAuthOptions: {
    credentials: Boolean(process.env.GEMINI_SERVICE_ACCOUNT)
      ? {
          client_email: GEMINI_SERVICE_ACCOUNT.client_email,
          private_key: GEMINI_SERVICE_ACCOUNT.private_key,
        }
      : undefined,
  },
});
