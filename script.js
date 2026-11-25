
// ========================================
// PIXELPLAY — GAME MARKETPLACE
// ========================================

// DATABASE: GAMES

const games = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        genre: "action",
        genreName: "Action RPG",
        price: 12500,
        rating: "9.2",
        tag: "BESTSELLER",
        description: "Добро пожаловать в Найт-Сити — город будущего.",
        image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=700"
    },
    {
        id: 2,
        name: "Resident Evil Village",
        genre: "horror",
        genreName: "Horror",
        price: 8900,
        rating: "9.0",
        tag: "HOT",
        description: "Выживание начинается там, где заканчивается страх.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700"
    },
    {
        id: 3,
        name: "Stardew Valley",
        genre: "indie",
        genreName: "Indie",
        price: 4500,
        rating: "9.5",
        tag: "INDIE",
        description: "Создай собственную ферму и начни новую жизнь.",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=700"
    },
    {
        id: 4,
        name: "The Last of Us",
        genre: "adventure",
        genreName: "Adventure",
        price: 10900,
        rating: "9.7",
        tag: "TOP RATED",
        description: "История о выживании в разрушенном мире.",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700"
    },
    {
        id: 5,
        name: "Elden Ring",
        genre: "rpg",
        genreName: "RPG",
        price: 14500,
        rating: "9.8",
        tag: "POPULAR",
        description: "Исследуй огромный мир и стань Повелителем Элдена.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700"
    },
    {
        id: 6,
        name: "Minecraft",
        genre: "adventure",
        genreName: "Sandbox",
        price: 6500,
        rating: "9.4",
        tag: "CLASSIC",
        description: "Строй, исследуй и создавай собственную вселенную.",
        image: "https://images.unsplash.com/photo-1603481546238-487240415921?w=700"
    },
    {
        id: 7,
        name: "Little Nightmares",
        genre: "horror",
        genreName: "Horror",
        price: 3900,
        rating: "8.9",
        tag: "DARK",
        description: "Странный мир, полный кошмаров и загадок.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700"
    },
    {
        id: 8,
        name: "Hades",
        genre: "indie",
        genreName: "Indie",
        price: 5200,
        rating: "9.6",
        tag: "EDITOR'S PICK",
        description: "Попробуй сбежать из подземного царства.",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700"
    },
    {
        id: 9,
        name: "The Witcher 3",
        genre: "rpg",
        genreName: "RPG",
        price: 7900,
        rating: "9.8",
        tag: "LEGEND",
        description: "Стань ведьмаком и отправься на поиски приключений.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700"
    }
];


// ========================================
// STORAGE
// ========================================

function getStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let cart = getStorage("pixelplay_cart", []);
let users = getStorage("pixelplay_users", []);
let currentUser = getStorage("pixelplay_current_user", null);


// ========================================
// HELPERS
// ========================================

const $ = (selector) => document.querySelector(selector);

function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₸";
}

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageName) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = $("#" + pageName);

    if (!target) return;

    target.classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === pageName
        );
    });

    $("#cart-count").textContent = cart.length;

    if (pageName === "cart") {
        renderCart();
    }

    if (pageName === "profile") {
        renderProfile();
    }

    $("#catalog").scrollIntoView({ behavior: "instant" });
    window.scrollTo({ top: 0, behavior: "smooth" });

    $("#nav-placeholder");
    $(".nav").classList.remove("open");
}

document.addEventListener("click", event => {
    const pageLink = event.target.closest("[data-page]");
    const goButton = event.target.closest("[data-go]");

    if (pageLink) {
        event.preventDefault();
        showPage(pageLink.dataset.page);
    }

    if (goButton) {
        showPage(goButton.dataset.go);
    }
});


// ========================================
// GAME CARDS
// ========================================

function createGameCard(game) {
    return `
        <article class="game-card">
            <div class="game-cover">
                <img
                    src="${game.image}"
                    alt="${game.name}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >
                <span class="game-tag">${game.tag}</span>
            </div>

            <div class="game-info">
                <span class="game-genre">${game.genreName}</span>

                <h3>${game.name}</h3>

                <p class="game-description">
                    ${game.description}
                </p>

                <div class="game-bottom">
                    <span class="game-price">
                        ${formatPrice(game.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${game.id}"
                    >
                        + В КОРЗИНУ
                    </button>
                </div>

                <div style="
                    color:#ffd36b;
                    font-size:10px;
                    margin-top:13px;
                ">
                    ★ ${game.rating} / 10
                </div>
            </div>
        </article>
    `;
}


// ========================================
// FEATURED GAMES
// ========================================

function renderFeatured() {
    $("#featured-games").innerHTML =
        games.slice(0, 3).map(createGameCard).join("");
}


// ========================================
// CATALOG AND SEARCH
// ========================================

function renderCatalog() {
    const search = $("#search").value
        .trim()
        .toLowerCase();

    const genre = $("#genre-filter").value;
    const sort = $("#sort-filter").value;

    let filtered = games.filter(game => {
        const matchesSearch =
            game.name.toLowerCase().includes(search) ||
            game.genreName.toLowerCase().includes(search);

        const matchesGenre =
            genre === "all" || game.genre === genre;

        return matchesSearch && matchesGenre;
    });

    if (sort === "cheap") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "expensive") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        filtered.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    $("#catalog-games").innerHTML =
        filtered.map(createGameCard).join("");

    $("#catalog-total").textContent =
        filtered.length + " GAMES";

    $("#no-games").classList.toggle(
        "hidden",
        filtered.length !== 0
    );
}

$("#search").addEventListener("input", renderCatalog);
$("#genre-filter").addEventListener("change", renderCatalog);
$("#sort-filter").addEventListener("change", renderCatalog);


// ========================================
// CART
// ========================================

function saveCart() {
    saveStorage("pixelplay_cart", cart);
    $("#cart-count").textContent = cart.length;
}

function addToCart(id) {
    const game = games.find(item => item.id === id);

    if (!game) return;

    if (cart.some(item => item.id === id)) {
        showToast("Эта игра уже в корзине!");
        return;
    }

    cart.push(game);
    saveCart();

    showToast("✓ " + game.name + " добавлена в корзину!");

    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    renderCart();

    showToast("Игра удалена из корзины.");
}

function renderCart() {
    const container = $("#cart-items");

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div>🕹️</div>
                <h3>ТВОЯ КОРЗИНА ПУСТА</h3>
                <p>Похоже, приключения ещё не начались.</p>
                <button class="pixel-button" data-go="catalog">
                    НАЙТИ ИГРУ →
                </button>
            </div>
        `;

        $("#subtotal").textContent = formatPrice(0);
        $("#total").textContent = formatPrice(0);
        return;
    }

    container.innerHTML = cart.map(game => `
        <div class="cart-item">
            <img src="${game.image}" alt="${game.name}">

            <div class="cart-item-info">
                <h3>${game.name}</h3>
                <p>${formatPrice(game.price)}</p>
            </div>

            <button
                class="remove-button"
                data-remove="${game.id}"
                title="Удалить"
            >×</button>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, game) => sum + game.price,
        0
    );

    $("#subtotal").textContent = formatPrice(total);
    $("#total").textContent = formatPrice(total);
}

// Event delegation for game and cart buttons

document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const removeButton = event.target.closest("[data-remove]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});


// ========================================
// AUTH MODAL
// ========================================

let authMode = "login";

function openAuth() {
    $("#auth-modal").classList.remove("hidden");
    $("#auth-message").textContent = "";
}

function closeAuth() {
    $("#auth-modal").classList.add("hidden");
}

$("#auth-open").addEventListener("click", () => {
    if (currentUser) {
        showPage("profile");
    } else {
        openAuth();
    }
});

$("#auth-close").addEventListener("click", closeAuth);

$("#auth-modal").addEventListener("click", event => {
    if (event.target === $("#auth-modal")) {
        closeAuth();
    }
});

function setAuthMode(mode) {
    authMode = mode;

    document.querySelectorAll(".auth-tab").forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.auth === mode
        );
    });

    $("#name-label").classList.toggle(
        "hidden",
        mode !== "register"
    );

    $("#auth-name").required = mode === "register";

    $("#auth-title").innerHTML =
        mode === "login"
            ? 'WELCOME <span>BACK!</span>'
            : 'JOIN <span>PIXELPLAY!</span>';

    $("#auth-submit").textContent =
        mode === "login"
            ? "ВОЙТИ В ИГРУ →"
            : "СОЗДАТЬ АККАУНТ →";

    $("#auth-message").textContent = "";
}

document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        setAuthMode(tab.dataset.auth);
    });
});


// ========================================
// REGISTRATION AND LOGIN
// ========================================

$("#auth-form").addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#auth-email").value.trim().toLowerCase();
    const password = $("#auth-password").value;
    const name = $("#auth-name").value.trim();

    const message = $("#auth-message");

    if (password.length < 6) {
        message.textContent =
            "Пароль должен содержать минимум 6 символов.";
        return;
    }

    if (authMode === "register") {

        if (users.some(user => user.email === email)) {
            message.textContent =
                "Этот email уже зарегистрирован.";
            return;
        }

        if (name.length < 2) {
            message.textContent =
                "Имя должно содержать минимум 2 символа.";
            return;
        }

        const newUser = {
            name,
            email,
            password,
            purchases: []
        };

        users.push(newUser);
        saveStorage("pixelplay_users", users);

        currentUser = {
            name: newUser.name,
            email: newUser.email
        };

        saveStorage("pixelplay_current_user", currentUser);

        closeAuth();
        updateHeader();
        renderProfile();

        showToast("Добро пожаловать в PIXELPLAY!");

    } else {

        const user = users.find(user =>
            user.email === email &&
            user.password === password
        );

        if (!user) {
            message.textContent =
                "Неверный email или пароль.";
            return;
        }

        currentUser = {
            name: user.name,
            email: user.email
        };

        saveStorage("pixelplay_current_user", currentUser);

        closeAuth();
        updateHeader();

        showToast("Успешный вход! Привет, " + user.name);
    }

    $("#auth-form").reset();
});


// ========================================
// PROFILE
// ========================================

function updateHeader() {
    $("#auth-open").textContent = currentUser
        ? "◉ " + currentUser.name.toUpperCase()
        : "◉ ВОЙТИ";
}

function renderProfile() {
    if (!currentUser) {
        openAuth();
        return;
    }

    const user = users.find(
        item => item.email === currentUser.email
    );

    $("#profile-name").textContent = currentUser.name;
    $("#profile-email").textContent = currentUser.email;

    $("#profile-games").textContent =
        user ? user.purchases.length : 0;
}

$("#logout").addEventListener("click", () => {
    currentUser = null;

    localStorage.removeItem("pixelplay_current_user");

    updateHeader();

    showPage("home");

    showToast("Ты вышел из аккаунта.");
});


// ========================================
// CHECKOUT
// ========================================

$("#checkout").addEventListener("click", () => {

    if (cart.length === 0) {
        showToast("Сначала добавь игры в корзину.");
        return;
    }

    if (!currentUser) {
        showToast("Войди в аккаунт для оформления заказа.");
        openAuth();
        return;
    }

    const confirmed = confirm(
        "Демонстрационная покупка.\n\n" +
        "Количество игр: " + cart.length + "\n" +
        "Сумма: " +
        formatPrice(cart.reduce(
            (sum, game) => sum + game.price,
            0
        )) +
        "\n\nПодтвердить тестовую покупку?"
    );

    if (!confirmed) return;

    const user = users.find(
        item => item.email === currentUser.email
    );

    if (!user) {
        showToast("Ошибка аккаунта.");
        return;
    }

    user.purchases.push(...cart.map(game => ({
        id: game.id,
        name: game.name,
        price: game.price
    })));

    saveStorage("pixelplay_users", users);

    cart = [];
    saveCart();
    renderCart();
    renderProfile();

    showToast("✓ Тестовый заказ успешно оформлен!");

    showPage("profile");
});


// ========================================
// MOBILE MENU
// ========================================

$("#mobile-menu").addEventListener("click", () => {
    $(".nav").classList.toggle("open");
});


// ========================================
// INITIALIZATION
// ========================================

function init() {
    renderFeatured();
    renderCatalog();
    renderCart();
    updateHeader();

    $("#cart-count").textContent = cart.length;
}

init();
