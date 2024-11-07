/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  './routes/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	  './app/**/*.{ts,tsx}',
	  './src/**/*.{ts,tsx}',
	  ],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  myColor: {
			"50": "#eff0fe",
			"100": "#e0e0fc",
			"200": "#c1c2f9",
			"300": "#a1a3f7",
			"400": "#8285f4",
			"500": "#6366f1",
			"600": "#4f52c1",
			"700": "#3b3d91",
			"800": "#282960",
			"900": "#141430"
		  },
		  ring: "rgb(99, 102, 241)",
		  primary: {
			DEFAULT: "rgb(99, 102, 241)",
			foreground: "rgb(239, 240, 254)",
			dark: "rgb(79, 82, 193)",
			"dark-foreground": "rgb(239, 240, 254)"
		  },
		  accent: {
			DEFAULT: "rgb(224, 224, 252)",
			foreground: "rgb(20, 20, 48)",
			dark: "rgb(40, 41, 96)",
			"dark-foreground": "rgb(239, 240, 254)"
		  },
		  secondary: {
			DEFAULT: "rgb(224, 224, 252)",
			foreground: "rgb(20, 20, 48)",
			dark: "rgb(40, 41, 96)",
			"dark-foreground": "rgb(239, 240, 254)"
		  },
		  muted: {
			DEFAULT: "rgb(224, 224, 252)",
			foreground: "rgb(59, 61, 145)",
			dark: "rgb(40, 41, 96)",
			"dark-foreground": "rgb(161, 163, 247)"
		  },
		  border: {
			DEFAULT: "#E5E5E5",
			dark: "#262626",
		  },
		  input: {
			DEFAULT: "#E5E5E5",
			dark: "#262626",
		  },
		  background: {
			DEFAULT: "#FFFFFF",
			dark: "#0A0A0A",
		  },
		  foreground: {
			DEFAULT: "#0A0A0A",
			dark: "#FAFAFA",
		  },
		  destructive: {
			DEFAULT: "#EF4444",
			foreground: "#FAFAFA",
			dark: "#7F1D1D",
			"dark-foreground": "#FAFAFA",
		  },
		  popover: {
			DEFAULT: "#FFFFFF",
			foreground: "#0A0A0A",
			dark: "#0A0A0A",
			"dark-foreground": "#FAFAFA",
		  },
		  card: {
			DEFAULT: "#FFFFFF",
			foreground: "#0A0A0A",
			dark: "#0A0A0A",
			"dark-foreground": "#FAFAFA",
		  },
		},
		borderRadius: {
		  lg: "0.5rem",
		  md: "0.375rem",
		  sm: "0.25rem",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: 0 },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: 0 },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  }