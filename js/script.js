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
            top: 120px;
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

// ===== 6. НАВИГАЦИОННАЯ ПАНЕЛЬ (предоставленные SVG-иконки) =====
(function() {
    // Показываем только на главной странице (не на страницах политики/соглашения)
    if (document.querySelector('.legal-page')) return;

    // SVG-иконки с текущим цветом (stroke="currentColor")
    const svgPaths = {
        // Домик (оставляем прежний)
        home: '<path d="M3 9L12 3L21 9V20H3V9Z"/><path d="M9 20V12H15V20"/>',

        // Огонь
        fire: '<path d="M5.09473 0.570312C5.4126 0.710856 5.98142 1.05901 6.61035 1.55273C7.2931 2.08872 7.99187 2.75204 8.46094 3.41406C9.15819 4.39822 9.63245 5.36468 9.93164 6.08496C10.0809 6.44437 10.1856 6.74134 10.2529 6.94629C10.2866 7.04863 10.3107 7.12795 10.3262 7.18066C10.3339 7.20703 10.3403 7.22671 10.3438 7.23926C10.3455 7.24546 10.346 7.2503 10.3467 7.25293L10.3477 7.25488L10.5996 8.21289L11.2207 7.44141L11.2217 7.44043C11.2222 7.4398 11.2229 7.43841 11.2236 7.4375C11.2251 7.43571 11.2273 7.43347 11.2295 7.43066C11.2341 7.42487 11.2404 7.41712 11.248 7.40723C11.2635 7.38707 11.2847 7.35788 11.3105 7.32227C11.3621 7.25126 11.4322 7.15072 11.5078 7.0293C11.6555 6.7922 11.8409 6.45035 11.9414 6.08203C11.9643 5.99832 11.9834 5.90876 12.0029 5.8252C12.5349 6.51439 13.249 7.64957 13.6611 8.7207C14.0675 9.77706 14.2163 10.8214 14.2617 11.6064C14.2843 11.9976 14.2811 12.3213 14.2725 12.5449C14.2682 12.6562 14.2622 12.7425 14.2578 12.7998C14.2556 12.8281 14.2542 12.8497 14.2529 12.8633C14.2523 12.8699 14.2513 12.8751 14.251 12.8779V12.8799L14.249 12.8975L14.248 12.915C14.0946 16.5775 11.078 19.5 7.37793 19.5C3.58424 19.5 0.500002 16.3145 0.500002 12.6221C0.5 12.1356 0.485433 11.152 1.24219 9.4502C1.65577 8.52014 1.94978 7.85685 2.1377 7.26172C2.20962 7.42322 2.25876 7.61421 2.28809 7.79395C2.30562 7.90142 2.31533 7.99535 2.32031 8.06152C2.32278 8.09434 2.32449 8.12031 2.3252 8.13672V8.15625L2.3418 9.15039L3.12988 8.54492H3.13086V8.54395L3.13281 8.54297C3.13388 8.54214 3.13522 8.54121 3.13672 8.54004C3.14011 8.53739 3.14494 8.53365 3.15039 8.5293C3.16138 8.52053 3.17653 8.50781 3.19531 8.49219C3.23285 8.46095 3.28535 8.41586 3.34961 8.35742C3.47827 8.24041 3.65559 8.06907 3.85645 7.84375C4.2577 7.39363 4.75849 6.72438 5.16309 5.8457C5.76076 4.54772 5.83076 3.48347 5.69531 2.59863C5.62859 2.16288 5.51381 1.78087 5.40039 1.45215C5.27856 1.0991 5.18293 0.869481 5.10938 0.625977C5.10392 0.607927 5.09943 0.589074 5.09473 0.570312Z" stroke="currentColor"/><path d="M6.96951 8.289C7.2868 8.74423 7.78604 9.55818 8.10135 10.2411C8.36807 10.819 8.53531 11.3933 8.63553 11.8251C8.68537 12.0399 8.71791 12.2174 8.73807 12.3398C8.74814 12.4009 8.75528 12.4484 8.75955 12.4794C8.76168 12.4949 8.76257 12.5065 8.76346 12.5136C8.76385 12.5168 8.76426 12.519 8.76443 12.5204V12.5214L8.85135 13.287L9.51541 12.8954H9.51736L9.51834 12.8945C9.51948 12.8938 9.52087 12.8924 9.52225 12.8915C9.5252 12.8897 9.52897 12.8872 9.53299 12.8847C9.54096 12.8797 9.55142 12.874 9.56326 12.8661C9.58714 12.8503 9.6186 12.828 9.65604 12.7997C9.73116 12.743 9.83139 12.66 9.94315 12.5478C10.1671 12.323 10.4396 11.9798 10.659 11.4941C10.6821 11.4428 10.7062 11.3782 10.7234 11.3329C10.7428 11.2822 10.7618 11.2344 10.782 11.1874C10.8053 11.2174 10.832 11.2522 10.8601 11.2939C11.3392 12.0042 11.9885 13.2712 11.9793 14.8954V14.8984C11.9792 17.4398 9.9191 19.4999 7.37772 19.4999C4.83633 19.4999 2.77622 17.4398 2.77615 14.8984C2.77615 14.1239 2.93065 13.5239 3.23709 12.9579C3.55048 12.3791 4.03462 11.8126 4.73709 11.123C5.6604 10.2166 6.54719 9.08473 6.95193 8.26556C6.95746 8.2733 6.96378 8.28078 6.96951 8.289Z" stroke="currentColor"/><path d="M7.49184 14.9674C7.55865 15.0559 7.63466 15.2158 7.73793 15.4967C7.93186 16.0243 8.18018 16.8619 8.65981 17.7955C8.88021 18.2246 8.82188 18.6348 8.60512 18.9449C8.38243 19.2634 7.9733 19.4995 7.45668 19.4996C6.93603 19.4996 6.57238 19.2961 6.3268 18.9801C6.07001 18.6495 5.91569 18.159 5.91566 17.567C5.91566 17.0341 6.18714 16.3472 6.5768 15.774C6.76745 15.4936 6.9709 15.2649 7.15297 15.1119C7.3396 14.9551 7.44117 14.9301 7.45473 14.9274C7.4606 14.9322 7.47373 14.9435 7.49184 14.9674Z" stroke="currentColor"/>',

        // Звезда
        star: '<path d="M4.9375 0.5C4.99292 0.5 5.02229 0.51626 5.03516 0.526367C5.04061 0.530704 5.04804 0.536922 5.05469 0.547852L5.07227 0.597656C5.32439 1.91986 5.64188 2.88016 6.31836 3.55664C6.995 4.23328 7.95563 4.55058 9.27832 4.80273C9.32215 4.81176 9.33991 4.82888 9.34863 4.83984C9.35874 4.85271 9.375 4.88208 9.375 4.9375C9.375 4.99292 9.35874 5.02229 9.34863 5.03516C9.33992 5.04611 9.322 5.06226 9.27832 5.07129C7.95554 5.32345 6.99503 5.64169 6.31836 6.31836C5.6459 6.99082 5.32856 7.94382 5.07715 9.25391C5.07278 9.27104 5.05482 9.30769 5.01855 9.33887C4.98517 9.36749 4.95644 9.375 4.9375 9.375C4.88208 9.375 4.85271 9.35874 4.83984 9.34863C4.83439 9.3443 4.82696 9.33808 4.82031 9.32715L4.80273 9.27734C4.55061 7.95514 4.23312 6.99484 3.55664 6.31836C2.87981 5.64153 1.91897 5.32348 0.595703 5.07129C0.552701 5.06221 0.535017 5.04603 0.526367 5.03516C0.51626 5.02229 0.5 4.99292 0.5 4.9375C0.5 4.91856 0.507514 4.88983 0.536133 4.85645C0.566766 4.82081 0.602621 4.80261 0.620117 4.79785C1.93068 4.54641 2.88402 4.22926 3.55664 3.55664C4.23312 2.88016 4.55061 1.91986 4.80273 0.597656C4.81171 0.553149 4.8288 0.535154 4.83984 0.526367C4.85271 0.51626 4.88208 0.5 4.9375 0.5Z" stroke="currentColor"/><path d="M8.6875 11.25C8.74292 11.25 8.77229 11.2663 8.78516 11.2764C8.7962 11.2852 8.81329 11.3031 8.82227 11.3477L8.82324 11.3545C9.01065 12.2291 9.21996 12.8957 9.69336 13.3691C10.1638 13.8396 10.8249 14.0488 11.6914 14.2354C11.7085 14.2397 11.7452 14.2577 11.7764 14.2939C11.805 14.3273 11.8125 14.3561 11.8125 14.375C11.8125 14.4304 11.7962 14.4598 11.7861 14.4727C11.7773 14.4837 11.7594 14.5008 11.7148 14.5098L11.708 14.5107C10.8334 14.6982 10.1668 14.9075 9.69336 15.3809C9.21996 15.8543 9.01065 16.5209 8.82324 17.3955L8.82227 17.4023C8.81329 17.4469 8.7962 17.4648 8.78516 17.4736C8.77229 17.4837 8.74292 17.5 8.6875 17.5C8.63208 17.5 8.60271 17.4837 8.58984 17.4736C8.5788 17.4648 8.56171 17.4469 8.55273 17.4023L8.55176 17.3955L8.47949 17.0771C8.30748 16.3572 8.09588 15.7951 7.68164 15.3809C7.20824 14.9075 6.54156 14.6982 5.66699 14.5107L5.66016 14.5098L5.61035 14.4922C5.59942 14.4855 5.5932 14.4781 5.58887 14.4727C5.57876 14.4598 5.5625 14.4304 5.5625 14.375C5.5625 14.3196 5.57876 14.2902 5.58887 14.2773C5.59765 14.2663 5.61565 14.2492 5.66016 14.2402L5.66699 14.2393C6.54156 14.0518 7.20824 13.8425 7.68164 13.3691C8.15504 12.8957 8.36435 12.2291 8.55176 11.3545L8.55273 11.3477C8.56171 11.3031 8.5788 11.2852 8.58984 11.2764C8.60271 11.2663 8.63208 11.25 8.6875 11.25Z" stroke="currentColor"/><path d="M13.75 5.5625C13.8054 5.5625 13.8348 5.57876 13.8477 5.58887C13.8531 5.5932 13.8605 5.59942 13.8672 5.61035L13.8848 5.66016C14.0099 6.34581 14.169 6.9073 14.5684 7.30664C14.9681 7.70635 15.5303 7.86507 16.2168 7.99023C16.2599 7.9993 16.2775 8.01645 16.2861 8.02734C16.2962 8.04021 16.3125 8.06958 16.3125 8.125C16.3125 8.18042 16.2962 8.20979 16.2861 8.22266C16.2775 8.23353 16.2598 8.24971 16.2168 8.25879C15.5302 8.38396 14.9681 8.54362 14.5684 8.94336C14.169 9.3427 14.0099 9.90419 13.8848 10.5898C13.8758 10.6344 13.8587 10.6523 13.8477 10.6611C13.8348 10.6712 13.8054 10.6875 13.75 10.6875C13.6946 10.6875 13.6652 10.6712 13.6523 10.6611C13.6469 10.6568 13.6395 10.6506 13.6328 10.6396L13.6152 10.5898C13.4901 9.90419 13.331 9.3427 12.9316 8.94336C12.5317 8.54343 11.9692 8.38399 11.2822 8.25879C11.2399 8.24967 11.2225 8.23345 11.2139 8.22266C11.2038 8.20979 11.1875 8.18042 11.1875 8.125C11.1875 8.06958 11.2038 8.04021 11.2139 8.02734C11.2225 8.01653 11.2398 7.99934 11.2822 7.99023C11.9692 7.86504 12.5317 7.70653 12.9316 7.30664C13.331 6.9073 13.4901 6.34581 13.6152 5.66016C13.6242 5.61565 13.6413 5.59765 13.6523 5.58887C13.6652 5.57876 13.6946 5.5625 13.75 5.5625Z" stroke="currentColor"/><path d="M1.625 12.6875C1.4375 12.5 1.1875 12.4375 0.9375 12.5625C0.875 12.5625 0.8125 12.625 0.75 12.6875C0.6875 12.75 0.625 12.8125 0.625 12.875C0.5625 12.9375 0.5625 13.0625 0.5625 13.125C0.5625 13.1875 0.5625 13.3125 0.625 13.375C0.6875 13.4375 0.6875 13.5 0.75 13.5625C0.8125 13.625 0.875 13.6875 0.9375 13.6875C1 13.75 1.125 13.75 1.1875 13.75C1.25 13.75 1.375 13.75 1.4375 13.6875C1.5 13.625 1.5625 13.625 1.625 13.5625C1.6875 13.5 1.75 13.4375 1.75 13.375C1.8125 13.3125 1.8125 13.1875 1.8125 13.125C1.8125 13.0625 1.8125 12.9375 1.75 12.875C1.75 12.8125 1.6875 12.75 1.625 12.6875Z" fill="currentColor"/><path d="M15.5625 3.125C15.75 3.125 15.875 3.0625 16 2.9375C16.125 2.8125 16.1875 2.6875 16.1875 2.5C16.1875 2.3125 16.125 2.1875 16 2.0625C15.9375 2 15.875 1.9375 15.8125 1.9375C15.6875 1.875 15.5 1.875 15.3125 1.9375C15.25 1.9375 15.1875 2 15.125 2.0625C15 2.1875 14.9375 2.3125 14.9375 2.5C14.9375 2.6875 15 2.8125 15.125 2.9375C15.25 3.0625 15.375 3.125 15.5625 3.125Z" fill="currentColor"/>',

        // Локация
        pin: '<path d="M5.75586 2.99805C5.3602 2.83426 4.92489 2.79154 4.50488 2.875C4.08472 2.95857 3.69848 3.16492 3.39551 3.46777C3.09251 3.77077 2.88537 4.15689 2.80176 4.57715C2.71816 4.99744 2.76179 5.4332 2.92578 5.8291C3.08978 6.22497 3.36735 6.5637 3.72363 6.80176C4.07977 7.03965 4.49847 7.16691 4.92676 7.16699C5.5013 7.16699 6.05268 6.93843 6.45898 6.53223C6.86531 6.1259 7.09375 5.57464 7.09375 5C7.09375 4.57147 6.96659 4.1522 6.72852 3.7959C6.49045 3.43975 6.15164 3.16199 5.75586 2.99805ZM4.59375 9.5L4.18457 9.4248C3.08614 9.22238 2.10187 8.61901 1.42383 7.73145C0.745865 6.84398 0.42221 5.73592 0.515625 4.62305C0.609151 3.51009 1.11309 2.47094 1.92969 1.70898C2.74448 0.948763 3.81272 0.518135 4.92676 0.5C6.04094 0.517939 7.10888 0.948764 7.92383 1.70898C8.74049 2.47095 9.24534 3.51004 9.33887 4.62305C9.43228 5.73588 9.10859 6.844 8.43066 7.73145C7.75263 8.619 6.76833 9.22236 5.66992 9.4248L5.26074 9.5V15.833C5.26074 15.9214 5.2256 16.0068 5.16309 16.0693C5.10058 16.1318 5.01515 16.167 4.92676 16.167C4.83855 16.1669 4.75381 16.1317 4.69141 16.0693C4.62889 16.0068 4.59375 15.9214 4.59375 15.833V9.5Z" stroke="currentColor"/>',

        // Вилка/нож (возможности)
        forkKnife: '<path d="M12.6768 0.5H12.752C12.8211 0.5 12.877 0.55583 12.877 0.625V16.791C12.8767 16.86 12.821 16.916 12.752 16.916H10.6182C10.5491 16.916 10.4934 16.86 10.4932 16.791V10.9619H9.68066C9.12282 10.9619 8.66797 10.5071 8.66797 9.94922V4.50879C8.66807 2.29876 10.4667 0.500106 12.6768 0.5ZM12.043 0.803711C10.2709 1.10579 8.91806 2.65118 8.91797 4.50879V9.94922C8.91797 10.3694 9.25912 10.7119 9.68066 10.7119H10.6182C10.6872 10.712 10.7432 10.7678 10.7432 10.8369V16.666H12.627V0.704102L12.043 0.803711Z" stroke="currentColor"/><path d="M5.66602 0.5C5.73455 0.500211 5.79077 0.556113 5.79102 0.625977V6.9668C5.79102 7.85188 5.32999 8.64496 4.58887 9.08203L4.32324 9.23828L4.34375 9.5459L4.75098 15.6357C4.78045 16.0778 4.62295 16.5183 4.32031 16.8418C4.01763 17.1653 3.58844 17.3516 3.14551 17.3516C2.7023 17.3515 2.27337 17.1653 1.9707 16.8418C1.66818 16.5183 1.51155 16.0777 1.54102 15.6357L1.94727 9.5459L1.96875 9.23828L1.70312 9.08105C0.961947 8.644 0.5 7.85192 0.5 6.9668V0.625C0.5 0.55583 0.55583 0.5 0.625 0.5C0.69417 0.5 0.75 0.55583 0.75 0.625V5.625H3.02051V0.625C3.02051 0.55583 3.07634 0.5 3.14551 0.5C3.21459 0.500105 3.27051 0.555895 3.27051 0.625V5.625H5.54102V0.625C5.54102 0.55583 5.59685 0.5 5.66602 0.5ZM0.75 6.9668C0.750157 7.87738 1.2998 8.68536 2.14648 9.02051C2.19649 9.04046 2.22799 9.09029 2.22461 9.14453L1.79004 15.6514C1.7648 16.0294 1.89479 16.3945 2.15332 16.6709C2.41204 16.9473 2.7672 17.1006 3.14551 17.1006C3.52383 17.1005 3.879 16.9474 4.1377 16.6709C4.3961 16.3947 4.52619 16.0301 4.50098 15.6523L4.06543 9.14551V9.14453C4.06188 9.09079 4.09393 9.04053 4.14453 9.02051C4.99111 8.68522 5.54102 7.8774 5.54102 6.9668V5.875H0.75V6.9668Z" stroke="currentColor"/>',

        // О компании
        about: '<path d="M10 0.5C15.2467 0.5 19.5 4.75325 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75331 19.5 0.5 15.2467 0.5 10C0.5 4.75325 4.75331 0.5 10 0.5ZM10 1.5C5.31267 1.5 1.5 5.31267 1.5 10C1.5 14.6873 5.31267 18.5 10 18.5C14.6874 18.5 18.5 14.6873 18.5 10C18.5 5.31267 14.6874 1.5 10 1.5ZM10.502 9.5V14.5H9.50195V9.5H10.502ZM10.0098 5.25C10.4462 5.25 10.752 5.55049 10.752 6C10.752 6.45024 10.4464 6.75 10.0098 6.75C9.75982 6.74991 9.5775 6.66351 9.45801 6.54297C9.338 6.42188 9.252 6.23685 9.25195 5.98633C9.25195 5.55897 9.55044 5.25018 10.0098 5.25Z" stroke="currentColor"/>'
    };

    // Сопоставление id секций и иконок
    const navItems = [
        { id: 'top', svg: svgPaths.home, title: 'Наверх' },
        { id: 'card-barbecue', svg: svgPaths.fire, title: 'Барбекю для компании' },
        { id: 'card-business', svg: svgPaths.star, title: 'Бизнес-мероприятия' },
        { id: 'card-atmosphere', svg: svgPaths.pin, title: 'Атмосфера' },
        { id: 'card-opportunities', svg: svgPaths.forkKnife, title: 'Возможности для бизнеса' },
        { id: 'about-section', svg: svgPaths.about, title: 'О компании' }
    ];

    const navContainer = document.createElement('div');
    navContainer.className = 'nav-icons';

    navItems.forEach(item => {
        const target = document.getElementById(item.id);
        if (!target) return;

        const link = document.createElement('a');
        link.className = 'nav-icon';
        link.href = `#${item.id}`;
        link.title = item.title;
        link.setAttribute('aria-label', item.title);

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        // Используем оригинальные viewBox из предоставленных иконок
        switch (item.id) {
            case 'top':
                svg.setAttribute("viewBox", "0 0 24 24");
                break;
            case 'card-barbecue':
                svg.setAttribute("viewBox", "0 0 15 20");
                break;
            case 'card-business':
                svg.setAttribute("viewBox", "0 0 17 18");
                break;
            case 'card-atmosphere':
                svg.setAttribute("viewBox", "0 0 10 17");
                break;
            case 'card-opportunities':
                svg.setAttribute("viewBox", "0 0 14 18");
                break;
            case 'about-section':
                svg.setAttribute("viewBox", "0 0 20 20");
                break;
        }
        svg.innerHTML = item.svg;
        link.appendChild(svg);

        link.addEventListener('click', (e) => {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        navContainer.appendChild(link);
    });

    if (navContainer.children.length > 0) {
        document.body.appendChild(navContainer);
    }
})();