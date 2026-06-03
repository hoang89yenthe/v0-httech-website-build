"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { PHONE, ZALO, formatPhoneDisplay } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", phone: "", email: "", product: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Liên Hệ<br />
            <span className="text-primary">Với Chúng Tôi.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Để lại thông tin, đội ngũ kỹ sư HT TECH sẽ phản hồi trong vòng 30 phút.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Địa chỉ</h3>
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
                    <h3 className="font-semibold mb-1">Hotline / Zalo</h3>
                    <a href={`tel:${PHONE}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                      {formatPhoneDisplay(PHONE)}
                    </a>
                    <a
                      href={`https://zalo.me/${ZALO}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0068FF] hover:underline mt-0.5 block"
                    >
                      Chat Zalo ngay →
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
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Httechbn@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                    <p className="text-sm text-muted-foreground">
                      T2 - T6: 8:00 - 17:30
                      <br />
                      T7: 8:00 - 12:00
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
                <h3 className="text-xl font-semibold mb-6">Gửi yêu cầu tư vấn</h3>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h4 className="text-xl font-semibold">Gửi yêu cầu thành công!</h4>
                    <p className="text-muted-foreground max-w-sm">
                      Cảm ơn bạn đã liên hệ. Đội ngũ tư vấn HT TECH sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                      Gửi yêu cầu khác
                    </Button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sản phẩm quan tâm
                    </label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      <option value="bien-tan">Biến tần</option>
                      <option value="plc-hmi">PLC & HMI</option>
                      <option value="dong-cat">Thiết bị đóng cắt</option>
                      <option value="cam-bien">Cảm biến</option>
                      <option value="vat-tu">Vật tư tủ điện</option>
                      <option value="dich-vu">Dịch vụ kỹ thuật</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Nội dung yêu cầu
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mô tả chi tiết nhu cầu của bạn..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Gửi yêu cầu
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
