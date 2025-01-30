const urls = {
    bannerContent: 'https://storage.googleapis.com/cpc-public-website/dynamic-json/banner-content.json',
    podcastIndex: 'https://storage.googleapis.com/cpc-public-website/dynamic-json/podcast-index.json',
    highlights: 'https://storage.googleapis.com/cpc-public-website/dynamic-json/highlights.json'
};

let currentData = [];
let currentUrl = '';
let changes = [];
let newEntries = [];
let currentCollection = '';
let quill;

function loadData() {
    console.log('Load Data button clicked');
    const selector = document.getElementById('jsonSelector');
    const selectedValue = selector.value;
    currentCollection = selectedValue;
    currentUrl = urls[selectedValue];
    console.log('Fetching URL:', currentUrl);

    fetch(currentUrl)
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched successfully:', data);
            currentData = data;
            changes = []; // Reset changes
            newEntries = []; // Reset new entries
            displayData(data);
            displayMetadata(); // Display metadata after loading data
        })
        .catch(error => console.error('Error loading JSON:', error));
}

function displayData(data) {
    console.log('Displaying data');
    const jsonDisplay = document.getElementById('jsonDisplay');
    jsonDisplay.innerHTML = ''; // Clear previous content

    if (currentCollection === 'bannerContent') {
        jsonDisplay.innerHTML = formatBannerContent(data);
    } else if (currentCollection === 'podcastIndex') {
        jsonDisplay.innerHTML = formatPodcastIndex(data);
    } else if (currentCollection === 'highlights') {
        jsonDisplay.innerHTML = formatHighlights(data);
    }
}

function formatBannerContent(data) {
    return `<div>
        <p><strong>Show Banner:</strong> ${data.showBanner}</p>
        <p><strong>Banner Text:</strong> ${data.bannerText}</p>
        <p><strong>Button Text:</strong> ${data.buttonText}</p>
        <p><strong>Button URL:</strong> <a href="${data.buttonUrl}">${data.buttonUrl}</a></p>
        <p><strong>Entered By:</strong> ${data.enteredBy}</p>
        <p><strong>Entered Date:</strong> ${data.enteredDate}</p>
        <p><strong>Display Weeks:</strong> ${data.displayWeeks}</p>
    </div>`;
}

function formatPodcastIndex(data) {
    let formatted = '<div><h3>Podcast Series: ' + data.podcastSeries.title + '</h3><ul>';
    data.podcastSeries.episodes.forEach(episode => {
        formatted += `<li>
            <strong>Episode ${episode.number}:</strong> ${episode.title}
            <br><a href="${episode.link}">Listen</a>
            <br><a href="${episode.handoutPDF}">Handout PDF</a>
        </li>`;
    });
    formatted += '</ul></div>';
    return formatted;
}

function formatHighlights(data) {
    let formatted = '<div><h3>Highlights</h3><ul>';
    data.announcements.forEach(announcement => {
        formatted += `<li>
            <strong>${announcement.title}</strong>
            <p>${announcement.description}</p>
            <p><strong>Date Entered:</strong> ${announcement.dateEntered}</p>
            <p><strong>Active:</strong> ${announcement.active}</p>
            <p><strong>Type:</strong> ${announcement.type}</p>
            <p><strong>Category:</strong> ${announcement.category}</p>
            <p><strong>Tag:</strong> ${announcement.tag}</p>
        </li>`;
    });
    formatted += '</ul></div>';
    return formatted;
}

function formatJsonItem(item, index) {
    console.log('Formatting JSON item');
    let formatted = '<ul>';
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            const value = item[key];
            if (typeof value === 'object' && value !== null) {
                formatted += `<li><strong>${key}:</strong> ${formatNestedJson(value, `${index}-${key}`)}</li>`;
            } else {
                formatted += `<li><strong>${key}:</strong> <input type="text" value="${value}" data-key="${key}" data-index="${index}"></li>`;
            }
        }
    }
    formatted += '</ul>';
    formatted += `<button class="save" onclick="saveItem(${index})">Save</button>`;
    formatted += `<button class="delete" onclick="deleteItem(${index})">Delete</button>`;
    return formatted;
}

function formatNestedJson(value, parentIndex) {
    let formatted = '<ul>';
    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            formatted += `<li>${formatNestedJson(item, `${parentIndex}-${index}`)}</li>`;
        });
    } else if (typeof value === 'object') {
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                const nestedValue = value[key];
                if (typeof nestedValue === 'object' && nestedValue !== null) {
                    formatted += `<li><strong>${key}:</strong> ${formatNestedJson(nestedValue, `${parentIndex}-${key}`)}</li>`;
                } else {
                    formatted += `<li><strong>${key}:</strong> <input type="text" value="${nestedValue}" data-key="${parentIndex}-${key}" data-index="${parentIndex}"></li>`;
                }
            }
        }
    }
    formatted += `<button class="save" onclick="saveNestedItem('${parentIndex}')">Save Nested</button>`;
    formatted += `<button class="delete" onclick="deleteNestedItem('${parentIndex}')">Delete Nested</button>`;
    formatted += '</ul>';
    return formatted;
}

function saveNestedItem(parentIndex) {
    console.log('Saving nested item at index:', parentIndex);
    const inputs = document.querySelectorAll(`input[data-index^="${parentIndex}"]`);
    let itemChanged = false;
    let changeDetails = [];
    inputs.forEach(input => {
        const key = input.getAttribute('data-key');
        const newValue = input.value;
        const keys = key.split('-');
        let nestedItem = currentData;
        keys.forEach((k, i) => {
            if (i === keys.length - 1) {
                if (nestedItem[k] !== newValue) {
                    changeDetails.push(`${k}: "${nestedItem[k]}" -> "${newValue}"`);
                    nestedItem[k] = newValue;
                    itemChanged = true;
                }
            } else {
                nestedItem = nestedItem[k];
            }
        });
    });
    if (itemChanged) {
        changes.push({ index: parentIndex, details: changeDetails });
        showNotification('Nested changes saved successfully! Click here to review.');
        listChanges();
        console.log('Nested Changes:', changes);
        // Scroll to publish and download section
        document.getElementById('publishDownloadSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteNestedItem(parentIndex) {
    console.log('Deleting nested item at index:', parentIndex);
    const keys = parentIndex.split('-');
    let nestedItem = currentData;
    keys.forEach((k, i) => {
        if (i === keys.length - 1) {
            delete nestedItem[k];
        } else {
            nestedItem = nestedItem[k];
        }
    });
    displayData(currentData);
    showNotification('Nested item deleted successfully! Click here to review.');
    listChanges();
}

function saveItem(index) {
    if (newEntries.includes(index)) {
        saveNewEntry(index);
    } else {
        console.log('Saving item at index:', index);
        const inputs = document.querySelectorAll(`input[data-index="${index}"]`);
        let itemChanged = false;
        let changeDetails = [];
        inputs.forEach(input => {
            const key = input.getAttribute('data-key');
            const newValue = input.value;
            if (currentData[index][key] !== newValue) {
                changeDetails.push(`${key}: "${currentData[index][key]}" -> "${newValue}"`);
                currentData[index][key] = newValue;
                itemChanged = true;
            }
        });
        if (itemChanged) {
            changes.push({ index, details: changeDetails });
            const itemDiv = document.querySelector(`.json-item:nth-child(${index + 1})`);
            itemDiv.classList.add('changed');
            showNotification('Changes saved successfully! Click here to review.');
            listChanges();
            console.log('Changes:', changes);
            // Scroll to publish and download section
            document.getElementById('publishDownloadSection').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function deleteItem(index) {
    console.log('Deleting item at index:', index);
    currentData.splice(index, 1);
    displayData(currentData);
    showNotification('Item deleted successfully! Click here to review.');
    listChanges();
}


function previewChanges() {
    console.log('Previewing changes');
    const previewDisplay = document.getElementById('previewDisplay');
    const previewData = currentData.map((item, index) => {
        const isNew = newEntries.includes(index);
        return `${isNew ? '// New Entry\n' : ''}${JSON.stringify(item, null, 2)}`;
    }).join('\n\n');
    previewDisplay.textContent = previewData;
}

function publishChanges() {
    if (changes.length === 0 && newEntries.length === 0) {
        alert('No changes have been made.');
        return;
    }
    console.log('Publishing changes');
    const humanReadableData = currentData.map((item, index) => {
        const isNew = newEntries.includes(index);
        return `${isNew ? '// New Entry\n' : ''}${JSON.stringify(item, null, 2)}`;
    }).join('\n\n');

    const timestampComment = `// Published on: ${formatTimestamp(new Date())}\n`;
    const dataWithTimestamp = `${timestampComment}${humanReadableData}`;

    const timestamp = formatTimestamp(new Date());
    const humanBlob = new Blob([dataWithTimestamp], { type: 'application/json' });
    const humanUrl = URL.createObjectURL(humanBlob);
    const humanLink = document.createElement('a');
    humanLink.href = humanUrl;
    humanLink.download = `${currentCollection}_${timestamp}.json`;
    humanLink.click();
    URL.revokeObjectURL(humanUrl);
}

function formatTimestamp(date) {
    const options = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options).replace(/,|:/g, '').replace(' ', '-').toLowerCase();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.display = 'block';
    notification.onclick = () => {
        document.getElementById('reviewChanges').scrollIntoView({ behavior: 'smooth' });
    };
    setTimeout(() => {
        notification.style.display = 'none';
        document.body.removeChild(notification);
    }, 5000);
}

function listChanges() {
    const changeLog = document.getElementById('changeLog');
    changeLog.innerHTML = '<h3>Change Log</h3><ul>';
    changes.forEach(change => {
        changeLog.innerHTML += `<li>Modified item at index ${change.index}: ${change.details.join(', ')}</li>`;
    });
    newEntries.forEach(index => {
        changeLog.innerHTML += `<li>Added new item at index ${index}</li>`;
    });
    changeLog.innerHTML += '</ul>';
}

function initializeEditor() {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
            ]
        }
    });
}

function createNewEntry() {
    console.log('Creating new entry');
    const newEntry = { content: '' }; // Initialize a new entry object with content
    const jsonDisplay = document.getElementById('jsonDisplay');
    const entryIndex = currentData.length;

    // Create a container for the new entry
    const entryContainer = document.createElement('div');
    entryContainer.className = 'entry-container';

    // Create an editor container
    const editorContainer = document.createElement('div');
    editorContainer.id = `editor-container-${entryIndex}`;
    editorContainer.className = 'editor-container';

    // Create a preview container
    const previewContainer = document.createElement('div');
    previewContainer.id = `preview-container-${entryIndex}`;
    previewContainer.className = 'preview-container';

    // Append editor and preview to the entry container
    entryContainer.appendChild(editorContainer);
    entryContainer.appendChild(previewContainer);

    // Append the entry container to the display
    jsonDisplay.appendChild(entryContainer);

    // Initialize Quill editor for this entry
    const quill = new Quill(`#editor-container-${entryIndex}`, {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
            ]
        }
    });

    // Update preview on content change
    quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        previewContainer.innerHTML = content; // Update the preview with the editor content
    });

    newEntries.push(entryIndex);
    currentData.push(newEntry);
    showNotification('New entry created! Fill in the details and save.');
}

function saveNewEntry(index) {
    console.log('Saving new entry at index:', index);
    const quill = Quill.find(`#editor-container-${index}`);
    const content = quill.root.innerHTML; // Get the HTML content from the editor
    currentData[index].content = content; // Save the content to the current data
    let entryChanged = true;
    let changeDetails = [`content: "${content}"`];
    if (entryChanged) {
        changes.push({ index, details: changeDetails });
        showNotification('New entry saved successfully! Click here to review.');
        listChanges();
        console.log('New Entry Changes:', changes);
        document.getElementById('publishDownloadSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function updateHighlights() {
    console.log('Update Highlights button clicked');
    // Add logic here to handle updating highlights
    // This function can be called when the 'Update Website Highlights' button is clicked
}

function displayMetadata() {
    const metadataDisplay = document.getElementById('metadataDisplay');
    const timestamp = formatTimestamp(new Date());
    metadataDisplay.innerHTML = `
        <p><strong>Data Source URL:</strong> <a href="${currentUrl}" target="_blank">${currentUrl}</a></p>
        <p><strong>Last Updated:</strong> ${timestamp}</p>
    `;
}