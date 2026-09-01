import '../src/styles.css';

export const metadata = {
  title: 'guzl · WebMCP Experience Intelligence',
  description:
    'A WebMCP reference demo showing how experience context survives a consequential cancellation flow.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
