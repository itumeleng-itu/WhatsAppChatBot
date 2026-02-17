import fs from 'fs/promises';
import path from 'path';

export interface QueryLog {
  id: string;
  learnerId: string;
  query: string;
  response: string;
  timestamp: Date;
  confidence: number;
  category?: string;
}

/**
 * Service for logging learner queries and responses for QA purposes
 */
export class QueryLogger {
  private logDir: string;

  constructor() {
    this.logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error('Error creating log directory:', error);
    }
  }

  /**
   * Log a learner query
   */
  async logQuery(learnerId: string, query: string): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      learnerId,
      query,
      type: 'query',
    };

    await this.writeLog('queries', logEntry);
  }

  /**
   * Log a response
   */
  async logResponse(
    learnerId: string,
    query: string,
    response: string,
    confidence: number,
    category?: string
  ): Promise<void> {
    const logEntry: QueryLog = {
      id: this.generateId(),
      learnerId,
      query,
      response,
      timestamp: new Date(),
      confidence,
      category,
    };

    await this.writeLog('responses', logEntry);
  }

  /**
   * Write log entry to file
   */
  private async writeLog(logType: string, entry: any): Promise<void> {
    try {
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDir, `${logType}-${date}.json`);

      // Read existing logs
      let logs: any[] = [];
      try {
        const existingData = await fs.readFile(logFile, 'utf-8');
        logs = JSON.parse(existingData);
      } catch (error) {
        // File doesn't exist yet, start with empty array
        logs = [];
      }

      // Append new log entry
      logs.push(entry);

      // Write back to file
      await fs.writeFile(logFile, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing log entry (${logType}):`, error);
    }
  }

  /**
   * Generate unique ID for log entry
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get logs for a specific date
   */
  async getLogs(logType: string, date: string): Promise<any[]> {
    try {
      const logFile = path.join(this.logDir, `${logType}-${date}.json`);
      const data = await fs.readFile(logFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

}
