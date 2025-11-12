/* eslint-disable strict */
//var request = require('request');

const translatorApi = module.exports;



translatorApi.translate = async function (postData) {
	console.log('[Translator] ===== FUNCTION CALLED =====');
	console.log('[Translator] postData:', postData);
	
	try {
		const TRANSLATOR_API = 'http://localhost:5000/translate';
		const url = TRANSLATOR_API + '?content=' + encodeURIComponent(postData.content);
		
		console.log('[Translator] Requesting URL:', url);
		console.log('[Translator] Original content:', postData.content);
		
		const response = await fetch(url);
		const data = await response.json();
		
		console.log('[Translator] API Response:', data);

		const isEnglish = Boolean(data?.is_english);
		const translatedContent = (data?.translated_content || '').toString();
		
		console.log('[Translator] isEnglish:', isEnglish);
		console.log('[Translator] translatedContent:', translatedContent);

		return [isEnglish, translatedContent];
	}
	catch (err) {
		console.error('[Translator] Error:', err.message);

		// Fallback: still return an array so the toggle works
		return [false, postData.content]; // false = show toggle
	}

};
