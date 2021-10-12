import {generateUpdateMiddleware} from 'telegraf-middleware-console-time';
import {I18n} from '@grammyjs/i18n';
import {MenuMiddleware} from 'telegraf-inline-menu';
import {Telegraf} from 'telegraf';
import RedisSession from "telegraf-session-redis";
import {MyContext} from './my-context.js';
import {menu} from './menu/index.js';
import {getTodaySchedules, getTomorrowSchedules} from "./utils/raspisan.js";
import {redis_client} from "../index.js";

const token = process.env['BOT_TOKEN'];

if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}

const bot = new Telegraf<MyContext>(token);

const session = new RedisSession({
	store: {
		host: process.env['TELEGRAM_SESSION_HOST'] || '127.0.0.1',
		port: process.env['TELEGRAM_SESSION_PORT'] || 6379
	},
	getSessionKey: (ctx: MyContext) => {
		return `schedules_bot`+ctx.chat?.id;
	}
})

bot.use(session)

const i18n = new I18n({
	directory: 'locales',
	defaultLanguage: 'ru',
	defaultLanguageOnMissing: true,
	useSession: true,
});

bot.use(i18n.middleware());

if (process.env['NODE_ENV'] !== 'production') {
	bot.use(generateUpdateMiddleware());
}

export const menuMiddleware = new MenuMiddleware('/', menu);

bot.command('start', async context => menuMiddleware.replyToContext(context));
bot.command('today', async context => {
	await context.replyWithMarkdownV2(await getTodaySchedules(context), {
		disable_web_page_preview: true,
		disable_notification: true,
	});
});
bot.command('tomorrow', async context => {
	await context.replyWithMarkdownV2(await getTomorrowSchedules(context), {
		disable_web_page_preview: true,
		disable_notification: true,
	});
});
bot.command('settings', async context => menuMiddleware.replyToContext(context, '/settings/'));
bot.command('daily', async context => menuMiddleware.replyToContext(context, '/day_switch/'));
bot.command('links', async context => menuMiddleware.replyToContext(context, '/useful_links/'));
bot.command('about', async context => {
	await context.reply(`Разработан студентом МБИ группы №113. Если что-то сломалось, то пишите - @gbowsky`);
});

bot.use(menuMiddleware.middleware());

bot.catch(error => {
	console.error('telegraf error occured', error);
});

/*
* Statistics
* */
bot.on('message', () => {
	redis_client.get('stat:msg').then((stat_msg) => {
		if (stat_msg === null) {
			redis_client.set('stat:msg', '1');
		} else {
			redis_client.set('stat:msg', (parseInt(stat_msg) as number + 1).toString());
		}
	})
});

export async function start(): Promise<void> {
	const language_code = 'ru';

	await bot.telegram.setMyCommands([
		{
			command: 'start',
			description: i18n.t(language_code, 'commands.start')
		},
		{
			command: 'today',
			description: i18n.t(language_code, 'commands.today')
		},
		{
			command: 'tomorrow',
			description: i18n.t(language_code, 'commands.tomorrow')
		},
		{
			command: 'daily',
			description: i18n.t(language_code, 'commands.daily')
		},
		{
			command: 'links',
			description: i18n.t(language_code, 'commands.links')
		},
		{
			command: 'about',
			description: i18n.t(language_code, 'commands.about')
		},
		{
			command: 'settings',
			description: i18n.t(language_code, 'commands.settings')
		}
	]);

	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
