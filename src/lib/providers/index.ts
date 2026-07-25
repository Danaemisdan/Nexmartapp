import { CommerceProvider } from './CommerceProvider';
import { OvaloopProvider } from './OvaloopProvider';
import { BumpaProvider } from './BumpaProvider';
import { GlovoProvider } from './GlovoProvider';
import { ChowdeckProvider } from './ChowdeckProvider';

export function getProvider(providerName: string): CommerceProvider {
    switch (providerName.toLowerCase()) {
        case 'ovaloop':
            return new OvaloopProvider();
        case 'bumpa':
            return new BumpaProvider();
        case 'glovo':
            return new GlovoProvider();
        case 'chowdeck':
            return new ChowdeckProvider();
        default:
            // Defaulting to ovaloop for backward compatibility
            return new OvaloopProvider();
    }
}

export * from './CommerceProvider';
export * from './OvaloopProvider';
export * from './BumpaProvider';
export * from './GlovoProvider';
export * from './ChowdeckProvider';
