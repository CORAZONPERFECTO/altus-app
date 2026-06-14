import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';

interface AITextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  contextContext?: string; // Para decirle a la IA de qué trata este campo (ej. "Misión")
}

export default function AITextArea({ value, onChange, placeholder, className, contextContext }: AITextAreaProps) {
  const [isListening, setIsListening] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Inicializar Web Speech API para el dictado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'es-ES'; // Español por defecto

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          // Concatenar el dictado al valor actual
          onChange((value ? value + ' ' : '') + currentTranscript);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const enhanceText = async () => {
    if (!value.trim()) return;
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, contextContext }),
      });
      const data = await response.json();
      
      if (data.enhancedText) {
        onChange(data.enhancedText);
      } else {
        alert(data.error || 'Error al mejorar el texto con IA');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el cerebro IA');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="relative group">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none pb-12 ${className || ''}`}
      />
      
      {/* Botones Flotantes (Solo visibles en hover o cuando están activos) */}
      <div className="absolute bottom-3 right-3 flex items-center space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        
        {/* Botón de Dictado (Micrófono) */}
        <button
          onClick={toggleListen}
          type="button"
          className={`p-2 rounded-lg flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
              : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
          title={isListening ? 'Detener grabación' : 'Dictar por voz'}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        {/* Botón Mágico (Mejorar con IA) */}
        <button
          onClick={enhanceText}
          disabled={isEnhancing || !value.trim()}
          type="button"
          className={`p-2 rounded-lg flex items-center justify-center transition-all ${
            isEnhancing 
              ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
          title="Mejorar redacción con IA"
        >
          {isEnhancing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
