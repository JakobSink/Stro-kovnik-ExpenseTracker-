// Inicializacija proračuna in skupnih stroškov
let totalExpenses = 0;
let expenses = [];

// Funkcija za dodajanje stroška
function dodajStrosek() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Prosimo, izpolnite vse podatke.");
        return;
    }

    expenses.push({ description, amount, category });
    totalExpenses += amount;

    posodobiSkupajStroske();
    posodobiTabeloZgodovine();
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

// Funkcija za posodobitev skupnih stroškov
function posodobiSkupajStroske() {
    document.getElementById('totalExpenses').innerText = `Skupaj Stroški: ${totalExpenses.toFixed(2)}€`;
}

// Funkcija za posodobitev tabele zgodovine
function posodobiTabeloZgodovine() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const row = document.createElement('div');
        row.innerHTML = `
            <div>${expense.description} - ${expense.amount.toFixed(2)}€ (${expense.category})</div>
            <button onclick="urediStrosek(${index})">Uredi</button>
            <button onclick="odstraniStrosek(${index})">Odstrani</button>
        `;
        expenseList.appendChild(row);
    });
}

// Funkcija za urejanje stroška
function urediStrosek(index) {
    const expense = expenses[index];
    document.getElementById('description').value = expense.description;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;

    // Odstrani strošek, dokler ne končaš z urejanjem
    odstraniStrosek(index);
}

// Funkcija za odstranjevanje stroška
function odstraniStrosek(index) {
    const expense = expenses[index];
    totalExpenses -= expense.amount;
    expenses.splice(index, 1);

    posodobiSkupajStroske();
    posodobiTabeloZgodovine();
}

// Funkcija za dodajanje oseb
function posodobiOsebe() {
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;
    const osebeDiv = document.getElementById('osebe');
    osebeDiv.innerHTML = '';

    for (let i = 0; i < numPeople; i++) {
        osebeDiv.innerHTML += `
            <div>
                <h4>Oseba ${i + 1}</h4>
                <div class="input-group">
                    <label for="incomePerson${i}">Mesečni Dohodek (€):</label>
                    <input type="number" id="incomePerson${i}" placeholder="Vnesi mesečni dohodek">
                </div>
                <div class="input-group">
                    <label for="additionalIncomePerson${i}">Dodatni Dohodek (€):</label>
                    <input type="number" id="additionalIncomePerson${i}" placeholder="Vnesi dodatni dohodek">
                </div>
            </div>
        `;
    }
}

// Funkcija za izračun varčevanja
function izračunajVarčevanje() {
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;
    let totalIncome = 0;

    for (let i = 0; i < numPeople; i++) {
        const monthlyIncome = parseFloat(document.getElementById(`incomePerson${i}`).value) || 0;
        const additionalIncome = parseFloat(document.getElementById(`additionalIncomePerson${i}`).value) || 0;
        totalIncome += monthlyIncome + additionalIncome;
    }

    const savingsMethod = document.getElementById('savingsMethod').value;
    let totalSavings = 0;
    let rentAllocation = 0;
    let foodAllocation = 0;
    let remaining = 0;

    // Razdelitev sredstev glede na izbrano metodo varčevanja
    switch (savingsMethod) {
        case "70/20/10":
            totalSavings = 0.7 * totalIncome; // 70% za varčevanje
            rentAllocation = 0.2 * totalIncome; // 20% za najemnino
            foodAllocation = 0.1 * totalIncome; // 10% za hrano
            break;
        case "50/30/20":
            totalSavings = 0.5 * totalIncome; // 50% za varčevanje
            rentAllocation = 0.3 * totalIncome; // 30% za najemnino
            foodAllocation = 0.2 * totalIncome; // 20% za hrano
            break;
        case "100":
            totalSavings = totalIncome; // Vse za varčevanje
            break;
        default:
            totalSavings = 0;
    }

    // Izračun preostalega
    remaining = totalIncome - (totalSavings + rentAllocation + foodAllocation);

    // Razdelitev varčevanja
    const savingsForInvestments = totalSavings * 0.7; // 70% za varčevanje
    const remainingSavings = totalSavings * 0.3; // 30% za preostalo

    // Izračun porazdelitve sredstev po osebah
    const savingsForInvestmentsPerPerson = savingsForInvestments / numPeople;
    const remainingSavingsPerPerson = remainingSavings / numPeople;
    const rentPerPerson = rentAllocation / numPeople;
    const foodPerPerson = foodAllocation / numPeople;
    const remainingPerPerson = remaining / numPeople;

    // Prikaži rezultate v obliki tabele
    let resultHtml = `<table>
        <tr><th>Oseba</th><th>Varčevanje (€)</th><th>Preostalo (€)</th><th>Najemnina (€)</th><th>Hrana (€)</th></tr>`;
    
    for (let i = 0; i < numPeople; i++) {
        resultHtml += `
            <tr>
                <td>Oseba ${i + 1}</td>
                <td>${savingsForInvestmentsPerPerson.toFixed(2)}</td>
                <td>${remainingSavingsPerPerson.toFixed(2)}</td>
                <td>${rentPerPerson.toFixed(2)}</td>
                <td>${foodPerPerson.toFixed(2)}</td>
            </tr>`;
    }

    resultHtml += `</table>`;
    resultHtml += `<p>Skupaj varčevanje: ${totalSavings.toFixed(2)}€, Preostalo: ${remaining.toFixed(2)}€</p>`;
    resultHtml += `<p>Najemnina: ${rentAllocation.toFixed(2)}€, Hrana: ${foodAllocation.toFixed(2)}€</p>`;
    document.getElementById('saveResult').innerHTML = resultHtml;
}

// Funkcija za izračun stroškov bencina
function izracunajBencin() {
    const liters = parseFloat(document.getElementById('liters').value);
    const pricePerLiter = parseFloat(document.getElementById('pricePerLiter').value);

    if (isNaN(liters) || isNaN(pricePerLiter) || liters <= 0 || pricePerLiter <= 0) {
        alert("Prosimo, vnesite veljavne podatke.");
        return;
    }

    const totalFuelCost = liters * pricePerLiter;
    document.getElementById('fuelCost').innerText = `Skupni stroški bencina: ${totalFuelCost.toFixed(2)}€`;
}

// Funkcija za izračun mesečnih stroškov
function izracunajStroske() {
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const utilities = parseFloat(document.getElementById('utilities').value) || 0;
    const credit = parseFloat(document.getElementById('credit').value) || 0;
    const totalCosts = rent + utilities + credit;

    document.getElementById('monthlyCosts').innerText = `Skupni mesečni stroški: ${totalCosts.toFixed(2)}€`;
}

// Funkcija za prikaz razreza kategorij v analizi
function prikaziRazrezKategorij() {
    const categoryAnalysis = document.getElementById('categoryAnalysis');
    const categoryCounts = {};

    expenses.forEach(expense => {
        if (!categoryCounts[expense.category]) {
            categoryCounts[expense.category] = 0;
        }
        categoryCounts[expense.category] += expense.amount;
    });

    let resultHtml = '<table><tr><th>Kategorija</th><th>Skupni Znesek (€)</th></tr>';
    for (const category in categoryCounts) {
        resultHtml += `<tr><td>${category}</td><td>${categoryCounts[category].toFixed(2)}</td></tr>`;
    }
    resultHtml += '</table>';
    categoryAnalysis.innerHTML = resultHtml;
}

// Funkcija za odpiranje zavihkov
function odpriZavihek(zavihek) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const tabLinks = document.querySelectorAll('.tab');
    tabLinks.forEach(tabLink => tabLink.classList.remove('active'));

    document.getElementById(zavihek).classList.add('active');
}

// Inicializacija
odpriZavihek('varčevanje'); // Odpri prvi zavihek ob nalaganju
