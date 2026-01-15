/**
 * DanielVoiceService.ts
 * Manages the integration with GPT-SoVITS inference server.
 * Supports both local development and remote production deployment.
 */

// Configuración del servidor de voz
const VOICE_SERVER_URL = import.meta.env.VITE_VOICE_SERVER_URL || "/sovits";
const USE_REMOTE_SERVER = import.meta.env.VITE_USE_REMOTE_VOICE === "true";

// Rutas de los modelos (solo para servidor local)
const LOCAL_SOVITS_PATH = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/SoVITS_weights_v2/Daniel_Felipe_e8_s720.pth";
const LOCAL_GPT_PATH = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/GPT_weights_v2/Daniel_Felipe-e15.ckpt";
const LOCAL_REF_AUDIO = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/output/slicer_opt/Audio daniel.wav_0000035840_0000184320.wav";

export class DanielVoiceService {
    private static isConfigured = false;

    /**
     * Configures the SoVITS server with Daniel's specific weights.
     * Only needed for local development.
     */
    static async configureVoice() {
        // Si estamos usando servidor remoto, asumimos que ya está configurado
        if (USE_REMOTE_SERVER) {
            console.log("🌐 Daniel Context: Usando servidor de voz remoto en", VOICE_SERVER_URL);
            this.isConfigured = true;
            return;
        }

        try {
            console.log("🔧 Daniel Context: Iniciando configuración de voz (GPT-SoVITS)...");
            console.log("🔧 Daniel Context: Verificando conexión con el servidor local");

            // Load SoVITS Weights
            const sovitsParams = new URLSearchParams({ weights_path: LOCAL_SOVITS_PATH });
            const sRes = await fetch(`${VOICE_SERVER_URL}/set_sovits_weights?${sovitsParams.toString()}`);
            if (!sRes.ok) {
                console.error(`❌ Daniel Context: Error cargando SoVITS weights. Código: ${sRes.status}`);
                console.error("💡 Sugerencia: Ejecute el script 'go-api.bat' en su carpeta de GPT-SoVITS.");
                return;
            }

            // Load GPT Weights
            const gptParams = new URLSearchParams({ weights_path: LOCAL_GPT_PATH });
            const gRes = await fetch(`${VOICE_SERVER_URL}/set_gpt_weights?${gptParams.toString()}`);
            if (!gRes.ok) {
                console.error(`❌ Daniel Context: Error cargando GPT weights. Código: ${gRes.status}`);
                return;
            }

            console.log("✅ Daniel Context: Voz de Daniel (e15) configurada con éxito.");
            this.isConfigured = true;
        } catch (error) {
            console.error("❌ Daniel Context: ERROR FATAL configurando la voz de Daniel:", error);
            console.error("💡 Sugerencia: Ejecute el script 'go-api.bat' en su carpeta de GPT-SoVITS.");
        }
    }

    /**
     * Synthesizes text using Daniel's cloned voice.
     * Works with both local and remote servers.
     */
    static async speak(text: string): Promise<boolean> {
        try {
            // Para servidor remoto, usar una referencia de audio embebida o URL pública
            const refAudio = USE_REMOTE_SERVER
                ? "/audio/daniel_ref.wav"  // Deberás subir este archivo al servidor
                : LOCAL_REF_AUDIO;

            const promptText = "Confirmado jefe.";
            const params = new URLSearchParams({
                text: text,
                text_lang: "es",
                ref_audio_path: refAudio,
                prompt_text: promptText,
                prompt_lang: "es",
                text_split_method: "cut5",
                batch_size: "1",
                media_type: "wav"
            });

            const response = await fetch(`${VOICE_SERVER_URL}/tts?${params.toString()}`);
            if (!response.ok) {
                console.error(`❌ TTS Request failed: ${response.status}`);
                return false;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            return new Promise((resolve) => {
                audio.onended = () => {
                    URL.revokeObjectURL(url);
                    resolve(true);
                };
                audio.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve(false);
                };
                audio.play();
            });
        } catch (error) {
            console.error("❌ Error en la síntesis de Daniel:", error);
            return false;
        }
    }

    /**
     * Verifica si el servidor de voz está disponible
     */
    static async checkServerStatus(): Promise<boolean> {
        try {
            const response = await fetch(`${VOICE_SERVER_URL}/`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        } catch (error) {
            console.warn("⚠️ Servidor de voz no disponible:", error);
            return false;
        }
    }

    /**
     * Obtiene información sobre la configuración actual
     */
    static getConfig() {
        return {
            serverUrl: VOICE_SERVER_URL,
            isRemote: USE_REMOTE_SERVER,
            isConfigured: this.isConfigured
        };
    }
}
