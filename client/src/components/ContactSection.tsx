import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Apple, Smartphone } from "lucide-react";

export default function ContactSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message! We will get back to you soon.",
      });
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      firstName,
      lastName,
      email,
      subject,
      message,
    });
  };

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-xl text-slate-600">
              Have questions or feedback? We're here to help! Reach out to us via our contact form or email, and our team will assist you promptly.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="px-8 py-4 bg-gradient-primary hover-glow"
                >
                  {contactMutation.isPending ? "Sending..." : "Submit Now"}
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Address</h3>
                <p className="text-slate-600 leading-relaxed">
                  Commercial Bank of Dubai Building,<br />
                  Office M-01-60,<br />
                  Al Khabeesi,<br />
                  Dubai.
                </p>
              </div>
              
              {/* Custom SVG Contact Illustration */}
              <div className="mt-8">
                <svg className="w-full h-auto max-w-md" viewBox="0 0 400 300" fill="none">
                  {/* Background */}
                  <rect width="400" height="300" rx="20" fill="url(#contactGradient)"/>
                  {/* Building */}
                  <rect x="150" y="100" width="100" height="150" fill="white" fillOpacity="0.9"/>
                  <rect x="160" y="120" width="15" height="20" fill="#6366F1"/>
                  <rect x="185" y="120" width="15" height="20" fill="#6366F1"/>
                  <rect x="210" y="120" width="15" height="20" fill="#6366F1"/>
                  {/* Communication Lines */}
                  <g className="animate-pulse-slow">
                    <circle cx="100" cy="150" r="30" fill="#F59E0B" fillOpacity="0.3"/>
                    <circle cx="300" cy="180" r="25" fill="#10B981" fillOpacity="0.3"/>
                  </g>
                  
                  <defs>
                    <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            App is available for free on <span className="text-gradient">Google Play & App Store</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <a href="#" className="px-8 py-4 bg-black text-white rounded-xl hover-glow inline-flex items-center space-x-3">
              <Apple className="w-8 h-8" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </a>
            <a href="#" className="px-8 py-4 bg-black text-white rounded-xl hover-glow inline-flex items-center space-x-3">
              <Smartphone className="w-8 h-8" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
