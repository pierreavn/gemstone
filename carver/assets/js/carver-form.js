const inputLogo = document.getElementById('input-logo');

/**
 * Generate configuration
 * @returns 
 */
const generateConfig = (targetVersion) => {
    return {
        targetVersion,
        debug: false,
        color: document.querySelector('input[name="color"]:checked').value,
        logo: inputLogo.value,
        menuIcons: {
            "projects": "briefcase",
            "overview": "dashboard",
            "activity": "activity",
            "issues": "note",
            "time-entries": "clock",
            "agile": "layout-kanban",
            "gantt": "timeline",
            "calendar": "calendar",
            "news": "speakerphone",
            "documents": "archive",
            "wiki": "book-2",
            "files": "files",
            "settings": "tool"
        }
    }
}

const previewLogo = () => {
    window.open(inputLogo.value, '_blank').focus();
}
