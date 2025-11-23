import { useState, useEffect, useRef } from 'react';

const useVoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            
            // Configuration
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US'; // You can change language

            // Event handlers
            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPiece = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPiece + ' ';
                    } else {
                        interimTranscript += transcriptPiece;
                    }
                }

                setTranscript(finalTranscript || interimTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                
                if (event.error === 'no-speech') {
                    alert('No speech detected. Please try again.');
                } else if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please allow microphone access.');
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSupported(false);
            console.warn('Speech recognition not supported in this browser');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const resetTranscript = () => {
        setTranscript('');
    };

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        isSupported
    };
};

export default useVoiceInput;