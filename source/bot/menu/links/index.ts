import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../my-context.js';
import {backButtons} from "../general.js";

export const useful_links = new MenuTemplate<MyContext>(context => context.i18n.t('useful_links.body'));

useful_links.url((ctx) => ctx.i18n.t('useful_links.site'), 'https://ibispb.ru/');
useful_links.url((ctx) => ctx.i18n.t('useful_links.schedules'), 'http://inet.ibi.spb.ru/raspisan/', {
	joinLastRow: true,
});
useful_links.url((ctx) => ctx.i18n.t('useful_links.lms'), 'https://lms.ibispb.ru/login/index.php');
useful_links.url((ctx) => ctx.i18n.t('useful_links.lib'), 'http://www.iprbookshop.ru/', {
	joinLastRow: true,
});
useful_links.url((ctx) => ctx.i18n.t('useful_links.contacts'), 'https://ibispb.ru/contacts/');

useful_links.manualRow(backButtons);
