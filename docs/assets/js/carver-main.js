var webContainer = null;
var config = null;

const btnSubmit = document.getElementById('btn-submit');

// Parse target version
const urlParams = new URLSearchParams(window.location.search);
var targetVersion = urlParams.get('version');

/**
 * Get list of available versions
 * @param {*} afterVersion Version after to fetch
 */
const listVersions = async (pages = 5, afterVersion = null) => {
    const response = await fetch(`https://${GEMSTONE_CDN}/tags.html${afterVersion ? `?after=${afterVersion}` : ''}`);
    const data = await response.text();

    const regexp = new RegExp(`href="\\/${GEMSTONE_REPO_OWNER}\\/${GEMSTONE_REPO_NAME}\\/releases\\/tag\\/(\\d+\\.\\d+\\.\\d+)"`, "g");
    const versions = [...data.matchAll(regexp)].map(match => match[1]);

    let previousVersions = [];
    if (versions.length >= 10 && pages > 1) {
        previousVersions = await listVersions(pages - 1, versions[versions.length - 1]);
    }

    return [...versions, ...previousVersions];
}

/**
 * Submit form and generate config
 */
const submit = () => {
    try {
        btnSubmit.classList.add("btn-loading");
        btnSubmit.disabled = true;

        config = generateConfig(targetVersion);
        console.log('Configuration:', config);

        if (webContainer) {
            buildAndDownload();
        }
    } catch (err) {
        onError(err);
    }
}

/**
 * Build and Download theme
 */
const buildAndDownload = async () => {
    try {
        await buildTheme(webContainer, config);
        console.log(`Downloaded theme version ${targetVersion}!`);

        btnSubmit.classList.remove("btn-loading");
        btnSubmit.disabled = false;
    } catch (err) {
        onError(err);
    }
}

const onError = (err) => {
    document.getElementById('alert-error').style.display = "block";
    btnSubmit.classList.remove("btn-loading");
    btnSubmit.disabled = true;
    if (err) throw err;
}

/**
 * Main script
 */
listVersions().then(versions => {
    try {
        if (versions.length === 0) {
            throw new Error(`No versions found for repo '${GEMSTONE_REPO_OWNER}/${GEMSTONE_REPO_NAME}'!`)
        }
        console.log('Found versions:', versions);
        const latestVersion = versions[0];
    
        // Set default target version
        if (!targetVersion || !versions.includes(targetVersion)) {
            targetVersion = versions[0];
        }
    
        // Append versions to select
        const versionSelect = document.getElementById('select-version');
        versionSelect.innerHTML = '';
        versions.forEach((version, i) => {
            const label = i === 0 ? `${version} (latest)` : version;
            versionSelect.options[versionSelect.options.length] = new Option(label, version);
        });
        versionSelect.value = targetVersion;
    
        // Trigger re-initialization on version change
        versionSelect.addEventListener('change', () => {
            const version = versionSelect.value;
            if (version === latestVersion) {
                window.location.search = "";
            } else {
                window.location.search = `?version=${versionSelect.value}`;
            }
        });
    
        // Invoke container
        invokeContainer(targetVersion).then(wc => {
            webContainer = wc;
            if (config) {
                buildAndDownload();
            }
        }).catch(err => onError(err));
    
        versionSelect.disabled = false;
        btnSubmit.disabled = false;
    } catch (err) {
        onError(err);
    }
}).catch(err => onError(err));
