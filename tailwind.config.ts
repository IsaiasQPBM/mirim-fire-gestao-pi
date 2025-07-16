
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#F5A623', // New orange - Primary CBMEPI color
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#B71C1C', // Red - Secondary CBMEPI color
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#F5A623', // New orange
					foreground: '#212121'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: '#263238',
					foreground: '#FFFFFF',
					primary: '#F5A623', // Updated to new orange
					'primary-foreground': '#FFFFFF',
					accent: '#37474F',
					'accent-foreground': '#FFFFFF',
					border: '#455A64',
					ring: '#F5A623' // Updated to new orange
				},
				cbmepi: {
					orange: '#F5A623', // New orange color
					'orange-light': '#F7B955', // Lighter variant
					'orange-dark': '#E8941A', // Darker variant
					red: '#B71C1C',
					white: '#FFFFFF',
					black: '#212121',
					'red-light': '#E57373',
					'gray-dark': '#263238',
					'gray-light': '#ECEFF1'
				},
				orange: {
					500: '#f97316',
					600: '#ea580c',
				},
				green: {
					500: '#22c55e',
				},
				red: {
					500: '#ef4444',
				},
				gray: {
					800: '#374151',
					50: '#f9fafb',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '1rem',
				'lg': '0.5rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
			},
			transitionProperty: {
				'all': 'all',
			},
			transitionDuration: {
				'200': '200ms',
			},
			transitionTimingFunction: {
				'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
