const { withNativeWind } = require("nativewind/utils");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F5B800',
          dark: '#E6AC00',
        },
        secondary: {
          DEFAULT: '#111111',
          light: '#6B7280',
        },
        rider: {
          online: '#4CAF50',
          offline: '#E53935',
          surge: '#FF9800',
          emergency: '#B71C1C',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1C1C1E',
        },
        surface: {
          light: '#F8F8F8',
          dark: '#2C2C2E',
        }
      },
      fontFamily: {
        bold: ['Poppins-Bold'],
        semiBold: ['Poppins-SemiBold'],
        medium: ['Poppins-Medium'],
        regular: ['Poppins-Regular'],
      },
    },
  },
  plugins: [],
};
