import { Camera, Mic, Send, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./MessageBubble";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSearchRequest: (query: string) => void;
  onPhotoUpload: (file: File) => void;
  uploadedPhoto: File | null;
  isUploadingPhoto?: boolean;
  assistantReply?: string;
}

export const ChatInterface = ({ onSearchRequest, onPhotoUpload, uploadedPhoto, isUploadingPhoto = false, assistantReply }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your personal shopping assistant. Tell me what you're looking for, or describe what you need. You can also upload a photo to see how items would look on you!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (assistantReply) {
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: "assistant",
        content: assistantReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  }, [assistantReply]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      };
    }
  }, [toast]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Stop recording if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onSearchRequest(input);
    setInput("");
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
      toast({
        title: "Photo uploaded",
        description: "Processing your photo for virtual try-on...",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-card overflow-hidden border border-border/60">
      {/* Messages Area - Grows to fill space */}
      {messages.length > 1 && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 border-b border-border/60 bg-gradient-subtle min-h-0">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area - Fixed size at bottom */}
      <div className="flex-shrink-0 p-5">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <TooltipProvider>
            <div className="flex gap-3 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePhotoClick}
                    disabled={isUploadingPhoto}
                    className="shrink-0 h-11 w-11 rounded-xl border-border/60"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">Upload a photo of yourself to see how items would look on you!</p>
                </TooltipContent>
              </Tooltip>
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={toggleVoiceInput}
                className={`shrink-0 h-11 w-11 rounded-xl border-border/60 ${isListening ? 'animate-pulse shadow-soft' : ''}`}
                title="Voice input"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      // Stop recording when Enter is pressed
                      if (isListening) {
                        recognitionRef.current?.stop();
                        setIsListening(false);
                      }
                      handleSend();
                    }
                  }}
                  placeholder="Tell me what you're looking for..."
                  className="h-11 text-sm pr-12 bg-background/50 border-border/60 rounded-xl focus:border-primary transition-colors font-medium placeholder:text-muted-foreground/60"
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="absolute right-1 top-1 h-9 w-9 rounded-lg"
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TooltipProvider>
          
          {uploadedPhoto && (
            <div className="flex items-center gap-2 text-xs font-medium text-secondary-foreground bg-secondary/40 px-3 py-2 rounded-lg border border-secondary/60">
              <Camera className="h-3.5 w-3.5" />
              <span>Photo uploaded - try-on ready!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
