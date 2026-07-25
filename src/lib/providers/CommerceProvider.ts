export interface Merchant {
    id: string;
    name: string;
    provider: string;
    provider_business_id: string;
    credentials?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    isActive: boolean;
}

export interface OrderPayload {
    cart: unknown[];
    customer?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface OrderResult {
    success?: boolean;
    orderId?: string;
    [key: string]: unknown;
}

export interface WebhookResult {
    success?: boolean;
    message?: string;
    [key: string]: unknown;
}

export interface ProductData {
    id: string;
    title: string;
    price: number;
    [key: string]: unknown;
}

export interface CommerceProvider {
    /** 
     * Connect or authenticate with the provider 
     */
    connect(credentials: Record<string, unknown>): Promise<boolean>;

    /**
     * Orders
     */
    createOrder(payload: OrderPayload): Promise<OrderResult>;
    getOrder(orderId: string): Promise<OrderResult>;
    cancelOrder(orderId: string): Promise<OrderResult>;
    returnOrder(orderId: string, payload?: Record<string, unknown>): Promise<OrderResult>;

    /**
     * Webhooks
     */
    registerWebhook(url: string, events: string[]): Promise<WebhookResult>;
    verifyWebhook(req: Request): Promise<boolean>;
    processWebhook(req: Request): Promise<WebhookResult>;

    /**
     * Catalog & Inventory
     */
    getProducts(merchantId: string, limit?: number, offset?: number): Promise<ProductData[]>;
    syncProducts(merchantId: string): Promise<unknown>;
    syncInventory(merchantId: string): Promise<unknown>;
}
