export const typography = {
  fontFamily: {
    bold: 'Poppins-Bold',
    semiBold: 'Poppins-SemiBold',
    medium: 'Poppins-Medium',
    regular: 'Poppins-Regular',
  },
  size: {
    hero: 32,
    title: 24,
    section: 20,
    card: 18,
    body: 16,
    caption: 14,
    small: 12,
  },
  weight: {
    bold: '700' as const,
    semiBold: '600' as const,
    medium: '500' as const,
    regular: '400' as const,
  },
};

export type Typography = typeof typography;
