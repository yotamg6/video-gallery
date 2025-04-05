# Video Gallery App

A full-stack video gallery web application where users can upload videos, automatically generate thumbnails, and view them in a styled gallery carousel.

Built with Next.js App Router, Prisma, React Query, AWS Lambda, Vercel Blob, and Neon Postgres.

---

## Features

- Upload videos (supports multiple files)
- Automatic thumbnail generation using AWS Lambda with ffmpeg
- Display thumbnails in a responsive Swiper carousel
- View uploaded videos in a modal player
- Tracks file size and total DB usage, blocks uploads when exceeded
- Reusable UI components for loading, messages, and error handling
- Smart polling and upload progress via Redis
- Styled with Material UI and a clean green-accent theme

---

## Tech Stack

| Frontend             | Backend               | Infrastructure         |
| -------------------- | --------------------- | ---------------------- |
| Next.js (App Router) | Prisma ORM            | Vercel Blob Storage    |
| React Query          | Neon Postgres         | AWS Lambda             |
| Material UI          | Redis (upload status) | Swiper.js for carousel |

---

## Project Structure

# Video Gallery App

A full-stack video gallery web application where users can upload videos, automatically generate thumbnails, and view them in a styled gallery carousel.

Built with Next.js App Router, Prisma, React Query, AWS Lambda, Vercel Blob, and Neon Postgres.

---

## Features

- Upload videos (supports multiple files)
- Automatic thumbnail generation using AWS Lambda with ffmpeg
- Display thumbnails in a responsive carousel
- View uploaded videos in a modal player
- Tracks file size and total DB usage; blocks uploads when storage is exceeded
- Reusable UI components for loading, messages, and error handling
- Smart polling and upload progress tracking via Redis
- Styled with Material UI and a clean green-accent theme

---

## Tech Stack

- **Frontend:** Next.js (App Router), React Query, Material UI, Swiper.js
- **Backend:** Prisma ORM, Neon Postgres, Redis, AWS Lambda
- **Storage/Infrastructure:** Vercel Blob Storage

---

## Getting Started

### 1. Install Dependencies

Clone the repository and install the required packages:

git clone https://github.com/your-username/video-gallery.git
cd video-gallery
npm install

### 2. Configure Environment Variables

Create a .env.local file in the root of the project with the following variables:

DATABASE_URL=your_neon_postgres_url
REDIS_URL=your_redis_url
VERCEL_BLOB_READ_WRITE_TOKEN=your_blob_token
LAMBDA_THUMBNAIL_ENDPOINT=your_lambda_url

Replace the placeholder values with your actual configuration.

### 3. Start the App

Run the development server with:
npm run dev

Open http://localhost:3000 in your browser to see the app in action.

## Storage Limits

The Neon database enforces a strict 0.5GB limit using file size tracking.

Uploads are automatically blocked if the projected total storage would exceed this limit.

Storage usage is calculated and validated both on the client-side (before upload) and server-side.

## Live Demo

The live demo of the app is found on:
https://video-gallery-silk.vercel.app

Written by Yotam Gaton
