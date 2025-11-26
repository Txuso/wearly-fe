import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3.5 py-2.5 shadow-card border",
          isUser
            ? "bg-[hsl(var(--primary))] text-white border-primary/20"
            : "bg-card/80 text-card-foreground border-border/60 backdrop-blur-sm"
        )}
      >
        <p className="text-xs font-medium leading-relaxed">{message.content}</p>
        <p className={cn(
          "text-[10px] mt-1 font-medium text-white"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
