// ========================================
// DAILY LEARNING JOURNAL - JavaScript
// ========================================

// ========================================
// 1. INITIAL DATA & STATE MANAGEMENT
// ========================================

// Static sample data
const sampleEntries = [
    {
        id: 1,
        date: '2026-05-19',
        topic: 'Networking Hardware Devices',
        query: 'networking basics',
        details: 'Modem: Converts analog signal to digital signal and helps connect devices to network/internet.\nNIC: Network Interface Card used to connect a computer to a network.\nHub: Connects multiple devices and shares data to all connected devices.\nSwitch: Connects multiple devices using ports and forwards data smartly.\nRepeater: Regenerates and boosts network signal.\nBridge: Connects two network segments into one network.',
        importantPoints: 'Understand the difference between Hub, Switch, and Router.\nNetworking devices work at different layers of the OSI model.',
        tools: 'VMware, Kali Linux'
    },
    {
        id: 2,
        date: '2026-05-20',
        topic: 'Mock Test and Assignment',
        query: 'mock test',
        details: 'Mock Test completed.\nAssignment instructions and clarification discussed.',
        importantPoints: 'Complete all assignments on time.\nReview concepts before mock tests.',
        tools: 'None'
    }
];

// Application state
let appState = {
    entries: [],
    nextId: 3,
    currentEditingId: null,
    filters: {
        searchTerm: '',
        date: ''
    }
};

// ========================================
// 2. INITIALIZATION
// ========================================

// Initialize the application
function initializeApp() {
    // Load entries from localStorage or use sample data
    loadEntries();
    
    // Set today's date in the date input
    setTodayDate();
    
    // Display current date in header
    displayCurrentDate();
    
    // Render initial journal entries
    renderJournal();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update statistics
    updateStatistics();
}

// Load entries from localStorage or initialize with sample data
function loadEntries() {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
        appState.entries = JSON.parse(savedEntries);
        // Calculate the next ID based on existing entries
        if (appState.entries.length > 0) {
            appState.nextId = Math.max(...appState.entries.map(e => e.id)) + 1;
        }
    } else {
        // Use sample data on first load
        appState.entries = JSON.parse(JSON.stringify(sampleEntries));
        appState.nextId = 3;
        saveEntries();
    }
}

// Save entries to localStorage
function saveEntries() {
    localStorage.setItem('journalEntries', JSON.stringify(appState.entries));
}

// Set today's date in the date input
function setTodayDate() {
    const today = new Date();
    const dateString = formatDateForInput(today);
    const dateInput = document.getElementById('entryDate');
    if (dateInput) dateInput.value = dateString;
}

// Display current date in header
function displayCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = dateString;
}

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display (DD-MM-YYYY)
function formatDateForDisplay(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// ========================================
// 3. EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Form submission
    document.getElementById('entryForm').addEventListener('submit', handleFormSubmit);
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) clearBtn.addEventListener('click', handleClearFilters);

    // Date filter
    const filterDate = document.getElementById('filterDate');
    if (filterDate) {
        filterDate.addEventListener('change', (e) => {
            appState.filters.date = e.target.value;
            renderJournal();
        });
    }
}

// ========================================
// 4. FORM HANDLING
// ========================================

// Handle form submission (Add or Update entry)
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const formData = {
        date: document.getElementById('entryDate').value,
        topic: document.getElementById('entryTopic').value,
        query: document.getElementById('entryQuery') ? document.getElementById('entryQuery').value : '',
        details: document.getElementById('entryDetails').value,
        importantPoints: document.getElementById('entryImportant').value,
        tools: document.getElementById('entryTools').value
    };
    
    // Validate form data
    if (!formData.date || !formData.topic || !formData.details) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Check if editing or adding
    if (appState.currentEditingId !== null) {
        // Update existing entry
        updateEntry(appState.currentEditingId, formData);
        appState.currentEditingId = null;
    } else {
        // Add new entry
        addEntry(formData);
    }
    
    // Reset form
    document.getElementById('entryForm').reset();
    setTodayDate();
    
    // Reset submit button text
    document.getElementById('submitBtn').textContent = 'Add Entry';
    
    // Render updated journal
    renderJournal();
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveEntries();
}

// Add new entry
function addEntry(data) {
    const newEntry = {
        id: appState.nextId,
        date: data.date,
        query: data.query || '',
        topic: data.topic,
        details: data.details,
        importantPoints: data.importantPoints,
        tools: data.tools
    };
    
    appState.entries.unshift(newEntry); // Add to beginning
    appState.nextId++;
}

// Update existing entry
function updateEntry(id, data) {
    const entryIndex = appState.entries.findIndex(e => e.id === id);
    if (entryIndex !== -1) {
        appState.entries[entryIndex] = {
            id: id,
            query: data.query || '',
            ...data
        };
    }
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        appState.entries = appState.entries.filter(e => e.id !== id);
        renderJournal();
        updateStatistics();
        saveEntries();
    }
}

// Edit entry
function editEntry(id) {
    const entry = appState.entries.find(e => e.id === id);
    if (entry) {
        // Fill form with entry data
        document.getElementById('entryDate').value = entry.date;
        document.getElementById('entryTopic').value = entry.topic;
        if (document.getElementById('entryQuery')) document.getElementById('entryQuery').value = entry.query || '';
        document.getElementById('entryDetails').value = entry.details;
        document.getElementById('entryImportant').value = entry.importantPoints;
        document.getElementById('entryTools').value = entry.tools;
        
        // Update state and button
        appState.currentEditingId = id;
        document.getElementById('submitBtn').textContent = 'Update Entry';
        
        // Scroll to form
        document.getElementById('entryForm').scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================================
// 5. SEARCH & FILTER
// ========================================

// Handle search input
function handleSearch(event) {
    appState.filters.searchTerm = event.target.value.toLowerCase();
    renderJournal();
}

// Handle filter changes
function handleFilter() {
    renderJournal();
}

// Clear all filters
function handleClearFilters() {
    appState.filters = {
        searchTerm: '',
        date: ''
    };

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const filterDate = document.getElementById('filterDate');
    if (filterDate) filterDate.value = '';

    renderJournal();
}

// Filter entries based on current filters
function getFilteredEntries() {
    return appState.entries.filter(entry => {
        // Search filter - search in topic, details, tools, and important points
        const searchMatch = !appState.filters.searchTerm || 
            entry.topic.toLowerCase().includes(appState.filters.searchTerm) ||
            entry.details.toLowerCase().includes(appState.filters.searchTerm) ||
            (entry.query && entry.query.toLowerCase().includes(appState.filters.searchTerm)) ||
            entry.tools.toLowerCase().includes(appState.filters.searchTerm) ||
            entry.importantPoints.toLowerCase().includes(appState.filters.searchTerm);
        const dateMatch = !appState.filters.date || entry.date === appState.filters.date;

        return searchMatch && dateMatch;
    });
}

// ========================================
// 6. RENDER JOURNAL
// ========================================

// Render journal entries
function renderJournal() {
    const container = document.getElementById('journalContainer');
    const filteredEntries = getFilteredEntries();
    
    // Clear container
    container.innerHTML = '';
    
    // Check if there are entries
    if (filteredEntries.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">No entries</div>
                <div class="empty-state-title">No entries found</div>
                <div class="empty-state-text">Try adjusting your search or filters to find your learning entries.</div>
            </div>
        `;
        return;
    }
    
    // Render each entry as a card
    filteredEntries.forEach((entry, index) => {
        const card = createEntryCard(entry);
        container.appendChild(card);
        
        // Trigger animation with slight delay
        setTimeout(() => {
            card.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s both`;
        }, 0);
    });
}

// Create entry card element
function createEntryCard(entry) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    
    // Format the date for display
    const displayDate = formatDateForDisplay(entry.date);
    
    // Build tools tags
    const toolsArray = (entry.tools || '').split(',').filter(tool => tool.trim() !== '');
    const toolsHTML = toolsArray.length > 0 
        ? toolsArray.map(tool => `<div class="tool-tag">${tool.trim()}</div>`).join('')
        : '<div class="tool-tag">No tools specified</div>';
    
    card.innerHTML = `
        <div class="entry-header">
            <div class="entry-date">${displayDate}</div>
        </div>
        
        <h3 class="entry-title">${entry.topic}</h3>
        ${entry.query ? `<div class="entry-query">Query: ${entry.query}</div>` : ''}
        
        <div class="entry-section">
            <div class="entry-section-label">Learning Details</div>
            <div class="entry-section-content">${entry.details.replace(/\n/g, '<br>')}</div>
        </div>
        
        ${entry.importantPoints ? `
        <div class="entry-section">
            <div class="entry-section-label">Important Points</div>
            <div class="entry-section-content">${entry.importantPoints.replace(/\n/g, '<br>')}</div>
        </div>
        ` : ''}
        
        <div class="entry-section">
            <div class="entry-section-label">Tools / Software Used</div>
            <div class="entry-tools">${toolsHTML}</div>
        </div>
        
        <div class="entry-actions">
            <button class="btn btn-edit btn-sm" onclick="editEntry(${entry.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEntry(${entry.id})">Delete</button>
        </div>
    `;
    
    return card;
}

// ========================================
// 7. STATISTICS
// ========================================

// Update statistics display
function updateStatistics() {
    const total = appState.entries.length;
    document.getElementById('totalEntries').textContent = total;
}

// ========================================
// 8. RUN APPLICATION
// ========================================

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
