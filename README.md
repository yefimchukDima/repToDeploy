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
id - PK AUTO_INCREMENT<br>
email - VARCHAR NULLABLE<br>
username - VARCHAR NULLABLE<br>
mobile_number - VARCHAR NULLABLE<br>
password - VARCHAR NULLABLE<br>
first_name - VARCHAR NULLABLE<br>
last_name - VARCHAR NULLABLE<br>
isAdmin - BOOLEAN DEFAULT FALSE<br>
isRegistered - BOOLEAN DEFAULT FALSE<br>
isVerified - BOOLEAN DEFAULT FALSE<br>
base64_image - VARCHAR NULLABLE<br>
created_at - DATE DEFAULT CURRENT_TIMESTAMP<br>
updated_at - DATE DEFAULT CURRENT_TIMESTAMP<br>

**Company**
id - PK AUTO_INCREMENT<br>
mobile_number - VARCHAR<br>
website_url - VARCHAR<br>
url_id - VARCHAR NULLABLE<br>
name - VARCHAR<br>
keywords - VARCHAR[]<br>
created_at - DATE DEFAULT CURRENT_TIMESTAMP<br>
updated_at - DATE DEFAULT CURRENT_TIMESTAMP<br>
userId - INTEGER FK User<br>

**Department**
id - PK AUTO_INCREMENT<br>
department - VARCHAR NULLABLE<br>
title - VARCHAR NULLABLE<br>
name - VARCHAR NULLABLE<br>
phone_number - VARCHAR<br>
email - VARCHAR NULLABLE<br>
image_url - VARCHAR NULLABLE<br>
created_at - DATE DEFAULT CURRENT_TIMESTAMP<br>
updated_at - DATE DEFAULT CURRENT_TIMESTAMP<br>
companyId - INTEGER FK Company<br>

**Verification Code**
id - PK AUTO_INCREMENT<br>
code - VARCHAR <br>
expTime - VARCHAR DEFAULT String(Math.floor(new Date().getTime() / 1000) + 300), // 5 minutes<br>
userId - INTEGER FK User<br>

**Password Reset Tokens**
id - PK AUTO_INCREMENT<br>
token - VARCHAR<br>
userId - INTEGER FK User<br>

**Chat Message**
id - PK AUTO_INCREMENT<br>
content - VARCHAR<br>
room - VARCHAR<br>
date - DATE DEFAULT CURRENT_TIMESTAMP(6)<br>
authorId - INTEGER FK User<br>
