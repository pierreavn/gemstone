var WebContainer;

/**
 * Invoke and boot a new WebContainer to build theme
 * @param {*} version Theme version (tag) to use (if not provided, latest is used)
 */
const invokeContainer = async (version = null) => {
    console.log(`-- Invoking WebContainer for version ${version ?? 'master'}:`);
    console.log('Downloading repository archive...');
    const repositoryRef = version ? `tags/${version}.zip` : `heads/master.zip`;
    const content = await Promise.all([
        fetch('assets/js/unzip.cjs')
            .then((r) => r.text()),
        fetch(`https://${GEMSTONE_CDN}/archive/refs/${repositoryRef}`)
            .then((r) => r.arrayBuffer()),
    ]);

    console.log('Booting WebContainer...');
    const webContainer = await WebContainer.boot();

    console.log('Loading files tree...');
    const tree = {
        'unzip.cjs': {
            file: { contents: content[0] },
        },
        'archive.zip': {
            file: { contents: new Uint8Array(content[1]) },
        },
    };
    await webContainer.loadFiles(tree);

    // Unzip Archive
    // Warning: In this modified unzip.cjs version,
    // all files should be in a single parent directory inside archive
    console.log('Unzipping repository archive...');
    await run(webContainer, "node", ["unzip.cjs"]);

    // Install NPM Dependencies
    console.log('Installing dependencies...');
    await run(webContainer, "npm", ["install"]);

    console.log(`WebContainer invoked for ${version ?? 'latest version'}!`);
    return webContainer;
}

/**
 * Run command inside given webContainer
 * @param {*} webContainer 
 * @param {*} cmd 
 * @param {*} args 
 */
const run = async (webContainer, cmd, args = []) => {
    const result = await webContainer.run(
      {
        command: cmd,
        args
      },
      {
        output: (data) => console.log(data),
        stderr: (data) => console.error(data),
      });

    if (await result.onExit !== 0) {
        throw new Error('Failed to run command');
    }
}

/**
 * Build theme with given config into webContainer
 * @param {*} webContainer 
 * @param {*} config 
 */
const buildTheme = async (webContainer, config) => {
    // Write config file
    console.log('Writing config file...');
    const tree = {
        'src': {
            directory: {
                'config.json': {
                    file: { contents: JSON.stringify(config, null, 2) }
                }
            }
        }
    };
    await webContainer.loadFiles(tree);

    // Build theme
    console.log('Building theme...');
    await run(webContainer, "npm", ["run", "build"]);

    // Fetch Archive (Uint8Array)
    console.log('Fetching archive...');
    const themeArchive = await webContainer.fs.readFile('dist/gemstone.zip');

    // Download Archive
    console.log('Downloading archive...');
    downloadBlob(themeArchive, `gemstone_${config.targetVersion}.zip`, "application/zip");
}

/**
 * Download file from blob data
 * @param {*} data 
 * @param {*} fileName 
 * @param {*} mimeType 
 */
const downloadBlob = (data, fileName, mimeType) => {
    var blob, url;
    blob = new Blob([data], {
      type: mimeType
    });
    url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(function() {
      return window.URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * Download file from URL
 * @param {*} data 
 * @param {*} fileName 
 */
const downloadURL = (data, fileName) => {
    var a;
    a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
}
