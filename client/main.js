import './style.css';

let currentQuote = null;
let startTime = Date.now();

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
        console.error('Error fetching quotes: ', error);
    }
}

async function updateStartTime() {
    try {
        // Make the request to the server
        const response = await fetch('http://localhost:3001/start_time');

        const data = await response.json();
        startTime = data;
    } catch (error) {
        console.error('Error getting time: ', error);
    }
}

function updateTime() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = 10000 - elapsedTime;
    const percentage = Math.max(0, (remainingTime / 10000) * 100);
    document.getElementById('slider').value = percentage;
}

// Function to fetch and parse the output.ini file
async function mainLoop() {
    const [randomQuote, allOptions] = await getRandomQuotes();
    if (currentQuote != null && randomQuote.quote === currentQuote.quote) {
        return;
    }
    await updateStartTime();
    currentQuote = randomQuote;

    let correctIndex = -1;
    let selectedIndex = -1;
    for (let i = 0; i < allOptions.length; i++) {
        if (allOptions[i] === randomQuote.nonQuote) {
            correctIndex = i;
            break;
        }
    }
    // Display the random quote and non-quotes in the HTML
    document.querySelector('#app').innerHTML = `
        <h2>"${randomQuote.quote}"</h2>
        <ul id="options">
            ${allOptions.map((option, index) => `<li><button id="option-${index}">${option}</button></li>`).join('')}
        </ul>
    `;

    document.querySelectorAll('#options button').forEach((button, index) => {
    button.addEventListener('click', function () {
        selectedIndex = index;
        document.querySelectorAll('#options button').forEach(btn => btn.style.backgroundColor = '');
        this.style.backgroundColor = '#555555';
    });

    function displayAnswerFeedback() {
    document.querySelectorAll('#options button').forEach((button, index) => {
        // Always highlight the correct answer in green
        if (index === correctIndex) {
            button.style.backgroundColor = 'green';
        }
        // If selected index is incorrect, highlight it in red
        else if (index === selectedIndex) {
            button.style.backgroundColor = 'red';
        }

        // Disable all buttons after feedback is shown
        button.disabled = true;
    });

    setTimeout(displayAnswerFeedback, 10000);
}
});

    // Add event listeners to the buttons for guessing
    document.querySelectorAll('#options button').forEach(button => {
        button.addEventListener('click', function() {
            const isCorrect = this.getAttribute('id') === "option-" + correctIndex;

            // Disable all buttons after selection
            document.querySelectorAll('#options button').forEach(btn => {
                btn.disabled = true;  // Disable all buttons after the user clicks one
                if (!isCorrect && this == btn) {
                    setTimeout(function(){
                        btn.style.backgroundColor = 'red';  // Highlight the correct answer in green
                    }, startTime + 10000 - Date.now());
                } else {
                    setTimeout(function(){
                        if (btn.getAttribute('id') === "option-" + correctIndex) {
                            btn.style.backgroundColor = 'green';  // Highlight the correct answer in green
                        }
                    }, startTime + 10000 - Date.now());
                }
            });

            // Highlight the clicked button
            this.style.backgroundColor = '#555555';
        });
    });
}

// Call the function to fetch and display a random quote and non-quotes
setInterval(mainLoop, 1000);
setInterval(updateTime, 10);
