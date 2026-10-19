/**
 * TinyFish Live API Client
 * Official integration client connecting the Hunar platform to TinyFish cloud API service.
 */

export interface TinyFishConfig {
  apiKey?: string;
  endpoint?: string;
  environment?: string;
}

export interface TinyFishAgentRunRequest {
  url?: string;
  goal: string;
  parameters?: Record<string, any>;
  stream?: boolean;
}

export interface TinyFishAgentRunResponse {
  success: boolean;
  taskId?: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: any;
  error?: string;
  executionTimeMs?: number;
}

export interface TinyFishSyncPayload {
  collection: string;
  action: "create" | "update" | "delete" | "status_change";
  data: any;
  timestamp?: number;
}

export class TinyFishClient {
  private apiKey: string;
  private endpoint: string;
  private environment: string;

  constructor(config?: TinyFishConfig) {
    this.apiKey =
      config?.apiKey ||
      process.env.TINYFISH_API_KEY ||
      process.env.NEXT_PUBLIC_TINYFISH_API_KEY ||
      "";
    this.endpoint = (
      config?.endpoint ||
      process.env.TINYFISH_ENDPOINT ||
      process.env.NEXT_PUBLIC_TINYFISH_ENDPOINT ||
      "https://api.tinyfish.io/v1"
    ).replace(/\/+$/, "");
    this.environment =
      config?.environment ||
      process.env.TINYFISH_ENVIRONMENT ||
      process.env.NODE_ENV ||
      "development";
  }

  /**
   * Constructs official authorization and request headers
   */
  public getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "X-TinyFish-Environment": this.environment,
      "X-Hunar-Client": "HunarPlatform/1.0"
    };
  }

  /**
   * Verifies if real account credentials are provided
   */
  public hasValidCredentials(): boolean {
    return (
      Boolean(this.apiKey) &&
      this.apiKey !== "your_tinyfish_api_key_here" &&
      this.apiKey.length > 8
    );
  }

  /**
   * Health and connectivity check to the official TinyFish service
   */
  public async checkHealth(): Promise<{
    connected: boolean;
    endpoint: string;
    hasCredentials: boolean;
    environment: string;
    message: string;
  }> {
    const hasCredentials = this.hasValidCredentials();

    if (!hasCredentials) {
      return {
        connected: false,
        endpoint: this.endpoint,
        hasCredentials: false,
        environment: this.environment,
        message: "No live TINYFISH_API_KEY configured. Running in local simulated mode."
      };
    }

    try {
      const response = await fetch(`${this.endpoint}/health`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (response.ok) {
        return {
          connected: true,
          endpoint: this.endpoint,
          hasCredentials: true,
          environment: this.environment,
          message: "Successfully connected to official TinyFish service."
        };
      }

      return {
        connected: false,
        endpoint: this.endpoint,
        hasCredentials: true,
        environment: this.environment,
        message: `TinyFish service returned HTTP status ${response.status}: ${response.statusText}`
      };
    } catch (err: any) {
      return {
        connected: false,
        endpoint: this.endpoint,
        hasCredentials: true,
        environment: this.environment,
        message: `Network error reaching TinyFish endpoint (${this.endpoint}): ${err?.message || err}`
      };
    }
  }

  /**
   * Dispatches a goal-based AI web automation or data extraction task
   */
  public async runAgent(
    request: TinyFishAgentRunRequest
  ): Promise<TinyFishAgentRunResponse> {
    if (!this.hasValidCredentials()) {
      return {
        success: false,
        status: "failed",
        error: "Missing or placeholder TINYFISH_API_KEY. Configure a live key in .env.local to execute cloud tasks."
      };
    }

    const startTime = Date.now();
    try {
      const response = await fetch(`${this.endpoint}/agent/run`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          status: "failed",
          error: responseData.message || responseData.error || `HTTP ${response.status}`,
          executionTimeMs: Date.now() - startTime
        };
      }

      return {
        success: true,
        taskId: responseData.taskId || responseData.id,
        status: responseData.status || "completed",
        result: responseData.result || responseData.data,
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        success: false,
        status: "failed",
        error: `Agent dispatch failed: ${err?.message || err}`,
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Syncs platform collections with the live TinyFish cloud indexing service
   */
  public async syncCollection(payload: TinyFishSyncPayload): Promise<{
    success: boolean;
    message: string;
    syncedAt?: string;
  }> {
    if (!this.hasValidCredentials()) {
      return {
        success: false,
        message: "Offline mode: No live TinyFish credentials provided. Stored in client cache."
      };
    }

    try {
      const response = await fetch(`${this.endpoint}/sync`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...payload,
          timestamp: payload.timestamp || Date.now()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || `TinyFish sync failed with HTTP ${response.status}`
        };
      }

      return {
        success: true,
        message: "Successfully synchronized collection to TinyFish cloud.",
        syncedAt: new Date().toISOString()
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Sync network error: ${err?.message || err}`
      };
    }
  }
}

// Global singleton instance for server-side & edge use
export const tinyFishClient = new TinyFishClient();
