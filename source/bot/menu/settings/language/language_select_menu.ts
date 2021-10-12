import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../../my-context';
import {backButtons} from "../../general.js";
import {I18n} from "@grammyjs/i18n";

export const language_select_menu = new MenuTemplate<MyContext>(context => context.i18n.t('settings.body'));
const availableLocales = new I18n({directory: 'locales'}).availableLocales();

language_select_menu.select('lang_set', availableLocales, {
	isSet: (context, key) => context.i18n.locale() === key,
	set: (context, key) => {
		context.i18n.locale(key);
		return true;
	},
})

language_select_menu.manualRow(backButtons);
