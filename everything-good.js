const fs = require('fs');
const path = require('path');

// Function to list all files in a directory
function listFilesInDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

// Function to read package.json and extract snippets paths
function readPackageJson(packageJsonPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(packageJsonPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const snippetsConfig = JSON.parse(data);
                if (snippetsConfig && snippetsConfig.contributes && snippetsConfig.contributes.snippets) {
                    const snippetFiles = snippetsConfig.contributes.snippets.map(element => stripSnippetsPrefix(element.path));
                    resolve(snippetFiles);
                } else {
                    reject(new Error('Invalid package.json format: missing contributes.snippets'));
                }
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

// Function to strip './snippets/' prefix
function stripSnippetsPrefix(filePath) {
    return filePath.replace('./snippets/', '');
}

// Example usage:
const directoryPath = './snippets';
const packageJsonPath = './package.json';

Promise.all([
    listFilesInDirectory(directoryPath),
    readPackageJson(packageJsonPath)
])
    .then(([files, snippetFiles]) => {
        const missingFiles = files.filter(file => !snippetFiles.includes(file));

        if (missingFiles.length > 0) {
            console.log('Files missing in package.json, please add them before loading:', missingFiles);
        } else {
            console.log('All files listed in package.json are present in the directory.');
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });
