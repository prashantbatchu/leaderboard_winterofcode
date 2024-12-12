
# Leaderboard Project
# Welcome to the **Leaderboard Repository**! 🚀

This project showcases a leaderboard where user scores are displayed dynamically in a table. It is designed to be interactive and collaborative, allowing users to search, filter, and navigate through the data. The project uses a simple tech stack and is easily extendable.

---
## The page is also live and you can visit it [here](https://leaderboard-winterofcode.vercel.app/)
![image](https://github.com/user-attachments/assets/13262ea1-a9f6-4951-81ad-94da7f318d03)
## **Tech Stack**

1. **HTML**: For the structure and layout of the web application.
2. **CSS**: For styling the page, ensuring responsiveness and visual appeal.
3. **JavaScript**: For dynamic functionality such as fetching data, filtering, pagination, and caching.
4. **Google Apps Script Web API**: Used as the backend to fetch leaderboard data.
5. **LocalStorage**: For caching data locally to reduce API calls and improve performance.

---

## **Features**

- **Dynamic Leaderboard**: Data is fetched dynamically from an external API.
- **Search Functionality**: Users can search for names in the leaderboard using a search bar.
- **Pagination**:

  - Data is divided into pages for easy navigation.
  - **Implementation Proof**:
    - **Variables for Pagination**:
      ```javascript
      let currentPage = 1;
      const rowsPerPage = 10;
      ```
      These variables define the current page and the number of rows displayed per page.
    - **Function to Change Pages**:
      ```javascript
      function changePage(direction) {
          currentPage += direction;
          displayTable();
      }
      ```
      This function increments or decrements the `currentPage` variable and re-displays the table content accordingly.
    - **Logic in `displayTable` Function**:
      ```javascript
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const dataToDisplay = leaderboardData.slice(startIndex, endIndex);
      ```
      This ensures that only a specific chunk of data corresponding to the current page is displayed in the table.

- **Data Caching**:

  - Leaderboard data is cached for 5 minutes to improve performance.
  - **Implementation Proof**:
    - **Cache Retrieval**:
      ```javascript
      const cachedData = JSON.parse(localStorage.getItem('leaderboardData'));
      const cachedTimestamp = localStorage.getItem('leaderboardTimestamp');
      ```
      Cached data and its timestamp are fetched from `localStorage`.
    - **Cache Validation**:
      ```javascript
      if (cachedData && cachedTimestamp && now - cachedTimestamp < 300000) {
          console.log('Using cached data');
          leaderboardData = cachedData;
      }
      ```
      The cache is considered valid if it exists and is less than 5 minutes (300,000 ms) old.
    - **Saving to Cache**:
      ```javascript
      localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
      localStorage.setItem('leaderboardTimestamp', Date.now());
      ```
      Data is saved to `localStorage` along with the current timestamp for future use.

- **Responsive Design**: The UI is responsive and works well on different screen sizes.

---

## **File Structure**

### `index.html`

- Contains the structure of the page, including the table and search bar.
- Links to external styles (`style.css`) and scripts (`script.js`).

### `style.css`

- Styles the page for a modern and responsive look.
- Defines table and pagination button styles.
- Includes media queries for mobile responsiveness.

### `script.js`

- Implements functionality for:
  - Fetching leaderboard data from the API.
  - Caching data using LocalStorage.
  - Searching and filtering the table.
  - Pagination logic.

---

## **Setup and Usage**

### **Prerequisites**

- A modern browser that supports ES6 JavaScript.
- Internet connection for fetching data from the API.

### **Steps to Run Locally**

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd leaderboard-project
   ```

3. Open `index.html` in your browser.

4. The leaderboard will load dynamically. Use the search bar to filter by name and navigate using the pagination buttons.

### **Deployment**

You can deploy the project on any static hosting service like GitHub Pages, Netlify, or Vercel.

---

## **API Integration**

The leaderboard data is fetched from the following API:

```
https://script.google.com/macros/s/AKfycbx2_dsVB0Z1dX8l_m7VGy_8VB0qFts5PlWbx_mZwD6jxaq-hdxxBDvK_dKwzIqJt8LgEQ/exec
```

- The API returns an array of data where each row contains:
  - `Name`: The name of the individual.
  - `Year`: The year of participation.
  - `Easy`, `Medium`, `Hard`: Scores in respective categories.
  - `Total`: Total score.

---

## 💡 How to Contribute

We encourage everyone to contribute to this project by resolving issues or adding new features. Here's how you can get started:

### 1. Check the Issues Tab
   - Navigate to the [**Issues tab**](../../issues).
   - Look for any open issue that interests you.
   - Read the description and comments to understand what needs to be done.

### 2. Fork the Repository
   - Click the **Fork** button at the top-right corner of this repository to create your own copy.


### 3. Make Your Changes in the forked repo
   - Resolve the issue or add your feature. Follow best practices and maintain code formatting.
   - Test your changes to ensure everything works as expected.

### 4. Open a Pull Request
   - Go to your forked repository on GitHub.
   - Click the **Compare & pull request** button.
   - Write a brief description of the changes you made.
   - Make sure you include *Fixes #issue_number* or *Closed #issue_number* (Example- If you resolved *#3 issue*, then add *Fixes #3*) 
   - Submit your pull request!

---

## 🛠 Guidelines for Contributors
- Follow the existing coding style and conventions.
- Be respectful in your interactions.
- Provide clear and concise commit messages.
- Test your code before submitting a pull request.
- Earn points :)

---
## **Contributing**

We welcome contributions to improve the project! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## 📜 **License**

This project is open source and available under the [MIT License](LICENSE).

---

## ⭐ **Acknowledgments**

- Thanks to [Google Apps Script](https://developers.google.com/apps-script/) for providing easy API integration.
- Thank you for taking the time to contribute! Every contribution, no matter how small, helps improve this project. If you have any questions, feel free to open a new issue or reach out to the maintainers.

---

Feel free to open issues or reach out if you have any questions or feedback!
```

