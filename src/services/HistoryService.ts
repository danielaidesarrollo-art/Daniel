/**
 * HistoryService.ts
 * Persists Sentinel recommendations and historical market events.
 */

import type { MacroEvent, Recommendation } from './SentinelService';

export interface HistoryEntry {
    timestamp: number;
    event: MacroEvent;
    recommendation: Recommendation;
    result?: string; // To be filled later for "Continuous Learning"
}

export class HistoryService {
    private static STORAGE_KEY = 'daniel_sentinel_history';

    static addEntry(event: MacroEvent, recommendation: Recommendation) {
        const history = this.getHistory();
        const entry: HistoryEntry = {
            timestamp: Date.now(),
            event,
            recommendation
        };

        history.unshift(entry); // Newest first
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
        console.log("Historial Sentinela actualizado:", entry);
    }

    static getHistory(): HistoryEntry[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        try {
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    static clearHistory() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
