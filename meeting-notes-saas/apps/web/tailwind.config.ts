import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
 theme: {
extend: {
colors: {
ink: { DEFAULT: '#0A0A0B', 2: '#1C1C1F', 3: '#2A2A2E' },
muted: '#6B6B78',
border: '#E4E4E7',
surface:'#FAFAFA',
accent: { DEFAULT:'#18181B', blue:'#3B82F6', 'blue-lt':'#EFF6FF' },
},
},
},
plugins: [],
};

export default config;
