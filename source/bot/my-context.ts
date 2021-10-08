import {Context as TelegrafContext} from 'telegraf';
import {I18nContext} from '@grammyjs/i18n';

export interface Session {
	page?: number;
	education_level: string;
	group: string;
}

export interface MyContext extends TelegrafContext {
	match: [
		string,
		string,
		index: number,
		input: string,
		groups: any,
	];
	readonly i18n: I18nContext;
	session: Session;
}
