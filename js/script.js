// ===== 1. БЕСКОНЕЧНАЯ ПРОКРУТКА ЛОГОТИПОВ (ВЕРХ – ВПРАВО, НИЗ – ВЛЕВО) =====
const SCROLL_SPEED = 25;

(function() {
    const topImages = [];
    const bottomImages = [];
    for (let i = 1; i <= 24; i++) {
        topImages.push(`img/icons/line1/${i}.png`);
        bottomImages.push(`img/icons/line2/${i}.png`);
    }

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
        let position = 0, animFrame, lastTime, paused = false;
        function updateGap() { track.style.gap = getComputedStyle(container).gap; }
        window.addEventListener('resize', updateGap);
        function animate(now) {
            if (paused) { lastTime = null; animFrame = requestAnimationFrame(animate); return; }
            if (!lastTime) { lastTime = now; animFrame = requestAnimationFrame(animate); return; }
            const delta = Math.min(50, now - lastTime);
            const shift = speed * delta / 1000;
            position -= shift;
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
        let position = 0, animFrame, lastTime, paused = false;
        function updateGap() { track.style.gap = getComputedStyle(container).gap; }
        window.addEventListener('resize', updateGap);
        function animate(now) {
            if (paused) { lastTime = null; animFrame = requestAnimationFrame(animate); return; }
            if (!lastTime) { lastTime = now; animFrame = requestAnimationFrame(animate); return; }
            const delta = Math.min(50, now - lastTime);
            const shift = speed * delta / 1000;
            position += shift;
            lastTime = now;
            const last = track.lastElementChild;
            if (last) {
                const w = last.offsetWidth;
                const g = parseInt(getComputedStyle(track).gap) || 0;
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
    if (topLine) createMarqueeRight(topLine, topImages, SCROLL_SPEED);
    if (bottomLine) createMarqueeLeft(bottomLine, bottomImages, SCROLL_SPEED);
})();

// ===== 2. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
(function() {
    const elements = document.querySelectorAll('.card, .step, .award-card, .about__grid-card, .partner .logos__line');
    elements.forEach(el => el.classList.add('fade-on-scroll'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
    elements.forEach(el => observer.observe(el));
})();

// ===== 3. КНОПКА ПОДТВЕРЖДЕНИЯ СОГЛАСИЯ (страница политики) =====
(function() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (!confirmBtn) return;
    function createHeartAnimation(element) {
        const rect = element.getBoundingClientRect();
        const heartsCount = 5;
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-gold').trim() || '#D4AF37';
        for (let i = 0; i < heartsCount; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '♥';
            heart.style.position = 'fixed';
            heart.style.left = (rect.left + rect.width / 2) + 'px';
            heart.style.top = (rect.top + rect.height / 2) + 'px';
            heart.style.color = accentColor;
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '10000';
            heart.style.opacity = '0';
            heart.style.transform = 'translateY(0)';
            heart.style.transition = 'all 1s ease-out';
            document.body.appendChild(heart);
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / heartsCount;
                const distance = 50 + Math.random() * 50;
                const x = Math.cos(angle) * distance;
                const y = -Math.random() * 100 - 50;
                heart.style.opacity = '1';
                heart.style.transform = `translate(${x}px, ${y}px)`;
                setTimeout(() => {
                    heart.style.opacity = '0';
                    setTimeout(() => heart.remove(), 1000);
                }, 900);
            }, i * 100);
        }
    }
    if (localStorage.getItem('privacyPolicyConfirmed') === 'true') {
        confirmBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3333 7.5L8.75 12.0833L6.66667 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Спасибо за согласие!</span>`;
        confirmBtn.classList.add('confirmed');
    }
    confirmBtn.addEventListener('click', function() {
        if (this.classList.contains('confirmed')) {
            this.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6667 5.8335L8.33333 14.1668L4.16667 10.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Я согласен с условиями</span>`;
            this.classList.remove('confirmed');
            localStorage.removeItem('privacyPolicyConfirmed');
        } else {
            this.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3333 7.5L8.75 12.0833L6.66667 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Спасибо за согласие!</span>`;
            this.classList.add('confirmed');
            createHeartAnimation(this);
            localStorage.setItem('privacyPolicyConfirmed', 'true');
        }
    });
})();

// ===== 4. ПЛАВАЮЩАЯ ИКОНКА "НА ГЛАВНУЮ" (только для страниц политики/соглашения) =====
(function() {
    if (!document.querySelector('.legal-page')) return;
    const homeIcon = document.createElement('a');
    homeIcon.className = 'back-to-home-icon';
    homeIcon.href = 'index.html';
    homeIcon.ariaLabel = 'На главную';
    homeIcon.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 3L21 9V20H3V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 20V12H15V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const style = document.createElement('style');
    style.textContent = `
        .back-to-home-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: rgba(24,7,14,0.8);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            color: var(--color-gold,#D4AF37);
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            animation: softPulseBack 2s infinite ease-in-out;
        }
        .back-to-home-icon:hover {
            transform: scale(1.05);
            background: rgba(24,7,14,0.95);
            color: #fff;
            box-shadow: 0 4px 12px rgba(212,175,55,0.3);
        }
        @keyframes softPulseBack {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.7; transform: scale(1); }
        }
        @media (max-width: 767px) {
            .back-to-home-icon { top: 12px; right: 12px; width: 40px; height: 40px; }
            .back-to-home-icon svg { width: 24px; height: 24px; }
        }
    `;
    if (!document.querySelector('#back-to-home-styles')) {
        style.id = 'back-to-home-styles';
        document.head.appendChild(style);
    }
    document.body.appendChild(homeIcon);
})();

// ===== 5. СЛАЙДЕРЫ ИЗОБРАЖЕНИЙ С КРОССФЕЙДОМ =====
(function() {
    const sliders = document.querySelectorAll('.card__slider');
    if (!sliders.length) return;

    function getImageFolder(badgeSpan) {
        if (!badgeSpan) return 'active';
        const text = badgeSpan.textContent.trim().toLowerCase();
        if (text.includes('активный')) return 'active';
        if (text.includes('элегантный')) return 'elegant';
        if (text.includes('локация')) return 'location';
        if (text.includes('фуд')) return 'food';
        return 'active';
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
        });
    }

    async function initSlider(slider) {
        const originalImg = slider.querySelector('.card__slider-img');
        const pager = slider.querySelector('.tui-pager');
        if (!originalImg || !pager) return;

        const allSvgs = Array.from(pager.querySelectorAll('svg'));
        const dots = allSvgs.filter(svg => svg.querySelector('rect') !== null);
        const imagesCount = dots.length;
        if (imagesCount === 0) return;

        const badgeSpan = slider.querySelector('.badge span');
        const folder = getImageFolder(badgeSpan);

        const validPaths = [];
        for (let i = 1; i <= imagesCount; i++) {
            const pngPath = `img/content/${folder}/${i}.png`;
            const jpgPath = `img/content/${folder}/${i}.jpg`;
            try {
                await loadImage(pngPath);
                validPaths[i - 1] = pngPath;
            } catch {
                try {
                    await loadImage(jpgPath);
                    validPaths[i - 1] = jpgPath;
                } catch {
                    validPaths[i - 1] = null;
                }
            }
        }
        if (validPaths.every(p => p === null)) return;

        // Создаём контейнер для изображений
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'slider-images';
        slider.style.display = 'flex';
        slider.style.flexDirection = 'column';

        // Создаём два слоя
        const front = document.createElement('img');
        const back = document.createElement('img');
        front.className = 'card__slider-img';
        back.className = 'card__slider-img';
        front.style.position = 'absolute';
        back.style.position = 'absolute';
        front.style.top = '0';
        back.style.top = '0';
        front.style.left = '0';
        back.style.left = '0';
        front.style.transition = 'opacity 0.6s ease-in-out';
        back.style.transition = 'opacity 0.6s ease-in-out';
        front.style.opacity = '1';
        back.style.opacity = '0';

        imagesContainer.appendChild(back);
        imagesContainer.appendChild(front);

        // Скрываем оригинальное изображение
        originalImg.style.display = 'none';

        // Вставляем контейнер с изображениями перед пагинацией
        slider.insertBefore(imagesContainer, pager);

        let currentIndex = 0;
        let autoTimer = null;
        let isAnimating = false;

        function updateActiveDot(index) {
            dots.forEach((dot, i) => {
                const rect = dot.querySelector('rect');
                if (rect) rect.setAttribute('opacity', i === index ? '1' : '0.4');
            });
        }

        function setImage(imgElement, src) {
            if (!src) {
                imgElement.style.background = '#2C2C2C';
                imgElement.style.opacity = '0.4';
                imgElement.removeAttribute('src');
                return;
            }
            imgElement.src = src;
            imgElement.style.background = 'none';
            imgElement.style.opacity = '1';
        }

        setImage(front, validPaths[0]);
        setImage(back, validPaths[0]);
        updateActiveDot(0);

        function changeImage(newIndex) {
            if (isAnimating) return;
            if (newIndex === currentIndex) return;
            if (newIndex < 0) newIndex = imagesCount - 1;
            if (newIndex >= imagesCount) newIndex = 0;

            isAnimating = true;
            const frontVisible = front.style.opacity === '1';
            const topLayer = frontVisible ? front : back;
            const bottomLayer = frontVisible ? back : front;

            const newSrc = validPaths[newIndex];
            if (!newSrc) {
                currentIndex = newIndex;
                updateActiveDot(currentIndex);
                isAnimating = false;
                return;
            }

            const img = new Image();
            img.onload = () => {
                bottomLayer.src = newSrc;
                bottomLayer.style.background = 'none';
                topLayer.style.opacity = '0';
                bottomLayer.style.opacity = '1';
                setTimeout(() => {
                    currentIndex = newIndex;
                    updateActiveDot(currentIndex);
                    isAnimating = false;
                }, 600);
            };
            img.onerror = () => {
                bottomLayer.style.background = '#2C2C2C';
                bottomLayer.style.opacity = '0.4';
                topLayer.style.opacity = '0';
                bottomLayer.style.opacity = '1';
                setTimeout(() => {
                    currentIndex = newIndex;
                    updateActiveDot(currentIndex);
                    isAnimating = false;
                }, 600);
            };
            img.src = newSrc;
            if (img.complete) img.onload();
        }

        function startAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = setInterval(() => {
                if (!isAnimating) changeImage((currentIndex + 1) % imagesCount);
            }, 5000);
        }
        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        dots.forEach((dot, idx) => {
            dot.style.cursor = 'pointer';
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                stopAuto();
                changeImage(idx);
                startAuto();
            });
        });

        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
        startAuto();
    }

    sliders.forEach(slider => {
        initSlider(slider).catch(err => console.error('Ошибка инициализации слайдера:', err));
    });
})();