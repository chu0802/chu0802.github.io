document.addEventListener('DOMContentLoaded', function() {

    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const bookLink = document.createElement('button');
                bookLink.textContent = book.title;
                bookLink.classList.add('book-link');
                bookLink.setAttribute('data-book', book.path);
                document.getElementById('book-menu').appendChild(bookLink);

                bookLink.addEventListener('click', () => {
                    loadBook(bookLink.getAttribute('data-book'));
                    closeMenu();
                });
            });

            loadBook(data[0].path)
        });

    const cardsContainer = document.querySelector('.cards-container');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    let vocab = [];
    let currentIndex = 0;

    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');

    // Function to close the side menu
    function closeMenu() {
        sideMenu.style.width = '0';
        sideMenu.style.opacity = '0';
        sideMenu.style.fontSize = '0';
    }

    // Function to open the side menu
    function openMenu() {
        sideMenu.style.width = '80%'; // Adjust as needed for your design
        sideMenu.style.opacity = '1';
        sideMenu.style.fontSize = '0.8em';
    }

    // Toggle side menu on menu button click
    menuToggle.addEventListener('click', function() {
        if (sideMenu.style.width === '80%') {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Load vocab data from selected book
    function loadBook(bookFile) {
        fetch(bookFile)
            .then(response => response.json())
            .then(data => {
                vocab = data;
                currentIndex = 0;
                displayCards();
            })
            .catch(error => console.error('Error loading the vocabulary:', error));
    }




    document.addEventListener('click', function(event) {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    function displayCards() {
        cardsContainer.innerHTML = ''; // Clear previous cards
        vocab.forEach(wordData => {
            const card = createCard(wordData);
            cardsContainer.appendChild(card);
        });
        showCard(currentIndex); // Show the first card
    }

    function createCard(wordData) {
        const card = document.createElement('div');
        card.className = 'card';
        const front = document.createElement('div');
        front.className = 'card-face card-front';

        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = wordData.word;
        front.appendChild(wordDiv);

        const back = document.createElement('div');
        back.className = 'card-face card-back';

        const defDiv = document.createElement('div');
        defDiv.className = 'definition';
        defDiv.textContent = wordData.definition;

        back.appendChild(defDiv);
        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', () => {
            card.classList.toggle('flip');
        });
        return card;
    }

    function showCard(index) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.style.display = 'none');
        cards[index].style.display = 'block';
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + vocab.length) % vocab.length;
        showCard(currentIndex);
    })

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % vocab.length;
        showCard(currentIndex);
    });

});
