import "./globals.css";
export const metadata = { title: "OAuth setup guides for agent builders", description: "How hard is it to get an OAuth app ready for an integration, how long it takes, and what to do next." };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="top"><a href="/">OAuth setup guides</a></header>
        <main>{children}</main>
        <footer>Guides say what was tested, what an official page supports, and what is still a guess.</footer>
      </body>
    </html>
  );
}
