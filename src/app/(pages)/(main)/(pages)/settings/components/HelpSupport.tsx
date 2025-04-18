"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HelpSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const faqs = [
    {
      question: "How does the AI assistant work?",
      answer:
        "Our AI assistant uses machine learning to understand your learning patterns and provide personalized help with your coursework, answer questions, and offer study tips.",
    },
    {
      question: "Can I download course materials?",
      answer:
        "Yes, you can download most course materials for offline study. Look for the download icon on course pages.",
    },
    {
      question: "How do I reset my password?",
      answer:
        'You can reset your password by clicking "Forgot Password" on the login screen, or by changing it in your Account Settings.',
    },
    {
      question: "Is my data secure?",
      answer:
        "We take data security seriously. All personal information is encrypted and stored securely. You can manage your privacy settings in the Privacy tab.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-background rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Help & Support</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4"
            >
              <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        <Button
          variant="link"
          className="text-primary hover:text-primary/90 mt-4 p-0"
        >
          View all FAQs →
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Contact Support</h3>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-2xl"
        >
          <div>
            <Label
              htmlFor="subject"
              aria-required
            >
              Subject <span className="text-red-600">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Briefly describe your issue"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">
              Message <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide details about your issue or question"
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
