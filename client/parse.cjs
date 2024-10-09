const fs = require('fs');
const readline = require('readline');

// Function to remove punctuation from a string
function removePunctuation(str) {
    return str.replace(/[:\-~]/g, '').trim();
}

// Function to process the .ini file
function processIniFile(inputFile, outputFile, nonQuotedFile) {
    const readStream = fs.createReadStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);

    const uniqueNonQuoted = new Set();  // Set to store unique non-quoted parts for nonquoted.txt

    const rl = readline.createInterface({
        input: readStream,
        output: writeStream,
        terminal: false
    });

    rl.on('line', (line) => {
        const quoteMatch = line.match(/"(.*?)"/); // Match text within quotes
        if (quoteMatch) {
            const quotedText = quoteMatch[0]; // Full quoted string
            const nonQuotedText = line.replace(quotedText, ''); // Non-quoted part of the line

            // Remove punctuation from non-quoted text
            const cleanedNonQuotedText = removePunctuation(nonQuotedText).trim();

            // If non-quoted text exists, proceed to modify the line
            if (cleanedNonQuotedText) {
                // Write the modified line to output.ini regardless of duplicates in non-quoted parts
                let modifiedLine = `[${cleanedNonQuotedText}] ${quotedText.trim()}`;
                writeStream.write(modifiedLine + '\n'); // Write modified line to output file

                // Handle duplicates only for nonquoted.txt
                const lowerCaseNonQuoted = cleanedNonQuotedText.toLowerCase(); // Normalize case
                if (!uniqueNonQuoted.has(lowerCaseNonQuoted)) {
                    uniqueNonQuoted.add(lowerCaseNonQuoted); // Add only unique non-quoted text
                }
            }
        }
    });

    rl.on('close', () => {
        // Write unique non-quoted text to a separate file once processing is done
        const nonQuotedStream = fs.createWriteStream(nonQuotedFile);
        uniqueNonQuoted.forEach(nonQuoted => {
            nonQuotedStream.write(nonQuoted + '\n');
        });

        console.log('Processing complete.');
    });
}

// Provide input and output file paths
const inputFile = 'quotes.ini';        // Your .ini file
const outputFile = 'parsed-quotes.ini';      // Output file with modified lines
const nonQuotedFile = 'nonquoted.txt'; // File with just the non-quoted parts

// Call the function
processIniFile(inputFile, outputFile, nonQuotedFile);