import { useState, useRef, useEffect } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversation = useQuery(api.chat.getConversation);
  const sendMessage = useAction(api.chat.sendMessage);
  const clearConversation = useMutation(api.chat.clearConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage({ message: message.trim() });
      setMessage("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await clearConversation();
      toast.success("Chat cleared");
    } catch {
      toast.error("Failed to clear chat");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chat with Your Health Advisor</h2>
          <p className="text-gray-600">Ask about any food and get personalized health advice!</p>
        </div>
        {conversation?.messages && conversation.messages.length > 0 && (
          <button
            onClick={() => { void handleClearChat(); }}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
        {!conversation?.messages || conversation.messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <div className="text-4xl mb-4">🍎</div>
            <p className="text-lg font-medium">Start a conversation!</p>
            <p className="text-sm">Ask me about any food and I'll give you personalized health advice.</p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Try asking:</p>
              <ul className="mt-2 space-y-1">
                <li>"Is pizza healthy for someone with diabetes?"</li>
                <li>"What are good breakfast options for weight loss?"</li>
                <li>"Should I eat bananas if I have high blood pressure?"</li>
              </ul>
            </div>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 border"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about any food... (e.g., 'Is salmon good for my heart condition?')"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
