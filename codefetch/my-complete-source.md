```
Project Structure:
├── README.md
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── codefetch
│   └── my-complete-source.md
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── styles
│   └── globals.css
├── tailwind.config.ts
└── tsconfig.json
```

.cursorrules
```
1 | You are a Senior Front-End Developer and an Expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix). You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.
2 | 
3 | - Follow the user’s requirements carefully & to the letter.
4 | - First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
5 | - Confirm, then write code!
6 | - Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines .
7 | - Focus on easy and readability code, over being performant.
8 | - Fully implement all requested functionality.
9 | - Leave NO todo’s, placeholders or missing pieces.
10 | - Ensure code is complete! Verify thoroughly finalised.
11 | - Include all required imports, and ensure proper naming of key components.
12 | - Be concise Minimize any other prose.
13 | - If you think there might not be a correct answer, you say so.
14 | - If you do not know the answer, say so, instead of guessing.
15 | 
16 | ### Coding Environment
17 | The user asks questions about the following coding languages:
18 | - ReactJS
19 | - NextJS
20 | - JavaScript
21 | - TypeScript
22 | - TailwindCSS
23 | - HTML
24 | - CSS
25 | 
26 | ### Code Implementation Guidelines
27 | Follow these rules when you write code:
28 | - Use early returns whenever possible to make the code more readable.
29 | - Always use Tailwind classes for styling HTML elements; avoid using CSS or tags.
30 | - Use “class:” instead of the tertiary operator in class tags whenever possible.
31 | - Use descriptive variable and function/const names. Also, event functions should be named with a “handle” prefix, like “handleClick” for onClick and “handleKeyDown” for onKeyDown.
32 | - Implement accessibility features on elements. For example, a tag should have a tabindex=“0”, aria-label, on:click, and on:keydown, and similar attributes.
33 | - Use consts instead of functions, for example, “const toggle = () =>”. Also, define a type if possible.
34 | 
35 | ### General
36 | - Always ask to see documentations if unsure
37 | - Always ask questions if unsure
38 | - Never assume that things are set up on third party sites - always confirm
```

app/auth/callback/route.ts
```
1 | import { createServerClient } from '@supabase/ssr';
2 | import { cookies } from 'next/headers';
3 | import { NextResponse } from 'next/server';
4 | 
5 | export async function GET(request: Request) {
6 |   const requestUrl = new URL(request.url);
7 |   const code = requestUrl.searchParams.get('code');
8 | 
9 |   if (code) {
10 |     const cookieStore = await cookies();
11 |     const supabase = createServerClient(
12 |       process.env.NEXT_PUBLIC_SUPABASE_URL!,
13 |       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
14 |       {
15 |         cookies: {
16 |           get(name: string) {
17 |             return cookieStore.get(name)?.value;
18 |           },
19 |           set(name: string, value: string, options: any) {
20 |             cookieStore.set({ name, value, ...options });
21 |           },
22 |           remove(name: string, options: any) {
23 |             cookieStore.set({ name, value: '', ...options });
24 |           },
25 |         },
26 |       }
27 |     );
28 |     await supabase.auth.exchangeCodeForSession(code);
29 |   }
30 | 
31 |   // URL to redirect to after sign in process completes
32 |   return NextResponse.redirect(new URL('/', requestUrl.origin));
33 | } 
```

app/auth/login/page.tsx
```
1 | 'use client';
2 | 
3 | import { signInWithGoogle } from '../../../lib/supabase/client';
4 | 
5 | export default function LoginPage() {
6 |   return (
7 |     <div className="min-h-screen flex items-center justify-center bg-gray-900">
8 |       <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
9 |         <div>
10 |           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
11 |             Sign in to your account
12 |           </h2>
13 |         </div>
14 |         <div>
15 |           <button
16 |             onClick={signInWithGoogle}
17 |             className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
18 |           >
19 |             <span className="absolute left-0 inset-y-0 flex items-center pl-3">
20 |               <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
21 |                 <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.332-1.459,2.379-2.799,2.379h-2.545c-1.39,0-2.545-1.155-2.545-2.545v-2.545c0-1.39,1.155-2.545,2.545-2.545h2.545c1.34,0,2.432,1.047,2.799,2.379h-3.536C13.4,10.242,12.545,11.097,12.545,12.151z" />
22 |               </svg>
23 |             </span>
24 |             Sign in with Google
25 |           </button>
26 |         </div>
27 |       </div>
28 |     </div>
29 |   );
30 | } 
```

app/components/chat/ChatContainer.tsx
```
1 | // Path: app/components/chat/ChatContainer.tsx
2 | 'use client';
3 | 
4 | import { useChat } from '../../hooks/useChat';
5 | import { supabase } from '../../lib/supabase/client';
6 | import { useRouter } from 'next/navigation';
7 | import ChatMessage from './ChatMessage';
8 | import ChatInput from './ChatInput';
9 | import ChatHeader from './ChatHeader';
10 | import { useEffect, useRef } from 'react';
11 | 
12 | interface Message {
13 |   content: string;
14 |   role: string;
15 | }
16 | 
17 | export default function ChatContainer() {
18 |   const { messages, isLoading, error, sendMessage, addMessage: hookAddMessage } = useChat();
19 |   const router = useRouter();
20 |   const messagesEndRef = useRef<HTMLDivElement>(null);
21 | 
22 |   const scrollToBottom = () => {
23 |     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
24 |   };
25 | 
26 |   useEffect(() => {
27 |     scrollToBottom();
28 |   }, [messages]); // Scroll when messages change
29 | 
30 |   const handleSignOut = async () => {
31 |     const { error } = await supabase.auth.signOut();
32 |     if (error) {
33 |       console.error('Error signing out:', error.message);
34 |       return;
35 |     }
36 |     router.push('/login');
37 |   };
38 | 
39 |   const addMessage = (content: string) => {
40 |     console.log('ChatContainer: Adding message:', content);
41 |     hookAddMessage(content);
42 |   };
43 | 
44 |   useEffect(() => {
45 |     console.log('Current messages:', messages);
46 |   }, [messages]);
47 | 
48 |   return (
49 |     <div className="flex flex-col h-screen bg-[#343541]">
50 |       <ChatHeader onSignOut={handleSignOut} addMessage={addMessage} />
51 |       <div className="flex-1 overflow-hidden relative">
52 |         <div className="h-full overflow-y-auto" id="chat-messages">
53 |           <div className="max-w-2xl mx-auto px-4">
54 |             {error && (
55 |               <div className="mt-4 p-4 bg-red-900/10 border border-red-900/20 text-red-400 rounded-md text-sm">
56 |                 {error}
57 |               </div>
58 |             )}
59 |             <div className="space-y-6 pb-32 pt-8">
60 |               {messages.map((message: Message, index: number) => (
61 |                 <ChatMessage
62 |                   key={index}
63 |                   role={message.role}
64 |                   content={message.content}
65 |                 />
66 |               ))}
67 |               <div ref={messagesEndRef} /> {/* Scroll anchor */}
68 |             </div>
69 |           </div>
70 |         </div>
71 |         <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-[#343541]/0 to-[#343541] pt-32 pb-8">
72 |           <div className="max-w-2xl mx-auto px-4">
73 |             <ChatInput onSend={sendMessage} disabled={isLoading} />
74 |           </div>
75 |         </div>
76 |       </div>
77 |     </div>
78 |   );
79 | }
```

app/components/chat/ChatHeader.tsx
```
1 | // Path: app/components/chat/ChatHeader.tsx
2 | 'use client';
3 | 
4 | import { supabase, checkUserTrips } from '../../lib/supabase/client';
5 | import { formatTravelPlans } from '../../lib/gemini/client';
6 | 
7 | interface ChatHeaderProps {
8 |   onSignOut: () => void;
9 |   addMessage: (content: string) => void;
10 | }
11 | 
12 | export default function ChatHeader({ onSignOut, addMessage }: ChatHeaderProps) {
13 |   const handleCheckTrips = async () => {
14 |     console.log('🔍 Check Trips button clicked');
15 |     try {
16 |       const trips = await checkUserTrips();
17 |       if (trips) {
18 |         const formattedTrips = await formatTravelPlans(trips);
19 |         addMessage(formattedTrips);
20 |       }
21 |     } catch (error) {
22 |       console.error('Error checking trips:', error);
23 |       addMessage("Sorry, I couldn't retrieve your trips right now.");
24 |     }
25 |   };
26 | 
27 |   const handleSignOut = async () => {
28 |     try {
29 |       await supabase.auth.signOut();
30 |       window.location.href = '/login';
31 |     } catch (error) {
32 |       console.error('Error signing out:', error);
33 |     }
34 |   };
35 | 
36 |   return (
37 |     <div className="sticky top-0 z-50 flex items-center justify-between p-8 bg-[#343541]">
38 |       <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans">
39 |         Yondo
40 |       </h1>
41 |       <div className="flex items-center space-x-4">
42 |         <button
43 |           type="button"
44 |           onClick={handleCheckTrips}
45 |           className="px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors border border-gray-600/50"
46 |         >
47 |           Check Trips
48 |         </button>
49 |         <button
50 |           type="button"
51 |           onClick={handleSignOut}
52 |           className="px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors border border-gray-600/50"
53 |         >
54 |           Sign out
55 |         </button>
56 |       </div>
57 |     </div>
58 |   );
59 | }
```

app/components/chat/ChatInput.tsx
```
1 | // Path: app/components/chat/ChatInput.tsx
2 | 'use client';
3 | 
4 | import { useState, FormEvent } from 'react';
5 | 
6 | interface ChatInputProps {
7 |   onSend: (message: string) => void;
8 |   disabled?: boolean;
9 | }
10 | 
11 | export default function ChatInput({ onSend, disabled }: ChatInputProps) {
12 |   const [message, setMessage] = useState('');
13 | 
14 |   const handleSubmit = (e: FormEvent) => {
15 |     e.preventDefault();
16 |     if (message.trim() && !disabled) {
17 |       onSend(message.trim());
18 |       setMessage('');
19 |     }
20 |   };
21 | 
22 |   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
23 |     if (e.key === 'Enter' && !e.shiftKey) {
24 |       e.preventDefault();
25 |       handleSubmit(e as unknown as FormEvent);
26 |     }
27 |   };
28 | 
29 |   return (
30 |     <form onSubmit={handleSubmit} className="flex flex-row lg:max-w-4xl lg:mx-auto md:mx-4 mx-2">
31 |       <div className="relative flex flex-1">
32 |         <textarea
33 |           value={message}
34 |           onChange={(e) => setMessage(e.target.value)}
35 |           onKeyDown={handleKeyDown}
36 |           disabled={disabled}
37 |           placeholder="Send a message"
38 |           rows={1}
39 |           className="w-full resize-none bg-[#3a3b42] border border-gray-600/50 p-4 pr-12 text-white focus:ring-0 focus-visible:ring-0 focus:outline-none focus:border-gray-400 rounded-xl transition-colors text-base"
40 |           style={{ maxHeight: '200px', height: '60px', overflowY: 'hidden' }}
41 |         />
42 |         <button
43 |           type="submit"
44 |           disabled={!message.trim() || disabled}
45 |           className="absolute right-3 bottom-3.5 p-1 text-gray-400 hover:text-gray-200 disabled:hover:bg-transparent disabled:opacity-40"
46 |         >
47 |           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
48 |             <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
49 |           </svg>
50 |         </button>
51 |       </div>
52 |     </form>
53 |   );
54 | }
```

app/components/chat/ChatMessage.tsx
```
1 | // Path: app/components/chat/ChatMessage.tsx
2 | 'use client';
3 | 
4 | interface ChatMessageProps {
5 |   role: string;
6 |   content: string;
7 | }
8 | 
9 | export default function ChatMessage({ role, content }: ChatMessageProps) {
10 |   const isUser = role === 'user';
11 | 
12 |   return (
13 |     <div className={`group w-full text-gray-100 border-b border-black/10 ${isUser ? 'bg-[#343541]' : 'bg-[#444654]'}`}>
14 |       <div className="max-w-2xl mx-auto flex gap-6 p-6 text-lg">
15 |         <div className="min-w-[40px] text-right font-semibold">
16 |           {isUser ? 'You' : 'AI'}
17 |         </div>
18 |         <div className="prose prose-invert prose-lg flex-1">
19 |           <p className="whitespace-pre-wrap leading-relaxed">
20 |             {content}
21 |           </p>
22 |         </div>
23 |       </div>
24 |     </div>
25 |   );
26 | }
```

app/globals.css
```
1 | /* Path: app/globals.css */
2 | @tailwind base;
3 | @tailwind components;
4 | @tailwind utilities;
5 | 
6 | @layer base {
7 |   :root {
8 |     --background: 0 0% 100%;
9 |     --foreground: 222.2 47.4% 11.2%;
10 |     --muted: 210 40% 96.1%;
11 |     --muted-foreground: 215.4 16.3% 46.9%;
12 |     --popover: 0 0% 100%;
13 |     --popover-foreground: 222.2 47.4% 11.2%;
14 |     --border: 214.3 31.8% 91.4%;
15 |     --input: 214.3 31.8% 91.4%;
16 |     --primary: 222.2 47.4% 11.2%;
17 |     --primary-foreground: 210 40% 98%;
18 |     --secondary: 210 40% 96.1%;
19 |     --secondary-foreground: 222.2 47.4% 11.2%;
20 |     --accent: 210 40% 96.1%;
21 |     --accent-foreground: 222.2 47.4% 11.2%;
22 |     --destructive: 0 100% 50%;
23 |     --destructive-foreground: 210 40% 98%;
24 |     --ring: 215 20.2% 65.1%;
25 |     --radius: 0.5rem;
26 |   }
27 | }
```

app/hooks/useChat.ts
```
1 | 'use client';
2 | 
3 | import { useState, useEffect } from 'react';
4 | import { getTravelResponse } from '../lib/gemini/client';
5 | import { supabase, createTravelPlan, getCurrentUser } from '../lib/supabase/client';
6 | import { useRouter } from 'next/navigation';
7 | 
8 | interface Message {
9 |   content: string;
10 |   role: string;
11 | }
12 | 
13 | export const useChat = () => {
14 |   const [messages, setMessages] = useState<Message[]>([
15 |     { role: 'assistant', content: 'This is Yondo. Where are you going?' }
16 |   ]);
17 |   const [isLoading, setIsLoading] = useState(false);
18 |   const [error, setError] = useState<string | null>(null);
19 |   const [userId, setUserId] = useState<string | null>(null);
20 | 
21 |   useEffect(() => {
22 |     const checkUser = async () => {
23 |       try {
24 |         const { data: { user }, error } = await supabase.auth.getUser();
25 |         if (error) throw error;
26 |         if (user) {
27 |           setUserId(user.id);
28 |         } else {
29 |           window.location.href = '/login';
30 |         }
31 |       } catch (error) {
32 |         console.error('Error getting user:', error);
33 |         setError(error instanceof Error ? error.message : 'An error occurred');
34 |       }
35 |     };
36 |     checkUser();
37 |   }, []);
38 | 
39 |   const addMessage = (content: string) => {
40 |     console.log('Previous messages:', messages);
41 |     setMessages(prev => {
42 |       const newMessages = [...prev, { content, role: 'assistant' }];
43 |       console.log('New messages:', newMessages);
44 |       return newMessages;
45 |     });
46 |   };
47 | 
48 |   const updateLastMessage = (content: string) => {
49 |     setMessages(prev => {
50 |       const newMessages = [...prev];
51 |       if (newMessages.length > 0) {
52 |         newMessages[newMessages.length - 1] = {
53 |           ...newMessages[newMessages.length - 1],
54 |           content: newMessages[newMessages.length - 1].content + content
55 |         };
56 |       }
57 |       return newMessages;
58 |     });
59 |   };
60 | 
61 |   const sendMessage = async (content: string) => {
62 |     if (!userId) {
63 |       setError('Chat not initialized');
64 |       return;
65 |     }
66 | 
67 |     try {
68 |       setIsLoading(true);
69 |       setError(null);
70 | 
71 |       // Add user message
72 |       const userMessage = { content, role: 'user' };
73 |       setMessages(prev => [...prev, userMessage]);
74 | 
75 |       // Add empty assistant message that will be updated
76 |       setMessages(prev => [...prev, { content: '', role: 'assistant' }]);
77 | 
78 |       // Get streaming response
79 |       await getTravelResponse(
80 |         content,
81 |         messages,
82 |         userId,
83 |         (partialResponse) => {
84 |           updateLastMessage(partialResponse);
85 |         }
86 |       );
87 | 
88 |       setIsLoading(false);
89 |     } catch (error) {
90 |       console.error('Error in sendMessage:', error);
91 |       setError(error instanceof Error ? error.message : 'An error occurred');
92 |       setIsLoading(false);
93 |     }
94 |   };
95 | 
96 |   return {
97 |     messages,
98 |     isLoading,
99 |     error,
100 |     sendMessage,
101 |     addMessage
102 |   };
103 | };
```

app/layout.tsx
```
1 | // Path: app/layout.tsx
2 | import type { Metadata } from "next";
3 | import { Inter } from "next/font/google";
4 | import "./globals.css";
5 | 
6 | const inter = Inter({ subsets: ["latin"] });
7 | 
8 | export const metadata: Metadata = {
9 |   title: "Travel Assistant",
10 |   description: "Your AI-powered travel planning companion",
11 | };
12 | 
13 | export default function RootLayout({
14 |   children,
15 | }: Readonly<{
16 |   children: React.ReactNode;
17 | }>) {
18 |   return (
19 |     <html lang="en">
20 |       <body className={inter.className}>{children}</body>
21 |     </html>
22 |   );
23 | }
```

app/lib/gemini/client.ts
```
1 | // Path: app/lib/gemini/client.ts
2 | 'use client';
3 | 
4 | import { GoogleGenerativeAI } from '@google/generative-ai';
5 | import { createTravelPlan, deleteTravelPlan, getCurrentUser, getTravelPlans, updateTravelPlan, deleteAllTravelPlans } from '../supabase/client';
6 | 
7 | if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
8 |   throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
9 | }
10 | 
11 | const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
12 | 
13 | const getCurrentDateInfo = () => {
14 |   const now = new Date();
15 |   return {
16 |     currentDate: now.toISOString().split('T')[0],
17 |     currentYear: now.getFullYear()
18 |   };
19 | };
20 | 
21 | const { currentDate, currentYear } = getCurrentDateInfo();
22 | 
23 | const SYSTEM_PROMPT = `You are Yondo, a travel assistant focused exclusively on helping users plan and manage their trips. 
24 | 
25 | When users mention a destination and dates for a new trip, respond with:
26 | {
27 |   "function": "storeTravelPlan",
28 |   "parameters": {
29 |     "destination": "city",
30 |     "start_date": "YYYY-MM-DD",
31 |     "end_date": "YYYY-MM-DD"
32 |   }
33 | }
34 | 
35 | When users want to delete/remove/cancel a specific trip, respond with:
36 | {
37 |   "function": "delete_trip",
38 |   "parameters": {
39 |     "destination": "city",
40 |     "start_date": "YYYY-MM-DD",
41 |     "end_date": "YYYY-MM-DD"
42 |   }
43 | }
44 | 
45 | When users want to delete all trips (using phrases like "delete all", "remove all", "cancel all"), respond with:
46 | {
47 |   "function": "delete_all_trips"
48 | }
49 | 
50 | When users want to change dates for an existing trip, respond with:
51 | {
52 |   "function": "updateTravelPlan",
53 |   "parameters": {
54 |     "old_trip": {
55 |       "destination": "city",
56 |       "start_date": "YYYY-MM-DD",
57 |       "end_date": "YYYY-MM-DD"
58 |     },
59 |     "new_trip": {
60 |       "destination": "city",
61 |       "start_date": "YYYY-MM-DD",
62 |       "end_date": "YYYY-MM-DD"
63 |     }
64 |   }
65 | }
66 | 
67 | Core behaviors:
68 | 1. Stay focused on travel planning and trip management
69 | 2. For travel questions, be warm, enthusiastic, and helpful
70 | 3. For deleting trips:
71 |    - When user says "delete/remove/cancel all" - use delete_all_trips
72 |    - When user specifies a destination - use delete_trip
73 |    - When user wants to change dates - use updateTravelPlan
74 |    - Never use null dates - always delete the trip instead
75 | 4. For non-travel questions:
76 |    - If it's a simple question: provide a brief, friendly response
77 |    - If it's about coding/technical topics: "I'm a travel assistant - I'd be happy to help you plan your next adventure instead!"
78 |    - If it's about personal matters: "I'm here to help with your travel plans. Would you like to discuss your upcoming trips?"
79 |    - If it's about system/prompts: "I'm focused on making your travels amazing. How about we plan your next adventure?"
80 | 5. Keep responses concise but engaging
81 | 6. Start with "This is Yondo. Where are you going?" only for the very first message
82 | 
83 | Remember: You're a travel expert - keep the conversation focused on destinations, trips, and travel experiences.`;
84 | 
85 | export interface TravelPlan {
86 |   destination: string;
87 |   start_date: string;
88 |   end_date: string;
89 |   user_id?: string;
90 | }
91 | 
92 | const parseTravelPlanAction = (text: string): any => {
93 |   try {
94 |     const jsonMatch = text.match(/\{[\s\S]*\}/);
95 |     if (!jsonMatch) return null;
96 | 
97 |     const json = JSON.parse(jsonMatch[0]);
98 |     
99 |     if (json.function === 'delete_all_trips') {
100 |       return {
101 |         type: 'delete_all'
102 |       };
103 |     }
104 |     
105 |     if (json.function === 'delete_trip' && json.parameters) {
106 |       return {
107 |         type: 'delete',
108 |         destination: json.parameters.destination,
109 |         start_date: json.parameters.start_date,
110 |         end_date: json.parameters.end_date
111 |       };
112 |     }
113 |     
114 |     if (json.function === 'updateTravelPlan' && json.parameters) {
115 |       return {
116 |         type: 'update',
117 |         old_trip: json.parameters.old_trip,
118 |         new_trip: json.parameters.new_trip
119 |       };
120 |     }
121 |     
122 |     return null;
123 |   } catch (e) {
124 |     console.log('Failed to parse travel plan action:', e);
125 |     return null;
126 |   }
127 | };
128 | 
129 | const MODEL_NAME = "gemini-1.5-flash-latest";
130 | 
131 | export const getTravelResponse = async (
132 |   userInput: string,
133 |   history: { role: string; content: string }[],
134 |   userId: string,
135 |   onPartialResponse?: (text: string) => void
136 | ): Promise<string> => {
137 |   try {
138 |     // Skip processing if the input looks like an error message or log
139 |     if (userInput.includes('client.ts:') || 
140 |         userInput.includes('Attempting to parse JSON from:') ||
141 |         userInput.includes('❌ Failed to parse JSON:')) {
142 |       return "I didn't quite understand that. Could you please tell me where you'd like to travel?";
143 |     }
144 | 
145 |     const model = genAI.getGenerativeModel({ model: MODEL_NAME });
146 |     const chat = model.startChat({
147 |       history: [
148 |         {
149 |           role: 'user',
150 |           parts: [{ text: SYSTEM_PROMPT }]
151 |         },
152 |         ...(history.length === 0 ? [{
153 |           role: 'model',
154 |           parts: [{ text: "This is Yondo. Where are you going?" }]
155 |         }] : []),
156 |         ...history.map(msg => ({
157 |           role: msg.role === 'user' ? 'user' : 'model',
158 |           parts: [{ text: msg.content }]
159 |         }))
160 |       ],
161 |       generationConfig: {
162 |         temperature: 0.7,
163 |         maxOutputTokens: 500,
164 |       }
165 |     });
166 | 
167 |     // For trip listing requests, fetch and format trips
168 |     if (userInput.toLowerCase().includes('trips') || userInput.toLowerCase().includes('plans')) {
169 |       const user = await getCurrentUser();
170 |       if (!user?.id) {
171 |         throw new Error('No user ID found');
172 |       }
173 |       const trips = await getTravelPlans(user.id);
174 |       const formattedResponse = await formatTravelPlans(trips);
175 |       
176 |       // Stream the formatted response word by word
177 |       const words = formattedResponse.split(/(?<=\s)/);
178 |       let streamedResponse = '';
179 |       
180 |       for (const word of words) {
181 |         streamedResponse += word;
182 |         if (onPartialResponse) {
183 |           onPartialResponse(word);
184 |           await new Promise(resolve => setTimeout(resolve, 50));
185 |         }
186 |       }
187 |       
188 |       return formattedResponse;
189 |     }
190 | 
191 |     const result = await chat.sendMessage(userInput);
192 |     let fullResponse = '';
193 |     
194 |     // Handle streaming response
195 |     const response = await result.response;
196 |     const chunks = response.text().split(/(?<=\s)/);
197 |     for (const chunk of chunks) {
198 |       fullResponse += chunk;
199 |       
200 |       // Call the callback with each chunk if provided
201 |       if (onPartialResponse) {
202 |         onPartialResponse(chunk);
203 |         // Add a small delay to simulate natural typing
204 |         await new Promise(resolve => setTimeout(resolve, 50));
205 |       }
206 |     }
207 |     
208 |     console.log('Raw response:', fullResponse);
209 | 
210 |     // Check for update/deletion request
211 |     const action = parseTravelPlanAction(fullResponse);
212 |     if (action?.type === 'delete_all') {
213 |       try {
214 |         await deleteAllTravelPlans(userId);
215 |         const response = "I've deleted all your trips. Ready to plan your next adventure?";
216 |         if (onPartialResponse) {
217 |           onPartialResponse(response);
218 |         }
219 |         return response;
220 |       } catch (error) {
221 |         const errorMsg = `I couldn't delete all trips. ${error instanceof Error ? error.message : 'Please try again.'}`;
222 |         if (onPartialResponse) {
223 |           onPartialResponse(errorMsg);
224 |         }
225 |         return errorMsg;
226 |       }
227 |     } else if (action?.type === 'update') {
228 |       try {
229 |         await updateTravelPlan(userId, action.old_trip, action.new_trip);
230 |         const response = `Perfect! I've updated your trip to ${action.new_trip.destination} for ${action.new_trip.start_date} to ${action.new_trip.end_date}.`;
231 |         if (onPartialResponse) {
232 |           onPartialResponse(response);
233 |         }
234 |         return response;
235 |       } catch (error) {
236 |         const errorMsg = `I couldn't update that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
237 |         if (onPartialResponse) {
238 |           onPartialResponse(errorMsg);
239 |         }
240 |         return errorMsg;
241 |       }
242 |     } else if (action?.type === 'delete') {
243 |       try {
244 |         await deleteTravelPlan(userId, action.destination, action.start_date, action.end_date);
245 |         const response = `I've deleted your trip to ${action.destination} from ${action.start_date} to ${action.end_date}. Would you like to see your remaining trips?`;
246 |         if (onPartialResponse) {
247 |           onPartialResponse(response);
248 |         }
249 |         return response;
250 |       } catch (error) {
251 |         const errorMsg = `I couldn't delete that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
252 |         if (onPartialResponse) {
253 |           onPartialResponse(errorMsg);
254 |         }
255 |         return errorMsg;
256 |       }
257 |     }
258 | 
259 |     // Try to parse JSON from the response
260 |     if (fullResponse) {
261 |       try {
262 |         console.log('Attempting to parse JSON from:', fullResponse);
263 |         
264 |         // Extract JSON block using regex - look for content between ```json and ``` or just {}
265 |         const jsonMatch = fullResponse.match(/```json\n?([\s\S]*?)\n?```|(\{[\s\S]*\})/);
266 |         if (!jsonMatch) {
267 |           console.log('❌ No JSON block found in response');
268 |           return fullResponse;
269 |         }
270 |         
271 |         // Use the first matching group (between ``` ```) or second group (just {})
272 |         const jsonString = (jsonMatch[1] || jsonMatch[2]).trim();
273 |         console.log('Extracted JSON string:', jsonString);
274 |         
275 |         const parsed = JSON.parse(jsonString);
276 |         console.log('Successfully parsed JSON:', parsed);
277 |         
278 |         if (parsed.function === 'storeTravelPlan' && parsed.parameters) {
279 |           console.log('✅ Valid function call detected');
280 |           console.log('Function name:', parsed.function);
281 |           console.log('Parameters:', parsed.parameters);
282 |           
283 |           const confirmation = await handleStoreTravelPlan(parsed.parameters, userId);
284 |           console.log('Got confirmation:', confirmation);
285 |           if (onPartialResponse) {
286 |             onPartialResponse(confirmation);
287 |           }
288 |           return confirmation;
289 |         } else {
290 |           console.log('❌ Not a valid function call:', parsed);
291 |         }
292 |       } catch (e) {
293 |         // Not JSON or not in the expected format, just return the response
294 |         console.log('❌ Failed to parse JSON:', e);
295 |         console.log('Raw text was:', fullResponse);
296 |       }
297 |     } else {
298 |       console.log('❌ No text in response');
299 |     }
300 |     
301 |     return fullResponse || "I didn't understand that. Could you please try again?";
302 |   } catch (error) {
303 |     console.error('Error in getTravelResponse:', error);
304 |     throw error;
305 |   }
306 | };
307 | 
308 | export const handleStoreTravelPlan = async (
309 |   info: TravelPlan,
310 |   userId: string
311 | ) => {
312 |   console.log('\n🔍 HANDLING TRAVEL PLAN');
313 |   console.log('Current User ID:', userId);
314 |   console.log('Travel Info:', info);
315 |   
316 |   try {
317 |     console.log('\n=== STORING TRAVEL PLAN ===');
318 |     console.log('📍 Destination:', info.destination);
319 |     console.log('📅 Start date:', info.start_date);
320 |     console.log('📅 End date:', info.end_date);
321 |     console.log('👤 User ID:', userId);
322 |     
323 |     const storedPlan = await createTravelPlan(
324 |       userId,
325 |       info.destination,
326 |       info.start_date,
327 |       info.end_date
328 |     );
329 |     
330 |     console.log('\n✅ TRAVEL PLAN STORED SUCCESSFULLY');
331 |     console.log('ID:', storedPlan.id);
332 |     console.log('User ID:', storedPlan.user_id);
333 |     console.log('Created at:', storedPlan.created_at);
334 |     console.log('===========================\n');
335 |     
336 |     return `Great! I've saved your trip to ${info.destination} from ${info.start_date} to ${info.end_date}.`;
337 |   } catch (error) {
338 |     console.log('\n❌ FAILED TO STORE TRAVEL PLAN');
339 |     console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
340 |     console.log('===========================\n');
341 |     return `I've noted your trip to ${info.destination} from ${info.start_date} to ${info.end_date}, but there was an issue saving it.`;
342 |   }
343 | };
344 | 
345 | const cleanupSpaces = (text: string): string => {
346 |   return text.replace(/\s+/g, ' ').trim();
347 | };
348 | 
349 | export const formatTravelPlans = async (plans: TravelPlan[]) => {
350 |   if (plans.length === 0) {
351 |     return "You don't have any trips planned yet. Would you like to plan one?";
352 |   }
353 | 
354 |   // Filter out any invalid trips (those with null or undefined dates)
355 |   const validPlans = plans.filter(plan => 
356 |     plan.start_date && 
357 |     plan.end_date && 
358 |     plan.start_date !== 'null' && 
359 |     plan.end_date !== 'null'
360 |   );
361 | 
362 |   // Sort plans chronologically
363 |   validPlans.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
364 | 
365 |   const model = genAI.getGenerativeModel({ 
366 |     model: MODEL_NAME,
367 |     generationConfig: {
368 |       temperature: 0.7,
369 |       maxOutputTokens: 500,
370 |     }
371 |   });
372 | 
373 |   const prompt = `List the user's travel plans clearly and directly. This is in response to them checking their trips.
374 | 
375 | Current trips (${validPlans.length} total):
376 | ${validPlans.map(plan => `- ${plan.destination} from ${plan.start_date} to ${plan.end_date}`).join('\n')}
377 | 
378 | Guidelines:
379 | - Start with "You have ${validPlans.length === 1 ? 'one trip' : validPlans.length + ' trips'} booked:"
380 | - List trips chronologically (they are already sorted)
381 | - Format dates naturally (like "mid-March" or "late October")
382 | - Be clear and direct about what's actually booked
383 | - Don't mention invalid or incomplete trips
384 | - Don't ask questions about planning more trips
385 | - Don't speculate about potential future trips
386 | - Keep it factual but warm
387 | - Avoid double spaces between words
388 | 
389 | Example good responses:
390 | For multiple trips:
391 | "You have 3 trips booked: Athens from March 15th to 22nd, Cologne from September 5th to 7th, and Rome from November 1st to 7th. All set!"
392 | 
393 | For one trip:
394 | "You have one trip booked: Athens from March 15th to 22nd. The spring weather should be lovely!"
395 | 
396 | Remember: Only mention valid, confirmed trips with actual dates. Use single spaces between words.`;
397 | 
398 |   try {
399 |     const result = await model.generateContent(prompt);
400 |     const response = await result.response;
401 |     return cleanupSpaces(response.text() || "Error formatting your trips.");
402 |   } catch (error) {
403 |     console.error('Error formatting travel plans:', error);
404 |     return "Sorry, I couldn't retrieve your trips right now.";
405 |   }
406 | };
```

app/lib/supabase/client.ts
```
1 | // Path: app/lib/supabase/client.ts
2 | import { createBrowserClient } from '@supabase/ssr';
3 | 
4 | export const supabase = createBrowserClient(
5 |   process.env.NEXT_PUBLIC_SUPABASE_URL!,
6 |   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
7 | );
8 | 
9 | export const signInWithGoogle = async () => {
10 |   const { error } = await supabase.auth.signInWithOAuth({
11 |     provider: 'google',
12 |     options: {
13 |       redirectTo: `${window.location.origin}/auth/callback`,
14 |     },
15 |   });
16 | 
17 |   if (error) {
18 |     console.error('Error signing in:', error.message);
19 |     throw error;
20 |   }
21 | };
22 | 
23 | export const getCurrentUser = async () => {
24 |   try {
25 |     const { data: { user }, error } = await supabase.auth.getUser();
26 |     if (error) throw error;
27 |     return user;
28 |   } catch (error) {
29 |     console.error('Error getting user:', error);
30 |     throw error;
31 |   }
32 | };
33 | 
34 | export const checkUserTrips = async () => {
35 |   try {
36 |     console.log('\n=== CHECKING USER INFO ===');
37 |     const user = await getCurrentUser();
38 |     
39 |     if (!user) {
40 |       const error = 'No user logged in - please sign in first';
41 |       console.error('❌', error);
42 |       throw new Error(error);
43 |     }
44 | 
45 |     console.log('✅ User found:');
46 |     console.log('User ID:', user.id);
47 |     console.log('Email:', user.email);
48 |     console.log('===============================\n');
49 |     
50 |     const trips = await getTravelPlans(user.id);
51 |     
52 |     if (!trips || trips.length === 0) {
53 |       console.log('ℹ️ No trips found for this user');
54 |       return [];
55 |     }
56 |     
57 |     console.log('✅ Found', trips.length, 'trips:');
58 |     trips.forEach((trip, index) => {
59 |       console.log(`\nTrip ${index + 1}:`);
60 |       console.log('🌍 Destination:', trip.destination);
61 |       console.log('📅 Start:', trip.start_date);
62 |       console.log('📅 End:', trip.end_date);
63 |     });
64 |     
65 |     return trips;
66 |   } catch (error) {
67 |     console.error('\n❌ ERROR IN checkUserTrips');
68 |     if (error instanceof Error) {
69 |       console.error('Message:', error.message);
70 |     } else {
71 |       console.error('Unknown error:', error);
72 |     }
73 |     console.error('===============================\n');
74 |     throw error;
75 |   }
76 | };
77 | 
78 | export interface TravelPlan {
79 |   id: string;
80 |   user_id: string;
81 |   destination: string;
82 |   start_date: string;
83 |   end_date: string;
84 |   created_at: string;
85 | }
86 | 
87 | export const getTravelPlans = async (userId: string) => {
88 |   try {
89 |     console.log('\n=== FETCHING TRAVEL PLANS ===');
90 |     console.log('User ID:', userId);
91 | 
92 |     const { data, error } = await supabase
93 |       .from('travel_plans')
94 |       .select('*')
95 |       .eq('user_id', userId)
96 |       .order('created_at', { ascending: false });
97 | 
98 |     if (error) {
99 |       console.error('\n❌ ERROR FETCHING TRAVEL PLANS');
100 |       console.error('Message:', error.message);
101 |       console.error('Details:', error.details);
102 |       throw error;
103 |     }
104 | 
105 |     console.log('\n✅ TRAVEL PLANS FETCHED');
106 |     console.log('Number of plans:', data?.length);
107 |     console.log('Plans:', data);
108 |     console.log('===============================\n');
109 | 
110 |     return data;
111 |   } catch (error) {
112 |     console.error('\n❌ UNEXPECTED ERROR');
113 |     console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
114 |     console.error('===============================\n');
115 |     throw error;
116 |   }
117 | };
118 | 
119 | export const createTravelPlan = async (userId: string, destination: string, startDate: string, endDate: string) => {
120 |   try {
121 |     console.log('\n=== CREATING TRAVEL PLAN IN SUPABASE ===');
122 |     console.log('User ID:', userId);
123 |     console.log('Destination:', destination);
124 |     console.log('Start Date:', startDate);
125 |     console.log('End Date:', endDate);
126 | 
127 |     const { data, error } = await supabase
128 |       .from('travel_plans')
129 |       .insert([
130 |         {
131 |           user_id: userId,
132 |           destination: destination.toLowerCase(),
133 |           start_date: startDate,
134 |           end_date: endDate,
135 |         },
136 |       ])
137 |       .select()
138 |       .single();
139 | 
140 |     if (error) {
141 |       console.error('\n❌ SUPABASE ERROR');
142 |       console.error('Message:', error.message);
143 |       console.error('Details:', error.details);
144 |       console.error('Hint:', error.hint);
145 |       console.error('Code:', error.code);
146 |       throw error;
147 |     }
148 | 
149 |     console.log('\n✅ TRAVEL PLAN CREATED');
150 |     console.log('Stored Data:', data);
151 |     console.log('===============================\n');
152 | 
153 |     // Fetch and log all travel plans after creating a new one
154 |     await getTravelPlans(userId);
155 | 
156 |     return data;
157 |   } catch (error) {
158 |     console.error('\n❌ UNEXPECTED ERROR');
159 |     console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
160 |     console.error('===============================\n');
161 |     throw error;
162 |   }
163 | };
164 | 
165 | export const deleteTravelPlan = async (userId: string, destination: string, start_date: string, end_date: string) => {
166 |   console.log('\n=== DELETING TRAVEL PLAN ===');
167 |   console.log('User ID:', userId);
168 |   console.log('Destination:', destination);
169 |   console.log('Start Date:', start_date);
170 |   console.log('End Date:', end_date);
171 | 
172 |   try {
173 |     const { data, error } = await supabase
174 |       .from('travel_plans')
175 |       .delete()
176 |       .match({
177 |         user_id: userId,
178 |         destination: destination.toLowerCase(),
179 |         start_date,
180 |         end_date
181 |       })
182 |       .select();
183 | 
184 |     if (error) throw error;
185 | 
186 |     console.log('\n✅ TRAVEL PLAN DELETED');
187 |     console.log('Deleted Data:', data);
188 |     console.log('===========================\n');
189 |     
190 |     return data;
191 |   } catch (error) {
192 |     console.log('\n❌ FAILED TO DELETE TRAVEL PLAN');
193 |     console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
194 |     console.log('===========================\n');
195 |     throw error;
196 |   }
197 | };
198 | 
199 | export const updateTravelPlan = async (
200 |   userId: string,
201 |   oldTrip: { destination: string; start_date: string; end_date: string },
202 |   newTrip: { destination: string; start_date: string; end_date: string }
203 | ) => {
204 |   try {
205 |     console.log('\n=== UPDATING TRAVEL PLAN ===');
206 |     console.log('User ID:', userId);
207 |     console.log('Old trip:', oldTrip);
208 |     console.log('New trip:', newTrip);
209 | 
210 |     // Delete the old trip
211 |     const { error: deleteError } = await supabase
212 |       .from('travel_plans')
213 |       .delete()
214 |       .match({
215 |         user_id: userId,
216 |         destination: oldTrip.destination.toLowerCase(),
217 |         start_date: oldTrip.start_date,
218 |         end_date: oldTrip.end_date
219 |       });
220 | 
221 |     if (deleteError) throw deleteError;
222 | 
223 |     // Create the new trip
224 |     const { data, error: insertError } = await supabase
225 |       .from('travel_plans')
226 |       .insert([
227 |         {
228 |           user_id: userId,
229 |           destination: newTrip.destination.toLowerCase(),
230 |           start_date: newTrip.start_date,
231 |           end_date: newTrip.end_date,
232 |         },
233 |       ])
234 |       .select()
235 |       .single();
236 | 
237 |     if (insertError) throw insertError;
238 | 
239 |     console.log('\n✅ TRAVEL PLAN UPDATED');
240 |     console.log('Updated Data:', data);
241 |     console.log('===========================\n');
242 | 
243 |     return data;
244 |   } catch (error) {
245 |     console.error('\n❌ FAILED TO UPDATE TRAVEL PLAN');
246 |     console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
247 |     console.error('===========================\n');
248 |     throw error;
249 |   }
250 | };
251 | 
252 | export const deleteAllTravelPlans = async (userId: string) => {
253 |   console.log('\n=== DELETING ALL TRAVEL PLANS ===');
254 |   console.log('User ID:', userId);
255 | 
256 |   try {
257 |     const { data, error } = await supabase
258 |       .from('travel_plans')
259 |       .delete()
260 |       .eq('user_id', userId)
261 |       .select();
262 | 
263 |     if (error) throw error;
264 | 
265 |     console.log('\n✅ ALL TRAVEL PLANS DELETED');
266 |     console.log('Number of trips deleted:', data?.length);
267 |     console.log('===========================\n');
268 |     
269 |     return data;
270 |   } catch (error) {
271 |     console.log('\n❌ FAILED TO DELETE ALL TRAVEL PLANS');
272 |     console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
273 |     console.log('===========================\n');
274 |     throw error;
275 |   }
276 | };
```

app/login/page.tsx
```
1 | 'use client';
2 | 
3 | import { signInWithGoogle } from '../lib/supabase/client';
4 | 
5 | export default function LoginPage() {
6 |   return (
7 |     <div className="min-h-screen flex items-center justify-center bg-[#343541]">
8 |       <div className="max-w-md w-full space-y-8 p-8">
9 |         <div>
10 |           <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans text-center">
11 |             Yondo
12 |           </h1>
13 |           <p className="mt-4 text-center text-gray-400">
14 |             Your AI travel companion
15 |           </p>
16 |         </div>
17 |         <div>
18 |           <button
19 |             onClick={signInWithGoogle}
20 |             className="w-full flex justify-center py-4 px-4 border border-gray-600/50 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors"
21 |           >
22 |             <span className="flex items-center">
23 |               <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
24 |                 <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.332-1.459,2.379-2.799,2.379h-2.545c-1.39,0-2.545-1.155-2.545-2.545v-2.545c0-1.39,1.155-2.545,2.545-2.545h2.545c1.34,0,2.432,1.047,2.799,2.379h-3.536C13.4,10.242,12.545,11.097,12.545,12.151z" />
25 |               </svg>
26 |               Sign in with Google
27 |             </span>
28 |           </button>
29 |         </div>
30 |       </div>
31 |     </div>
32 |   );
33 | } 
```

app/page.tsx
```
1 | // Path: app/page.tsx
2 | import ChatContainer from "./components/chat/ChatContainer";
3 | 
4 | export default function Home() {
5 |   return <ChatContainer />;
6 | }
```

eslint.config.mjs
```
1 | import { dirname } from "path";
2 | import { fileURLToPath } from "url";
3 | import { FlatCompat } from "@eslint/eslintrc";
4 | 
5 | const __filename = fileURLToPath(import.meta.url);
6 | const __dirname = dirname(__filename);
7 | 
8 | const compat = new FlatCompat({
9 |   baseDirectory: __dirname,
10 | });
11 | 
12 | const eslintConfig = [
13 |   ...compat.extends("next/core-web-vitals", "next/typescript"),
14 | ];
15 | 
16 | export default eslintConfig;
```

middleware.ts
```
1 | import { createServerClient } from '@supabase/ssr';
2 | import { NextResponse } from 'next/server';
3 | import type { NextRequest } from 'next/server';
4 | 
5 | export async function middleware(request: NextRequest) {
6 |   let response = NextResponse.next({
7 |     request: {
8 |       headers: request.headers,
9 |     },
10 |   });
11 | 
12 |   const supabase = createServerClient(
13 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
14 |     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
15 |     {
16 |       cookies: {
17 |         get(name: string) {
18 |           return request.cookies.get(name)?.value;
19 |         },
20 |         set(name: string, value: string, options: any) {
21 |           request.cookies.set({
22 |             name,
23 |             value,
24 |             ...options,
25 |           });
26 |           response = NextResponse.next({
27 |             request: {
28 |               headers: request.headers,
29 |             },
30 |           });
31 |           response.cookies.set({
32 |             name,
33 |             value,
34 |             ...options,
35 |           });
36 |         },
37 |         remove(name: string, options: any) {
38 |           request.cookies.set({
39 |             name,
40 |             value: '',
41 |             ...options,
42 |           });
43 |           response = NextResponse.next({
44 |             request: {
45 |               headers: request.headers,
46 |             },
47 |           });
48 |           response.cookies.set({
49 |             name,
50 |             value: '',
51 |             ...options,
52 |           });
53 |         },
54 |       },
55 |     }
56 |   );
57 | 
58 |   const { data: { user } } = await supabase.auth.getUser();
59 | 
60 |   // If user is not signed in and the current path is not /login or /auth/callback,
61 |   // redirect the user to /login
62 |   if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth/callback')) {
63 |     return NextResponse.redirect(new URL('/login', request.url));
64 |   }
65 | 
66 |   // If user is signed in and the current path is /login,
67 |   // redirect the user to /
68 |   if (user && request.nextUrl.pathname.startsWith('/login')) {
69 |     return NextResponse.redirect(new URL('/', request.url));
70 |   }
71 | 
72 |   return response;
73 | }
74 | 
75 | export const config = {
76 |   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
77 | }; 
```

next.config.ts
```
1 | // Path: next.config.js
2 | /** @type {import('next').NextConfig} */
3 | const nextConfig = {
4 |   reactStrictMode: true,
5 |   swcMinify: true,
6 | }
7 | 
8 | module.exports = nextConfig
```

package.json
```
1 | {
2 |   "name": "chatbot-notion",
3 |   "version": "0.1.0",
4 |   "private": true,
5 |   "scripts": {
6 |     "dev": "next dev",
7 |     "build": "next build",
8 |     "start": "next start",
9 |     "lint": "next lint"
10 |   },
11 |   "dependencies": {
12 |     "@google/generative-ai": "^0.21.0",
13 |     "@radix-ui/react-checkbox": "^1.1.3",
14 |     "@radix-ui/react-icons": "^1.3.2",
15 |     "@radix-ui/react-label": "^2.1.1",
16 |     "@radix-ui/react-slot": "^1.1.1",
17 |     "@supabase/auth-helpers-nextjs": "^0.10.0",
18 |     "@supabase/ssr": "^0.5.2",
19 |     "@supabase/supabase-js": "^2.47.16",
20 |     "class-variance-authority": "^0.7.1",
21 |     "clsx": "^2.1.1",
22 |     "date-fns": "^4.1.0",
23 |     "lucide-react": "^0.471.2",
24 |     "next": "15.1.4",
25 |     "openai": "^4.78.1",
26 |     "react": "^19.0.0",
27 |     "react-dom": "^19.0.0",
28 |     "tailwind-merge": "^2.6.0",
29 |     "tailwindcss-animate": "^1.0.7",
30 |     "uuid": "^11.0.5"
31 |   },
32 |   "devDependencies": {
33 |     "@eslint/eslintrc": "^3",
34 |     "@types/node": "^20",
35 |     "@types/react": "^19",
36 |     "@types/react-dom": "^19",
37 |     "eslint": "^9",
38 |     "eslint-config-next": "15.1.4",
39 |     "postcss": "^8",
40 |     "tailwindcss": "^3.4.1",
41 |     "typescript": "^5"
42 |   }
43 | }
```

postcss.config.mjs
```
1 | /** @type {import('postcss-load-config').Config} */
2 | const config = {
3 |   plugins: {
4 |     tailwindcss: {},
5 |   },
6 | };
7 | 
8 | export default config;
```

styles/globals.css
```
1 | @tailwind base;
2 | @tailwind components;
3 | @tailwind utilities;
4 | 
5 | :root {
6 |   --background: #ffffff;
7 |   --foreground: #171717;
8 | }
9 | 
10 | @media (prefers-color-scheme: dark) {
11 |   :root {
12 |     --background: #0a0a0a;
13 |     --foreground: #ededed;
14 |   }
15 | }
16 | 
17 | body {
18 |   color: var(--foreground);
19 |   background: var(--background);
20 |   font-family: Arial, Helvetica, sans-serif;
21 | }
```

tailwind.config.ts
```
1 | // Path: tailwind.config.js
2 | /** @type {import('tailwindcss').Config} */
3 | module.exports = {
4 |   darkMode: ["class"],
5 |   content: [
6 |     './pages/**/*.{ts,tsx}',
7 |     './components/**/*.{ts,tsx}',
8 |     './app/**/*.{ts,tsx}',
9 |     './src/**/*.{ts,tsx}',
10 |   ],
11 |   theme: {
12 |     container: {
13 |       center: true,
14 |       padding: "2rem",
15 |       screens: {
16 |         "2xl": "1400px",
17 |       },
18 |     },
19 |     extend: {
20 |       colors: {
21 |         border: "hsl(var(--border))",
22 |         input: "hsl(var(--input))",
23 |         ring: "hsl(var(--ring))",
24 |         background: "hsl(var(--background))",
25 |         foreground: "hsl(var(--foreground))",
26 |         primary: {
27 |           DEFAULT: "hsl(var(--primary))",
28 |           foreground: "hsl(var(--primary-foreground))",
29 |         },
30 |         secondary: {
31 |           DEFAULT: "hsl(var(--secondary))",
32 |           foreground: "hsl(var(--secondary-foreground))",
33 |         },
34 |         destructive: {
35 |           DEFAULT: "hsl(var(--destructive))",
36 |           foreground: "hsl(var(--destructive-foreground))",
37 |         },
38 |         muted: {
39 |           DEFAULT: "hsl(var(--muted))",
40 |           foreground: "hsl(var(--muted-foreground))",
41 |         },
42 |         accent: {
43 |           DEFAULT: "hsl(var(--accent))",
44 |           foreground: "hsl(var(--accent-foreground))",
45 |         },
46 |         popover: {
47 |           DEFAULT: "hsl(var(--popover))",
48 |           foreground: "hsl(var(--popover-foreground))",
49 |         },
50 |       },
51 |       borderRadius: {
52 |         lg: "var(--radius)",
53 |         md: "calc(var(--radius) - 2px)",
54 |         sm: "calc(var(--radius) - 4px)",
55 |       },
56 |       keyframes: {
57 |         "accordion-down": {
58 |           from: { height: 0 },
59 |           to: { height: "var(--radix-accordion-content-height)" },
60 |         },
61 |         "accordion-up": {
62 |           from: { height: "var(--radix-accordion-content-height)" },
63 |           to: { height: 0 },
64 |         },
65 |       },
66 |       animation: {
67 |         "accordion-down": "accordion-down 0.2s ease-out",
68 |         "accordion-up": "accordion-up 0.2s ease-out",
69 |       },
70 |     },
71 |   },
72 |   plugins: [require("tailwindcss-animate")],
73 | }
```

tsconfig.json
```
1 | // Path: tsconfig.json
2 | {
3 |   "compilerOptions": {
4 |     "target": "es5",
5 |     "lib": ["dom", "dom.iterable", "esnext"],
6 |     "allowJs": true,
7 |     "skipLibCheck": true,
8 |     "strict": true,
9 |     "noEmit": true,
10 |     "esModuleInterop": true,
11 |     "module": "esnext",
12 |     "moduleResolution": "bundler",
13 |     "resolveJsonModule": true,
14 |     "isolatedModules": true,
15 |     "jsx": "preserve",
16 |     "incremental": true,
17 |     "plugins": [
18 |       {
19 |         "name": "next"
20 |       }
21 |     ],
22 |     "paths": {
23 |       "@/*": ["./app/*"]
24 |     }
25 |   },
26 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
27 |   "exclude": ["node_modules"]
28 | }
```

