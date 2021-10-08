import {start as startBot} from './bot/index.js';
import {createClient} from "redis";
import { config as envInitialize } from 'dotenv';

// dotenv initialization
console.log(envInitialize());

// redis initialization
export const redis_client = createClient();

redis_client.on('error', console.error);
redis_client.connect().then(() => {
	startBot().then();
}).catch(console.error)
