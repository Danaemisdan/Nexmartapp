import { NavData } from './types';

export const electronicsNav: NavData = {
    id: 'electronics',
    label: 'Electronics & Appliances',
    columns: [
        {
            sections: [
                {
                    title: 'Mobiles & Wearables',
                    links: [
                        { label: 'Smartphones', href: '/products?category=smartphones' },
                        { label: 'Feature Phones', href: '/products?category=feature-phones' },
                        { label: 'Smartwatches', href: '/products?category=smartwatches' },
                        { label: 'Fitness Bands', href: '/products?category=fitness-bands' },
                        { label: 'Cases & Covers', href: '/products?category=cases' },
                        { label: 'Screen Protectors', href: '/products?category=screen-protectors' },
                        { label: 'Chargers', href: '/products?category=chargers' },
                        { label: 'Power Banks', href: '/products?category=power-banks' },
                    ]
                },
                {
                    title: 'Computers',
                    links: [
                        { label: 'Laptops', href: '/products?category=laptops' },
                        { label: 'Gaming Laptops', href: '/products?category=gaming-laptops' },
                        { label: 'Desktop PCs', href: '/products?category=desktops' },
                        { label: 'Monitors', href: '/products?category=monitors' },
                        { label: 'Printers', href: '/products?category=printers' },
                        { label: 'Storage Devices', href: '/products?category=storage' },
                        { label: 'Keyboards', href: '/products?category=keyboards' },
                        { label: 'Mouse', href: '/products?category=mouse' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Audio',
                    links: [
                        { label: 'Earbuds', href: '/products?category=earbuds' },
                        { label: 'Headphones', href: '/products?category=headphones' },
                        { label: 'Speakers', href: '/products?category=speakers' },
                        { label: 'Soundbars', href: '/products?category=soundbars' },
                        { label: 'Home Theatre', href: '/products?category=home-theatre' },
                        { label: 'Microphones', href: '/products?category=microphones' },
                    ]
                },
                {
                    title: 'TV & Entertainment',
                    links: [
                        { label: 'Smart TVs', href: '/products?category=smart-tvs' },
                        { label: 'Streaming Devices', href: '/products?category=streaming' },
                        { label: 'Projectors', href: '/products?category=projectors' },
                        { label: 'TV Accessories', href: '/products?category=tv-accessories' },
                    ]
                },
                {
                    title: 'Cameras & Gaming',
                    links: [
                        { label: 'DSLR', href: '/products?category=dslr' },
                        { label: 'Mirrorless', href: '/products?category=mirrorless' },
                        { label: 'Action Cameras', href: '/products?category=action-cameras' },
                        { label: 'CCTV', href: '/products?category=cctv' },
                        { label: 'Gaming Consoles', href: '/products?category=consoles' },
                        { label: 'Gaming Accessories', href: '/products?category=gaming-accessories' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Home Appliances',
                    links: [
                        { label: 'Refrigerators', href: '/products?category=refrigerators' },
                        { label: 'Washing Machines', href: '/products?category=washing-machines' },
                        { label: 'Air Conditioners', href: '/products?category=acs' },
                        { label: 'Air Coolers', href: '/products?category=air-coolers' },
                        { label: 'Water Purifiers', href: '/products?category=water-purifiers' },
                        { label: 'Water Heaters', href: '/products?category=water-heaters' },
                        { label: 'Air Purifiers', href: '/products?category=air-purifiers' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Kitchen Appliances',
                    links: [
                        { label: 'Microwave Ovens', href: '/products?category=microwaves' },
                        { label: 'OTGs', href: '/products?category=otgs' },
                        { label: 'Mixer Grinders', href: '/products?category=mixers' },
                        { label: 'Induction Cooktops', href: '/products?category=induction' },
                        { label: 'Coffee Machines', href: '/products?category=coffee-machines' },
                        { label: 'Electric Kettles', href: '/products?category=kettles' },
                        { label: 'Chimneys', href: '/products?category=chimneys' },
                    ]
                },
                {
                    title: 'Personal Care Appliances',
                    links: [
                        { label: 'Hair Dryers', href: '/products?category=hair-dryers' },
                        { label: 'Hair Straighteners', href: '/products?category=straighteners' },
                        { label: 'Trimmers', href: '/products?category=trimmers' },
                        { label: 'Shavers', href: '/products?category=shavers' },
                        { label: 'Epilators', href: '/products?category=epilators' },
                        { label: 'Grooming Kits', href: '/products?category=grooming-kits' },
                    ]
                }
            ]
        }
    ]
};
