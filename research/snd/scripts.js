    

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
    const modalImg = document.getElementById('modal-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const close = document.querySelector('.close');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10); // Small delay to ensure display change is registered
            modalImg.src = thumbnail.src;
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

    // Dynamically load images
    const imagePaths = [
        'images/results/order_1/order_1_1st-task_fgvc-aircraft.svg',
        'images/results/order_1/order_1_2nd-task_dtd.svg',
        'images/results/order_1/order_1_3rd-task_eurosat.svg',
        'images/results/order_1/order_1_4th-task_flowers-102.svg',
        'images/results/order_1/order_1_5th-task_food-101.svg',
        'images/results/order_1/order_1_6th-task_oxford-pets.svg',
        'images/results/order_1/order_1_7th-task_stanford-cars.svg',
        'images/results/order_1/order_1_8th-task_ucf-101.svg'
    ];
    const dots = document.getElementById('dots');

    imagePaths.forEach((path, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.setAttribute("dotID", index);
        dots.appendChild(dot);
    });
    const carouselTrack = document.getElementById('carouselTrack');

    const addImageToTrack = (path, isClone = false) => {
        const li = document.createElement('div');
        li.classList.add('carousel-slide');
        li.style.width = `${document.querySelector('.carousel').clientWidth / 3}px`;
        const img = document.createElement('img');
        
        img.src = path;
        img.style.width = `${document.querySelector('.carousel').clientWidth / 3}px`; // Set the width of the image here
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10); // Small delay to ensure display change is registered
            modalImg.src = img.src;
        });
        li.appendChild(img);
        carouselTrack.appendChild(li);
    };

    // Add clone of the last image to the beginning
    addImageToTrack(imagePaths[imagePaths.length - 1], true);

    // Add images to the carousel
    imagePaths.forEach(path => addImageToTrack(path));

    // Add clone of the first three image to the end
    addImageToTrack(imagePaths[0], true);

    addImageToTrack(imagePaths[1], true);

    addImageToTrack(imagePaths[2], true);

    let currentIndex = 7;
    const slideWidth = document.querySelector('.carousel-slide').clientWidth;
    carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`; // Start from the first real image

    const updateCarousel = () => {
        const allDots = document.querySelectorAll('.dot');
        const buttons = document.querySelectorAll('.carousel-button');

        allDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === (currentIndex + 1) % imagePaths.length) {
                dot.classList.add('active')
            }
        })
        
        buttons.forEach((button, index) => {
            button.classList.add('disable');
        });

        setTimeout(() => {
            buttons.forEach((button, index) => {
                button.classList.remove('disable');
            });
        }, 500);

        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        carouselTrack.style.transform = `translateX(-${(currentIndex + 1) * slideWidth}px)`;



        // Handle circular navigation with clone images
        if (currentIndex === imagePaths.length) {
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                currentIndex = 0;
                carouselTrack.style.transform = `translateX(-${slideWidth}px)`;
                // document.querySelectorAll('.carousel-slide')[currentIndex+2].classList.add('active');
            }, 500); // Match this delay with the CSS transition duration
        }

        if (currentIndex === -1) {
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                currentIndex = imagePaths.length - 1;
                carouselTrack.style.transform = `translateX(-${(imagePaths.length) * slideWidth}px)`;
            }, 500); // Match this delay with the CSS transition duration
        }

        // Remove active class from all slides
        document.querySelectorAll('.carousel-slide').forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === (currentIndex+2) || index === (currentIndex + 10) || index === (currentIndex - 6)) {
                slide.classList.add('active');
            }
        });
    };

    const nextSlide = () => {
        currentIndex++;
        updateCarousel();
    };

    const prevSlide = () => {
        currentIndex--;
        updateCarousel();
    };

    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

    document.querySelectorAll('.dot').forEach((dot, index) => {
        const dotID = parseInt(dot.getAttribute("dotID"))
        dot.addEventListener("click", function(){
            currentIndex = dotID - 1;
            updateCarousel();
        });
    });

    document.querySelectorAll('.carousel-slide')[currentIndex+2].classList.add('active');
    document.querySelectorAll('.dot')[(currentIndex + 1) % imagePaths.length].classList.add('active');
});

function showResults() {
    const researchSection = document.getElementById('research');
    if (researchSection) {
        researchSection.classList.add('visible');
    }
}
