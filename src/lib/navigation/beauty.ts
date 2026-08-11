import { NavData } from './types';

export const beautyNav: NavData = {
    id: 'beauty',
    label: 'Beauty',
    columns: [
        {
            sections: [
                {
                    title: 'Makeup',
                    links: [
                        { label: 'Lipstick', href: '/products?category=lipstick' },
                        { label: 'Lip Gloss', href: '/products?category=lip-gloss' },
                        { label: 'Lip Liner', href: '/products?category=lip-liner' },
                        { label: 'Mascara', href: '/products?category=mascara' },
                        { label: 'Eyeliner', href: '/products?category=eyeliner' },
                        { label: 'Kajal', href: '/products?category=kajal' },
                        { label: 'Eyeshadow', href: '/products?category=eyeshadow' },
                        { label: 'Foundation', href: '/products?category=foundation' },
                        { label: 'Primer', href: '/products?category=primer' },
                        { label: 'Concealer', href: '/products?category=concealer' },
                        { label: 'Compact', href: '/products?category=compact' },
                        { label: 'Nail Polish', href: '/products?category=nail-polish' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Skincare, Bath & Body',
                    links: [
                        { label: 'Face Moisturiser', href: '/products?category=face-moisturiser' },
                        { label: 'Cleanser', href: '/products?category=cleanser' },
                        { label: 'Masks & Peel', href: '/products?category=masks-peel' },
                        { label: 'Sunscreen', href: '/products?category=sunscreen' },
                        { label: 'Serum', href: '/products?category=serum' },
                        { label: 'Face Wash', href: '/products?category=face-wash' },
                        { label: 'Eye Cream', href: '/products?category=eye-cream' },
                        { label: 'Lip Balm', href: '/products?category=lip-balm' },
                        { label: 'Body Lotion', href: '/products?category=body-lotion' },
                        { label: 'Body Wash', href: '/products?category=body-wash' },
                        { label: 'Body Scrub', href: '/products?category=body-scrub' },
                        { label: 'Hand Cream', href: '/products?category=hand-cream' },
                    ]
                },
                {
                    title: 'Baby Care',
                    links: []
                },
                {
                    title: 'Masks',
                    links: []
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Haircare',
                    links: [
                        { label: 'Shampoo', href: '/products?category=shampoo' },
                        { label: 'Conditioner', href: '/products?category=conditioner' },
                        { label: 'Hair Cream', href: '/products?category=hair-cream' },
                        { label: 'Hair Oil', href: '/products?category=hair-oil' },
                        { label: 'Hair Gel', href: '/products?category=hair-gel' },
                        { label: 'Hair Color', href: '/products?category=hair-color' },
                        { label: 'Hair Serum', href: '/products?category=hair-serum' },
                        { label: 'Hair Accessory', href: '/products?category=hair-accessory' },
                    ]
                },
                {
                    title: 'Fragrances',
                    links: [
                        { label: 'Perfume', href: '/products?category=perfume' },
                        { label: 'Deodorant', href: '/products?category=deodorant' },
                        { label: 'Body Mist', href: '/products?category=body-mist' },
                    ]
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Appliances',
                    links: [
                        { label: 'Hair Straightener', href: '/products?category=hair-straightener' },
                        { label: 'Hair Dryer', href: '/products?category=hair-dryer' },
                        { label: 'Epilator', href: '/products?category=epilator' },
                    ]
                },
                {
                    title: "Men's Grooming",
                    links: [
                        { label: 'Trimmers', href: '/products?category=trimmers' },
                        { label: 'Beard Oil', href: '/products?category=beard-oil' },
                        { label: 'Hair Wax', href: '/products?category=hair-wax' },
                    ]
                },
                {
                    title: 'Beauty Gift & Makeup Set',
                    links: [
                        { label: 'Beauty Gift', href: '/products?category=beauty-gift' },
                        { label: 'Makeup Kit', href: '/products?category=makeup-kit' },
                    ]
                },
                {
                    title: 'Premium Beauty',
                    links: []
                },
                {
                    title: 'Wellness & Hygiene',
                    links: []
                }
            ]
        },
        {
            sections: [
                {
                    title: 'Top Brands',
                    links: [
                        { label: 'Lakme', href: '/products?brand=lakme' },
                        { label: 'Maybelline', href: '/products?brand=maybelline' },
                        { label: 'LOreal', href: '/products?brand=loreal' },
                        { label: 'Philips', href: '/products?brand=philips' },
                        { label: 'Bath & Body Works', href: '/products?brand=bath-body-works' },
                        { label: 'THE BODY SHOP', href: '/products?brand=the-body-shop' },
                        { label: 'Biotique', href: '/products?brand=biotique' },
                        { label: 'Mamaearth', href: '/products?brand=mamaearth' },
                        { label: 'MCaffeine', href: '/products?brand=mcaffeine' },
                        { label: 'Nivea', href: '/products?brand=nivea' },
                        { label: 'Lotus Herbals', href: '/products?brand=lotus-herbals' },
                        { label: 'LOreal Professionnel', href: '/products?brand=loreal-professionnel' },
                        { label: 'KAMA AYURVEDA', href: '/products?brand=kama-ayurveda' },
                        { label: 'M.A.C', href: '/products?brand=mac' },
                        { label: 'Forest Essentials', href: '/products?brand=forest-essentials' },
                    ]
                }
            ]
        }
    ]
};
