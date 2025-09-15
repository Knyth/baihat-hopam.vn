// src/app/font.js

import { Nunito_Sans, Inter } from 'next/font/google';
export const nunito = Nunito_Sans({ subsets: ['vietnamese','latin'], weight: ['400','600','700','800'], variable: '--font-ui', display: 'swap' });
export const inter = Inter({ subsets: ['vietnamese','latin'], weight: ['400','500','600','700'], variable: '--font-content', display: 'swap' });


// src/app/font.js
// import { Nunito_Sans, Inter } from 'next/font/google';

// export const nunito = Nunito_Sans({
//   subsets: ['vietnamese', 'latin'],
//   weight: ['400','600','700','800'],
//   variable: '--font-ui',
//   display: 'swap',
// });

// export const inter = Inter({
//   subsets: ['vietnamese','latin'],
//   weight: ['400','500','600','700'],
//   variable: '--font-content',
//   display: 'swap',
// });
