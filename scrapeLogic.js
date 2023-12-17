const puppeteer = require('puppeteer');
require('dotenv').config();

const URL = `https://lucky-jet.gamedev-atech.cc/?exitUrl=null&language=uk&b=8137c4e5b3acab20ae1f3beb43efac9a78fcaa7c4a27cd6e8a02bf5074ba8de9857cf583774d79836cd757f40d50d77dd3b276632df2208273725233bae66c554f83a1d1981b5f2fb0b84ed7222c2f5399a3c25fb5752c3859468772cedb1166b93c6f9070.80429a59887f8724d9270af78d143b0a`;

const scrapeLogic = async res => {
	const browser = await puppeteer.launch({
		args: [
			'--disable-setuid-sandbox',
			'--no-sandbox',
			'--single-process',
			'--no-zygote',
		],
		executablePath:
			process.env.NODE_ENV === 'production'
				? process.env.PUPPETEER_EXECUTABLE_PATH
				: puppeteer.executablePath(),
		headless: 'new',
	});
	try {
		const page = await browser.newPage();

		await page.goto(URL);

		// Set screen size
		await page.setViewport({ width: 1080, height: 1024 });
		await page.waitForNavigation(60000);
		// Type into search box
		await page.waitForSelector('.sc-dwnOUR', 300000);
		const coefficientsWrapper = await page.$('.sc-dwnOUR');
		const coefficients = await page.evaluete(el => {
			const coefficientsValueEl = el.querySelector('.sc-fLcnxK');
			const coefficientsValues = [];
			coefficientsValueEl.forEach(coefficientValueEl => {
				coefficientsValues.push(coefficientValueEl.textContent);
			});

			return coefficientsValues;
		}, coefficientsWrapper);
		console.log(coefficients);
		res.send(`Balance: ${balance}`);
	} catch (e) {
		console.error(e);
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	} finally {
		await browser.close();
	}
};

module.exports = { scrapeLogic };
