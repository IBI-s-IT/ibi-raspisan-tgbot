import {MyContext} from "../my-context";
import axios from "axios";
import { format, addDays } from "date-fns";
import * as queryString from "querystring";
import {JSDOM} from "jsdom";
import {redis_client} from "../../index.js";

interface ScheduleInfo {
	time?: string | null,
	text?: string;
}

/*function cacheCheck(cache: string | null): string | undefined {
	if (typeof cache === 'string') {
		return (cache as string);
	} else {
		return undefined;
	}
}*/

function parseLessonText(lesson_text?: string | string[]): string {
	let final_text: string = '';

	if (lesson_text === '' || typeof lesson_text === 'undefined') {
		final_text = 'Окно, отдыхай ✨';
	} else if (typeof lesson_text === 'string') {
		let mod_text = lesson_text;

		/**
		 * Заголовок текста урока
		 * Примеры:
		 *
		 *
		 * *Практика*, *Онлайн*, Название
		 * ссылка
		 *
		 * *Проектная деятельность*, *Офлайн*, Название
		*/
		if (mod_text.includes('--------')) {
			mod_text = parseLessonText(lesson_text.split('--------'));
		} else {
			if (mod_text.includes('-Прак')) {
				mod_text.replace('-Прак', '');
				final_text += '*Практика*, ';
			}
			if (mod_text.includes('-Лекц')) {
				mod_text.replace('-Лекц', '');
				final_text += '*Лекция*, ';
			}
			if (mod_text.includes('-ПроД')) {
				let is_sw = false;

				mod_text.replace('-ПроД', '');
				if (mod_text.includes('СРС!')) {
					is_sw = true;
					mod_text.replace('CРС!', '');
				}
				final_text += `*Проектная деятельность${is_sw ? ' (СРС)' : ''}*, `;
			}
			if (mod_text.includes('ОНЛАЙН!')) {
				mod_text.replace(',  ОНЛАЙН!', '');
				final_text += `*Онлайн*\n`;
			} else {
				final_text += `\n`;
			}
		}

		final_text += mod_text;
	} else {
		// Array likely
		if (Array.isArray(lesson_text)) {
			lesson_text.map(text => {
				final_text += `${parseLessonText(text)}\n`;
			})
		}
	}

	return final_text.split('.').join('\\.')
}

export function getAndParseRaspisanOneDay(ctx: MyContext, date: string):Promise<string> {
	const {group} = ctx.session;
	const key: any = `schedules_bot:rasp_${date}_${group}`;

	return new Promise(resolve => {
		axios.post('http://inet.ibi.spb.ru/raspisan/rasp.php', queryString.stringify({
			rtype: 1,
			group: group,
			exam: 0,
			datafrom: date,
			dataend: date,
			formo: 0,
			allp: 0,
			hour: 0,
			tuttabl: 0
		})).then(r => {
			redis_client.get(key).then((cache) => {
				console.log(cache);
				// cache === null || cacheCheck(cache)?.includes('📅')
				if (true) {
					let text = `📅 Расписание на ${date}\n`;

					const tableParser = new JSDOM(r.data);

					const dates = tableParser.window.document.querySelectorAll("table > tbody > tr > td > b");
					const texts = tableParser.window.document.querySelectorAll("table > tbody > tr > td[style='border-color: Black;']");

					if (texts.length === 0) {
						resolve(`📅 На ${date.split('.').join('\\.')} занятий нет\\.\n\nТакже есть вероятность что сайт упал или обновляются базы\\.`)
						return;
					}

					let lessons: ScheduleInfo[] = [];
					let lesson_num = 0;

					for (let i = 2; i < dates.length; i++) {
						if (dates[i]?.textContent !== null) {
							lessons.push({
								time: dates[i]?.textContent?.trim(),
							});
						}
					}

					for (let i = 1; i < texts.length; i++) {
						if (texts[i]?.textContent !== null) {
							lessons[lesson_num] = {
								...lessons[lesson_num],
								text: parseLessonText(texts[i]?.textContent?.trim()),
							}

							lesson_num++;
						}
					}

					lessons.map(lesson => {
						text += `\n⏰ ${lesson.time}\n${lesson.text}\n`
					})

					redis_client.set(key, text as any, {
						EX: 3600,
					} as any).then();
					console.log('cached_now', key)
					resolve(text);
				}/* else {
					console.log('got from cache', key)
					resolve(cache);
				}*/
			})
		})
	});
}

export function getTodaySchedules(ctx: MyContext): Promise<string> {
	const today = new Date();
	const date = format(today, 'dd.MM.yyyy');

	return new Promise<string>(resolve => {
		getAndParseRaspisanOneDay(ctx, date).then(r => {
			resolve(r);
		})
	})
}

export function getTomorrowSchedules(ctx: MyContext): Promise<string> {
	const today = new Date();
	const date = format(addDays(today, 1), 'dd.MM.yyyy');

	return new Promise<string>(resolve => {
		getAndParseRaspisanOneDay(ctx, date).then(r => {
			resolve(r);
		})
	})
}
