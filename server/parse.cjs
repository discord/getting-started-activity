const fs = require('fs');
const readline = require('readline');

// Function to remove punctuation from a string
function removePunctuation(str) {
    return str.replace(/[:\-~]/g, '').trim();
}

// Function to process the .ini file
function processIniFile(inputFile, outputFile, authorFile) {
    const readStream = fs.createReadStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);

    const authorFrequency = new Map();

    const rl = readline.createInterface({
        input: readStream,
        output: writeStream,
        terminal: false
    });

    rl.on('line', (line) => {
        line = line.replace(/[“”]/g, '"');
        const quoteMatch = line.match(/"(.*?)"/); // Match text within quotes
        if (quoteMatch) {
            const quotedText = quoteMatch[0]; // Full quoted string
            const nonQuotedText = line.replace(quotedText, ''); // Non-quoted part of the line
            // Remove punctuation from non-quoted text
            const author = removePunctuation(nonQuotedText).trim().toLowerCase();
            // If non-quoted text exists, proceed to modify the line
            if (author && !author.includes('"')) {
                // Write the modified line to output.ini regardless of duplicates in non-quoted parts
                let modifiedLine = `[${author}] ${quotedText.trim()}`;
                writeStream.write(modifiedLine + '\n'); // Write modified line to output file
                if (authorFrequency.has(author)){
                    authorFrequency.set(author, authorFrequency.get(author) + 1);
                } else {
                    authorFrequency.set(author, 1);
                }
            }
        }
    });

    rl.on('close', () => {
        // Write unique non-quoted text to a separate file once processing is done
        const authorStream = fs.createWriteStream(authorFile);

        //const authors = Array.from(authorFrequency)
        const authors = Array.from(authorFrequency.keys());

        authors.forEach(author => {
            for (let i = 0; i < Math.sqrt(authorFrequency.get(author)); i++) {
                authorStream.write(author + '\n');
            }
        });

        console.log('Processing complete.');
    });
}

// Provide input and output file paths
const inputFile = 'quotes.ini';        // Your .ini file
const outputFile = 'parsed-quotes.ini';      // Output file with modified lines
const authorFile = 'nonquoted.txt'; // File with just the non-quoted parts

// Call the function
processIniFile(inputFile, outputFile, authorFile);