/* eslint-disable strict */
//var request = require('request');

const translatorApi = module.exports;

<<<<<<< HEAD
// translatorApi.translate = function (postData) {
// return ['is_english',postData];
// };

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
=======
translatorApi.translate = function (postData) {
	return ['is_english',postData];
};

// translatorApi.translate = async function (postData) {
//  Edit the translator URL below
//  const TRANSLATOR_API = "TODO"
//  const response = await fetch(TRANSLATOR_API+'/?content='+postData.content);
//  const data = await response.json();
//  return ['is_english','translated_content'];
// };
>>>>>>> main
