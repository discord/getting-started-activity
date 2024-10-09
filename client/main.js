import './style.css';
import platoFoto from '/plato.png';

// Function to fetch and parse the output.ini file
async function fetchQuotes() {
    try {
        // Fetch both the output.ini and nonquoted.txt files
        const [outputResponse, nonQuotedResponse] = await Promise.all([
            fetch('/parsed-quotes.ini'),    // Path to output.ini
            fetch('/nonquoted.txt')  // Path to nonquoted.txt
        ]);

        const outputData = await outputResponse.text();
        const nonQuotedData = await nonQuotedResponse.text();

        // Split the files into lines
        const outputLines = outputData.split('\n').filter(line => line.trim() !== '');
        const nonQuotedLines = nonQuotedData.split('\n').filter(line => line.trim() !== '');

        // Extract non-quoted and quoted parts from output.ini
        const quotesArray = outputLines.map(line => {
            const nonQuoteMatch = line.match(/\[(.*?)\]/); // Match text inside square brackets
            const quoteMatch = line.match(/"(.*?)"/); // Match text inside quotes

            if (nonQuoteMatch && quoteMatch) {
                return {
                    nonQuote: nonQuoteMatch[1],
                    quote: quoteMatch[1]
                };
            }
            return null;
        }).filter(item => item !== null); // Filter out null values

        // Pick a random quote and non-quote combination from output.ini
        const randomQuoteIndex = Math.floor(Math.random() * quotesArray.length);
        const randomQuote = quotesArray[randomQuoteIndex];

        // Pick 3 random incorrect non-quotes from nonquoted.txt
        const incorrectNonQuotes = [];
        while (incorrectNonQuotes.length < 3) {
            const randomIndex = Math.floor(Math.random() * nonQuotedLines.length);
            const nonQuote = nonQuotedLines[randomIndex];

            // Ensure the incorrect non-quote isn't the correct one and isn't already selected
            if (nonQuote !== randomQuote.nonQuote && !incorrectNonQuotes.includes(nonQuote)) {
                incorrectNonQuotes.push(nonQuote);
            }
        }

        // Combine the correct non-quote with the incorrect ones
        const allOptions = [...incorrectNonQuotes];

        // Insert the correct answer at a random position
        const randomPosition = Math.floor(Math.random() * (incorrectNonQuotes.length + 1));
        allOptions.splice(randomPosition, 0, randomQuote.nonQuote);

        // Display the random quote and non-quotes in the HTML
        document.querySelector('#app').innerHTML = `
      <div>
        <img src="${platoFoto}" class="logo" alt="Plato" />
        <h2>"${randomQuote.quote}"</h2>
        <ul id="options">
          ${allOptions.map((option, index) => `<p><button data-answer="${option === randomQuote.nonQuote}" id="option-${index}">${option}</button></p>`).join('')}
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

    } catch (error) {
        console.error('Error fetching or processing the files:', error);
    }
}

// Call the function to fetch and display a random quote and non-quotes
fetchQuotes();
