import { NavData } from './types';

export const medicineNav: NavData = {
    id: 'medicine',
    label: 'Health & Medicine',
    columns: [
        {
            sections: [
                {
                    title: 'Medicines',
                    links: [
                        { label: 'Prescription Medicines', href: '/products?category=prescription' },
                        { label: 'OTC Medicines', href: '/products?category=otc' },
                        { label: 'Pain Relief', href: '/products?category=pain-relief' },
                        { label: 'Cold & Flu', href: '/products?category=cold-flu' },
                        { label: 'Digestive Care', href: '/products?category=digestive-care' },
                    ]
                },
                {
                    title: 'Health Devices',
                    links: [
                        { label: 'Thermometers', href: '/products?category=thermometers' },
                        { label: 'BP Monitors', href: '/products?category=bp-monitors' },
                        { label: 'Glucometers', href: '/products?category=glucometers' },
                        { label: 'Nebulizers', href: '/products?category=nebulizers' },
                        { label: 'Oximeters', href: '/products?category=oximeters' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Vitamins',
                    links: [
                        { label: 'Multivitamins', href: '/products?category=multivitamins' },
                        { label: 'Vitamin C', href: '/products?category=vitamin-c' },
                        { label: 'Vitamin D', href: '/products?category=vitamin-d' },
                        { label: 'Calcium', href: '/products?category=calcium' },
                        { label: 'Omega 3', href: '/products?category=omega-3' },
                    ]
                },
                {
                    title: 'Nutrition',
                    links: [
                        { label: 'Protein', href: '/products?category=protein' },
                        { label: 'Mass Gainers', href: '/products?category=mass-gainers' },
                        { label: 'Energy Drinks', href: '/products?category=energy-drinks' },
                        { label: 'Nutrition Bars', href: '/products?category=nutrition-bars' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Personal Care',
                    links: [
                        { label: 'Sanitary Care', href: '/products?category=sanitary-care' },
                        { label: 'Adult Care', href: '/products?category=adult-care' },
                        { label: 'Feminine Hygiene', href: '/products?category=feminine-hygiene' },
                        { label: 'Baby Care', href: '/products?category=baby-care' },
                    ]
                },
                {
                    title: 'Ayurveda',
                    links: [
                        { label: 'Herbal Medicines', href: '/products?category=herbal-medicines' },
                        { label: 'Chyawanprash', href: '/products?category=chyawanprash' },
                        { label: 'Herbal Supplements', href: '/products?category=herbal-supplements' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Medical Supplies',
                    links: [
                        { label: 'First Aid', href: '/products?category=first-aid' },
                        { label: 'Bandages', href: '/products?category=bandages' },
                        { label: 'Face Masks', href: '/products?category=face-masks' },
                        { label: 'Gloves', href: '/products?category=gloves' },
                    ]
                },
                {
                    title: 'Wellness',
                    links: [
                        { label: 'Sleep Support', href: '/products?category=sleep-support' },
                        { label: 'Immunity', href: '/products?category=immunity' },
                        { label: 'Stress Relief', href: '/products?category=stress-relief' },
                        { label: 'Mental Wellness', href: '/products?category=mental-wellness' },
                    ]
                }
            ]
        }
    ]
};
