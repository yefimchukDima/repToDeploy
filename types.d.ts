declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: number;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      JWT_SECRET: string;
      JWT_EXP: string;
      TWILIO_SID: string;
      TWILIO_TOKEN: string;
      TWILIO_PHONE_NUMBER: string;
      SENDGRID_API_KEY: string;
      SENDGRID_EMAIL: string;
      S3_ACCESS_KEY_ID: string;
      S3_SECRET_ACCESS_KEY: string;
      S3_FILES_BUCKET_NAME: string;
    }
  }
}

export interface UserJwtPayload {
  id: number;
  email?: string;
  mobile_number: string;
  first_name: string;
  last_name: string;
}

export interface CompanyAdminJwtPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
