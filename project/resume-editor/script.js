document.querySelectorAll('.editable').forEach(item => {
    item.addEventListener('click', function(event) {
        startEditing(item);
    });

    item.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            finishEditing(item);
        }
    });
});

function startEditing(element) {
    element.setAttribute('contenteditable', 'true');
    element.focus();
}

function finishEditing(element) {
    element.removeAttribute('contenteditable');
    updateResume(element.id, element.textContent.trim());
}

function updateResume(id, value) {
    switch (id) {
        case 'fullName':
            document.getElementById('fullName').textContent = value;
            break;
        case 'email':
            document.getElementById('email').textContent = value;
            break;
        case 'education':
            document.getElementById('education').textContent = value;
            break;
        case 'experience':
            document.getElementById('experience').textContent = value;
            break;
    }
}
