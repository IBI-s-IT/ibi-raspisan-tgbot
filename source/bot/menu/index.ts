import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../my-context.js';
import {settingsMenu} from './settings/index.js';
import {getTodaySchedules, getTomorrowSchedules} from "../utils/raspisan.js";
import {backButtons} from "./general.js";
import {raspisanDaySwitchMenu} from "./raspisanDaySwitch.js";
import {useful_links} from "./links/usefulLinks.js";

export const menu = new MenuTemplate<MyContext>(context => context.i18n.t('welcome'));

const todayRaspMenu = new MenuTemplate<MyContext>(async (context) => {
	return {
		text: await getTodaySchedules(context),
		parse_mode: 'MarkdownV2',
	}
});
todayRaspMenu.manualRow(backButtons);

const tomorrowRaspMenu = new MenuTemplate<MyContext>(async (context) => {
	return {
		text: await getTomorrowSchedules(context),
		parse_mode: 'MarkdownV2',
	}
});
tomorrowRaspMenu.manualRow(backButtons);

menu.submenu(context => '📅 ' + context.i18n.t('menu.today'), 'today_rasp', todayRaspMenu);
menu.submenu(context => '📅 ' + context.i18n.t('menu.tomorrow'), 'tomorrow_rasp', tomorrowRaspMenu, {
	joinLastRow: true,
});
menu.submenu(context => '📅 ' + context.i18n.t('menu.day_switch'), 'day_switch', raspisanDaySwitchMenu);
menu.submenu(context => '🔗 ' + context.i18n.t('menu.useful_links'), 'useful_links', useful_links, {
	joinLastRow: true
});
menu.submenu(context => '⚙️ ' + context.i18n.t('menu.settings'), 'settings', settingsMenu);
