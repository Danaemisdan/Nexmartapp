import { NavData } from './types';

export const groceriesNav: NavData = {
    id: 'groceries',
    label: 'Food & Groceries',
    columns: [
        {
            sections: [
                {
                    title: 'Staples',
                    links: [
                        { label: 'Rice', href: '/products?category=rice' },
                        { label: 'Atta', href: '/products?category=atta' },
                        { label: 'Flour', href: '/products?category=flour' },
                        { label: 'Pulses', href: '/products?category=pulses' },
                        { label: 'Grains', href: '/products?category=grains' },
                    ]
                },
                {
                    title: 'Breakfast',
                    links: [
                        { label: 'Cereals', href: '/products?category=cereals' },
                        { label: 'Muesli', href: '/products?category=muesli' },
                        { label: 'Oats', href: '/products?category=oats' },
                        { label: 'Peanut Butter', href: '/products?category=peanut-butter' },
                        { label: 'Honey', href: '/products?category=honey' },
                    ]
                },
                {
                    title: 'Snacks',
                    links: [
                        { label: 'Chips', href: '/products?category=chips' },
                        { label: 'Biscuits', href: '/products?category=biscuits' },
                        { label: 'Chocolates', href: '/products?category=chocolates' },
                        { label: 'Namkeen', href: '/products?category=namkeen' },
                        { label: 'Cookies', href: '/products?category=cookies' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Beverages',
                    links: [
                        { label: 'Tea', href: '/products?category=tea' },
                        { label: 'Coffee', href: '/products?category=coffee' },
                        { label: 'Juices', href: '/products?category=juices' },
                        { label: 'Soft Drinks', href: '/products?category=soft-drinks' },
                        { label: 'Energy Drinks', href: '/products?category=energy-drinks' },
                    ]
                },
                {
                    title: 'Cooking Essentials',
                    links: [
                        { label: 'Cooking Oil', href: '/products?category=cooking-oil' },
                        { label: 'Ghee', href: '/products?category=ghee' },
                        { label: 'Spices', href: '/products?category=spices' },
                        { label: 'Salt', href: '/products?category=salt' },
                        { label: 'Sugar', href: '/products?category=sugar' },
                        { label: 'Vinegar', href: '/products?category=vinegar' },
                    ]
                },
                {
                    title: 'Dairy & Bakery',
                    links: [
                        { label: 'Milk', href: '/products?category=milk' },
                        { label: 'Butter', href: '/products?category=butter' },
                        { label: 'Cheese', href: '/products?category=cheese' },
                        { label: 'Bread', href: '/products?category=bread' },
                        { label: 'Eggs', href: '/products?category=eggs' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Fresh Produce',
                    links: [
                        { label: 'Fruits', href: '/products?category=fruits' },
                        { label: 'Vegetables', href: '/products?category=vegetables' },
                        { label: 'Herbs', href: '/products?category=herbs' },
                    ]
                },
                {
                    title: 'Frozen Food',
                    links: [
                        { label: 'Frozen Snacks', href: '/products?category=frozen-snacks' },
                        { label: 'Ice Cream', href: '/products?category=ice-cream' },
                        { label: 'Frozen Vegetables', href: '/products?category=frozen-vegetables' },
                    ]
                },
                {
                    title: 'Organic',
                    links: [
                        { label: 'Organic Staples', href: '/products?category=organic-staples' },
                        { label: 'Organic Snacks', href: '/products?category=organic-snacks' },
                        { label: 'Healthy Foods', href: '/products?category=healthy-foods' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Household Supplies',
                    links: [
                        { label: 'Cleaning', href: '/products?category=cleaning' },
                        { label: 'Laundry', href: '/products?category=laundry' },
                        { label: 'Dishwashing', href: '/products?category=dishwashing' },
                        { label: 'Air Fresheners', href: '/products?category=air-fresheners' },
                    ]
                }
            ]
        }
    ]
};
