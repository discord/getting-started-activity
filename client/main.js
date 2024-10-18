import './style.css';
import platoFoto from '/plato.png';

async function getAllQuotes() {
    try {
        // Make the request to the server
        const response = await fetch('http://localhost:3001/all_quotes');

        const data = await response.json();

        // Access the first array from the response
        const quotes = data[0];  // First part contains the quotes
        const authors = data[1];   // Second part contains the names

        if (!Array.isArray(quotes) || !Array.isArray(authors)) {
            throw new TypeError('Expected arrays in the response.');
        }

        return [quotes, authors];
    } catch (error) {
        document.querySelector('#app').innerHTML = `<p>Connection to server lost :(</p>`;
        console.error('Error fetching quotes:', error);
    }
}

async function getRandomQuotes() {
    try {
        // Make the request to the server
        const response = await fetch('http://localhost:3001/random_quotes');

        const data = await response.json();

        // Access the first array from the response
        const randomQuote = data[0];  // First part contains the quotes
        const allOptions = data[1];   // Second part contains the names

        return [randomQuote, allOptions];
    } catch (error) {
        document.querySelector('#app').innerHTML = `<p>Connection to server lost :(</p>`;
        console.error('Error fetching quotes:', error);
    }
}

// Function to fetch and parse the output.ini file
async function fetchQuotes() {
    const [randomQuote, allOptions] = await getRandomQuotes();

    // Display the random quote and non-quotes in the HTML
    document.querySelector('#app').innerHTML = `
        <div>
        <img src="${platoFoto}" class="logo" alt="Plato" />
        <h2>"${randomQuote.quote}"</h2>
        <ul id="options">
            ${allOptions.map((option, index) => `<li><button data-answer="${option === randomQuote.nonQuote}" id="option-${index}">${option}</button></li>`).join('')}
        </ul>
        <br>
        <small><button id="nextQuestion" style="color:#424242">Volgende</button></small>
        </div>
    `;

    // Add event listeners to the buttons for guessing
    document.querySelectorAll('#options button').forEach(button => {
        button.addEventListener('click', function() {
            const isCorrect = this.getAttribute('data-answer') === 'true';

            // Disable all buttons after selection
            document.querySelectorAll('#options button').forEach(btn => {
                btn.disabled = true;  // Disable all buttons after the user clicks one
                if (btn.getAttribute('data-answer') === 'true') {
                    btn.style.backgroundColor = 'green';  // Highlight the correct answer in green
                }
            });

            // Highlight the clicked button
            if (!isCorrect) {
                this.style.backgroundColor = 'red';  // Highlight the wrong answer in red
            }

            document.querySelector('#nextQuestion').style.color = '#FFFFFF';

        });
    });
    // Add event listener for the Next Question button
    document.querySelector('#nextQuestion').addEventListener('click', function() {
        fetchQuotes();  // Fetch a new question
    });

}

// Call the function to fetch and display a random quote and non-quotes
fetchQuotes();
