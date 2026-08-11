import { NavData } from './types';

export const fashionNav: NavData = {
    id: 'fashion',
    label: 'Fashion',
    tabs: [
        {
            id: 'men',
            label: 'Men',
            columns: [
                {
                    sections: [
                        {
                            title: 'Topwear',
                            links: [
                                { label: 'T-Shirts', href: '/products?category=t-shirts' },
                                { label: 'Casual Shirts', href: '/products?category=casual-shirts' },
                                { label: 'Formal Shirts', href: '/products?category=formal-shirts' },
                                { label: 'Sweatshirts', href: '/products?category=sweatshirts' },
                                { label: 'Sweaters', href: '/products?category=sweaters' },
                                { label: 'Jackets', href: '/products?category=jackets' },
                                { label: 'Blazers & Coats', href: '/products?category=blazers' },
                            ]
                        },
                        {
                            title: 'Indian & Festive Wear',
                            links: [
                                { label: 'Kurtas & Kurta Sets', href: '/products?category=kurtas' },
                                { label: 'Sherwanis', href: '/products?category=sherwanis' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Bottomwear',
                            links: [
                                { label: 'Jeans', href: '/products?category=jeans' },
                                { label: 'Casual Trousers', href: '/products?category=casual-trousers' },
                                { label: 'Formal Trousers', href: '/products?category=formal-trousers' },
                                { label: 'Shorts', href: '/products?category=shorts' },
                                { label: 'Track Pants & Joggers', href: '/products?category=track-pants' },
                            ]
                        },
                        {
                            title: 'Innerwear & Sleepwear',
                            links: [
                                { label: 'Briefs & Trunks', href: '/products?category=briefs' },
                                { label: 'Boxers', href: '/products?category=boxers' },
                                { label: 'Vests', href: '/products?category=vests' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Footwear',
                            links: [
                                { label: 'Casual Shoes', href: '/products?category=casual-shoes' },
                                { label: 'Sports Shoes', href: '/products?category=sports-shoes' },
                                { label: 'Formal Shoes', href: '/products?category=formal-shoes' },
                                { label: 'Sneakers', href: '/products?category=sneakers' },
                                { label: 'Sandals & Floaters', href: '/products?category=sandals' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Sports & Active Wear',
                            links: [
                                { label: 'Sports Shoes', href: '/products?category=active-shoes' },
                                { label: 'Active T-Shirts', href: '/products?category=active-tshirts' },
                                { label: 'Track Pants & Shorts', href: '/products?category=active-pants' },
                                { label: 'Tracksuits', href: '/products?category=tracksuits' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Fashion Accessories',
                            links: [
                                { label: 'Wallets', href: '/products?category=wallets' },
                                { label: 'Belts', href: '/products?category=belts' },
                                { label: 'Perfumes & Body Mists', href: '/products?category=perfumes' },
                                { label: 'Trimmers', href: '/products?category=trimmers' },
                                { label: 'Ties, Cufflinks', href: '/products?category=ties' },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'women',
            label: 'Women',
            columns: [
                {
                    sections: [
                        {
                            title: 'Indian & Fusion Wear',
                            links: [
                                { label: 'Kurtas & Suits', href: '/products?category=women-kurtas' },
                                { label: 'Kurtis, Tunics & Tops', href: '/products?category=women-tops' },
                                { label: 'Sarees', href: '/products?category=sarees' },
                                { label: 'Ethnic Wear', href: '/products?category=ethnic-wear' },
                                { label: 'Leggings, Salwars & Churidars', href: '/products?category=leggings' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Western Wear',
                            links: [
                                { label: 'Dresses', href: '/products?category=dresses' },
                                { label: 'Tops', href: '/products?category=western-tops' },
                                { label: 'Tshirts', href: '/products?category=women-tshirts' },
                                { label: 'Jeans', href: '/products?category=women-jeans' },
                                { label: 'Trousers & Capris', href: '/products?category=trousers' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Footwear',
                            links: [
                                { label: 'Flats', href: '/products?category=flats' },
                                { label: 'Casual Shoes', href: '/products?category=women-casual-shoes' },
                                { label: 'Heels', href: '/products?category=heels' },
                                { label: 'Boots', href: '/products?category=boots' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Beauty & Personal Care',
                            links: [
                                { label: 'Makeup', href: '/products?category=makeup' },
                                { label: 'Skincare', href: '/products?category=skincare' },
                                { label: 'Premium Beauty', href: '/products?category=premium-beauty' },
                                { label: 'Lipsticks', href: '/products?category=lipsticks' },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'kids',
            label: 'Kids',
            columns: [
                {
                    sections: [
                        {
                            title: 'Boys Clothing',
                            links: [
                                { label: 'T-Shirts', href: '/products?category=boys-tshirts' },
                                { label: 'Shirts', href: '/products?category=boys-shirts' },
                                { label: 'Shorts', href: '/products?category=boys-shorts' },
                                { label: 'Jeans', href: '/products?category=boys-jeans' },
                                { label: 'Trousers', href: '/products?category=boys-trousers' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Girls Clothing',
                            links: [
                                { label: 'Dresses', href: '/products?category=girls-dresses' },
                                { label: 'Tops', href: '/products?category=girls-tops' },
                                { label: 'Tshirts', href: '/products?category=girls-tshirts' },
                                { label: 'Clothing Sets', href: '/products?category=girls-clothing-sets' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Footwear',
                            links: [
                                { label: 'Casual Shoes', href: '/products?category=kids-casual-shoes' },
                                { label: 'Flipflops', href: '/products?category=kids-flipflops' },
                                { label: 'Sports Shoes', href: '/products?category=kids-sports-shoes' },
                                { label: 'Flats', href: '/products?category=kids-flats' },
                                { label: 'Sandals', href: '/products?category=kids-sandals' },
                            ]
                        }
                    ]
                },
                {
                    sections: [
                        {
                            title: 'Kids Accessories',
                            links: [
                                { label: 'Bags & Backpacks', href: '/products?category=kids-bags' },
                                { label: 'Watches', href: '/products?category=kids-watches' },
                                { label: 'Jewellery & Hair accessory', href: '/products?category=kids-hair-accessories' },
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
