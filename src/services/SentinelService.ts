/**
 * SentinelService.ts
 * Core logic for the "Sentinela Macro" Protocol.
 * Links macro events to Beefy vault recommendations.
 */

import { SynthesisService } from './SynthesisService';
import { HistoryService } from './HistoryService';

export interface MacroEvent {
    id: string;
    description: string;
    category: 'Inflation' | 'Regulation' | 'Unlock' | 'Market';
    impact: number; // 0 to 100
    timestamp: number;
}

export interface BeefyVault {
    id: string;
    name: string;
    asset: string;
    type: 'LP' | 'Stable' | 'Single';
    currentApy: number;
}

export interface Recommendation {
    eventId: string;
    action: 'Move to Stable' | 'Harvest' | 'Hold' | 'Aggressive Compound';
    reason: string;
    priority: 'Low' | 'Medium' | 'High';
}

export class SentinelService {
    private static vaults: BeefyVault[] = [
        { id: '1', name: 'USDC-DAI LP', asset: 'Stablecoins', type: 'Stable', currentApy: 12.5 },
        { id: '2', name: 'ETH-WAVAX LP', asset: 'ETH/AVAX', type: 'LP', currentApy: 45.2 },
        { id: '3', name: 'BIFI Single', asset: 'BIFI', type: 'Single', currentApy: 18.2 }
    ];

    /**
     * Analyzes a macro event and generates a recommendation for Beefy vaults.
     */
    static analyzeEvent(event: MacroEvent): Recommendation {
        let action: Recommendation['action'] = 'Hold';
        let reason = '';
        let priority: Recommendation['priority'] = 'Low';

        if (event.impact > 10) {
            priority = 'High';
        } else if (event.impact > 5) {
            priority = 'Medium';
        }

        // Action Matrix Logic
        if (event.category === 'Inflation' && event.impact > 8) {
            action = 'Move to Stable';
            reason = `Inflación alta (${event.impact}%). Protegiendo capital en vaults de stablecoins.`;
        } else if (event.category === 'Unlock' && event.impact > 5) {
            action = 'Harvest';
            reason = `Desbloqueo de tokens detectado. Recomiendo retirar ganancias antes de la presión de venta.`;
        } else if (event.category === 'Market' && event.impact < 3) {
            action = 'Aggressive Compound';
            reason = `Baja volatilidad detectada. Momento ideal para interés compuesto agresivo.`;
        } else {
            action = 'Hold';
            reason = `Evento estable. Mantener estrategias actuales en Beefy.`;
        }

        const recommendation: Recommendation = {
            eventId: event.id,
            action,
            reason,
            priority
        };

        // Log to History
        HistoryService.addEntry(event, recommendation);

        // Trigger Voice Alert if Priority is High
        if (priority === 'High') {
            this.triggerVoiceAlert(event, recommendation);
        }

        return recommendation;
    }

    private static triggerVoiceAlert(event: MacroEvent, rec: Recommendation) {
        const message = `Alerta de prioridad, jefe. ${event.description}. El impacto estimado es del ${event.impact} por ciento. Mi recomendación Sentinela es: ${rec.action}. Motivo: ${rec.reason}`;
        SynthesisService.speak(message);
    }

    static getVaults() {
        return this.vaults;
    }
}
