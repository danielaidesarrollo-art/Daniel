import { DanielVoiceService } from './DanielVoiceService';

export class SynthesisService {
    private static synth = window.speechSynthesis;
    // Note: daniel.wav processing would usually happen on a server or via a custom Web Audio context
    // For this integration, we will use the local synthesis engine but structure it to receive custom audio if available.

    static async speak(text: string) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        console.log("Utilizando clon de voz Daniel (GPT-SoVITS)...");

        // Try GPT-SoVITS cloning first
        const success = await DanielVoiceService.speak(text);

        if (!success) {
            console.warn("GPT-SoVITS no responde, usando fallback de sistema.");
            // Fallback logic
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-CO';
            utterance.rate = 0.85;
            utterance.pitch = 0.95;
            this.synth.speak(utterance);
        }
    }

    static async confirmStatus(balance: number, gasExpenses: string) {
        const message = `Confirmado jefe. El estado de tus activos es de ${balance.toLocaleString('es-CO')} pesos colombianos. También he registrado los gastos de gas: ${gasExpenses}.`;
        await this.speak(message);
    }
}
