import {MyContext} from "../my-context";
import axios from "axios";
import { format } from "date-fns";
import * as queryString from "querystring";
import {JSDOM} from "jsdom";

interface ScheduleInfo {
	time?: string | null,
	text?: string;
}

export function getTodaySchedules(ctx: MyContext): Promise<string> {
	const {group} = ctx.session;
	const today = new Date();
	const date = format(today, 'dd.MM.yyyy');

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
			let text = `Расписание на ${date}\n`;

			const tableParser = new JSDOM(r.data);
			const dates = tableParser.window.document.querySelectorAll("table > tbody > tr > td > b");
			const texts = tableParser.window.document.querySelectorAll("table > tbody > tr > td[style='border-color: Black;']");

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
						text: texts[i]?.textContent?.trim(),
					}

					lesson_num++;
				}
			}

			lessons.map(lesson => {
				text += `\n⏰ ${lesson.time}\n${lesson.text}\n`
			})

			resolve(text);
		})
	});


}
