    

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.animated-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it has become visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const close = document.querySelector('.close');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10); // Small delay to ensure display change is registered
            if (thumbnail.tagName.toLowerCase() === 'video') {
                const video = document.createElement('video');
                video.src = thumbnail.src;
                video.muted = true;
                video.autoplay = true;
                video.loop = true;
                modalContent.innerHTML = ''; // Clear any existing content
                modalContent.appendChild(video);
            }
            else {
                const img = document.createElement('img');
                img.src = thumbnail.src;
                modalContent.innerHTML = ''; // Clear any existing content
                modalContent.appendChild(img);
            }
        });
    });

    const hideModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500); // Match this duration with the CSS transition duration
    };

    close.addEventListener('click', hideModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            hideModal();
        }
    });

});

function showResults() {
    const researchSection = document.getElementById('research');
    if (researchSection) {
        researchSection.classList.add('visible');
    }
}
