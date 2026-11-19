import crypto from "crypto";

export class PaytmChecksum {
  /**
   * Generate SHA256 HMAC signature for a payload body with merchant key
   */
  public static generateSignature(body: Record<string, unknown> | string, merchantKey: string): string {
    const dataString = typeof body === "string" ? body : JSON.stringify(body);
    return crypto.createHmac("sha256", merchantKey).update(dataString).digest("base64");
  }

  /**
   * Verify SHA256 HMAC signature against payload body
   */
  public static verifySignature(
    body: Record<string, unknown> | string,
    signature: string,
    merchantKey: string
  ): boolean {
    const expected = PaytmChecksum.generateSignature(body, merchantKey);
    return expected === signature;
  }
}
