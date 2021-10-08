import {redis_client} from "../../index.js";
import axios from "axios";
import queryString from "querystring";
import {JSDOM} from "jsdom";

/**
 * 1 - бакалавриат
 * 2 - специалитет
 * 3 - магистратура
 * 4 - аспирантура
 * 5 - ДПО
 **/
export function getCachedGroupList({ code = '1' }: {code: string}): Promise<Array<{ id: string | null, name: string | null }>> {
	return new Promise((resolve, reject) => {
		const key: any = `groupList:${code}`;

		redis_client.get(key)
			.then(res => {
				if (res === null) {
					getGroups({ code: code.toString() }).then((r) => {
						console.log('caching', code)
						// @ts-ignore
						redis_client.set(key, JSON.stringify(r), { EX: 3600 * 48 })
							.catch(reject);
						resolve(r);
					})
				} else {
					console.log('already cached');
					resolve(JSON.parse(res));
				}
			})
			.catch(reject);

	})
}

/**
 * 1 - бакалавриат
 * 2 - специалитет
 * 3 - магистратура
 * 4 - аспирантура
 * 5 - ДПО
 **/
export function getGroups({ code = '1' }): Promise<Array<{ id: string | null, name: string | null }>> {
	return new Promise((resolve, reject) => {
		// get schedules
		const headers: Record<string, any> = {
			'User-Agent': 'tg-bot',
			'Referer': 'http://inet.ibi.spb.ru/raspisan/'
		}

		axios.get(`http://inet.ibi.spb.ru/raspisan/menu.php?${queryString.stringify({
			tmenu: 12,
			cod: code
		})}`, { headers: headers }).then((r) => {
			const parser = new JSDOM(r.data);
			let groups: { name: string | null, id: string | null }[] = [];
			parser.window?.document?.querySelectorAll('#group > option').forEach((ch: Element) => {
				groups.push({
					name: ch.textContent,
					id: ch.getAttribute('value'),
				});
			});

			resolve(groups);
		})
			.catch(reject);
	})
}
