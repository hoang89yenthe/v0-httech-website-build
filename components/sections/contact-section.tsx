"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { PHONE, ZALO, formatPhoneDisplay } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  const { locale } = useLanguage();
  const tr = t(locale).contact;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: bot tự điền field ẩn → reject ngay client-side
    if (honeypot) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _hp: honeypot }),
      });
      if (!res.ok) throw new Error("Gửi thất bại");
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", product: "", message: "" });
    } catch {
      setError(tr.errorDefault);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {tr.heading}<br />
            <span className="text-primary">{tr.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">{tr.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{tr.address}</h3>
                    <p className="text-sm text-muted-foreground">
                      CL13-16 KĐT Him Lam Green Park, Phường Võ Cường, Tỉnh Bắc Ninh, Việt Nam
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{tr.phone}</h3>
                    <a href={`tel:${PHONE}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                      {formatPhoneDisplay(PHONE)}
                    </a>
                    <a
                      href={`https://zalo.me/${ZALO}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0068FF] hover:underline mt-0.5 block"
                    >
                      {tr.chatZalo}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{tr.email}</h3>
                    <p className="text-sm text-muted-foreground">
                      httechbn@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6">{tr.formTitle}</h3>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h4 className="text-xl font-semibold">{tr.successTitle}</h4>
                    <p className="text-muted-foreground max-w-sm">{tr.successBody}</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                      {tr.sendAnother}
                    </Button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot — ẩn với người dùng, bot tự điền */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {tr.name} <span className="text-red-500">*</span>
                      </label>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder={tr.namePlaceholder} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {tr.phoneField} <span className="text-red-500">*</span>
                      </label>
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder={tr.phonePlaceholder} required />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{tr.emailField}</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={tr.emailPlaceholder} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{tr.productField}</label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">{tr.productDefault}</option>
                      {Object.entries(tr.productOptions).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{tr.messageField}</label>
                    <Textarea name="message" value={formData.message} onChange={handleChange} placeholder={tr.messagePlaceholder} rows={4} />
                  </div>

                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                  <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                    <Send className="w-4 h-4" />
                    {loading ? tr.submitting : tr.submit}
                  </Button>
                </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
}
