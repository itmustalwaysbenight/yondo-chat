# Yondo - AI Travel Assistant

A modern, minimalist AI travel assistant built with Next.js and the Gemini API.

## Features

- Clean, modern UI with dark mode
- Powered by Google's Gemini 1.5 Flash model
- Travel planning with natural language
- Responsive design
- Minimalist Shadcn/UI inspired interface

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Google Generative AI (Gemini)
- Supabase

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:itmustalwaysbenight/yondo-chat.git
cd yondo-chat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY`: Google Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## License

MIT
