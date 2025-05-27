import * as fs from 'fs';
import * as path from 'path';

// Import client metadata (assuming client-metadata.ts exports an object)
import clientMetadata from '@/build/client-metadata';

// Define the output path
const outputFilePath = process.cwd() + '/dist/client-metadata.json';

// Make sure the dist directory exists
fs.mkdir(path.dirname(outputFilePath), { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating dist directory:', err);
    return;
  }

  // Write the JSON to a file
  fs.writeFile(outputFilePath, JSON.stringify(clientMetadata, null, 2), (err) => {
    if (err) {
      console.error('Error writing metadata to JSON file:', err);
    } else {
      console.log(
        'Metadata successfully written to client-metadata.json',
        path.dirname(outputFilePath)
      );
    }
  });
});
