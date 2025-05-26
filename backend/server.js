const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

console.log('__dirname:', __dirname);
console.log('process.cwd():', process.cwd());

const app = express();
const port = 3001; // Using a different port for the backend API

// Middleware
app.use(cors()); // Enable CORS for development
app.use(bodyParser.json()); // Parse JSON request bodies

// Define the path to your Word templates
const template1Path = path.join(__dirname, 'form-template1.docx');
const template2Path = path.join(__dirname, 'form-template2.docx');

// Ensure the template files exist
if (!fs.existsSync(template1Path)) {
    console.error(`Error: form-template1.docx not found at ${template1Path}`);
    console.error('Please ensure form-template1.docx is in the same directory as server.js.');
    process.exit(1); // Exit if template is missing
}
if (!fs.existsSync(template2Path)) {
    console.error(`Error: form-template2.docx not found at ${template2Path}`);
    console.error('Please ensure form-template2.docx is in the same directory as server.js.');
    process.exit(1); // Exit if template is missing
}

// API endpoint to generate document
app.post('/generate-document', async (req, res) => {
    try {
        const data = req.body; // Data from the frontend form
        const selectedTemplate = data.template || '1';

        // Choose template path based on selection
        let templatePath;
        if (selectedTemplate === '1') {
            templatePath = template1Path;
        } else if (selectedTemplate === '2') {
            templatePath = template2Path;
        } else {
            // Default to template1 if invalid selection
            templatePath = template1Path;
        }

        // Read the template file
        const content = fs.readFileSync(templatePath, 'binary');

        // Create a new PizZip instance with the template content
        const zip = new PizZip(content);

        // Create a new Docxtemplater instance with custom delimiters
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true, // Allow looping over paragraphs
            linebreaks: true,    // Preserve line breaks
            delimiters: { start: '(', end: ')' } // Use () as delimiters
        });

        let generatedDocBuffer;

        try {
            // Render the document directly with data
            doc.render(data); // Passing data directly to render

            // Get the generated document as a buffer
            generatedDocBuffer = doc.getZip().generate({
                type: 'nodebuffer',
                compression: 'DEFLATE',
            });

            console.log('Generated DOCX Buffer Length:', generatedDocBuffer.length);

            if (generatedDocBuffer.length === 0) {
                throw new Error('Docxtemplater generated an empty document buffer. This often indicates an issue with the template structure or placeholders.');
            }

            // --- IMPORTANT DEBUGGING STEP ---
            // Save the generated buffer to a temporary file for inspection
            const tempOutputPath = path.join(__dirname, 'temp_generated.docx');
            fs.writeFileSync(tempOutputPath, generatedDocBuffer);
            console.log(`Temporary generated DOCX saved to: ${tempOutputPath}`);
            // --- END DEBUGGING STEP ---

            // Set headers for file download
            res.setHeader('Content-Disposition', 'attachment; filename=generated-document.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(generatedDocBuffer); // Send the DOCX buffer as the response

        } catch (renderOrGenerateError) {
            console.error('Docxtemplater processing error:', renderOrGenerateError);
            if (renderOrGenerateError.properties && renderOrGenerateError.properties.errors) {
                console.error('Docxtemplater detailed errors:', renderOrGenerateError.properties.errors);
            }
            throw new Error('Failed to process document template: ' + renderOrGenerateError.message);
        }

    } catch (error) {
        console.error('Overall Error generating document:', error);
        res.status(500).json({ error: 'Failed to generate document', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
