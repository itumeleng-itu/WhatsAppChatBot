import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';
import path from 'path';

// Initialize the Vonage client
const vonage = new Vonage(new Auth({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APP_ID,
  privateKey: path.join(process.cwd(), 'private.key')
}), {
  apiHost: process.env.VONAGE_API_URL ? new URL(process.env.VONAGE_API_URL).hostname : undefined
});

export default vonage;