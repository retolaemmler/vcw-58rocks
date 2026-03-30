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
      commitStrategy: "vad",
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
      <Button
        ref={ref}
        type="button"
        variant={scribe.isConnected ? "destructive" : "default"}
        size="icon"
        onClick={toggleListening}
        className={`h-8 w-8 shrink-0 ${scribe.isConnected ? "animate-pulse" : ""} ${className || ""}`}
        title={scribe.isConnected ? "Stop recording" : "Voice input"}
      >
        {scribe.isConnected ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    );
  }
);

MicrophoneButton.displayName = "MicrophoneButton";

export default MicrophoneButton;
