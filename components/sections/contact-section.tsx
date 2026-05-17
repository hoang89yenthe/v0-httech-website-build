"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    product: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - would integrate with Sanity or other backend
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      company: "",
      product: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Liên Hệ <span className="text-primary">Với Chúng Tôi</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Để lại thông tin, đội ngũ tư vấn của HTtech sẽ liên hệ và hỗ trợ bạn trong thời gian sớm nhất.
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
                      123 Đường ABC, Phường XYZ, Quận 9, TP. Hồ Chí Minh
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
                    <h3 className="font-semibold mb-1">Hotline</h3>
                    <p className="text-sm text-muted-foreground">
                      1900 6868
                      <br />
                      0909 123 456
                    </p>
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
                      info@httech.vn
                      <br />
                      sales@httech.vn
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

                  <div className="grid sm:grid-cols-2 gap-4">
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
                      <label className="text-sm font-medium mb-2 block">Công ty</label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Tên công ty"
                      />
                    </div>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4842102890986!2d106.76932!3d10.8500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUxJzAwLjAiTiAxMDbCsDQ2JzA5LjYiRQ!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="HTtech location"
          />
        </div>
      </div>
    </section>
  );
}
