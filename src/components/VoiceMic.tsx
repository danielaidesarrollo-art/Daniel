import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceMicProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
}

const VoiceMic: React.FC<VoiceMicProps> = ({ onTranscript, isListening, setIsListening }) => {
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'es-CO';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript, setIsListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  }, [isListening, recognition, setIsListening]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border ${isListening
          ? 'flow-gradient-cyan-magenta flow-glow-mixed scale-110 border-flow-cyan/50'
          : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
          } backdrop-blur-md shadow-2xl`}
      >
        {isListening ? (
          <Mic className="text-white animate-pulse" size={28} />
        ) : (
          <MicOff className="text-slate-400" size={28} />
        )}
      </button>
      {isListening && (
        <div className="absolute -top-12 right-0 bg-flow-cyan/10 backdrop-blur-md border border-flow-cyan/30 px-4 py-1 rounded-full text-flow-cyan text-sm font-medium flow-glow-cyan">
          Daniel escuchando...
        </div>
      )}
    </div>
  );
};

export default VoiceMic;
