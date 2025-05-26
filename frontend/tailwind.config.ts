import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ['class'],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
  				'6': 'hsl(var(--chart-6, 260 60% 50%))',
  				'7': 'hsl(var(--chart-7, 300 70% 50%))',
  				'8': 'hsl(var(--chart-8, 330 80% 50%))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
        success: {
          DEFAULT: 'hsl(var(--success, 142 76% 36%))',
          foreground: 'hsl(var(--success-foreground, 0 0% 98%))'
        },
        info: {
          DEFAULT: 'hsl(var(--info, 211 100% 50%))',
          foreground: 'hsl(var(--info-foreground, 0 0% 98%))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning, 45 100% 51%))',
          foreground: 'hsl(var(--warning-foreground, 0 0% 9%))'
        },
        // New theme colors
        monochrome: {
          50: 'hsl(var(--mono-50, 0 0% 98%))',
          100: 'hsl(var(--mono-100, 0 0% 95%))',
          200: 'hsl(var(--mono-200, 0 0% 90%))',
          300: 'hsl(var(--mono-300, 0 0% 83%))',
          400: 'hsl(var(--mono-400, 0 0% 64%))',
          500: 'hsl(var(--mono-500, 0 0% 45%))',
          600: 'hsl(var(--mono-600, 0 0% 32%))',
          700: 'hsl(var(--mono-700, 0 0% 25%))',
          800: 'hsl(var(--mono-800, 0 0% 15%))',
          900: 'hsl(var(--mono-900, 0 0% 9%))',
          950: 'hsl(var(--mono-950, 0 0% 4%))',
        },
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
        'spin': {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        },
        'theme-fade': {
          '0%': { 
            opacity: '0.2' 
          },
          '100%': { 
            opacity: '1' 
          }
        },
        'float': {
          '0%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        },
        'scale-up': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0.7'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(20px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'blur-in': {
          '0%': {
            filter: 'blur(5px)',
            opacity: '0'
          },
          '100%': {
            filter: 'blur(0)',
            opacity: '1'
          }
        },
        'pulse-shadow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(var(--primary-rgb), 0.4)'
          },
          '50%': {
            boxShadow: '0 0 0 15px rgba(var(--primary-rgb), 0)'
          }
        },
        'morph': {
          '0%': { borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '100%': { borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'wave': {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(5px)' },
          '100%': { transform: 'translateY(0)' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'rotate-orbit': {
          '0%': { transform: 'rotate(0deg) translateX(10px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(10px) rotate(-360deg)' }
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'spin': 'spin 1s linear infinite',
        'theme-fade': 'theme-fade 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'scale-up': 'scale-up 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'blur-in': 'blur-in 0.4s ease-out forwards',
        'pulse-shadow': 'pulse-shadow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'rotate-orbit': 'rotate-orbit 8s linear infinite'
  		},
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-overlay': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(var(--primary) / 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(var(--accent) / 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(var(--secondary) / 0.1) 0px, transparent 50%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        'futuristic-grid': 'linear-gradient(to right, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
        'float': '0 10px 20px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'inner-glow': 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
        'neon': '0 0 5px rgba(var(--primary-rgb), 0.2), 0 0 20px rgba(var(--primary-rgb), 0.4), 0 0 30px rgba(var(--primary-rgb), 0.1)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'layered': '0 1px 1px rgba(0, 0, 0, 0.08), 0 2px 2px rgba(0, 0, 0, 0.05), 0 4px 4px rgba(0, 0, 0, 0.03), 0 8px 8px rgba(0, 0, 0, 0.02)',
        'sharp': '0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 5px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spring': 'cubic-bezier(0.5, 1.5, 0.5, 0.9)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.45, 0, 0.15, 1)',
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)'
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '32px'
      }
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)'
        },
        '.text-glow': {
          textShadow: '0 0 5px rgba(var(--primary-rgb), 0.5), 0 0 20px rgba(var(--primary-rgb), 0.3)'
        },
        '.backdrop-blur-2xs': {
          backdropFilter: 'blur(1px)'
        },
        '.backdrop-saturate-150': {
          backdropFilter: 'saturate(150%)'
        },
        '.glass-panel': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px) saturate(180%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius)'
        },
        '.mask-radial-gradient': {
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)'
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d'
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden'
        }
      };
      
      addUtilities(newUtilities);
    }
  ],
};

export default config;
