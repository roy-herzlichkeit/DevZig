# DevZig 🚀

**The ultimate platform for developers to Connect and Grow.**

DevZig is a modern, full-stack event management platform built with Next.js 16, designed specifically for the developer community. It enables developers to discover, explore, and book technical events including hackathons, seminars, and conferences—all in one place.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Project Structure](#project-structure)
5. [Database Models](#database-models)
6. [API Routes & Request Flow](#api-routes--request-flow)
7. [Features](#features)
8. [Environment Variables](#environment-variables)
9. [Getting Started](#getting-started)
10. [Deployment](#deployment)
11. [Performance Optimizations](#performance-optimizations)
12. [Analytics & Monitoring](#analytics--monitoring)

---

## 🎯 Overview

DevZig is a comprehensive event discovery and booking platform that leverages the latest web technologies to provide a seamless user experience. The application features:

- **Server-side rendering (SSR)** for optimal SEO and performance
- **Intelligent caching** using Next.js 16's new caching APIs
- **Real-time event management** with MongoDB
- **Image optimization** via Cloudinary CDN
- **Analytics tracking** with PostHog
- **Modern UI** with Tailwind CSS v4 and custom visual effects

---

## 🛠 Technology Stack

### **Frontend**
- **Next.js 16.0.1** - React framework with App Router and Turbopack
- **React 19.2.0** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework with native oxide engine
- **OGL (WebGL)** - Custom light ray effects and visual enhancements

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose 8.19.3** - ODM for MongoDB with schema validation

### **Infrastructure & Services**
- **Cloudinary** - Cloud-based image storage and optimization
- **PostHog** - Product analytics and feature flags
- **Vercel** - Deployment and hosting platform

### **Development Tools**
- **ESLint 9** - Code linting
- **LightningCSS** - Fast CSS processing
- **PostCSS** - CSS transformations

---

## 🏗 Project Architecture

DevZig follows a modern **JAMstack architecture** with server-side rendering:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Browser   │  │  Next.js UI  │  │  React Components│   │
│  │   (User)    │←→│  (SSR/CSR)   │←→│   & Interactions │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Next.js App Router (app/)                │   │
│  │  ┌────────────────┐       ┌──────────────────┐     │   │
│  │  │  Page Routes   │       │  API Routes      │     │   │
│  │  │  - Home        │       │  - GET /events   │     │   │
│  │  │  - Event Detail│       │  - POST /events  │     │   │
│  │  └────────────────┘       │  - GET /events/  │     │   │
│  │                            │    [slug]        │     │   │
│  │                            └──────────────────┘     │   │
│  └─────────────────────────────────────────────────────┘   │
│                              ↕                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Server Actions (lib/actions/)               │   │
│  │  - event.actions.ts  - booking.actions.ts           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────────┐    ┌─────────────────────────────┐   │
│  │  MongoDB Atlas   │←──→│  Mongoose Models            │   │
│  │  - Events        │    │  - event.model.ts           │   │
│  │  - Bookings      │    │  - booking.model.ts         │   │
│  └──────────────────┘    └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Cloudinary   │  │   PostHog    │  │    Vercel    │   │
│  │  (Image CDN)   │  │  (Analytics) │  │  (Hosting)   │   │
│  └────────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
DevZig/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts & light effects
│   ├── page.tsx                 # Home page (event listing)
│   ├── globals.css              # Global styles with Tailwind
│   ├── api/                     # API routes
│   │   └── events/
│   │       ├── route.ts         # GET & POST /api/events
│   │       └── [slug]/
│   │           └── route.ts     # GET /api/events/[slug]
│   └── events/                  # Event pages
│       └── [slug]/
│           └── page.tsx         # Dynamic event detail page
│
├── components/                   # React components
│   ├── BookEvent.tsx            # Event booking form (client component)
│   ├── EventCard.tsx            # Event card for listing
│   ├── ExploreBtn.tsx           # CTA button
│   ├── LightRays.tsx            # WebGL light effect component
│   ├── LightRays.css            # Light ray styles
│   └── Navbar.tsx               # Navigation bar
│
├── database/                     # Database layer
│   ├── index.ts                 # Central export for models
│   ├── event.model.ts           # Event schema & model
│   └── booking.model.ts         # Booking schema & model
│
├── lib/                          # Utility libraries
│   ├── mongodb.ts               # MongoDB connection manager
│   ├── utils.ts                 # Utility functions
│   ├── constants.ts             # App constants
│   └── actions/                 # Server actions
│       ├── event.actions.ts     # Event-related actions
│       └── booking.actions.ts   # Booking-related actions
│
├── public/                       # Static assets
│   ├── icons/                   # SVG icons
│   └── images/                  # Images
│
├── instrumentation-client.ts     # PostHog initialization
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
├── components.json              # shadcn/ui configuration
├── package.json                 # Dependencies
└── .env                         # Environment variables
```

---

## 🗄 Database Models

### **Event Model** (`database/event.model.ts`)

The Event model is the core entity representing developer events.

**Schema Fields:**
- `title` (String, required) - Event name
- `slug` (String, required, unique) - Auto-generated URL-friendly identifier
- `description` (String, required) - Detailed event description
- `overview` (String, required) - Brief summary
- `image` (String, required) - Cloudinary URL of event poster
- `venue` (String, required) - Physical venue name
- `location` (String, required) - City/address
- `date` (String, required) - Normalized to YYYY-MM-DD format
- `time` (String, required) - Normalized to HH:mm 24-hour format
- `mode` (String, required) - Event type: online, offline, or hybrid
- `audience` (String, required) - Target audience description
- `agenda` (Array<String>, required) - List of event agenda items
- `organizer` (String, required) - Event organizer name
- `tags` (Array<String>, required) - Categorization tags for filtering
- `createdAt` (Date, auto) - Document creation timestamp
- `updatedAt` (Date, auto) - Last modification timestamp

**Key Features:**
- **Auto-slug generation**: Automatically creates URL-safe slugs from titles
- **Date/time normalization**: Ensures consistent date formats (ISO) and time formats (24h)
- **Validation**: Strict schema validation for data integrity
- **Indexing**: Slug field is indexed for fast lookups

### **Booking Model** (`database/booking.model.ts`)

Represents user bookings for events.

**Schema Fields:**
- `eventId` (ObjectId, required) - Reference to Event document
- `email` (String, required) - User's email (validated format)
- `createdAt` (Date, auto) - Booking timestamp
- `updatedAt` (Date, auto) - Last update timestamp

**Key Features:**
- **Email validation**: Regex-based validation for email format
- **Referential integrity**: Pre-save hook validates event existence
- **Indexing**: EventId is indexed for efficient queries
- **Data sanitization**: DTOs prevent MongoDB internals from leaking to client

---

## 🔄 API Routes & Request Flow

### **GET /api/events**

**Purpose**: Fetch all events (latest first)

**Flow:**
```
1. Client Request → GET /api/events
2. API Route Handler (app/api/events/route.ts)
3. Connect to MongoDB (lib/mongodb.ts)
4. Query Event.find().sort({ createdAt: -1 })
5. Return JSON: { message, events }
```

**Response:**
```json
{
  "message": "Events fetched successfully",
  "events": [
    {
      "_id": "...",
      "title": "React Summit 2025",
      "slug": "react-summit-2025",
      "image": "https://res.cloudinary.com/...",
      "date": "2025-06-15",
      "time": "10:00",
      "location": "San Francisco",
      // ... other fields
    }
  ]
}
```

**Caching Strategy:**
- Pages consuming this endpoint use `'use cache'` with `cacheLife('hours')`
- Reduces API calls and improves response times

---

### **POST /api/events**

**Purpose**: Create a new event with image upload

**Flow:**
```
1. Client Request → POST /api/events (FormData)
   - Contains: title, description, date, time, etc.
   - File: image (uploaded poster)
2. API Route Handler
3. Parse FormData
   - Extract fields
   - Parse arrays (tags, agenda) from JSON/CSV/newlines
4. Upload image to Cloudinary
   - Convert File to Buffer
   - Stream to cloudinary.uploader.upload_stream()
   - Receive secure_url
5. Create Event Document
   - Combine fields + cloudinary URL
   - Event.create()
6. Return JSON: { message, event }
```

**Request Example:**
```javascript
const formData = new FormData();
formData.append('title', 'AI Conference 2025');
formData.append('description', '...');
formData.append('image', imageFile);
formData.append('tags', JSON.stringify(['AI', 'ML']));
formData.append('agenda', 'Keynote\nWorkshop\nPanel');
// ... other fields

fetch('/api/events', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "message": "Event created",
  "event": {
    "_id": "...",
    "title": "AI Conference 2025",
    "slug": "ai-conference-2025",
    "image": "https://res.cloudinary.com/.../image.jpg",
    // ... other fields
  }
}
```

---

### **GET /api/events/[slug]**

**Purpose**: Fetch a single event by slug

**Flow:**
```
1. Client Request → GET /api/events/react-summit-2025
2. API Route Handler (app/api/events/[slug]/route.ts)
3. Extract slug from params
4. Validate & sanitize slug
5. Connect to MongoDB
6. Query Event.findOne({ slug }).lean()
7. Return event or 404 if not found
```

**Response (Success):**
```json
{
  "event": {
    "_id": "...",
    "title": "React Summit 2025",
    "slug": "react-summit-2025",
    // ... all event fields
  }
}
```

**Response (Not Found):**
```json
{
  "error": "Event not found"
}
```

---

## 🎨 Features

### **1. Event Discovery**
- Browse all developer events on the home page
- Events displayed in card format with key info (date, time, location)
- Responsive grid layout adapts to screen sizes

### **2. Event Details**
- Dedicated page for each event (`/events/[slug]`)
- Comprehensive event information:
  - Full description and overview
  - Event agenda with timeline
  - Tags for categorization
  - Organizer information
  - Date, time, location, and mode
- High-quality images via Cloudinary CDN
- Related events section (based on tags)

### **3. Event Booking**
- Inline booking form on event detail pages
- Email-based registration
- Client-side validation
- Server-side email validation and event verification
- Success/error feedback
- PostHog event tracking for analytics

### **4. Visual Effects**
- Custom WebGL-powered light ray effects using OGL
- Interactive light rays that follow mouse movement
- Configurable parameters (speed, spread, color, length)
- Smooth animations for enhanced UX

### **5. SEO & Performance**
- Server-side rendering for all pages
- Metadata optimization with Next.js Metadata API
- Image optimization with next/image
- Intelligent caching with Next.js 16's cache APIs
- Font optimization with next/font

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devzig

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxx

# Application URL (for API calls)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_BASE_URL=https://devzig.vercel.app  # Production
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20.x or higher
- npm/yarn/pnpm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- PostHog account (optional, for analytics)

### **Installation**

1. **Clone the repository:**
```bash
git clone https://github.com/roy-herzlichkeit/DevZig.git
cd DevZig
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

### **Available Scripts**

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🌐 Deployment

### **Vercel Deployment**

DevZig is optimized for deployment on Vercel.

**Automatic Deployment:**
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables in Vercel settings
4. Deploy

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### **Important Vercel Configuration**

Ensure the following in your Vercel project settings:
- **Framework Preset**: Next.js
- **Node Version**: 20.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### **Environment Variables in Production**

Add all environment variables from `.env` to Vercel:
1. Go to Project Settings → Environment Variables
2. Add each variable with production values
3. Ensure `NEXT_PUBLIC_BASE_URL` points to your production URL

### **Known Deployment Issue: Tailwind CSS v4 on Vercel**

**Issue**: Tailwind CSS v4 uses native bindings that may fail to install on Vercel due to npm's handling of optional dependencies.

**Solution**: Add `@tailwindcss/oxide` to dependencies (already configured in this project):
```json
{
  "dependencies": {
    "@tailwindcss/oxide": "^4.0.0"
  }
}
```

This ensures the Linux x64 native bindings are properly installed during Vercel's build process.

---

## ⚡ Performance Optimizations

### **Caching Strategy**

DevZig uses Next.js 16's new caching APIs for optimal performance:

```typescript
// Example from app/page.tsx
export default async function Page() {
  'use cache';           // Enable caching for this component
  cacheLife('hours');    // Cache for 1 hour
  
  const events = await fetchEvents();
  return <EventList events={events} />;
}
```

**Benefits:**
- Reduced database queries
- Faster page loads
- Lower server costs
- Better user experience

### **Image Optimization**

All images are:
1. Uploaded to Cloudinary for CDN delivery
2. Automatically optimized (format, compression)
3. Served via `next/image` for lazy loading and responsive sizing
4. Configured with remote patterns in `next.config.ts`

### **Code Splitting**

- Next.js automatically splits code by route
- React 19's Server Components reduce client-side JavaScript
- Client components marked with `"use client"` directive

### **Database Connection Pooling**

MongoDB connection is cached in development to prevent multiple connections:
```typescript
// lib/mongodb.ts
const cached: MongooseCache = global.__mongooseCache ?? { conn: null, promise: null };
```

---

## 📊 Analytics & Monitoring

### **PostHog Integration**

DevZig uses PostHog for product analytics and monitoring.

**Tracked Events:**
- `event_booked` - When a user books an event
- Page views (automatic)
- Exceptions (automatic with `capture_exceptions: true`)

**Implementation:**
```typescript
// instrumentation-client.ts
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
```

**Custom Event Tracking:**
```typescript
// components/BookEvent.tsx
posthog.capture('event_booked', {
  eventId,
  slug,
  email: trimmedEmail
});
```

### **Proxy Configuration**

PostHog requests are proxied through Next.js to avoid ad blockers:
```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: "/ingest/:path*",
      destination: "https://us.i.posthog.com/:path*",
    }
  ];
}
```

---

## 🐛 Issues & Solutions

This section documents the challenges faced during development and their resolutions.

### **Issue 1: Deprecated Package Warning - `q@1.5.1`**

**Problem:**
During `npm install`, a deprecation warning appeared:
```bash
npm warn deprecated q@1.5.1: You or someone you depend on is using Q, 
the JavaScript Promise library that gave JavaScript developers strong 
feelings about promises. They can almost certainly migrate to the native 
JavaScript promise now.
```

**Root Cause:**
The `q` package (v1.5.1) is a transitive dependency brought in by `cloudinary@2.8.0`. This is an old Promise library that predates native JavaScript promises.

**Investigation:**
```bash
npm ls q
# Output:
# devzig@0.1.0
# └─┬ cloudinary@2.8.0
#   └── q@1.5.1
```

**Analysis:**
- The warning is informational, not an error
- `cloudinary` is the only package using `q`
- Already using the latest version of `cloudinary` (2.8.0)
- `q` is not directly used in our codebase

**Solution:**
**Recommended approach**: Keep as-is
- The warning is harmless and doesn't affect functionality
- The Cloudinary team will eventually update their package
- Attempting to override with `npm overrides` could break Cloudinary's functionality

**Alternative (Not Recommended):**
Force remove via package overrides:
```json
// package.json
{
  "overrides": {
    "q": "npm:noop-package@1.0.0"
  }
}
```
⚠️ **Warning**: This can break Cloudinary uploads and is not recommended.

**Status**: ✅ Resolved - Accepted as non-critical warning

---

### **Issue 2: Vercel Deployment Failure - Tailwind CSS v4 Native Bindings**

**Problem:**
Deployment to Vercel failed during the build process with the following error:
```bash
Error: Turbopack build failed with 1 errors:
./app/globals.css
Error evaluating Node.js code
Error: Cannot find native binding. npm has a bug related to optional 
dependencies (https://github.com/npm/cli/issues/4828). 
Please try `npm i` again after removing both package-lock.json and 
node_modules directory.
    [at Object.<anonymous> (/vercel/path0/node_modules/@tailwindcss/oxide/index.js:562:11)]

Caused by: Error: Cannot find module '@tailwindcss/oxide-linux-x64-gnu'

Caused by: Error: Cannot find module './tailwindcss-oxide.linux-x64-gnu.node'
```

**Root Cause:**
Tailwind CSS v4 uses native Rust-based bindings (`@tailwindcss/oxide`) for performance. These are marked as optional dependencies in npm, and npm has a known bug ([#4828](https://github.com/npm/cli/issues/4828)) where optional dependencies sometimes fail to install correctly on Linux systems (like Vercel's build servers).

**Impact:**
- Builds worked locally on Windows
- Failed on Vercel's Linux-based build environment
- Missing `tailwindcss-oxide.linux-x64-gnu.node` native module

**Investigation:**
```bash
# Error trace showed:
[at Function._resolveFilename (node:internal/modules/cjs/loader:1383:15)]
# Missing module: @tailwindcss/oxide-linux-x64-gnu
```

**Solution:**
Add `@tailwindcss/oxide` as an explicit dependency (not optional):

```json
// package.json
{
  "dependencies": {
    "@tailwindcss/oxide": "^4.0.0",  // ← Added this
    "class-variance-authority": "^0.7.1",
    // ... other dependencies
  }
}
```

**Why This Works:**
- Making it a regular dependency forces npm to install it
- Ensures Linux x64 native bindings are included in Vercel's build
- Bypasses npm's optional dependency bug

**Verification:**
```bash
npm install
npm run build  # Should succeed locally
# Then deploy to Vercel - build will now succeed
```

**Status**: ✅ Resolved - Added `@tailwindcss/oxide` to dependencies

---

### **Issue 3: Module Resolution Error During Build**

**Problem:**
Build error showing module resolution failure:
```bash
[at Function._resolveFilename (node:internal/modules/cjs/loader:1383:15)]
```

**Connection:**
This was part of the Tailwind CSS v4 native binding issue (Issue #2). The error message was cryptic but pointed to the missing native module.

**Solution:**
Resolved by fixing Issue #2 above.

**Status**: ✅ Resolved - Fixed with Tailwind CSS dependency update

---

### **Lessons Learned**

1. **Optional Dependencies Can Fail**: npm's handling of optional dependencies is unreliable, especially in CI/CD environments like Vercel.

2. **Platform-Specific Native Modules**: When using packages with native bindings (Rust, C++, etc.), ensure platform-specific binaries are available for your deployment target.

3. **Local vs. Production Environment**: Always test builds in an environment that matches production (Linux if deploying to Vercel/Linux servers).

4. **Deprecation Warnings vs. Errors**: Not all npm warnings require immediate action. Distinguish between critical errors and informational warnings.

5. **Transitive Dependencies**: Sometimes the issue isn't in your direct dependencies but in their dependencies. Use `npm ls <package>` to trace dependency trees.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**DevZig** - The ultimate platform for developers to Connect and Grow.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for database services
- Cloudinary for image management
- PostHog for analytics
- The open-source community

---

<div align="center">

Made with Next.js 16, React 19, TypeScript, MongoDB, and Tailwind CSS v4.

</div>

---

## 📝 Documentation Credits

This comprehensive documentation was generated and written by **GitHub Copilot AI Assistant** to help developers understand and contribute to the DevZig project. The documentation covers the complete project architecture, request/response flows, database design, deployment strategies, and best practices implemented in this application.
