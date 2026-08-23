/* --- Reconhecimento de Voz Aprimorado e sem Travamentos --- */
let recognition = null;
let isListening = false;
const btnVoice = document.getElementById('btnVoice');
const voiceBtnText = document.getElementById('voiceBtnText');
const voiceStatus = document.getElementById('voiceStatus');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function resetVoiceUI(statusText = 'Aguardando...') {
    isListening = false;
    btnVoice.classList.remove('listening');
    voiceBtnText.textContent = 'COMANDO DE VOZ';
    voiceStatus.textContent = statusText;
}

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        btnVoice.classList.add('listening');
        voiceBtnText.textContent = 'OUVINDO...';
        voiceStatus.textContent = 'Pode falar...';
    };

    recognition.onend = () => {
        resetVoiceUI('Aguardando...');
    };

    recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
            resetVoiceUI('Nenhuma voz ouvida');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            resetVoiceUI('Permissão negada');
            alert('Permita o acesso ao microfone no navegador.');
        } else {
            resetVoiceUI('Erro no microfone');
        }
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase().trim();
        voiceStatus.textContent = `"${text}"`;
        processVoiceCommand(text);
    };
} else {
    btnVoice.disabled = true;
    voiceStatus.textContent = 'Voz não suportada';
}

function toggleVoiceRecognition() {
    if (!recognition) return;
    
    if (isListening) {
        try {
            recognition.abort(); // Interrompe imediatamente sem esperar buffer
        } catch (e) {
            console.error(e);
        }
        resetVoiceUI('Cancelado');
    } else {
        try {
            recognition.start();
        } catch (e) {
            // Se o motor de reconhecimento já estiver ativo em segundo plano, reseta e reinicia
            recognition.abort();
            setTimeout(() => {
                try { recognition.start(); } catch (err) { resetVoiceUI('Erro ao iniciar'); }
            }, 150);
        }
    }
}