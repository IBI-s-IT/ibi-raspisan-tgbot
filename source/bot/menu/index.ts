import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../my-context.js';
import {settingsMenu} from './settings/index.js';
import {getTodaySchedules, getTomorrowSchedules} from "../utils/raspisan.js";
import {backButtons} from "./general.js";

export const menu = new MenuTemplate<MyContext>(context => context.i18n.t('welcome'));

const todayRaspMenu = new MenuTemplate<MyContext>(async (context) => await getTodaySchedules(context));
todayRaspMenu.manualRow(backButtons);

const tomorrowRaspMenu = new MenuTemplate<MyContext>(async (context) => await getTomorrowSchedules(context));
tomorrowRaspMenu.manualRow(backButtons);

menu.submenu(context => '📅 ' + context.i18n.t('menu.today'), 'today_rasp', todayRaspMenu);
menu.submenu(context => '📅 ' + context.i18n.t('menu.tomorrow'), 'tomorrow_rasp', tomorrowRaspMenu);
menu.submenu(context => '⚙️ ' + context.i18n.t('menu.settings'), 'settings', settingsMenu);
