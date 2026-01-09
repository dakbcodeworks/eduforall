This is a NextJS project

Ensure Node.js is installed on your machine

To run this on your local machine,
1. Clone the repository
2. run "npm install"
3. run "npm run dev"
4. Make a .env file and include the following environemnt variables
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   MONGODB_URI

Project Structure
eduforall/
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.js
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-config.json
│   │   │   └── hero.jpg
│   │   ├── logo.png
│   │   └── qr-1747326338165.png
│   ├── next.svg
│   ├── settings.json
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   ├── queries/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── gallery-delete/
│   │   │   │   └── route.ts
│   │   │   ├── gallery-list/
│   │   │   │   └── route.ts
│   │   │   ├── gallery-upload/
│   │   │   │   └── route.ts
│   │   │   ├── get-settings/
│   │   │   │   └── route.ts
│   │   │   ├── remove-qr/
│   │   │   │   └── route.ts
│   │   │   ├── save-settings/
│   │   │   │   └── route.ts
│   │   │   ├── test-cloudinary/
│   │   │   │   └── route.ts
│   │   │   └── upload-qr/
│   │   │       └── route.ts
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── donate/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── Navigation.tsx
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   └── mongodb.ts
│   └── models/
│       └── Settings.ts
└── tsconfig.json
