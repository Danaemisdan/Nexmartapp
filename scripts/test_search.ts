import { SearchService } from './src/lib/SearchService';
import { marketplaceProducts } from './src/lib/marketplaceData';

const result = SearchService.search("Find me some shoes", "find me some shoes", "SEARCH", false, marketplaceProducts);
console.log(JSON.stringify(result, null, 2));
