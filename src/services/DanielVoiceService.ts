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
            console.log("Configurando voz de Daniel (GPT-SoVITS)...");

            const sovitsPath = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/SoVITS_weights_v2/Daniel_Felipe_e8_s720.pth";
            const gptPath = "C:/Users/johan/Downloads/GPT-SoVITS-v3lora-20250228/GPT-SoVITS-v3lora-20250228/GPT_weights_v2/Daniel_Felipe-e15.ckpt";

            // Load SoVITS Weights
            const sovitsParams = new URLSearchParams({ weights_path: sovitsPath });
            const sRes = await fetch(`${API_BASE}/set_sovits_weights?${sovitsParams.toString()}`);
            if (!sRes.ok) throw new Error(`Failed to set SoVITS weights: ${sRes.status}`);

            // Load GPT Weights
            const gptParams = new URLSearchParams({ weights_path: gptPath });
            const gRes = await fetch(`${API_BASE}/set_gpt_weights?${gptParams.toString()}`);
            if (!gRes.ok) throw new Error(`Failed to set GPT weights: ${gRes.status}`);

            console.log("Pesos de Daniel (e15) cargados con éxito.");
        } catch (error) {
            console.error("Error configurando la voz de Daniel:", error);
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
