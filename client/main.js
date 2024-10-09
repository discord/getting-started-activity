import './style.css'
import platoFoto from '/plato.png'

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

        // Pick 3 random non-quotes from nonquoted.txt
        const randomNonQuotes = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * nonQuotedLines.length);
            randomNonQuotes.push(nonQuotedLines[randomIndex]);
        }

        // Display the random quote and non-quotes in the HTML
        document.querySelector('#app').innerHTML = `
      <div>
        <img src="${platoFoto}" class="logo" alt="Plato" />
        <h2>"${randomQuote.quote}"</h2>
        <p><button>${randomQuote.nonQuote}</button></p>
         ${randomNonQuotes.map(nonQuote => `<p><button>${nonQuote}</button></p>`).join('')}
      </div>
    `;
    } catch (error) {
        console.error('Error fetching or processing the files:', error);
    }
}

// Call the function to fetch and display a random quote and non-quotes
fetchQuotes();
