import "dotenv/config"; 

export const FirebaseAdminConfig = {
    type: "service_account",
    project_id: "cs554project-9ad69",
    private_key_id: "ab35f7e7ae45a4317a6e9ffb6b595dda1a990919",
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    client_email: "firebase-adminsdk-zdcyq@cs554project-9ad69.iam.gserviceaccount.com",
    client_id: "104001209849137768390",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zdcyq%40cs554project-9ad69.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  }
  