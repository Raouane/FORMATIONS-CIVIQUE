/**
 * Utilitaire pour logger les performances des interactions utilisateur
 */

export class PerformanceLogger {
  private static marks: Map<string, number> = new Map();

  /**
   * Marque le début d'une opération
   */
  static markStart(label: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      this.marks.set(label, performance.now());
      performance.mark(`${label}-start`);
    }
  }

  /**
   * Marque la fin d'une opération et log le temps écoulé
   */
  static markEnd(label: string, warnThreshold: number = 100): number {
    if (typeof window !== 'undefined' && window.performance) {
      const startTime = this.marks.get(label);
      if (startTime) {
        const duration = performance.now() - startTime;
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        
        if (duration > warnThreshold) {
          console.warn(`[PERF] ⚠️ ${label}: ${duration.toFixed(2)}ms (seuil: ${warnThreshold}ms)`);
        } else {
          console.log(`[PERF] ✅ ${label}: ${duration.toFixed(2)}ms`);
        }
        
        this.marks.delete(label);
        return duration;
      }
    }
    return 0;
  }

  /**
   * Mesure une opération asynchrone
   */
  static async measure<T>(
    label: string,
    operation: () => Promise<T>,
    warnThreshold: number = 100
  ): Promise<T> {
    this.markStart(label);
    try {
      const result = await operation();
      this.markEnd(label, warnThreshold);
      return result;
    } catch (error) {
      const duration = this.markEnd(label, warnThreshold);
      console.error(`[PERF] ❌ ${label} échoué après ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Mesure une opération synchrone
   */
  static measureSync<T>(
    label: string,
    operation: () => T,
    warnThreshold: number = 50
  ): T {
    this.markStart(label);
    try {
      const result = operation();
      this.markEnd(label, warnThreshold);
      return result;
    } catch (error) {
      const duration = this.markEnd(label, warnThreshold);
      console.error(`[PERF] ❌ ${label} échoué après ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }
}
