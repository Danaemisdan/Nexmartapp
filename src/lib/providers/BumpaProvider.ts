import { CommerceProvider, OrderPayload, OrderResult, WebhookResult, ProductData } from './CommerceProvider';

export class BumpaProvider implements CommerceProvider {
    async connect(_credentials: Record<string, unknown>): Promise<boolean> {
        throw new Error('Not implemented');
    }
    
    async createOrder(_payload: OrderPayload): Promise<OrderResult> {
        throw new Error('Not implemented');
    }
    
    async getOrder(_orderId: string): Promise<OrderResult> {
        throw new Error('Not implemented');
    }
    
    async cancelOrder(_orderId: string): Promise<OrderResult> {
        throw new Error('Not implemented');
    }
    
    async returnOrder(_orderId: string, _payload?: Record<string, unknown>): Promise<OrderResult> {
        throw new Error('Not implemented');
    }
    
    async registerWebhook(_url: string, _events: string[]): Promise<WebhookResult> {
        throw new Error('Not implemented');
    }
    
    async verifyWebhook(_req: Request): Promise<boolean> {
        throw new Error('Not implemented');
    }
    
    async processWebhook(_req: Request): Promise<WebhookResult> {
        throw new Error('Not implemented');
    }
    
    async getProducts(_merchantId: string, _limit?: number, _offset?: number): Promise<ProductData[]> {
        throw new Error('Not implemented');
    }
    
    async syncProducts(_merchantId: string): Promise<unknown> {
        throw new Error('Not implemented');
    }
    
    async syncInventory(_merchantId: string): Promise<unknown> {
        throw new Error('Not implemented');
    }
}
