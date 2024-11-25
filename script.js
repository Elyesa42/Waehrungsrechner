const apiKey = 'DEIN_API_KEY'; // API-Schlüssel von deiner bevorzugten API für Währungsumrechnungen
let conversionHistory = [];
let alertSet = false;
let alertRate = 0;
let alertCurrencyPair = "";

// Lade die verfügbaren Währungen
async function loadCurrencies() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');

    // Optionen für beide Auswahlfelder hinzufügen
    currencies.forEach(currency => {
        const fromOption = document.createElement('option');
        fromOption.value = currency;
        fromOption.textContent = currency;
        fromCurrencySelect.appendChild(fromOption);

        const toOption = document.createElement('option');
        toOption.value = currency;
        toOption.textContent = currency;
        toCurrencySelect.appendChild(toOption);
    });
}

// Umrechnung der Währungen
async function getExchangeRate(fromCurrency, toCurrency, amount) {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    const rate = data.rates[toCurrency];
    const convertedAmount = (rate * amount).toFixed(2);

    // Ergebnis anzeigen
    document.getElementById('converted-result').textContent = `Ergebnis: ${convertedAmount} ${toCurrency}`;

    // Umrechnungsverlauf speichern
    conversionHistory.push({
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        amount: amount,
        result: convertedAmount
    });
}

// Anzeige des Umrechnungsverlaufs
function viewHistory() {
    const historyResult = document.getElementById('history-result');
    historyResult.innerHTML = "<h3>Währungsumrechnungsverlauf:</h3>";
    conversionHistory.forEach(entry => {
        historyResult.innerHTML += `
            <p>${entry.amount} ${entry.fromCurrency} = ${entry.result} ${entry.toCurrency}</p>
        `;
    });
}

// Wechselkurs-Alarm
function setExchangeAlert() {
    alertSet = !alertSet;
    if (alertSet) {
        alertRate = prompt("Geben Sie den gewünschten Wechselkurs ein:");
        alertCurrencyPair = `${document.getElementById('from-currency').value} / ${document.getElementById('to-currency').value}`;
        document.getElementById('alert-result').textContent = `Alarm für ${alertCurrencyPair} bei Kurs ${alertRate} gesetzt.`;
    } else {
        document.getElementById('alert-result').textContent = "Wechselkurs-Alarm deaktiviert.";
    }
}

// Wechselkurs regelmäßig überprüfen (Simuliert)
async function checkAlert() {
    if (alertSet) {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.rates[toCurrency];

        if (rate >= alertRate) {
            alert(`Wechselkurs für ${alertCurrencyPair} hat den gewünschten Wert erreicht: ${rate}`);
            alertSet = false; // Alarm wird einmalig ausgelöst und dann deaktiviert
        }
    }
}

// Event-Listener für Umrechnung und Features
document.getElementById('convert-btn').addEventListener('click', () => {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    getExchangeRate(fromCurrency, toCurrency, amount);
});

document.getElementById('set-alert').addEventListener('click', setExchangeAlert);
document.getElementById('view-history').addEventListener('click', viewHistory);

// Initiale Ladefunktionen
loadCurrencies();

// Wechselkurs Alarm regelmäßig überprüfen
setInterval(checkAlert, 10000); // Alle 10 Sekunden überprüfen
