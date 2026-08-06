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

        // Stripeの決済リンクを入れればそのまま本番の購入ボタンになる。
        // 未設定のうちはデモのカートに入れるボタンにしておく
        const buy = p.stripe
            ? '<a class="item-card__buy" href="' + esc(p.stripe) + '" target="_blank" rel="noopener noreferrer">' +
              'カートに入れる<span>&rarr;</span></a>'
            : '<button type="button" class="item-card__buy" data-add="' + esc(p.id) + '">' +
              'カートに入れる<span>&rarr;</span></button>';

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
       カート（デモ）
       ---------------------------------------------------------
       買い物かごの動きを体験していただくためのもので、
       実際の決済・注文は行われません。中身はブラウザに保存され、
       次に開いたときも残ります。
       商品データの stripe に決済リンクを入れると、その商品は
       本物の購入ボタンに切り替わります。
       ========================================================= */
    const SHIPPING  = 1200;     // 送料（全国一律）
    const FREE_LINE = 10000;    // この金額以上で送料無料
    const CART_KEY  = 'izakayaR-cart';

    const cartBox  = document.getElementById('cart');
    const cartBody = document.getElementById('cartBody');
    const cartFoot = document.getElementById('cartFoot');

    let items = [];   // [{ id: 'oden', qty: 2 }]
    try { items = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { items = []; }
    // 商品を削除した後などに備えて、実在するものだけ残す
    items = items.filter(function (it) { return !!product(it.id); });

    function product(id) {
        return PRODUCTS.filter(function (p) { return p.id === id; })[0];
    }
    function saveCart() {
        try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* 保存できなくても動く */ }
    }
    function totalQty() {
        return items.reduce(function (n, it) { return n + it.qty; }, 0);
    }
    function subtotal() {
        return items.reduce(function (n, it) { return n + product(it.id).price * it.qty; }, 0);
    }

    // ヘッダー・フッターのカートアイコンに個数を出す
    function paintCount() {
        const n = totalQty();
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
            el.textContent = n;
            el.hidden = n === 0;
        });
    }

    function addToCart(id, qty) {
        const found = items.filter(function (it) { return it.id === id; })[0];
        if (found) found.qty = Math.min(found.qty + (qty || 1), 99);
        else items.push({ id: id, qty: qty || 1 });
        saveCart();
        paintCount();
        renderCart();
    }
    function setQty(id, qty) {
        if (qty <= 0) {
            items = items.filter(function (it) { return it.id !== id; });
        } else {
            items.forEach(function (it) { if (it.id === id) it.qty = Math.min(qty, 99); });
        }
        saveCart();
        paintCount();
        renderCart();
    }

    function renderCart() {
        if (!cartBody || !cartFoot) return;

        if (!items.length) {
            cartBody.innerHTML =
                '<p class="cart__empty">カートに商品がありません。<br>気になる一品を「カートに入れる」から追加してください。</p>';
            cartFoot.innerHTML =
                '<button type="button" class="cart__continue" data-cart-close>買い物を続ける</button>';
            return;
        }

        cartBody.innerHTML = '<ul class="cart__list">' + items.map(function (it) {
            const p = product(it.id);
            return '' +
                '<li class="cart-row">' +
                    '<img class="cart-row__img" src="' + esc(p.img) + '" alt="" loading="lazy">' +
                    '<div class="cart-row__body">' +
                        '<p class="cart-row__name">' + esc(p.name) + '</p>' +
                        '<p class="cart-row__unit">&yen;' + yen(p.price) + '（税込）</p>' +
                        '<div class="cart-row__qty">' +
                            '<button type="button" data-minus="' + esc(p.id) + '" aria-label="' + esc(p.name) + 'を1つ減らす">－</button>' +
                            '<span>' + it.qty + '</span>' +
                            '<button type="button" data-plus="' + esc(p.id) + '" aria-label="' + esc(p.name) + 'を1つ増やす">＋</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="cart-row__right">' +
                        '<p class="cart-row__price">&yen;' + yen(p.price * it.qty) + '</p>' +
                        '<button type="button" class="cart-row__del" data-del="' + esc(p.id) + '">削除</button>' +
                    '</div>' +
                '</li>';
        }).join('') + '</ul>';

        const sub  = subtotal();
        const ship = sub >= FREE_LINE ? 0 : SHIPPING;
        const rest = FREE_LINE - sub;

        cartFoot.innerHTML = '' +
            '<dl class="cart__sums">' +
                '<div><dt>小計</dt><dd>&yen;' + yen(sub) + '</dd></div>' +
                '<div><dt>送料</dt><dd>' + (ship ? '&yen;' + yen(ship) : '無料') + '</dd></div>' +
                '<div class="cart__total"><dt>合計</dt><dd>&yen;' + yen(sub + ship) + '</dd></div>' +
            '</dl>' +
            (rest > 0
                ? '<p class="cart__free">あと&yen;' + yen(rest) + 'のお買い上げで送料無料になります。</p>'
                : '<p class="cart__free is-done">送料無料でお届けします。</p>') +
            '<button type="button" class="cart__checkout" data-checkout>ご注文手続きへ</button>' +
            '<p class="cart__note">※ こちらはデモです。実際のご注文・お支払いは行われません。' +
                'お急ぎの場合はお電話（<a href="tel:09019593572">090-1959-3572</a>）でも承ります。</p>';
    }

    // 注文完了の画面（デモ）
    function showDone() {
        const sub  = subtotal();
        const ship = sub >= FREE_LINE ? 0 : SHIPPING;
        cartBody.innerHTML = '' +
            '<div class="cart__done">' +
                '<p class="cart__done-mark" aria-hidden="true">承</p>' +
                '<p class="cart__done-title">ご注文ありがとうございます</p>' +
                '<p class="cart__done-txt">合計 &yen;' + yen(sub + ship) + ' のご注文を承りました……という流れになります。<br>' +
                    'こちらはデモのため、実際の注文・決済は行われていません。</p>' +
            '</div>';
        cartFoot.innerHTML = '<button type="button" class="cart__continue" data-cart-close>買い物を続ける</button>';
        items = [];
        saveCart();
        paintCount();
    }

    function openCart() {
        if (!cartBox) return;
        cartBox.hidden = false;
        // hidden を外した直後にクラスを付けて、滑り込む動きにする
        requestAnimationFrame(function () { cartBox.classList.add('is-open'); });
        document.body.style.overflow = 'hidden';
    }
    function closeCart() {
        if (!cartBox) return;
        cartBox.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(function () { cartBox.hidden = true; }, 300);
    }

    // 「カートに入れました」の一言（数秒で消える）
    let toast = null, toastTimer = null;
    function showToast(name) {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<span>' + esc(name) + 'をカートに入れました</span>' +
            '<button type="button" data-cart-open>カートを見る</button>';
        toast.classList.add('is-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 3200);
    }

    // クリックの受け付けはページ全体でまとめて見る
    document.addEventListener('click', function (e) {
        const add = e.target.closest('[data-add]');
        if (add) {
            const p = product(add.getAttribute('data-add'));
            if (p) { addToCart(p.id, 1); showToast(p.name); }
            return;
        }
        if (e.target.closest('[data-cart-open]')) { renderCart(); openCart(); return; }
        if (e.target.closest('[data-cart-close]')) { closeCart(); return; }
        if (e.target.closest('[data-checkout]')) { showDone(); return; }

        const plus  = e.target.closest('[data-plus]');
        const minus = e.target.closest('[data-minus]');
        const del   = e.target.closest('[data-del]');
        if (plus || minus || del) {
            const id = plus  ? plus.getAttribute('data-plus')
                     : minus ? minus.getAttribute('data-minus')
                     :         del.getAttribute('data-del');
            const now = items.filter(function (it) { return it.id === id; })[0];
            if (!now) return;
            if (del) setQty(id, 0);
            else setQty(id, now.qty + (plus ? 1 : -1));
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && cartBox && !cartBox.hidden) closeCart();
    });

    paintCount();
    renderCart();

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
