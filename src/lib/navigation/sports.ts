import { NavData } from './types';

export const sportsNav: NavData = {
    id: 'sports',
    label: 'Sports & Fitness',
    columns: [
        {
            sections: [
                {
                    title: 'Outdoor Sports',
                    links: [
                        { label: 'Cricket', href: '/products?category=cricket' },
                        { label: 'Football', href: '/products?category=football' },
                        { label: 'Basketball', href: '/products?category=basketball' },
                        { label: 'Badminton', href: '/products?category=badminton' },
                        { label: 'Volleyball', href: '/products?category=volleyball' },
                    ]
                },
                {
                    title: 'Fitness',
                    links: [
                        { label: 'Dumbbells', href: '/products?category=dumbbells' },
                        { label: 'Resistance Bands', href: '/products?category=resistance-bands' },
                        { label: 'Yoga Mats', href: '/products?category=yoga-mats' },
                        { label: 'Treadmills', href: '/products?category=treadmills' },
                        { label: 'Exercise Bikes', href: '/products?category=exercise-bikes' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Running',
                    links: [
                        { label: 'Running Shoes', href: '/products?category=running-shoes' },
                        { label: 'Running Apparel', href: '/products?category=running-apparel' },
                        { label: 'Smart Watches', href: '/products?category=running-watches' },
                    ]
                },
                {
                    title: 'Cycling',
                    links: [
                        { label: 'Bicycles', href: '/products?category=bicycles' },
                        { label: 'Helmets', href: '/products?category=helmets' },
                        { label: 'Cycling Accessories', href: '/products?category=cycling-accessories' },
                    ]
                },
                {
                    title: 'Swimming',
                    links: [
                        { label: 'Swimwear', href: '/products?category=swimwear' },
                        { label: 'Goggles', href: '/products?category=goggles' },
                        { label: 'Swim Caps', href: '/products?category=swim-caps' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Camping',
                    links: [
                        { label: 'Tents', href: '/products?category=tents' },
                        { label: 'Sleeping Bags', href: '/products?category=sleeping-bags' },
                        { label: 'Backpacks', href: '/products?category=backpacks' },
                    ]
                },
                {
                    title: 'Adventure',
                    links: [
                        { label: 'Trekking', href: '/products?category=trekking' },
                        { label: 'Hiking', href: '/products?category=hiking' },
                        { label: 'Climbing', href: '/products?category=climbing' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Sports Nutrition',
                    links: [
                        { label: 'Whey Protein', href: '/products?category=whey-protein' },
                        { label: 'Creatine', href: '/products?category=creatine' },
                        { label: 'Pre Workout', href: '/products?category=pre-workout' },
                        { label: 'Shakers', href: '/products?category=shakers' },
                    ]
                },
                {
                    title: 'Accessories',
                    links: [
                        { label: 'Sports Bags', href: '/products?category=sports-bags' },
                        { label: 'Water Bottles', href: '/products?category=water-bottles' },
                        { label: 'Gloves', href: '/products?category=sports-gloves' },
                        { label: 'Socks', href: '/products?category=sports-socks' },
                    ]
                }
            ]
        }
    ]
};
