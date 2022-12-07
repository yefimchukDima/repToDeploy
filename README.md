## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# Environment variables

```
DB_HOST ~> Database host
DB_PORT ~> Database port
DB_USER ~> Database user
DB_PASS ~> Database password
DB_NAME ~> Database name
JWT_SECRET ~> JWT secret key
JWT_EXP ~> JWT token expiration
TWILIO_SID ~> Twilio SID key
TWILIO_TOKEN ~> Twilio API token
TWILIO_PHONE_NUMBER ~> Twilio phone number
SENDGRID_API_KEY ~> SendGrid API key
SENDGRID_EMAIL ~> SendGrid E-mail
S3_ACCESS_KEY_ID ~> AWS S3 Access Key ID
S3_SECRET_ACCESS_KEY ~> AWS S3 Access Key
S3_FILES_BUCKET_NAME ~> AWS S3 Files Bucket
```

## How to connect to the server

```bash
$ ssh -i <.pem file location> <server_username>@<server_ipaddress>
```

### Example
```bash
$ ssh -i ~/.ssh/key.pem ubuntu@192.168.1.1
```

# Database Schema

## Columns

**User**
id - PK AUTO_INCREMENT
email - VARCHAR NULLABLE
username - VARCHAR NULLABLE
mobile_number - VARCHAR NULLABLE
password - VARCHAR NULLABLE
first_name - VARCHAR NULLABLE
last_name - VARCHAR NULLABLE
isAdmin - BOOLEAN DEFAULT FALSE
isRegistered - BOOLEAN DEFAULT FALSE
isVerified - BOOLEAN DEFAULT FALSE
base64_image - VARCHAR NULLABLE
created_at - DATE DEFAULT CURRENT_TIMESTAMP
updated_at - DATE DEFAULT CURRENT_TIMESTAMP

**Company**
id - PK AUTO_INCREMENT
mobile_number - VARCHAR
website_url - VARCHAR
url_id - VARCHAR NULLABLE
name - VARCHAR
keywords - VARCHAR[];
created_at - DATE DEFAULT CURRENT_TIMESTAMP
updated_at - DATE DEFAULT CURRENT_TIMESTAMP
userId - INTEGER FK User

**Department**
id - PK AUTO_INCREMENT
department - VARCHAR NULLABLE
title - VARCHAR NULLABLE
name - VARCHAR NULLABLE
phone_number - VARCHAR
email - VARCHAR NULLABLE
image_url - VARCHAR NULLABLE
created_at - DATE DEFAULT CURRENT_TIMESTAMP
updated_at - DATE DEFAULT CURRENT_TIMESTAMP
companyId - INTEGER FK Company

**Verification Code**
id - PK AUTO_INCREMENT
code - VARCHAR 
expTime - VARCHAR DEFAULT String(Math.floor(new Date().getTime() / 1000) + 300), // 5 minutes
userId - INTEGER FK User

**Password Reset Tokens**
id - PK AUTO_INCREMENT
token - VARCHAR
userId - INTEGER FK User

**Chat Message**
id - PK AUTO_INCREMENT
content - VARCHAR 
room - VARCHAR
date - DATE DEFAULT CURRENT_TIMESTAMP(6)
authorId - INTEGER FK User
