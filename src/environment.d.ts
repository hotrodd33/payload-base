declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      PREVIEW_SECRET: string
      CRON_SECRET: string
      S3_BUCKET?: string
      S3_ACCESS_KEY_ID?: string
      S3_SECRET_ACCESS_KEY?: string
      S3_REGION?: string
      S3_ENDPOINT?: string
      EMAIL_PROVIDER?: 'nodemailer' | 'sendgrid'
      EMAIL_FROM_NAME?: string
      EMAIL_FROM_ADDRESS?: string
      SENDGRID_API_KEY?: string
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_USER?: string
      SMTP_PASS?: string
      SMTP_SECURE?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
