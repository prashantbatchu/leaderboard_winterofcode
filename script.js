let leaderboardData = []; 
let originalData = []; 
let currentPage = 1; 
const rowsPerPage = 10;
let previousData = []; 

async function fetchLeaderboardData() {
  try {
    const cachedData = JSON.parse(localStorage.getItem('leaderboardData'));
    const cachedTimestamp = localStorage.getItem('leaderboardTimestamp');

    const now = Date.now();
    if (cachedData && cachedTimestamp && now - cachedTimestamp < 300000) {
      console.log('Using cached data');
      leaderboardData = cachedData;
      originalData = [...leaderboardData]; // Save a copy of the original data
      displayTable();
      return;
    }

    const response = await fetch('https://script.google.com/macros/s/AKfycbx2_dsVB0Z1dX8l_m7VGy_8VB0qFts5PlWbx_mZwD6jxaq-hdxxBDvK_dKwzIqJt8LgEQ/exec'); // Replace with your URL
    leaderboardData = await response.json();
    originalData = [...leaderboardData]; 

    displayTable();

    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
    localStorage.setItem('leaderboardTimestamp', Date.now());

    previousData = leaderboardData; 
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);

    // Use previous or cached data on error
    if (previousData.length > 0) {
      console.warn('Using fallback data');
      leaderboardData = previousData;
      originalData = [...leaderboardData]; 
      displayTable();
    } else {
      console.warn('Using cached data as fallback');
      const cachedData = JSON.parse(localStorage.getItem('leaderboardData'));
      if (cachedData) {
        leaderboardData = cachedData;
        originalData = [...leaderboardData]; 
        displayTable();
      }
    }
  }
}

function displayTable() {
  const tableBody = document.getElementById('leaderboard').querySelector('tbody');
  tableBody.innerHTML = ''; 

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const dataToDisplay = leaderboardData.slice(startIndex, endIndex);

  dataToDisplay.forEach((row, index) => {
    // Skip the first row (index 0)
    if (index === 0) return;
  
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
    `;
    tableBody.appendChild(tr);
  });
  
  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage * rowsPerPage >= leaderboardData.length;
}

function changePage(direction) {
  currentPage += direction;
  displayTable();
}

function filterTable() {
  const searchValue = document.getElementById('search-bar').value.toLowerCase();

  if (searchValue === '') {
    leaderboardData = [...originalData]; // rreset to original data
  } else {
    leaderboardData = originalData.filter(row => row[0].toLowerCase().includes(searchValue)); // Filter by name
  }

  currentPage = 1; // Reset to the first pagee
  displayTable(); // Display filtered or resett data
}

fetchLeaderboardData();

setInterval(fetchLeaderboardData, 300000);
