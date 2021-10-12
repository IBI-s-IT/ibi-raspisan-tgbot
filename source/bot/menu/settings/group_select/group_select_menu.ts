import {MenuTemplate} from 'telegraf-inline-menu';
import {backButtons} from '../../general.js';
import {MyContext} from '../../../my-context.js';
import {getCachedGroupList} from "../../../utils/groups.js";

export const group_select_menu = new MenuTemplate<MyContext>(context => context.i18n.t('group.body'));

async function loadGroups(ctx: MyContext) {
	let groups: Record<string, string> = {};
	const r = await getCachedGroupList({ code: ctx.session.education_level });
	r.map(e => e.id !== null && e.name !== null ? groups[e.id] = e.name : '');
	return groups;
}

group_select_menu.select('selectGroup', loadGroups, {
	isSet: (context, key) => context.session.group === key,
	set: (context, key) => {
		context.session.group = key;
		return '..';
	},
	getCurrentPage: context => context.session.page,
	setPage: (context, page) => {
		context.session.page = page
	},
	maxRows: 5,
	columns: 3
});

group_select_menu.manualRow(backButtons);
