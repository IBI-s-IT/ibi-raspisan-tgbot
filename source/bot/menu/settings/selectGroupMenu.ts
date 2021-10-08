import {MenuTemplate} from 'telegraf-inline-menu';
import {backButtons} from '../general.js';
import {MyContext} from '../../my-context.js';
import {getCachedGroupList} from "../../utils/groups.js";

export const selectGroupMenu = new MenuTemplate<MyContext>(context => context.i18n.t('group.body'));

async function loadGroups(ctx: MyContext) {
	let groups: Record<string, string> = {};
	const r = await getCachedGroupList({ code: ctx.session.education_level });
	r.map(e => e.id !== null && e.name !== null ? groups[e.id] = e.name : '');
	return groups;
}

selectGroupMenu.select('selectGroup', loadGroups, {
	isSet: (context, key) => context.session.group === key,
	set: (context, key) => {
		context.session.group = key;
		return '..';
	},
	maxRows: 24,
	columns: 4
});

selectGroupMenu.manualRow(backButtons);
