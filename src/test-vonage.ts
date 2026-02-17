import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import vonage from '../src/lib/vonage';

const testConnection = async () => {
  try {
    console.log("Testing Vonage connection...");
    
    // This lists the applications on your account to verify all credentials
    const applications = await vonage.applications.listApplications({});
    
    console.log("✅ Success! Connected to Vonage.");
    console.log(`Found ${applications.totalItems} applications.`);
    
    // Optionally log the current application name to be sure
    const myApp = applications.applications?.find(app => app.id === process.env.VONAGE_APP_ID);
    if (myApp) {
      console.log(`Connected to app: ${myApp.name}`);
    }
  } catch (error: any) {
    console.error("❌ Connection failed!");
    console.error("Error Details:", error.message);
    
    if (error.message.includes("401")) {
      console.error("Hint: Check your API_KEY and API_SECRET.");
    } else if (error.message.includes("private key")) {
      console.error("Hint: The path to your private.key might be wrong.");
    }
  }
};

testConnection();