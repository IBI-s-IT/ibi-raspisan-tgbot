export function logger(type: 'error' | 'info', ...params: any) {
	let text: string = '';
	const today = new Date();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	if (type === 'error') {
		text += `[ERR][${time}]`;
		console.error(text, ...params)
	} else {
		text += `[INF][${time}]`;
		console.info(text, ...params);
	}
}
