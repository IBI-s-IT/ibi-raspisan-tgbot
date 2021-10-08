import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../my-context.js';
import {settingsMenu} from './settings/index.js';

export const menu = new MenuTemplate<MyContext>(context => context.i18n.t('welcome'));

menu.submenu(context => '⚙️ ' + context.i18n.t('menu.settings'), 'settings', settingsMenu);
