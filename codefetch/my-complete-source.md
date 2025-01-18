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
├── next.config.mjs
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
4 | import { getBaseUrl } from '../../lib/utils/url';
5 | 
6 | export async function GET(request: Request) {
7 |   const requestUrl = new URL(request.url);
8 |   const code = requestUrl.searchParams.get('code');
9 | 
10 |   if (code) {
11 |     const cookieStore = await cookies();
12 |     const supabase = createServerClient(
13 |       process.env.NEXT_PUBLIC_SUPABASE_URL!,
14 |       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
15 |       {
16 |         cookies: {
17 |           get(name: string) {
18 |             return cookieStore.get(name)?.value;
19 |           },
20 |           set(name: string, value: string, options: any) {
21 |             cookieStore.set({ name, value, ...options });
22 |           },
23 |           remove(name: string, options: any) {
24 |             cookieStore.set({ name, value: '', ...options });
25 |           },
26 |         },
27 |       }
28 |     );
29 |     await supabase.auth.exchangeCodeForSession(code);
30 |   }
31 | 
32 |   // URL to redirect to after sign in process completes
33 |   return NextResponse.redirect(new URL('/', getBaseUrl()));
34 | } 
```

app/auth/login/page.tsx
```
1 | 'use client';
2 | 
3 | import { signInWithGoogle } from '../../lib/supabase/client';
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

app/chat/page.tsx
```
1 | 'use client';
2 | 
3 | import { useEffect } from 'react';
4 | import { useRouter } from 'next/navigation';
5 | import { supabase } from '../lib/supabase/client';
6 | import ChatContainer from '../components/chat/ChatContainer';
7 | 
8 | export default function ChatPage() {
9 |   const router = useRouter();
10 | 
11 |   useEffect(() => {
12 |     const checkAuth = async () => {
13 |       const { data: { session } } = await supabase.auth.getSession();
14 |       if (!session) {
15 |         router.replace('/login');
16 |       }
17 |     };
18 | 
19 |     checkAuth();
20 | 
21 |     // Set up auth state listener
22 |     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
23 |       if (event === 'SIGNED_OUT' || !session) {
24 |         router.replace('/login');
25 |       }
26 |     });
27 | 
28 |     return () => {
29 |       subscription.unsubscribe();
30 |     };
31 |   }, [router]);
32 | 
33 |   return (
34 |     <main className="flex flex-col h-screen bg-[#343541]">
35 |       <ChatContainer />
36 |     </main>
37 |   );
38 | } 
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
6 | import { getBaseUrl } from '../../lib/utils/url';
7 | 
8 | interface ChatHeaderProps {
9 |   onSignOut: () => void;
10 |   addMessage: (content: string) => void;
11 | }
12 | 
13 | export default function ChatHeader({ onSignOut, addMessage }: ChatHeaderProps) {
14 |   const handleCheckTrips = async () => {
15 |     console.log('🔍 Check Trips button clicked');
16 |     try {
17 |       const trips = await checkUserTrips();
18 |       if (trips) {
19 |         const formattedTrips = await formatTravelPlans(trips);
20 |         addMessage(formattedTrips);
21 |       }
22 |     } catch (error) {
23 |       console.error('Error checking trips:', error);
24 |       addMessage("Sorry, I couldn't retrieve your trips right now.");
25 |     }
26 |   };
27 | 
28 |   const handleSignOut = async () => {
29 |     try {
30 |       await supabase.auth.signOut();
31 |       window.location.href = `${getBaseUrl()}/login`;
32 |     } catch (error) {
33 |       console.error('Error signing out:', error);
34 |     }
35 |   };
36 | 
37 |   return (
38 |     <div className="sticky top-0 z-50 flex items-center justify-between p-8 bg-[#343541]">
39 |       <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans">
40 |         Yondo
41 |       </h1>
42 |       <div className="flex items-center space-x-4">
43 |         <button
44 |           type="button"
45 |           onClick={handleCheckTrips}
46 |           className="px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors border border-gray-600/50"
47 |         >
48 |           Check Trips
49 |         </button>
50 |         <button
51 |           type="button"
52 |           onClick={handleSignOut}
53 |           className="px-6 py-3 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors border border-gray-600/50"
54 |         >
55 |           Sign out
56 |         </button>
57 |       </div>
58 |     </div>
59 |   );
60 | }
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
23 | const SYSTEM_PROMPT = `You are Yondo, a friendly travel assistant. You help users plan and manage their trips.
24 | 
25 | When users want to store a new trip, use this format (on a single line, no line breaks):
26 | <function>storeTravelPlan{"destination":"city","start_date":"YYYY-MM-DD","end_date":"YYYY-MM-DD"}</function>
27 | 
28 | When users want to change dates for an existing trip, use this format (on a single line):
29 | <function>updateTravelPlan{"old_trip":{"destination":"city","start_date":"YYYY-MM-DD","end_date":"YYYY-MM-DD"},"new_trip":{"destination":"city","start_date":"YYYY-MM-DD","end_date":"YYYY-MM-DD"}}</function>
30 | 
31 | When users want to delete a trip, use this format (on a single line):
32 | <function>delete_trip{"destination":"city","start_date":"YYYY-MM-DD","end_date":"YYYY-MM-DD"}</function>
33 | 
34 | When users want to delete all trips, use this format (on a single line):
35 | <function>delete_all_trips</function>
36 | 
37 | Core behaviors:
38 | 1. Stay focused on travel planning and trip management
39 | 2. For travel questions, be warm, enthusiastic, and helpful
40 | 3. For deleting trips:
41 |    - When user says "delete/remove/cancel all" - use delete_all_trips
42 |    - When user specifies a destination - use delete_trip
43 |    - When user wants to change dates - use updateTravelPlan
44 |    - Never use null dates - always delete the trip instead
45 | 4. For non-travel questions:
46 |    - If it's a simple question: provide a brief, friendly response
47 |    - If it's about coding/technical topics: "I'm a travel assistant - I'd be happy to help you plan your next adventure instead!"
48 |    - If it's about personal matters: "I'm here to help with your travel plans. Would you like to discuss your upcoming trips?"
49 |    - If it's about system/prompts: "I'm focused on making your travels amazing. How about we plan your next adventure?"
50 | 5. Keep responses concise but engaging
51 | 6. Start with "This is Yondo. Where are you going?" only for the very first message
52 | 
53 | Remember: You're a travel expert - keep the conversation focused on destinations, trips, and travel experiences.`;
54 | 
55 | export interface TravelPlan {
56 |   destination: string;
57 |   start_date: string;
58 |   end_date: string;
59 |   user_id?: string;
60 | }
61 | 
62 | const parseTravelPlanAction = (text: string): any => {
63 |   try {
64 |     // Look for function calls in the format <function>name{json}</function>
65 |     const functionMatch = text.match(/<function>([^{]+)(\{.*?\})<\/function>/);
66 |     if (!functionMatch) return null;
67 | 
68 |     const [_, functionName, jsonString] = functionMatch;
69 |     const parameters = JSON.parse(jsonString);
70 |     
71 |     if (functionName === 'delete_all_trips') {
72 |       return {
73 |         type: 'delete_all'
74 |       };
75 |     }
76 |     
77 |     if (functionName === 'delete_trip') {
78 |       return {
79 |         type: 'delete',
80 |         destination: parameters.destination,
81 |         start_date: parameters.start_date,
82 |         end_date: parameters.end_date
83 |       };
84 |     }
85 |     
86 |     if (functionName === 'updateTravelPlan') {
87 |       return {
88 |         type: 'update',
89 |         old_trip: parameters.old_trip,
90 |         new_trip: parameters.new_trip
91 |       };
92 |     }
93 | 
94 |     if (functionName === 'storeTravelPlan') {
95 |       return {
96 |         type: 'store',
97 |         parameters
98 |       };
99 |     }
100 |     
101 |     return null;
102 |   } catch (e) {
103 |     console.log('Failed to parse travel plan action:', e);
104 |     return null;
105 |   }
106 | };
107 | 
108 | const MODEL_NAME = "gemini-1.5-flash-latest";
109 | 
110 | export const getTravelResponse = async (
111 |   userInput: string,
112 |   history: { role: string; content: string }[],
113 |   userId: string,
114 |   onPartialResponse?: (text: string) => void
115 | ): Promise<string> => {
116 |   try {
117 |     // Skip processing if the input looks like an error message or log
118 |     if (userInput.includes('client.ts:') || 
119 |         userInput.includes('Attempting to parse JSON from:')) {
120 |       return "I didn't understand that. Could you please try again?";
121 |     }
122 | 
123 |     const model = genAI.getGenerativeModel({ model: MODEL_NAME });
124 |     const chat = model.startChat({
125 |       history: [
126 |         {
127 |           role: 'user',
128 |           parts: [{ text: SYSTEM_PROMPT }]
129 |         },
130 |         ...(history.length === 0 ? [{
131 |           role: 'model',
132 |           parts: [{ text: "This is Yondo. Where are you going?" }]
133 |         }] : []),
134 |         ...history.map(msg => ({
135 |           role: msg.role === 'user' ? 'user' : 'model',
136 |           parts: [{ text: msg.content }]
137 |         }))
138 |       ],
139 |       generationConfig: {
140 |         temperature: 0.7,
141 |         maxOutputTokens: 1000,
142 |       }
143 |     });
144 | 
145 |     const result = await chat.sendMessage(userInput);
146 |     let fullResponse = '';
147 |     let visibleResponse = '';
148 |     let currentFunction = '';
149 |     
150 |     // Handle streaming response
151 |     const response = await result.response;
152 |     const text = response.text();
153 |     
154 |     // Split into chunks, preserving spaces
155 |     const chunks = text.split(/(?<=\s)/);
156 |     
157 |     for (const chunk of chunks) {
158 |       fullResponse += chunk;
159 |       
160 |       // Check if this chunk starts or ends a function call
161 |       if (chunk.includes('<function>')) {
162 |         currentFunction = '';
163 |       } else if (chunk.includes('</function>')) {
164 |         currentFunction = '';
165 |       } else if (!currentFunction) {
166 |         // Only add to visible response if we're not inside a function call
167 |         visibleResponse += chunk;
168 |         if (onPartialResponse) {
169 |           onPartialResponse(chunk);
170 |           // Add a small delay to simulate natural typing
171 |           await new Promise(resolve => setTimeout(resolve, 50));
172 |         }
173 |       }
174 |     }
175 |     
176 |     console.log('Raw response:', fullResponse);
177 | 
178 |     // Check for update/deletion request
179 |     const action = parseTravelPlanAction(fullResponse);
180 |     if (action?.type === 'delete_all') {
181 |       try {
182 |         await deleteAllTravelPlans(userId);
183 |         const response = "I've deleted all your trips. Ready to plan your next adventure?";
184 |         if (onPartialResponse) {
185 |           onPartialResponse(response);
186 |         }
187 |         return response;
188 |       } catch (error) {
189 |         const errorMsg = `I couldn't delete all trips. ${error instanceof Error ? error.message : 'Please try again.'}`;
190 |         if (onPartialResponse) {
191 |           onPartialResponse(errorMsg);
192 |         }
193 |         return errorMsg;
194 |       }
195 |     } else if (action?.type === 'update') {
196 |       try {
197 |         await updateTravelPlan(userId, action.old_trip, action.new_trip);
198 |         const response = `Perfect! I've updated your trip to ${action.new_trip.destination} for ${action.new_trip.start_date} to ${action.new_trip.end_date}.`;
199 |         if (onPartialResponse) {
200 |           onPartialResponse(response);
201 |         }
202 |         return response;
203 |       } catch (error) {
204 |         const errorMsg = `I couldn't update that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
205 |         if (onPartialResponse) {
206 |           onPartialResponse(errorMsg);
207 |         }
208 |         return errorMsg;
209 |       }
210 |     } else if (action?.type === 'delete') {
211 |       try {
212 |         await deleteTravelPlan(userId, action.destination, action.start_date, action.end_date);
213 |         const response = `I've deleted your trip to ${action.destination} from ${action.start_date} to ${action.end_date}. Would you like to see your remaining trips?`;
214 |         if (onPartialResponse) {
215 |           onPartialResponse(response);
216 |         }
217 |         return response;
218 |       } catch (error) {
219 |         const errorMsg = `I couldn't delete that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
220 |         if (onPartialResponse) {
221 |           onPartialResponse(errorMsg);
222 |         }
223 |         return errorMsg;
224 |       }
225 |     } else if (action?.type === 'store') {
226 |       try {
227 |         const confirmation = await handleStoreTravelPlan(action.parameters, userId);
228 |         if (onPartialResponse) {
229 |           onPartialResponse(confirmation);
230 |         }
231 |         return confirmation;
232 |       } catch (error) {
233 |         const errorMsg = `I couldn't save that trip. ${error instanceof Error ? error.message : 'Please try again.'}`;
234 |         if (onPartialResponse) {
235 |           onPartialResponse(errorMsg);
236 |         }
237 |         return errorMsg;
238 |       }
239 |     }
240 |     
241 |     // If no action was found, return the visible response
242 |     return visibleResponse.trim() || "I didn't understand that. Could you please try again?";
243 |   } catch (error) {
244 |     console.error('Error in getTravelResponse:', error);
245 |     throw error;
246 |   }
247 | };
248 | 
249 | export const handleStoreTravelPlan = async (
250 |   info: TravelPlan,
251 |   userId: string
252 | ) => {
253 |   console.log('\n🔍 HANDLING TRAVEL PLAN');
254 |   console.log('Current User ID:', userId);
255 |   console.log('Travel Info:', info);
256 |   
257 |   try {
258 |     console.log('\n=== STORING TRAVEL PLAN ===');
259 |     console.log('📍 Destination:', info.destination);
260 |     console.log('📅 Start date:', info.start_date);
261 |     console.log('📅 End date:', info.end_date);
262 |     console.log('👤 User ID:', userId);
263 |     
264 |     const storedPlan = await createTravelPlan(
265 |       userId,
266 |       info.destination,
267 |       info.start_date,
268 |       info.end_date
269 |     );
270 |     
271 |     console.log('\n✅ TRAVEL PLAN STORED SUCCESSFULLY');
272 |     console.log('ID:', storedPlan.id);
273 |     console.log('User ID:', storedPlan.user_id);
274 |     console.log('Created at:', storedPlan.created_at);
275 |     console.log('===========================\n');
276 |     
277 |     return `Great! I've saved your trip to ${info.destination} from ${info.start_date} to ${info.end_date}.`;
278 |   } catch (error) {
279 |     console.log('\n❌ FAILED TO STORE TRAVEL PLAN');
280 |     console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
281 |     console.log('===========================\n');
282 |     return `I've noted your trip to ${info.destination} from ${info.start_date} to ${info.end_date}, but there was an issue saving it.`;
283 |   }
284 | };
285 | 
286 | const cleanupSpaces = (text: string): string => {
287 |   return text.replace(/\s+/g, ' ').trim();
288 | };
289 | 
290 | export const formatTravelPlans = async (plans: TravelPlan[]) => {
291 |   if (plans.length === 0) {
292 |     return "You don't have any trips planned yet. Would you like to plan one?";
293 |   }
294 | 
295 |   // Filter out any invalid trips (those with null or undefined dates)
296 |   const validPlans = plans.filter(plan => 
297 |     plan.start_date && 
298 |     plan.end_date && 
299 |     plan.start_date !== 'null' && 
300 |     plan.end_date !== 'null'
301 |   );
302 | 
303 |   // Sort plans chronologically
304 |   validPlans.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
305 | 
306 |   const model = genAI.getGenerativeModel({ 
307 |     model: MODEL_NAME,
308 |     generationConfig: {
309 |       temperature: 0.7,
310 |       maxOutputTokens: 500,
311 |     }
312 |   });
313 | 
314 |   const prompt = `List the user's travel plans clearly and directly. This is in response to them checking their trips.
315 | 
316 | Current trips (${validPlans.length} total):
317 | ${validPlans.map(plan => `- ${plan.destination} from ${plan.start_date} to ${plan.end_date}`).join('\n')}
318 | 
319 | Guidelines:
320 | - Start with "You have ${validPlans.length === 1 ? 'one trip' : validPlans.length + ' trips'} booked:"
321 | - List trips chronologically (they are already sorted)
322 | - Format dates naturally (like "mid-March" or "late October")
323 | - Be clear and direct about what's actually booked
324 | - Don't mention invalid or incomplete trips
325 | - Don't ask questions about planning more trips
326 | - Don't speculate about potential future trips
327 | - Keep it factual but warm
328 | - Avoid double spaces between words
329 | 
330 | Example good responses:
331 | For multiple trips:
332 | "You have 3 trips booked: Athens from March 15th to 22nd, Cologne from September 5th to 7th, and Rome from November 1st to 7th. All set!"
333 | 
334 | For one trip:
335 | "You have one trip booked: Athens from March 15th to 22nd. The spring weather should be lovely!"
336 | 
337 | Remember: Only mention valid, confirmed trips with actual dates. Use single spaces between words.`;
338 | 
339 |   try {
340 |     const result = await model.generateContent(prompt);
341 |     const response = await result.response;
342 |     return cleanupSpaces(response.text() || "Error formatting your trips.");
343 |   } catch (error) {
344 |     console.error('Error formatting travel plans:', error);
345 |     return "Sorry, I couldn't retrieve your trips right now.";
346 |   }
347 | };
```

app/lib/supabase/client.ts
```
1 | // Path: app/lib/supabase/client.ts
2 | import { createBrowserClient } from '@supabase/ssr';
3 | import { getBaseUrl } from '../utils/url';
4 | 
5 | export const supabase = createBrowserClient(
6 |   process.env.NEXT_PUBLIC_SUPABASE_URL!,
7 |   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
8 | );
9 | 
10 | export const signInWithGoogle = async () => {
11 |   try {
12 |     console.log('Starting Google sign-in...');
13 |     const redirectUrl = `${getBaseUrl()}/auth/callback`;
14 |     console.log('Redirect URL:', redirectUrl);
15 |     
16 |     const { data, error } = await supabase.auth.signInWithOAuth({
17 |       provider: 'google',
18 |       options: {
19 |         redirectTo: redirectUrl,
20 |         queryParams: {
21 |           access_type: 'offline',
22 |           prompt: 'consent',
23 |         },
24 |       },
25 |     });
26 | 
27 |     if (error) {
28 |       console.error('Error signing in:', error.message);
29 |       throw error;
30 |     }
31 | 
32 |     console.log('Sign-in initiated:', data);
33 |     return data;
34 |   } catch (error) {
35 |     console.error('Error in signInWithGoogle:', error);
36 |     throw error;
37 |   }
38 | };
39 | 
40 | export const getCurrentUser = async () => {
41 |   try {
42 |     const { data: { user }, error } = await supabase.auth.getUser();
43 |     if (error) throw error;
44 |     return user;
45 |   } catch (error) {
46 |     console.error('Error getting user:', error);
47 |     throw error;
48 |   }
49 | };
50 | 
51 | export const checkUserTrips = async () => {
52 |   try {
53 |     console.log('\n=== CHECKING USER INFO ===');
54 |     const user = await getCurrentUser();
55 |     
56 |     if (!user) {
57 |       const error = 'No user logged in - please sign in first';
58 |       console.error('❌', error);
59 |       throw new Error(error);
60 |     }
61 | 
62 |     console.log('✅ User found:');
63 |     console.log('User ID:', user.id);
64 |     console.log('Email:', user.email);
65 |     console.log('===============================\n');
66 |     
67 |     const trips = await getTravelPlans(user.id);
68 |     
69 |     if (!trips || trips.length === 0) {
70 |       console.log('ℹ️ No trips found for this user');
71 |       return [];
72 |     }
73 |     
74 |     console.log('✅ Found', trips.length, 'trips:');
75 |     trips.forEach((trip, index) => {
76 |       console.log(`\nTrip ${index + 1}:`);
77 |       console.log('🌍 Destination:', trip.destination);
78 |       console.log('📅 Start:', trip.start_date);
79 |       console.log('📅 End:', trip.end_date);
80 |     });
81 |     
82 |     return trips;
83 |   } catch (error) {
84 |     console.error('\n❌ ERROR IN checkUserTrips');
85 |     if (error instanceof Error) {
86 |       console.error('Message:', error.message);
87 |     } else {
88 |       console.error('Unknown error:', error);
89 |     }
90 |     console.error('===============================\n');
91 |     throw error;
92 |   }
93 | };
94 | 
95 | export interface TravelPlan {
96 |   id: string;
97 |   user_id: string;
98 |   destination: string;
99 |   start_date: string;
100 |   end_date: string;
101 |   created_at: string;
102 | }
103 | 
104 | export const getTravelPlans = async (userId: string) => {
105 |   try {
106 |     console.log('\n=== FETCHING TRAVEL PLANS ===');
107 |     console.log('User ID:', userId);
108 | 
109 |     const { data, error } = await supabase
110 |       .from('travel_plans')
111 |       .select('*')
112 |       .eq('user_id', userId)
113 |       .order('created_at', { ascending: false });
114 | 
115 |     if (error) {
116 |       console.error('\n❌ ERROR FETCHING TRAVEL PLANS');
117 |       console.error('Message:', error.message);
118 |       console.error('Details:', error.details);
119 |       throw error;
120 |     }
121 | 
122 |     console.log('\n✅ TRAVEL PLANS FETCHED');
123 |     console.log('Number of plans:', data?.length);
124 |     console.log('Plans:', data);
125 |     console.log('===============================\n');
126 | 
127 |     return data;
128 |   } catch (error) {
129 |     console.error('\n❌ UNEXPECTED ERROR');
130 |     console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
131 |     console.error('===============================\n');
132 |     throw error;
133 |   }
134 | };
135 | 
136 | export const createTravelPlan = async (userId: string, destination: string, startDate: string, endDate: string) => {
137 |   try {
138 |     console.log('\n=== CREATING TRAVEL PLAN IN SUPABASE ===');
139 |     console.log('User ID:', userId);
140 |     console.log('Destination:', destination);
141 |     console.log('Start Date:', startDate);
142 |     console.log('End Date:', endDate);
143 | 
144 |     const { data, error } = await supabase
145 |       .from('travel_plans')
146 |       .insert([
147 |         {
148 |           user_id: userId,
149 |           destination: destination.toLowerCase(),
150 |           start_date: startDate,
151 |           end_date: endDate,
152 |         },
153 |       ])
154 |       .select()
155 |       .single();
156 | 
157 |     if (error) {
158 |       console.error('\n❌ SUPABASE ERROR');
159 |       console.error('Message:', error.message);
160 |       console.error('Details:', error.details);
161 |       console.error('Hint:', error.hint);
162 |       console.error('Code:', error.code);
163 |       throw error;
164 |     }
165 | 
166 |     console.log('\n✅ TRAVEL PLAN CREATED');
167 |     console.log('Stored Data:', data);
168 |     console.log('===============================\n');
169 | 
170 |     // Fetch and log all travel plans after creating a new one
171 |     await getTravelPlans(userId);
172 | 
173 |     return data;
174 |   } catch (error) {
175 |     console.error('\n❌ UNEXPECTED ERROR');
176 |     console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
177 |     console.error('===============================\n');
178 |     throw error;
179 |   }
180 | };
181 | 
182 | export const deleteTravelPlan = async (userId: string, destination: string, start_date: string, end_date: string) => {
183 |   console.log('\n=== DELETING TRAVEL PLAN ===');
184 |   console.log('User ID:', userId);
185 |   console.log('Destination:', destination);
186 |   console.log('Start Date:', start_date);
187 |   console.log('End Date:', end_date);
188 | 
189 |   try {
190 |     const { data, error } = await supabase
191 |       .from('travel_plans')
192 |       .delete()
193 |       .match({
194 |         user_id: userId,
195 |         destination: destination.toLowerCase(),
196 |         start_date,
197 |         end_date
198 |       })
199 |       .select();
200 | 
201 |     if (error) throw error;
202 | 
203 |     console.log('\n✅ TRAVEL PLAN DELETED');
204 |     console.log('Deleted Data:', data);
205 |     console.log('===========================\n');
206 |     
207 |     return data;
208 |   } catch (error) {
209 |     console.log('\n❌ FAILED TO DELETE TRAVEL PLAN');
210 |     console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
211 |     console.log('===========================\n');
212 |     throw error;
213 |   }
214 | };
215 | 
216 | export const updateTravelPlan = async (
217 |   userId: string,
218 |   oldTrip: { destination: string; start_date: string; end_date: string },
219 |   newTrip: { destination: string; start_date: string; end_date: string }
220 | ) => {
221 |   try {
222 |     console.log('\n=== UPDATING TRAVEL PLAN ===');
223 |     console.log('User ID:', userId);
224 |     console.log('Old trip:', oldTrip);
225 |     console.log('New trip:', newTrip);
226 | 
227 |     // Delete the old trip
228 |     const { error: deleteError } = await supabase
229 |       .from('travel_plans')
230 |       .delete()
231 |       .match({
232 |         user_id: userId,
233 |         destination: oldTrip.destination.toLowerCase(),
234 |         start_date: oldTrip.start_date,
235 |         end_date: oldTrip.end_date
236 |       });
237 | 
238 |     if (deleteError) throw deleteError;
239 | 
240 |     // Create the new trip
241 |     const { data, error: insertError } = await supabase
242 |       .from('travel_plans')
243 |       .insert([
244 |         {
245 |           user_id: userId,
246 |           destination: newTrip.destination.toLowerCase(),
247 |           start_date: newTrip.start_date,
248 |           end_date: newTrip.end_date,
249 |         },
250 |       ])
251 |       .select()
252 |       .single();
253 | 
254 |     if (insertError) throw insertError;
255 | 
256 |     console.log('\n✅ TRAVEL PLAN UPDATED');
257 |     console.log('Updated Data:', data);
258 |     console.log('===========================\n');
259 | 
260 |     return data;
261 |   } catch (error) {
262 |     console.error('\n❌ FAILED TO UPDATE TRAVEL PLAN');
263 |     console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
264 |     console.error('===========================\n');
265 |     throw error;
266 |   }
267 | };
268 | 
269 | export const deleteAllTravelPlans = async (userId: string) => {
270 |   console.log('\n=== DELETING ALL TRAVEL PLANS ===');
271 |   console.log('User ID:', userId);
272 | 
273 |   try {
274 |     const { data, error } = await supabase
275 |       .from('travel_plans')
276 |       .delete()
277 |       .eq('user_id', userId)
278 |       .select();
279 | 
280 |     if (error) throw error;
281 | 
282 |     console.log('\n✅ ALL TRAVEL PLANS DELETED');
283 |     console.log('Number of trips deleted:', data?.length);
284 |     console.log('===========================\n');
285 |     
286 |     return data;
287 |   } catch (error) {
288 |     console.log('\n❌ FAILED TO DELETE ALL TRAVEL PLANS');
289 |     console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
290 |     console.log('===========================\n');
291 |     throw error;
292 |   }
293 | };
```

app/lib/utils/url.ts
```
1 | export const getBaseUrl = () => {
2 |   // Production URL takes precedence
3 |   if (process.env.NEXT_PUBLIC_BASE_URL) {
4 |     return process.env.NEXT_PUBLIC_BASE_URL;
5 |   }
6 | 
7 |   if (typeof window !== 'undefined') {
8 |     // Client-side
9 |     return window.location.origin;
10 |   }
11 | 
12 |   // Server-side
13 |   if (process.env.VERCEL_URL) {
14 |     return `https://${process.env.VERCEL_URL}`;
15 |   }
16 | 
17 |   return 'http://localhost:3000';
18 | }; 
```

app/login/page.tsx
```
1 | 'use client';
2 | 
3 | import { signInWithGoogle } from '../lib/supabase/client';
4 | import { useState, useEffect } from 'react';
5 | import { useRouter } from 'next/navigation';
6 | import { supabase } from '../lib/supabase/client';
7 | 
8 | export default function LoginPage() {
9 |   const [isLoading, setIsLoading] = useState(false);
10 |   const [error, setError] = useState<string | null>(null);
11 |   const router = useRouter();
12 | 
13 |   useEffect(() => {
14 |     // Check if we're already logged in
15 |     const checkSession = async () => {
16 |       const { data: { session } } = await supabase.auth.getSession();
17 |       console.log('Current session:', session);
18 |       if (session) {
19 |         console.log('User is already logged in, redirecting to home');
20 |         router.replace('/');
21 |       }
22 |     };
23 |     
24 |     checkSession();
25 |   }, [router]);
26 | 
27 |   const handleSignIn = async () => {
28 |     try {
29 |       console.log('Login button clicked');
30 |       setIsLoading(true);
31 |       setError(null);
32 |       
33 |       const result = await signInWithGoogle();
34 |       console.log('Sign-in result:', result);
35 |       
36 |     } catch (err) {
37 |       console.error('Sign in error:', err);
38 |       setError(err instanceof Error ? err.message : 'Failed to sign in');
39 |     } finally {
40 |       setIsLoading(false);
41 |     }
42 |   };
43 | 
44 |   return (
45 |     <div className="min-h-screen flex items-center justify-center bg-[#343541]">
46 |       <div className="max-w-md w-full space-y-8 p-8">
47 |         <div>
48 |           <h1 className="text-7xl font-extrabold text-gray-200 tracking-tight font-sans text-center">
49 |             Yondo
50 |           </h1>
51 |           <p className="mt-4 text-center text-gray-400">
52 |             Your AI travel companion
53 |           </p>
54 |         </div>
55 |         <div className="space-y-4">
56 |           <button
57 |             onClick={handleSignIn}
58 |             disabled={isLoading}
59 |             className="w-full flex justify-center py-4 px-4 border border-gray-600/50 text-base font-medium rounded-xl text-gray-200 bg-[#3a3b42] hover:bg-[#40414F] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
60 |           >
61 |             <span className="flex items-center">
62 |               {isLoading ? (
63 |                 <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
64 |                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
65 |                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
66 |                 </svg>
67 |               ) : (
68 |                 <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
69 |                   <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.332-1.459,2.379-2.799,2.379h-2.545c-1.39,0-2.545-1.155-2.545-2.545v-2.545c0-1.39,1.155-2.545,2.545-2.545h2.545c1.34,0,2.432,1.047,2.799,2.379h-3.536C13.4,10.242,12.545,11.097,12.545,12.151z" />
70 |                 </svg>
71 |               )}
72 |               {isLoading ? 'Signing in...' : 'Sign in with Google'}
73 |             </span>
74 |           </button>
75 |           {error && (
76 |             <p className="text-red-500 text-sm text-center mt-2">
77 |               {error}
78 |             </p>
79 |           )}
80 |         </div>
81 |       </div>
82 |     </div>
83 |   );
84 | } 
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
4 | import { getBaseUrl } from './app/lib/utils/url';
5 | 
6 | export async function middleware(request: NextRequest) {
7 |   let response = NextResponse.next({
8 |     request: {
9 |       headers: request.headers,
10 |     },
11 |   });
12 | 
13 |   const supabase = createServerClient(
14 |     process.env.NEXT_PUBLIC_SUPABASE_URL!,
15 |     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
16 |     {
17 |       cookies: {
18 |         get(name: string) {
19 |           return request.cookies.get(name)?.value;
20 |         },
21 |         set(name: string, value: string, options: any) {
22 |           request.cookies.set({
23 |             name,
24 |             value,
25 |             ...options,
26 |           });
27 |           response = NextResponse.next({
28 |             request: {
29 |               headers: request.headers,
30 |             },
31 |           });
32 |           response.cookies.set({
33 |             name,
34 |             value,
35 |             ...options,
36 |           });
37 |         },
38 |         remove(name: string, options: any) {
39 |           request.cookies.set({
40 |             name,
41 |             value: '',
42 |             ...options,
43 |           });
44 |           response = NextResponse.next({
45 |             request: {
46 |               headers: request.headers,
47 |             },
48 |           });
49 |           response.cookies.set({
50 |             name,
51 |             value: '',
52 |             ...options,
53 |           });
54 |         },
55 |       },
56 |     }
57 |   );
58 | 
59 |   const { data: { user } } = await supabase.auth.getUser();
60 | 
61 |   // If user is not signed in and the current path is not /login or /auth/callback,
62 |   // redirect the user to /login
63 |   if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth/callback')) {
64 |     return NextResponse.redirect(new URL('/login', getBaseUrl()));
65 |   }
66 | 
67 |   // If user is signed in and the current path is /login,
68 |   // redirect the user to /
69 |   if (user && request.nextUrl.pathname.startsWith('/login')) {
70 |     return NextResponse.redirect(new URL('/', getBaseUrl()));
71 |   }
72 | 
73 |   return response;
74 | }
75 | 
76 | export const config = {
77 |   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
78 | }; 
```

next.config.mjs
```
1 | /** @type {import('next').NextConfig} */
2 | const nextConfig = {
3 |   reactStrictMode: true,
4 | }
5 | 
6 | export default nextConfig; 
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
25 |     "react": "^19.0.0",
26 |     "react-dom": "^19.0.0",
27 |     "tailwind-merge": "^2.6.0",
28 |     "tailwindcss-animate": "^1.0.7",
29 |     "uuid": "^11.0.5"
30 |   },
31 |   "devDependencies": {
32 |     "@eslint/eslintrc": "^3.0.0",
33 |     "@types/node": "^20",
34 |     "@types/react": "^19",
35 |     "@types/react-dom": "^19",
36 |     "autoprefixer": "^10.0.1",
37 |     "eslint": "^8.0.0",
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

