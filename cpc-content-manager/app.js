const urls = {
    highlights: 'https://storage.googleapis.com/cpc-public-website/dynamic-json/highlights.json'
};

let currentData = [];
let changes = [];
let newEntries = [];

function navigateToStep(stepNumber) {
    const steps = ['loadSection', 'editSection', 'createSection'];
    steps.forEach((step, index) => {
        document.getElementById(step).style.display = index === stepNumber ? 'block' : 'none';
    });
}

async function loadData() {
    const selectedCollection = document.getElementById('jsonSelector').value;
    const currentUrl = urls[selectedCollection];

    try {
        const response = await fetch(currentUrl);
        if (!response.ok) throw new Error('Failed to fetch JSON');

        currentData = await response.json();
        displayData(currentData);
        navigateToStep(1); // Move to Step 2: Edit Data
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

function displayData(data) {
    const jsonDisplay = document.getElementById('jsonDisplay');
    jsonDisplay.innerHTML = '<h2>Step 2: Edit Data</h2>';

    data.announcements.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = 'json-item';

        div.innerHTML = `
            <input type="text" value="${item.title}" data-index="${index}" data-key="title">
            <textarea data-index="${index}" data-key="description">${item.description}</textarea>
            <input type="date" value="${item.dateEntered}" data-index="${index}" data-key="dateEntered">
            <input type="checkbox" ${item.active ? "checked" : ""} data-index="${index}" data-key="active">
            <input type="text" value="${item.type}" data-index="${index}" data-key="type">
            <input type="text" value="${item.category}" data-index="${index}" data-key="category">
            <input type="text" value="${item.tag}" data-index="${index}" data-key="tag">
            <button onclick="saveItem(${index})">Save</button>
            <button onclick="deleteItem(${index})">Delete</button>
        `;

        jsonDisplay.appendChild(div);
    });

    jsonDisplay.innerHTML += '<button onclick="publishUpdates()">Update Existing</button>';
}

function saveItem(index) {
    let inputs = document.querySelectorAll(`[data-index="${index}"]`);
    let updatedItem = {};

    inputs.forEach(input => {
        let key = input.getAttribute('data-key');
        if (input.type === 'checkbox') {
            updatedItem[key] = input.checked;
        } else {
            updatedItem[key] = input.value;
        }
    });

    currentData.announcements[index] = updatedItem;
    console.log('Updated JSON:', currentData);
}

function deleteItem(index) {
    currentData.announcements.splice(index, 1);
    displayData(currentData);
}

function createNewHighlight() {
    let newHighlight = {
        title: document.getElementById('highlightTitle').value,
        description: document.getElementById('highlightDescription').value,
        dateEntered: document.getElementById('highlightDateEntered').value,
        active: document.getElementById('highlightActive').checked,
        type: document.getElementById('highlightType').value,
        category: document.getElementById('highlightCategory').value,
        tag: document.getElementById('highlightTag').value,
        // Add any additional fields here if needed
    };

    newEntries.push(newHighlight);
    displayNewEntries();
}

function displayNewEntries() {
    const newEntriesDisplay = document.getElementById('newEntriesDisplay');
    newEntriesDisplay.innerHTML = '<h2>New Highlights</h2>';

    newEntries.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = 'json-item';

        div.innerHTML = `
            <input type="text" value="${item.title}" data-index="${index}" data-key="title">
            <textarea data-index="${index}" data-key="description">${item.description}</textarea>
            <input type="date" value="${item.dateEntered}" data-index="${index}" data-key="dateEntered">
            <input type="checkbox" ${item.active ? "checked" : ""} data-index="${index}" data-key="active">
            <input type="text" value="${item.type}" data-index="${index}" data-key="type">
            <input type="text" value="${item.category}" data-index="${index}" data-key="category">
            <input type="text" value="${item.tag}" data-index="${index}" data-key="tag">
            <button onclick="saveNewItem(${index})">Save</button>
            <button onclick="deleteNewItem(${index})">Delete</button>
        `;

        newEntriesDisplay.appendChild(div);
    });

    newEntriesDisplay.innerHTML += '<button onclick="publishNewEntries()">Create New</button>';
}

function publishUpdates() {
    const updatedJSON = JSON.stringify(currentData, null, 2);
    const blob = new Blob([updatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlights-updated.json';
    a.click();
    URL.revokeObjectURL(url);
}

function publishNewEntries() {
    const newJSON = JSON.stringify(newEntries, null, 2);
    const blob = new Blob([newJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'new-highlights.json';
    a.click();
    URL.revokeObjectURL(url);
}
