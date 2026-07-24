// Type declarations for @paystack/inline-js

declare module '@paystack/inline-js' {
  export interface PaystackChannelConfig {
    card?: boolean;
    bank?: boolean;
    ussd?: boolean;
    qr?: boolean;
    mobile_money?: boolean;
    bank_transfer?: boolean;
  }

  export interface PaystackMobileMoneyConfig {
    phone: string;
    provider: string;
  }

  export interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    currency?: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
    mobile_money?: PaystackMobileMoneyConfig;
  }

  export interface PaystackResponse {
    status: string;
    message: string;
    reference: string;
    trans: string;
    transaction: string;
    redirecturl: string;
  }

  export interface PaystackInstance {
    openIframe: (config: PaystackConfig) => void;
  }

  interface PaystackPopConstructor {
    new(): PaystackPop;
  }

  interface PaystackPop {
    checkout: (config: PaystackConfig) => Promise<PaystackInstance>;
    setup: (config: { key: string; container?: string }) => PaystackPop;
    paymentRequest: (config: {
      container: string;
      styles?: Record<string, unknown>;
      onElementsMount?: (elements: unknown) => void;
    }) => Promise<unknown>;
  }

  const PaystackPop: PaystackPopConstructor;
  export default PaystackPop;
}
