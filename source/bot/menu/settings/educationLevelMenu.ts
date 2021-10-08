import {MenuTemplate} from 'telegraf-inline-menu';
import {backButtons} from '../general.js';
import {MyContext} from '../../my-context.js';

export const educationLevelMenu = new MenuTemplate<MyContext>(context => context.i18n.t('edu.body'));

const education_levels = {
	'1': 'Бакалавриат',
	'2': 'Специалитет',
	'3': 'Магистратура',
	'4': 'Аспирантура',
	'5': 'ДПО',
};

educationLevelMenu.select('setEduLevel', education_levels, {
	isSet: (ctx, key) => ctx.session.education_level === key,
	set: (context, key) => {
		context.session.education_level = key;
		return '..';
	},
	columns: 2,
});

educationLevelMenu.manualRow(backButtons);
