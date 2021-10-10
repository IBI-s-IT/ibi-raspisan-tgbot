import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../my-context.js';
import { parse, format, subDays, addDays } from 'date-fns';
import {backButtons} from "./general.js";
import {getAndParseRaspisanOneDay} from "../utils/raspisan.js";

const day_format = 'dd.MM.yyyy';
export const raspisanDaySwitchMenu = new MenuTemplate<MyContext>(async (ctx) => {
		if (typeof ctx.session.date === 'string') {
			let data = await getAndParseRaspisanOneDay(ctx, ctx.session.date as string);
			return {text: data, parse_mode: 'MarkdownV2', disable_web_page_preview: true, disable_notification: true};
		} else {
			let data = await getAndParseRaspisanOneDay(ctx, format(new Date, day_format));
			return {text: data, parse_mode: 'MarkdownV2', disable_web_page_preview: true, disable_notification: true};
		}
	}
);

raspisanDaySwitchMenu.interact('⬅️', 'daily_back', {
	do: async (ctx) => {
		if (typeof ctx.session.date !== 'string') {
			ctx.session.date = format(subDays(new Date, 1),day_format);
		} else {
			ctx.session.date = format(subDays(parse(ctx.session.date, day_format, new Date()), 1), day_format);
		}
		return true;
	},

})

raspisanDaySwitchMenu.interact('Сегодня', 'daily_today', {
	do: async (ctx) => {
		ctx.session.date = format(new Date, day_format);
		return true
	},
	joinLastRow: true,
})

raspisanDaySwitchMenu.interact('➡️', 'daily_next', {
	joinLastRow: true,
	do: async (ctx) => {
		if (typeof ctx.session.date !== 'string') {
			ctx.session.date = format(addDays(new Date, 1),day_format);
		} else {
			ctx.session.date = format(addDays(parse(ctx.session.date, day_format, new Date()), 1), day_format);
		}
		return true
	}
})

raspisanDaySwitchMenu.manualRow(backButtons);
