// 西成居酒屋Ｒ  app.js
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const toggle = document.getElementById('navToggle');
        const gnav   = document.getElementById('gnav');
        const pagetop = document.getElementById('pagetop');

        // ハンバーガーメニュー開閉
        if (toggle && gnav) {
            toggle.addEventListener('click', function () {
                const open = gnav.classList.toggle('is-open');
                toggle.classList.toggle('is-open', open);
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });

            // メニュー内リンクをタップしたら閉じる
            gnav.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () {
                    gnav.classList.remove('is-open');
                    toggle.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // ヒーロー画像スライドショー（フェード切替）
        const slider = document.getElementById('fvSlider');
        if (slider) {
            const slides = slider.querySelectorAll('img');
            if (slides.length > 1) {
                let current = 0;
                setInterval(function () {
                    slides[current].classList.remove('is-active');
                    current = (current + 1) % slides.length;
                    slides[current].classList.add('is-active');
                }, 4000);
            }
        }

        // スクロールで出現するアニメーション（線 → 文字）
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length) {
            if ('IntersectionObserver' in window) {
                const io = new IntersectionObserver(function (entries, obs) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-inview');
                            obs.unobserve(entry.target);   // 一度だけ再生
                        }
                    });
                }, { threshold: 0.35 });
                reveals.forEach(function (el) { io.observe(el); });
            } else {
                // 非対応ブラウザは即表示
                reveals.forEach(function (el) { el.classList.add('is-inview'); });
            }
        }

        // フルスクリーン ドロワーメニュー
        const drawer   = document.getElementById('drawer');
        const menuOpen = document.getElementById('menuOpen');
        const menuClose = document.getElementById('menuClose');

        if (drawer && menuOpen) {
            const openDrawer = function () {
                drawer.classList.add('is-open');
                drawer.setAttribute('aria-hidden', 'false');
                menuOpen.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';   // 背面スクロール固定
            };
            const closeDrawer = function () {
                drawer.classList.remove('is-open');
                drawer.setAttribute('aria-hidden', 'true');
                menuOpen.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            };

            menuOpen.addEventListener('click', openDrawer);
            if (menuClose) menuClose.addEventListener('click', closeDrawer);

            // メニュー内リンクをタップしたら閉じる
            drawer.querySelectorAll('.drawer__nav a, .drawer__sub a').forEach(function (a) {
                a.addEventListener('click', closeDrawer);
            });

            // Escキーで閉じる
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
            });

            // ヒーロー（ファーストビュー）を通過したら固定ハンバーガーを表示
            const fv = document.getElementById('top');
            const onMenuScroll = function () {
                const trigger = fv ? fv.offsetHeight * 0.9 : window.innerHeight * 0.9;
                menuOpen.classList.toggle('is-show', window.pageYOffset > trigger);
            };
            window.addEventListener('scroll', onMenuScroll, { passive: true });
            onMenuScroll();
        }

        // ページトップボタンの表示切替
        if (pagetop) {
            const onScroll = function () {
                if (window.pageYOffset > 400) {
                    pagetop.classList.add('is-show');
                } else {
                    pagetop.classList.remove('is-show');
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    });
})();
