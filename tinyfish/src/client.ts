/**
 * Core TinyFish SDK Client Instance & Authentication Handler
 * Manages official API connectivity, environment configuration, and authorization tokens.
 */

export interface TinyFishClientConfig {
  apiKey?: string;
  endpoint?: string;
  environment?: string;
}

export class TinyFishClient {
  private apiKey: string;
  private endpoint: string;
  private environment: string;

  constructor(config?: TinyFishClientConfig) {
    this.apiKey =
      config?.apiKey ||
      (typeof process !== "undefined"
        ? process.env?.TINYFISH_API_KEY ||
          process.env?.NEXT_PUBLIC_TINYFISH_API_KEY ||
          ""
        : "");
    this.endpoint = (
      config?.endpoint ||
      (typeof process !== "undefined"
        ? process.env?.TINYFISH_ENDPOINT ||
          process.env?.NEXT_PUBLIC_TINYFISH_ENDPOINT ||
          "https://api.tinyfish.io/v1"
        : "https://api.tinyfish.io/v1")
    ).replace(/\/+$/, "");
    this.environment =
      config?.environment ||
      (typeof process !== "undefined"
        ? process.env?.TINYFISH_ENVIRONMENT ||
          process.env?.NODE_ENV ||
          "development"
        : "development");
  }

  public getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "X-TinyFish-Environment": this.environment,
      "X-Hunar-Client": "@hunar/tinyfish/1.0"
    };
  }

  public hasValidCredentials(): boolean {
    return (
      Boolean(this.apiKey) &&
      this.apiKey !== "your_tinyfish_api_key_here" &&
      this.apiKey.length > 8
    );
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getEnvironment(): string {
    return this.environment;
  }

  /**
   * Health and connectivity check to the live TinyFish cloud service
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
}

// Global client instance singleton
export const tinyFishClient = new TinyFishClient();
