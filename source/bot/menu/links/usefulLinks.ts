import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../my-context.js';
import {backButtons} from "../general.js";

export const useful_links = new MenuTemplate<MyContext>(context => context.i18n.t('useful_links.body'));

useful_links.url('МБИ', 'https://ibispb.ru/');
useful_links.url('Расписание', 'http://inet.ibi.spb.ru/raspisan/', {
	joinLastRow: true,
});
useful_links.url('ЕЭОС', 'https://lms.ibispb.ru/login/index.php');
useful_links.url('Библиотека', 'http://www.iprbookshop.ru/', {
	joinLastRow: true,
});

useful_links.url('Контакты', 'https://ibispb.ru/contacts/');

useful_links.manualRow(backButtons);
