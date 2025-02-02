import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
          rel="stylesheet"
        />
        {/* <link href="/vendor/fontawesome-free/css/all.min.css" rel="stylesheet" /> */}
        <link href="/css/sb-admin-2.min.css" rel="stylesheet" />
        {/* <link
          href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.min.css"
          rel="stylesheet"
        /> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.0/css/all.min.css"
          integrity="sha512-10/jx2EXwxxWqCLX/hHth/vu2KY3jCF70dCQB8TSgNjbCVAC/8vai53GfMDrO2Emgwccf2pJqxct9ehpzG+MTw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* <link href="/vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="main-container">
          <Sidebar />
          <div className="content">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
        <Toaster />
        <Script src="/vendor/jquery/jquery.min.js" strategy="afterInteractive" />
        <Script src="/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        {/* <Script src="/vendor/jquery-easing/jquery.easing.min.js" strategy="afterInteractive" /> */}
        {/* <Script src="/js/sb-admin-2.min.js" strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}
