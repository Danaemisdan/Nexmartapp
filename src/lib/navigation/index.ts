import { NavData } from './types';
import { fashionNav } from './fashion';
import { homeNav } from './home';
import { beautyNav } from './beauty';
import { electronicsNav } from './electronics';
import { groceriesNav } from './groceries';
import { medicineNav } from './medicine';
import { sportsNav } from './sports';

export * from './types';

export const megaMenuData: NavData[] = [
    fashionNav,
    homeNav,
    beautyNav,
    electronicsNav,
    groceriesNav,
    medicineNav,
    sportsNav
];
