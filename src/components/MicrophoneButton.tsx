import { useState, useRef, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MicrophoneButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const MicrophoneButton = ({ onTranscript, className }: MicrophoneButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({ title: "Not supported", description: "Speech recognition is not supported in this browser.", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "aborted") {
        toast({ title: "Mic error", description: `Could not recognize speech: ${event.error}`, variant: "destructive" });
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }, [isListening, onTranscript, toast]);

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "default"}
      size="icon"
      onClick={toggleListening}
      className={`h-8 w-8 shrink-0 ${isListening ? "animate-pulse" : ""} ${className || ""}`}
      title={isListening ? "Stop recording" : "Voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default MicrophoneButton;
