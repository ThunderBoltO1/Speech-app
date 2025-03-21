const API_KEY = 'AIzaSyC5n7h-wuxvKdvP4gXBiSStuU8bFSm4k2U';
const CLIENT_ID = '71962080875-khc6aslq3phrnm9cqgguk37j0funtr7f.apps.googleusercontent.com';
const SPREADSHEET_ID = '1YY1a1drCnfXrSNWrGBgrMaMlFQK5rzBOEoeMhW9MYm8';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

let words = [];

function init() {
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        'clientId': CLIENT_ID,
        'scope': SCOPE
    }).then(function () {
        loadWords();
    }, function(error) {
        console.error('Error initializing gapi.client', error);
    });
}

function loadWords() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:A'
    }).then(function(response) {
        words = response.result.values || [];
        renderWordButtons();
    }, function(error) {
        console.error('Error loading words from Google Sheets', error);
    });
}

function addWord() {
    const newWord = document.getElementById('new-word').value;
    if (newWord) {
        words.push([newWord]);
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:A',
            valueInputOption: 'RAW',
            resource: {
                values: [[newWord]]
            }
        }).then(function(response) {
            renderWordButtons();
        }, function(error) {
            console.error('Error adding word to Google Sheets', error);
        });
        document.getElementById('new-word').value = '';
    }
}

function renderWordButtons() {
    const wordButtons = document.getElementById('word-buttons');
    wordButtons.innerHTML = '';
    words.forEach(word => {
        const button = document.createElement('button');
        button.textContent = word[0];
        button.onclick = () => speak(word[0]);
        wordButtons.appendChild(button);
    });
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    speechSynthesis.speak(utterance);
}

function handleClientLoad() {
    gapi.load('client:auth2', init);
}

// เรียก handleClientLoad เมื่อหน้าเว็บโหลดเสร็จ
window.onload = handleClientLoad;