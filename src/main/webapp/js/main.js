document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (icon) {
                icon.classList.remove(isDark ? 'fa-moon' : 'fa-sun');
                icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
            }
        });
    }

    // 2. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Category Filter & Search (Books Page)
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('searchInput');
    const bookCards = document.querySelectorAll('.book-item');

    if (categoryButtons.length > 0 && bookCards.length > 0) {
        // Category Filter
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                categoryButtons.forEach(b => b.classList.remove('active', 'btn-primary'));
                categoryButtons.forEach(b => b.classList.add('btn-outline-primary'));
                
                // Add active class to clicked
                btn.classList.remove('btn-outline-primary');
                btn.classList.add('active', 'btn-primary');

                const filter = btn.getAttribute('data-filter');
                filterBooks(filter, searchInput ? searchInput.value : '');
            });
        });

        // Search Filter
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                const activeBtn = document.querySelector('.category-btn.active');
                const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
                filterBooks(filter, e.target.value);
            });
        }

        function filterBooks(category, searchTerm) {
            const term = searchTerm.toLowerCase();
            
            bookCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const author = card.querySelector('.text-muted-custom').textContent.toLowerCase();
                
                const matchesCategory = category === 'all' || cardCategory === category;
                const matchesSearch = title.includes(term) || author.includes(term);

                if (matchesCategory && matchesSearch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }

    // 4. Form Validation (Add Book / Contact Form)
    const forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // If valid, prevent actual submission for frontend-only demo and show success
                event.preventDefault();
                const successMsg = document.getElementById('successMessage');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    form.reset();
                    form.classList.remove('was-validated');
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 3000);
                    return;
                }
            }
            form.classList.add('was-validated');
        }, false);
    });

    // 5. Add staggered animation delay to book cards
    document.querySelectorAll('.book-card').forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
