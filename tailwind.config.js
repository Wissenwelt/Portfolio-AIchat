module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Navy Blue (Trust, Stability)
        primary: {
          50: 'hsl(210, 52%, 93%)',
          100: 'hsl(210, 52%, 88%)',
          200: 'hsl(210, 52%, 78%)',
          300: 'hsl(210, 52%, 68%)',
          400: 'hsl(210, 52%, 58%)',
          500: 'hsl(218, 61%, 16%)', // Base color
          600: 'hsl(218, 61%, 14%)',
          700: 'hsl(218, 61%, 12%)',
          800: 'hsl(218, 61%, 10%)',
          900: 'hsl(218, 61%, 8%)',
        },
        // Soft Slate Gray (Modern, Professional)
        secondary: {
          50: 'hsl(215, 14%, 98%)',
          100: 'hsl(215, 14%, 94%)',
          200: 'hsl(215, 14%, 84%)',
          300: 'hsl(215, 14%, 74%)',
          400: 'hsl(215, 14%, 64%)',
          500: 'hsl(215, 14%, 34%)', // Base color
          600: 'hsl(215, 14%, 30%)',
          700: 'hsl(215, 14%, 26%)',
          800: 'hsl(215, 14%, 22%)',
          900: 'hsl(215, 14%, 18%)',
        },
        // Soothing Teal (Calm, Reliability)
        accent: {
          50: 'hsl(180, 40%, 95%)',
          100: 'hsl(180, 40%, 90%)',
          200: 'hsl(180, 40%, 80%)',
          300: 'hsl(180, 40%, 70%)',
          400: 'hsl(180, 40%, 60%)',
          500: 'hsl(180, 40%, 50%)', // Base color
          600: 'hsl(180, 40%, 45%)',
          700: 'hsl(180, 40%, 40%)',
          800: 'hsl(180, 40%, 35%)',
          900: 'hsl(180, 40%, 30%)',
        },
        // Neutral Base
        neutral: {
          50: 'hsl(0, 0%, 98%)',
          100: 'hsl(0, 0%, 94%)',
          200: 'hsl(0, 0%, 86%)',
          300: 'hsl(0, 0%, 78%)',
          400: 'hsl(0, 0%, 62%)',
          500: 'hsl(0, 0%, 50%)',
          600: 'hsl(0, 0%, 42%)',
          700: 'hsl(0, 0%, 32%)',
          800: 'hsl(0, 0%, 22%)',
          900: 'hsl(0, 0%, 12%)',
        }
      },
      fontFamily: {
        sans: ['sans-serif'],
        mono: ['"Source Code Pro"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
