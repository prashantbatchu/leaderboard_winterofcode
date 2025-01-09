let leaderboardData = [];
let originalData = [];
let previousData = [];
let currentPage = 1;
let rowsPerPage = 10;

// Show the loading bar and reset its state
function showLoadingBar() {
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingMessage = document.getElementById('loading-message');

    loadingBar.style.width = '0%'; // Reset width
    loadingPercentage.innerText = '0%'; // Reset percentage
    loadingBarContainer.style.display = 'block';
    loadingMessage.style.display = 'block';
}

// Update the loading bar's progress
function updateLoadingBar(percentage) {
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercentage = document.getElementById('loading-percentage');

    loadingBar.style.width = `${percentage}%`;
    loadingPercentage.innerText = `${percentage}%`;
}

// Hide the loading bar when done
function hideLoadingBar() {
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingMessage = document.getElementById('loading-message');
    loadingBarContainer.style.display = 'none';
    loadingMessage.style.display = 'none';
}

// Fetch leaderboard data and handle caching
async function fetchLeaderboardData(startIndex = 1) {
    showLoadingBar(); 

    try {
        const cachedData = JSON.parse(localStorage.getItem('leaderboardData'));
        const cachedTimestamp = localStorage.getItem('leaderboardTimestamp');
        const now = Date.now();

        // Use cached data if within 5 minutes
        if (cachedData && cachedTimestamp && now - cachedTimestamp < 300000) {
            console.log('Using cached data');
            leaderboardData = cachedData.slice(startIndex); 
            originalData = [...leaderboardData];
            previousData = leaderboardData;

            updateLoadingBar(100);
            hideLoadingBar();

            displayTable();
            return;
        }

        // Fetch new data
        const response = await fetch('https://script.google.com/macros/s/AKfycbx2_dsVB0Z1dX8l_m7VGy_8VB0qFts5PlWbx_mZwD6jxaq-hdxxBDvK_dKwzIqJt8LgEQ/exec');
        const rawData = await response.json();

        leaderboardData = rawData.slice(startIndex);

        const totalRows = leaderboardData.length;
        const chunkSize = Math.ceil(totalRows / 10);

        for (let i = 0; i < totalRows; i += chunkSize) {
            await new Promise((resolve) => setTimeout(resolve, 50));

            const percentage = Math.min(((i + chunkSize) / totalRows) * 100, 100);
            updateLoadingBar(Math.floor(percentage));
        }

        originalData = [...leaderboardData];
        previousData = leaderboardData;

        displayTable();
        localStorage.setItem('leaderboardData', JSON.stringify(rawData)); 
        localStorage.setItem('leaderboardTimestamp', Date.now());
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);

        if (previousData.length > 0) {
            console.warn('Using fallback data');
            leaderboardData = previousData.slice(startIndex);
            originalData = [...leaderboardData];
            displayTable();
        } else {
            console.warn('Using cached data as fallback');
            const fallbackData = JSON.parse(localStorage.getItem('leaderboardData'));
            if (fallbackData) {
                leaderboardData = fallbackData.slice(startIndex);
                originalData = [...leaderboardData];
                displayTable();
            }
        }
    } finally {
        // Hide the loading bar
        hideLoadingBar();
    }
}


// Display table content
function displayTable() {
    const tableBody = document.getElementById('leaderboard')?.querySelector('tbody');
    if (!tableBody) {
        console.error("Table body not found. Ensure your HTML structure is correct.");
        return;
    }

    tableBody.innerHTML = ''; 

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataToDisplay = leaderboardData.slice(startIndex, endIndex);

    dataToDisplay.forEach((row, index) => {
        // if (row[0]?.toLowerCase() === 'name') return;
        const serialNumber = startIndex + index + 1; 
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${serialNumber}</td> 
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
        `;
        tableBody.appendChild(tr);
    });

    updatePagination();
}

// Pagination controls
function changePage(direction) {
    currentPage += direction;
    displayTable();
}

function goToFirstPage() {
    currentPage = 1;
    displayTable();
}

function goToLastPage() {
    currentPage = Math.ceil(leaderboardData.length / rowsPerPage);
    displayTable();
}

function updateRowsPerPage() {
    rowsPerPage = parseInt(document.getElementById('entries-per-page')?.value || '10');
    currentPage = 1;
    displayTable();
}

function filterTable() {
    const searchValue = document.getElementById('search-bar')?.value.toLowerCase();

    if (!searchValue) {
        leaderboardData = [...originalData];
    } else {
        leaderboardData = originalData.filter(row =>
            row.some(cell => cell.toString().toLowerCase().includes(searchValue))
        );
    }

    currentPage = 1;
    displayTable();
}

// Add page numbers for navigation
function updatePagination() {
    const totalPages = Math.ceil(leaderboardData.length / rowsPerPage);
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const firstBtn = document.getElementById('first-btn');
    const lastBtn = document.getElementById('last-btn');
    const pageInfo = document.getElementById('page-info');
    const totalEntries = document.getElementById('total-entries');

    if (!pageNumbersContainer) {
        console.error("Pagination container not found. Ensure your HTML structure is correct.");
        return;
    }

    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('page-btn');
        if (i === currentPage) {
            pageButton.disabled = true;
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => {
            currentPage = i;
            displayTable();
        };
        pageNumbersContainer.appendChild(pageButton);
    }

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (firstBtn) firstBtn.disabled = currentPage === 1;
    if (lastBtn) lastBtn.disabled = currentPage === totalPages;

    if (pageInfo) pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    if (totalEntries) totalEntries.innerText = `Total Entries: ${leaderboardData.length}`;
}

fetchLeaderboardData();
setInterval(fetchLeaderboardData, 300000);

function sortLeaderboardByColumn5Descending() {
    leaderboardData.sort((a, b) => {
        const valueA = parseFloat(a[5]) || 0; 
        const valueB = parseFloat(b[5]) || 0; 
        return valueB - valueA; 
    });

    currentPage = 1;
    displayTable();
}


function sortLeaderboardByColumn5Ascending() {
    leaderboardData.sort((a, b) => {
        const valueA = parseFloat(a[5]) || 0; 
        const valueB = parseFloat(b[5]) || 0; 
        return valueA - valueB; 
    });

    currentPage = 1; 
    displayTable();
}
