/**
 * DanielVoiceService.ts
 * Manages the integration with the local GPT-SoVITS inference server.
 */

const API_BASE = "/sovits";

export class DanielVoiceService {
    /**
     * Configures the local SoVITS server with Daniel's specific weights.
     */
    static async configureVoice() {
        try {
            console.log(" Daniel Context: Iniciando configuración de voz (GPT-SoVITS)...");
            console.log(" Daniel Context: Verificando conexión con el servidor en http://127.0.0.1:9880");

            const sovitsPath = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/SoVITS_weights_v2/Daniel_Felipe_e8_s720.pth";
            const gptPath = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/GPT_weights_v2/Daniel_Felipe-e15.ckpt";

            // Load SoVITS Weights
            const sovitsParams = new URLSearchParams({ weights_path: sovitsPath });
            const sRes = await fetch(`${API_BASE}/set_sovits_weights?${sovitsParams.toString()}`);
            if (!sRes.ok) {
                console.error(` Daniel Context: Error cargando SoVITS weights. Código: ${sRes.status}. Asegúrese de que el servidor está encendido.`);
                return;
            }

            // Load GPT Weights
            const gptParams = new URLSearchParams({ weights_path: gptPath });
            const gRes = await fetch(`${API_BASE}/set_gpt_weights?${gptParams.toString()}`);
            if (!gRes.ok) {
                console.error(` Daniel Context: Error cargando GPT weights. Código: ${gRes.status}`);
                return;
            }

            console.log(" Daniel Context: ✅ Voz de Daniel (e15) configuratada con éxito.");
        } catch (error) {
            console.error(" Daniel Context: ❌ ERROR FATAL configurando la voz de Daniel:", error);
            console.error(" Sugerencia: Ejecute el script 'go-api.bat' en su carpeta de GPT-SoVITS.");
        }
    }

    /**
     * Synthesizes text using Daniel's cloned voice.
     * Uses a representative slice of daniel.wav for reference.
     */
    static async speak(text: string) {
        try {
            const refAudio = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/output/slicer_opt/Audio daniel.wav_0000035840_0000184320.wav";
            const promptText = "Confirmado jefe."; // Text corresponding to the ref audio if known
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

            const response = await fetch(`${API_BASE}/tts?${params.toString()}`);
            if (!response.ok) throw new Error("TTS Request failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            return new Promise((resolve) => {
                audio.onended = () => resolve(true);
                audio.onerror = () => resolve(false);
                audio.play();
            });
        } catch (error) {
            console.error("Error en la síntesis de Daniel:", error);
            return false;
        }
    }
}
