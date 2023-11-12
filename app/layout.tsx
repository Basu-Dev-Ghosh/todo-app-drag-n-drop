import type { Metadata } from "next";
import "./globals.css";
import Modal from "@/components/Modal/Modal";

export const metadata: Metadata = {
  title: `Basu's Todo App`,
  description: "Todo app created by Basu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f6f8]">
        {children}
        <Modal />
      </body>
    </html>
  );
}
