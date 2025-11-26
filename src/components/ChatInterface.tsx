import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Camera } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
}

export const ChatInterface = ({ onSearchRequest, onPhotoUpload, uploadedPhoto }: ChatInterfaceProps) => {
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

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Searching for: "${input}". Let me find the best matches for you...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

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
    <div className="flex flex-col bg-card rounded-xl shadow-medium overflow-hidden">
      {messages.length > 1 && (
        <div className="max-h-48 overflow-y-auto p-4 space-y-3 border-b border-border">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-6">
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
                    className="shrink-0 h-12 w-12"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p>Upload a photo of yourself to see how items would look on you!</p>
                </TooltipContent>
              </Tooltip>
              <Button
                size="icon"
                variant={isListening ? "default" : "outline"}
                onClick={toggleVoiceInput}
                className={`shrink-0 h-12 w-12 ${isListening ? 'bg-secondary animate-pulse' : ''}`}
                title="Voice input"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Tell me what you're looking for..."
                  className="h-12 text-base pr-12 bg-background/50 border-2 focus:border-primary transition-colors"
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="absolute right-1 top-1 h-10 w-10"
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TooltipProvider>
          
          {uploadedPhoto && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/20 px-3 py-2 rounded-lg">
              <Camera className="h-4 w-4" />
              <span>Photo uploaded - try-on ready!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
