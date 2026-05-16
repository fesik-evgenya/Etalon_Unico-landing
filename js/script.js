// ===== БЕСКОНЕЧНАЯ ПРОКРУТКА ЛОГОТИПОВ (ДВЕ ОТДЕЛЬНЫЕ ФУНКЦИИ) =====
// Скорость прокрутки (пикселей в секунду) – вынесена в переменную
const SCROLL_SPEED = 25;

(function() {
    const topImages = [];
    const bottomImages = [];
    for (let i = 1; i <= 24; i++) {
        topImages.push(`img/icons/line1/${i}.png`);
        bottomImages.push(`img/icons/line2/${i}.png`);
    }

    /**
     * Прокрутка влево (нижняя строка – справа налево)
     * Переставляем первый элемент в конец, когда он уходит за левый край.
     */
    function createMarqueeLeft(container, images, speed) {
        if (!container) return;
        container.innerHTML = '';

        const track = document.createElement('div');
        track.className = 'logos__track';
        track.style.display = 'flex';
        track.style.flexWrap = 'nowrap';
        track.style.alignItems = 'center';
        track.style.gap = getComputedStyle(container).gap;

        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Логотип партнёра';
            img.loading = 'lazy';
            track.appendChild(img);
        });
        container.appendChild(track);

        let position = 0;
        let animFrame = null;
        let lastTime = null;
        let paused = false;

        function updateGap() {
            track.style.gap = getComputedStyle(container).gap;
        }
        window.addEventListener('resize', updateGap);

        function animate(now) {
            if (paused) {
                lastTime = null;
                animFrame = requestAnimationFrame(animate);
                return;
            }
            if (!lastTime) {
                lastTime = now;
                animFrame = requestAnimationFrame(animate);
                return;
            }
            const delta = Math.min(50, now - lastTime);
            const shift = speed * delta / 1000;
            position -= shift; // движение влево
            lastTime = now;

            const first = track.firstElementChild;
            if (first) {
                const w = first.offsetWidth;
                const g = parseInt(getComputedStyle(track).gap) || 0;
                if (position <= -(w + g)) {
                    track.appendChild(first);
                    position += (w + g);
                }
            }

            track.style.transform = `translateX(${position}px)`;
            animFrame = requestAnimationFrame(animate);
        }

        container.addEventListener('mouseenter', () => { paused = true; });
        container.addEventListener('mouseleave', () => { paused = false; });
        animate();
    }

    /**
     * Прокрутка вправо (верхняя строка – слева направо)
     * Переставляем последний элемент в начало, когда он уходит за правый край.
     */
    function createMarqueeRight(container, images, speed) {
        if (!container) return;
        container.innerHTML = '';

        const track = document.createElement('div');
        track.className = 'logos__track';
        track.style.display = 'flex';
        track.style.flexWrap = 'nowrap';
        track.style.alignItems = 'center';
        track.style.gap = getComputedStyle(container).gap;

        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Логотип партнёра';
            img.loading = 'lazy';
            track.appendChild(img);
        });
        container.appendChild(track);

        let position = 0;
        let animFrame = null;
        let lastTime = null;
        let paused = false;

        function updateGap() {
            track.style.gap = getComputedStyle(container).gap;
        }
        window.addEventListener('resize', updateGap);

        function animate(now) {
            if (paused) {
                lastTime = null;
                animFrame = requestAnimationFrame(animate);
                return;
            }
            if (!lastTime) {
                lastTime = now;
                animFrame = requestAnimationFrame(animate);
                return;
            }
            const delta = Math.min(50, now - lastTime);
            const shift = speed * delta / 1000;
            position += shift; // движение вправо
            lastTime = now;

            const last = track.lastElementChild;
            if (last) {
                const w = last.offsetWidth;
                const g = parseInt(getComputedStyle(track).gap) || 0;
                // Используем getBoundingClientRect для точной проверки выхода за правый край
                const containerRect = container.getBoundingClientRect();
                const lastRect = last.getBoundingClientRect();
                if (lastRect.left >= containerRect.right - 2) {
                    track.insertBefore(last, track.firstElementChild);
                    position -= (w + g);
                }
            }

            track.style.transform = `translateX(${position}px)`;
            animFrame = requestAnimationFrame(animate);
        }

        container.addEventListener('mouseenter', () => { paused = true; });
        container.addEventListener('mouseleave', () => { paused = false; });
        animate();
    }

    const topLine = document.querySelector('.logos__line.top');
    const bottomLine = document.querySelector('.logos__line.bottom');

    if (topLine) createMarqueeRight(topLine, topImages, SCROLL_SPEED);   // верхняя – движение вправо
    if (bottomLine) createMarqueeLeft(bottomLine, bottomImages, SCROLL_SPEED); // нижняя – движение влево
})();

// ===== ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
(function() {
    const elements = document.querySelectorAll('.card, .step, .award-card, .about__grid-card, .partner .logos__line');
    elements.forEach(el => {
        el.classList.add('fade-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

    elements.forEach(el => {
        observer.observe(el);
    });
})();