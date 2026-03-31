import { useCallback, forwardRef } from "react";
import { useScribe } from "@elevenlabs/react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MicrophoneButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const MicrophoneButton = forwardRef<HTMLButtonElement, MicrophoneButtonProps>(
  ({ onTranscript, className }, ref) => {
    const { toast } = useToast();

    const scribe = useScribe({
      modelId: "scribe_v2_realtime",
      commitStrategy: "vad" as any,
      onCommittedTranscript: (data) => {
        if (data.text?.trim()) {
          onTranscript(data.text.trim());
        }
      },
    });

    const toggleListening = useCallback(async () => {
      if (scribe.isConnected) {
        scribe.disconnect();
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "elevenlabs-scribe-token"
        );

        if (error || !data?.token) {
          throw new Error("Failed to get transcription token");
        }

        await scribe.connect({
          token: data.token,
          microphone: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
      } catch (err) {
        console.error("Speech-to-text error:", err);
        toast({
          title: "Mic error",
          description: "Could not start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
    }, [scribe, toast]);

    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <Button
          ref={ref}
          type="button"
          variant={scribe.isConnected ? "destructive" : "default"}
          size="icon"
          onClick={toggleListening}
          className={`h-8 w-8 shrink-0 ${scribe.isConnected ? "animate-pulse" : ""}`}
          title={scribe.isConnected ? "Stop recording" : "Voice input"}
        >
          {scribe.isConnected ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        {scribe.isConnected && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="inline-block w-0.5 rounded-full bg-destructive animate-bounce"
                  style={{
                    height: `${8 + Math.random() * 8}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.6s",
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-destructive whitespace-nowrap">
              Listening…
            </span>
          </div>
        )}
      </div>
    );
  }
);

MicrophoneButton.displayName = "MicrophoneButton";

export default MicrophoneButton;
