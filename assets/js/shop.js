// 西成居酒屋Ｒ  shop.js  ── オンラインショップの商品表示
(function () {
    'use strict';

    /* =========================================================
       商品データ
       ---------------------------------------------------------
       ここを書き換えるだけで商品を増減・修正できます。

       stripe : Stripeの「決済リンク」のURLを貼り付けてください。
                （Stripe管理画面 → 商品カタログ → 決済リンクを作成）
                数量の変更は、Stripe側で「数量の調整を許可」を
                オンにしておくと購入画面でお客様が選べます。
                空 '' のままだと「お電話でご注文」ボタンになります。
       badge  : 画像左上の小さなラベル。不要なら '' に。
       ========================================================= */
    const PRODUCTS = [
        {
            id: 'oden',
            name: '西成おでん 5種セット',
            sub: '大根・玉子・こんにゃく・厚揚げ・ちくわ／2人前',
            price: 1480,
            img: 'assets/image/shop/oden.jpg',
            badge: '人気',
            text: '毎日継ぎ足しの出汁でじっくり炊いたおでん。だしごと真空パックにしているので、温めるだけでお店の味です。',
            stripe: ''
        },
        {
            id: 'dote',
            name: '牛すじどて煮',
            sub: '300g（2〜3人前）',
            price: 1180,
            img: 'assets/image/shop/dote.jpg',
            badge: '',
            text: 'とろとろになるまで煮込んだ牛すじを、甘めの白味噌で仕上げました。ごはんにも日本酒にもよく合う一品です。',
            stripe: ''
        },
        {
            id: 'horumon',
            name: '味付けホルモン',
            sub: '300g／たれ込み',
            price: 1280,
            img: 'assets/image/shop/horumon.jpg',
            badge: '',
            text: '当店の看板メニュー。秘伝のたれに漬け込んだホルモンを、玉ねぎと一緒に焼くだけ。ビールが止まらなくなります。',
            stripe: ''
        },
        {
            id: 'hotaruika',
            name: 'ホタルイカ お造り',
            sub: '約150g／冷凍',
            price: 1380,
            img: 'assets/image/shop/hotaruika.jpg',
            badge: '季節限定',
            text: '春の富山湾産。ボイルではなく生のまま急速冷凍しているので、解凍するだけでとろりとした甘みが楽しめます。',
            stripe: ''
        },
        {
            id: 'motsunabe',
            name: 'もつ鍋セット',
            sub: '2人前／出汁・野菜付き',
            price: 3200,
            img: 'assets/image/shop/motsunabe.jpg',
            badge: '',
            text: '国産牛もつと、店で引いた出汁のセット。豆腐・キャベツ・ニラ・きのこも入って、鍋に移して煮るだけで完成します。',
            stripe: ''
        },
        {
            id: 'konabe',
            name: 'あったか小鍋',
            sub: '1人前／土鍋サイズ',
            price: 1680,
            img: 'assets/image/shop/konabe.jpg',
            badge: '',
            text: 'おひとり様にちょうどいい小鍋。豚バラ・厚揚げ・きのこ・青菜入りで、〆のうどんまで楽しめます。',
            stripe: ''
        },
        {
            id: 'oden-tsuika',
            name: 'おでん 追加パック',
            sub: 'お好み5個／だし付き',
            price: 880,
            img: 'assets/image/shop/oden-tsuika.jpg',
            badge: '',
            text: 'おでんセットと一緒にどうぞ。定番の具材をもう5つ、だしごとお付けします。',
            stripe: ''
        },
        {
            id: 'set-takunomi',
            name: '宅呑み晩酌セット',
            sub: 'おでん＋どて煮＋ホルモン／送料込',
            price: 4800,
            img: 'assets/image/shop/set-takunomi.jpg',
            badge: '送料無料',
            text: '迷ったらこれ。当店の人気3品をまとめたセットです。単品で揃えるより540円お得で、送料も込みになっています。',
            stripe: ''
        }
    ];

    /* =========================================================
       商品カードを組み立てて並べる
       ========================================================= */
    const grid = document.getElementById('itemGrid');
    if (!grid) return;

    // 3桁ごとにカンマを入れる（1480 → 1,480）
    function yen(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 商品名などをHTMLに埋め込む前に無害化する
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    const html = PRODUCTS.map(function (p) {
        const badge = p.badge
            ? '<span class="item-card__badge">' + esc(p.badge) + '</span>'
            : '';

        // Stripeの決済リンクが未設定のうちは電話注文のボタンにしておく
        const buy = p.stripe
            ? '<a class="item-card__buy" href="' + esc(p.stripe) + '" target="_blank" rel="noopener noreferrer">' +
              'カートに入れる<span>&rarr;</span></a>'
            : '<a class="item-card__buy is-tel" href="tel:09019593572">' +
              'お電話でご注文<span>090-1959-3572</span></a>';

        return '' +
            '<article class="item-card">' +
                '<div class="item-card__img">' +
                    '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
                    badge +
                '</div>' +
                '<div class="item-card__body">' +
                    '<h3 class="item-card__name">' + esc(p.name) + '</h3>' +
                    '<p class="item-card__sub">' + esc(p.sub) + '</p>' +
                    '<p class="item-card__text">' + esc(p.text) + '</p>' +
                    '<p class="item-card__price"><span>&yen;</span>' + yen(p.price) +
                        '<em>税込</em></p>' +
                    buy +
                '</div>' +
            '</article>';
    }).join('');

    grid.innerHTML = html;

    /* =========================================================
       商品検索（ヘッダーの検索窓で絞り込み）
       ========================================================= */
    const searchInput = document.getElementById('shopSearchInput');
    if (searchInput) {
        const cards = Array.prototype.slice.call(grid.children);

        // 該当なしのときに出すメッセージ
        const empty = document.createElement('p');
        empty.className = 'item-empty';
        empty.hidden = true;
        grid.parentNode.insertBefore(empty, grid.nextSibling);

        searchInput.addEventListener('input', function () {
            const q = searchInput.value.trim().toLowerCase();
            let hit = 0;
            cards.forEach(function (card, i) {
                const p = PRODUCTS[i];
                const found = !q ||
                    (p.name + ' ' + p.sub + ' ' + p.text).toLowerCase().indexOf(q) !== -1;
                card.hidden = !found;
                if (found) hit++;
            });
            empty.hidden = hit > 0;
            if (!hit) {
                empty.textContent = '「' + searchInput.value.trim() + '」に一致する商品は見つかりませんでした。';
            }
        });
    }
})();

/* =========================================================
   ヒーローのスライドショー
   ========================================================= */
(function () {
    'use strict';

    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dotsBox = document.getElementById('heroDots');
    const prev = slider.querySelector('.hero-slider__arrow--prev');
    const next = slider.querySelector('.hero-slider__arrow--next');
    if (slides.length < 2) return;

    let current = 0;
    let timer = null;
    const INTERVAL = 6000;

    // 下部のドットを枚数ぶん作る
    const dots = [];
    for (let i = 0; i < slides.length; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', (i + 1) + '枚目を表示');
        b.addEventListener('click', function () { go(i); });
        dotsBox.appendChild(b);
        dots.push(b);
    }

    function go(n) {
        current = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
        restart();
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(function () { go(current + 1); }, INTERVAL);
    }

    prev.addEventListener('click', function () { go(current - 1); });
    next.addEventListener('click', function () { go(current + 1); });

    // 指でのスワイプにも対応
    let startX = null;
    slider.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
        if (startX === null) return;
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50) go(current + (diff < 0 ? 1 : -1));
        startX = null;
    });

    // タブを見ていない間は止めて、戻ったら再開する
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) clearInterval(timer);
        else restart();
    });

    go(0);
})();

/* =========================================================
   文字サイズの切り替え（普通 / 大）
   ========================================================= */
(function () {
    'use strict';

    const box = document.getElementById('fontSize');
    if (!box) return;

    const buttons = box.querySelectorAll('button');

    function apply(size) {
        document.documentElement.classList.toggle('txt-lg', size === 'large');
        buttons.forEach(function (b) {
            b.classList.toggle('is-active', b.dataset.size === size);
        });
        try { localStorage.setItem('izakayaR-fontSize', size); } catch (e) { /* 保存できなくても動く */ }
    }

    buttons.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.dataset.size); });
    });

    // 前回の選択を復元
    let saved = null;
    try { saved = localStorage.getItem('izakayaR-fontSize'); } catch (e) { /* 非対応ブラウザ */ }
    if (saved) apply(saved);
})();
