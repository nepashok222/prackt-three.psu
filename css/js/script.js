document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Мобильное меню ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpened = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isOpened);
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('open');
        });
    }

    // --- 2. Фильтрация портфолио ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Активный класс
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    item.classList.remove('fade-in');
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                        // Небольшая задержка для перезапуска анимации
                        setTimeout(() => item.classList.add('fade-in'), 10);
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- 3. Lightbox (Галерея) ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        const galleryImages = document.querySelectorAll('.portfolio-item img');
        
        let currentIndex = 0;
        let visibleImages = [];

        // Обновляем список видимых картинок (с учетом фильтра)
        const updateVisibleImages = () => {
            visibleImages = Array.from(portfolioItems)
                .filter(item => !item.classList.contains('hidden'))
                .map(item => item.querySelector('img'));
        };

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = visibleImages[currentIndex].src;
            lightboxImg.alt = visibleImages[currentIndex].alt;
            lightbox.classList.remove('hidden');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        };

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % visibleImages.length;
            openLightbox(currentIndex);
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
            openLightbox(currentIndex);
        };

        // Открытие по клику или Enter
        galleryImages.forEach(img => {
            img.addEventListener('click', (e) => {
                updateVisibleImages();
                const index = visibleImages.indexOf(e.target);
                if (index > -1) openLightbox(index);
            });
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    updateVisibleImages();
                    const index = visibleImages.indexOf(e.target);
                    if (index > -1) openLightbox(index);
                }


});
        });

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        // Навигация с клавиатуры в Lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('hidden')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }

    // --- 4. Аккордеон FAQ ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.nextElementSibling;
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';

                // Закрываем все остальные (опционально)
                faqQuestions.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherBtn.nextElementSibling.style.maxHeight = null;
                    }
                });

                if (isExpanded) {
                    btn.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = null;
                } else {
                    btn.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // --- 5. Валидация Формы Контактов ---
    const contactForm = document.getElementById('contact-form');
    
    // Предзаполнение поля "Тип съемки" если пришли со страницы Услуг
    if (contactForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const typeParam = urlParams.get('type');
        if (typeParam) {
            const select = document.getElementById('type');
            if(select) select.value = typeParam;
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Получаем поля
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const consent = document.getElementById('consent');

            // Сброс ошибок
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));

            // Проверка Имени
            if (name.value.trim().length < 2) {
                name.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Проверка Email (простая регулярка)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Проверка Сообщения
            if (message.value.trim().length < 10) {
                message.parentElement.classList.add('invalid');
                isValid = false;
            }

            // Проверка Чекбокса
            if (!consent.checked) {
                consent.parentElement.classList.add('invalid');
                isValid = false;
            }

            if (isValid) {
                // Имитация отправки (Здесь можно подключить Formspree, EmailJS или fetch)
                /*
                // ПРИМЕР FORMSPREE:
                fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if(response.ok) { ... }
                });
                */


console.log('Форма успешно провалидирована и готова к отправке!');
                document.getElementById('form-success').classList.remove('hidden');
                contactForm.reset();
                
                // Скрываем сообщение через 5 секунд
                setTimeout(() => {
                    document.getElementById('form-success').classList.add('hidden');
                }, 5000);
            }
        });

        // Убираем красную рамку при вводе
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('invalid');
            });
        });
    }
});