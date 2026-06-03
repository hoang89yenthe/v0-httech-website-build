"use client";
import { Phone, MessageCircle } from "lucide-react";

const PHONE = "0972916382";
const ZALO = process.env.NEXT_PUBLIC_ZALO_NUMBER ?? PHONE;

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 md:hidden">
      <a
        href={`https://zalo.me/${ZALO}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="w-14 h-14 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a
        href={`tel:${PHONE}`}
        aria-label="Gọi điện"
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
