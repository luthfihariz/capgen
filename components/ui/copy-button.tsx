"use client";
import { useState } from "react";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (error) {
        // noop
      }
    };
  
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy caption"}
      >
        {copied ? <Check className="text-green-600" /> : <Copy />}
        {copied ? "Copied" : "Copy"}
      </Button>
    );
}