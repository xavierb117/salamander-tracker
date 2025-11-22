import "./globals.css";
import Footer from "@/app/components/Footer.jsx"
import Facts from "@/app//components/Facts.jsx"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Facts />
        <Footer />
      </body>
    </html>
  );
}
