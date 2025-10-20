// קרוסלה לדף הבית
const nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel');

    let list = null,
        item = null,
        runningTime = null;

if(carousel){

    list = carousel.querySelector('.list'),
    item = carousel.querySelectorAll('.item'),
    runningTime = carousel.querySelector('.time_running');
}

let timeRunning = 3000;
let timeAutoNext = 7000;

if(nextBtn){
    nextBtn.addEventListener('click', () => {
        showSlider('next');
    });
}

if(prevBtn){
    prevBtn.addEventListener('click', () => {
        showSlider('prev');
    });
}


let runTimeOut;
let runNextAuto = null;

if(nextBtn) {
    runNextAuto = setTimeout(() => {
        if(nextBtn && typeof nextBtn.click === 'function') nextBtn.click(); 
    }, timeAutoNext);
}


function resetTimeAnimation() {
    if(!runningTime) return;
    runningTime.style.animation = 'none';
    runningTime.offsetHeight; // trigger reflow
    runningTime.style.animation = null;
    runningTime.style.animation = 'runningTime 7s linear 1 forwards';
}

function showSlider(type) {
    if(!list || !carousel) return;

    let sliderItemsDom = list.querySelectorAll('.carousel .list .item');
    if(!sliderItemsDom || sliderItemsDom.length === 0) return;  

    if (type === 'next') {
        list.appendChild(sliderItemsDom[0]);
        carousel.classList.add('next');
    } else if (type === 'prev') {
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        carousel.classList.add('prev');
    }

    clearTimeout(runTimeOut);

    runTimeOut = setTimeout(() => {
        if(carousel){
        carousel.classList.remove('next');
        carousel.classList.remove('prev');
        }
    }, timeRunning);

    if(runNextAuto) clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        if(nextBtn && typeof nextBtn.click === 'function'){
            nextBtn.click();    
        }
    }, timeAutoNext);

    resetTimeAnimation(); // איפוס אנימציית פס ריצה
}

// הפעלת אנימציה של פס הזמן 
resetTimeAnimation();

// פתיחת תפריט ניווט ראשי 
let openSideMenu = document.querySelector('.header_filter');
openSideMenu.addEventListener('click', openSideMenuFunction);

function openSideMenuFunction(event) {
    let sideMenu = document.querySelector('.side_menu');
    sideMenu.classList.toggle('side_menu_open');

    let menuOverlay = document.querySelector('.menu_overlay');
    menuOverlay.style.display = 'block';
}

// סגירת תפריט ניווט ראשי
let closeSideMenu = document.querySelector('.menu_close_icon');
closeSideMenu.addEventListener('click', closeSideMenuFunction);

function closeSideMenuFunction(event) {
    let sideMenu = document.querySelector('.side_menu');
    sideMenu.classList.toggle('side_menu_open');

    let menuOverlay = document.querySelector('.menu_overlay');
    menuOverlay.style.display = 'none';
}

// סגירת תפריט בלחיצה על פקודת ניווט ומעבר לעמוד המבוקש
let sideMenuLink = document.querySelectorAll('.side_a_nav');
sideMenuLink.forEach(element => {
    element.addEventListener('click', closeSideMenuFunction);
})

// סגירת ופתיחה של תפריט קטלוג
let changeSideCatalog = document.querySelector('.quick_filter');
if(changeSideCatalog){
    changeSideCatalog.addEventListener('click', changeSideCatalogFunction);
}

function changeSideCatalogFunction(event) {
    let sideFilter = document.querySelector('.side_filter');
    sideFilter.classList.toggle('side_filter_open');

    let catalogOverlay = document.querySelector('.catalog_overlay');

    let footer = document.querySelector('footer');
    let header = document.querySelector('#catalog_header');
        header.classList.toggle('catalog_header');
    let sortCatalogBoxQuery = document.querySelector('#sort_catalog_box');
        sortCatalogBoxQuery.classList.toggle('sort_catalog_box');


    if (sideFilter.classList == 'side_filter side_filter_open'){
        catalogOverlay.style.display = 'block';
        footer.style.position = 'fixed';
        
    }
    else {
        catalogOverlay.style.display = 'none';
        footer.style.position = 'static';
    }
}

// בדיקה אם כבר מחובר
const loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
const loggedUser = loggedUsers.find(user => user.isLoggedIn);
if(loggedUser && window.location.href.includes('Account%20Page.html')){
    //אם כבר מחובר - מעבר לדף פרופיל
    window.location.href = '../profile.html'; 
}

// התחברות משתמש
const loginBtn = document.querySelector('#login_submit');
if(loginBtn){
    loginBtn.addEventListener('click', async () => {
        const userName = document.querySelector('#logusername').value.trim();
        const userPassword = document.querySelector('#logpassword').value.trim();

        // בדיקה בסיסית של שדות ריקים   
        if(!userName || !userPassword){
            alert('Please fill in all fields.');
            return
        }

        // שליחת בקשת התחברות לשרת
        try {
            // בקשת פאץ' לusers.json
            const response = await fetch('../data/users.json');
            const users = await response.json();

            // בדיקת התאמה של שם משתמש וסיסמה
            const user = users.find(user => user.username === userName && user.password === userPassword);

            if(user){
                let loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
                loggedUsers.push({
                    name: user.name,
                    email: user.email,
                    isLoggedIn: true
                });
                localStorage.setItem('loggedInUsers', JSON.stringify(loggedUsers));
                alert('Login successful! Welcome, ' + userName);
                window.location.href = '../profile.html';

            }
            else{
                alert('Invalid username or password. Please try again.');
            }
        }

        catch (error) {
            console.error('Error during login:', error);
            alert('could not connect to server. Please try again later.');
        }
    });

}

const signOutBtn = document.querySelector('#sign_out');
if(signOutBtn){
    signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let loggedUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];

        loggedUsers = loggedUsers.map(user => ({
            ...user,
            isLoggedIn: false
        }));

        localStorage.setItem('loggedInUsers', JSON.stringify(loggedUsers));
        window.location.href = '/account/Account Page.html';
    });
}

// הכנסת מוצרים מג'ייסון לקטלוג 
fetch('../data/products.json')
    .then(response => response.json())
    .then(products => {
        // ספירת מלאי  מוצרים כולל
        let totalItemsInShop = 0;
        const productQty = products.forEach(product => {
            totalItemsInShop++;
        });
        const totalInStock = document.querySelector('.total_in_stock')
        if(totalInStock){
            totalInStock.textContent = `Discover ${totalItemsInShop} Guitar Products Curated For You`;
        }

        // הכנסה של 4 מוצרים הכי נמכרים
        const topSales = products
            .sort((a, b) => b.topSale - a.topSale)
            .slice(0, 4);

        // בניית כרטיס מוצר פופולארי
        topSales.forEach(product => {
            productCreator(product);
        })

        // בדיקת כתובת אתר וקריאה לפונקצית בניית דף מוצר
        if(window.location.href.includes('Product%20Page.html')){
            const urlId = window.location.href.split('=')[2].split('&')[0];
            const product = products.find(productId => productId.id === urlId);
            if(product){
                pdpCreator(product);
            }

            else{
                console.warn('id is not found', urlId);
            }
        }

        // במידה וזה לא דף מוצר - יצירת קטלוג עם סינון אינטראקטיבי
        else{
            if(window.location.href.includes('catalog.html')){
                initCatalogFiltering(products);
            } else {
                products.forEach(product => {
                    creator(product);
                });
            }
        }

        // סינון מוצרים לפי חיפוש
        const search = document.querySelector('#search');
        search.addEventListener('input', function() {
            // מחק תיבת הצעות קודמות אם קיימת 
            const existingSuggestions = document.querySelector('.suggestions_box');
            if (existingSuggestions) {
                existingSuggestions.remove();
            }

            const searchTerm = search.value.toLowerCase();
            let filteredProducts = []; // אתחול מערך למוצרים מסוננים

            // טיפול בלחיצה על אנטר 
            search.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // למנוע את פעולת ברירת המחדל של הטופס
                    const searchTerm = search.value.toLowerCase();
                    if (filteredProducts.length > 0) {
                        // שמירת תוצאות החיפוש בלוקאלסטורג
                        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
                        // מעבר לעמוד תוצאות החיפוש
                        window.location.href = `../catalog/catalog.html?search=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });

            if (searchTerm.length >= 2) {
                filteredProducts = products.filter(product => {
                    return product.manufacturer.toLowerCase().includes(searchTerm) || 
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm);
                });

                // מחזיר את שמות המוצרים מתוך האובייקטים הנבחרים
                const filteredProductsNames = filteredProducts.map(product => product.name); 
                console.log('filteredProductsNames:', filteredProductsNames);

                // יצירת תיבת הצעות
                if (filteredProducts.length > 0) {
                    const suggestionsBox = document.createElement('div');
                    suggestionsBox.classList.add('suggestions_box');
                    suggestionsBox.style.width = '100%';
                    suggestionsBox.style.height = 'auto';
                    suggestionsBox.style.maxHeight = '300px';
                    suggestionsBox.style.backgroundColor = 'white';
                    suggestionsBox.style.position = 'absolute';
                    suggestionsBox.style.top = '90%';
                    suggestionsBox.style.left = '0';
                    suggestionsBox.style.zIndex = '997';
                    suggestionsBox.style.border = '1px solid black';
                    suggestionsBox.style.borderTop = '1px solid white';
                    suggestionsBox.style.borderBottomLeftRadius = '8px';
                    suggestionsBox.style.borderBottomRightRadius = '8px';
                    suggestionsBox.style.overflowY = 'auto';
                    suggestionsBox.style.opacity = '0'; // התחלה שקוף
                    suggestionsBox.style.transform = 'translateY(-10px)'; // התחלה למעלה
                    suggestionsBox.style.scrollbarWidth = 'thin';

                    // אנימציה של הופעה 
                    suggestionsBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                    // הוספת מוצרים לתיבת ההצעות
                    filteredProducts.forEach(product => { 
                        const suggestion = document.createElement('div');
                        suggestion.style.padding = '10px';
                        suggestion.style.borderbottom = '1px solid #eee';
                        suggestion.style.cursor = 'pointer';
                        suggestion.style.display = 'flex';
                        suggestion.style.alignItems = 'center';
                        suggestion.style.justifyContent = 'space-between';

                        // הוספת שם מוצר
                        const textDiv = document.createElement('div');
                        textDiv.textContent = product.name;
                        textDiv.style.flex = '1';

                        // הוספת תמונת מוצר 
                        const previewImg = document.createElement('img');
                        previewImg.src = product.img;
                        previewImg.alt = product.name;
                        previewImg.style.width = '40px';
                        previewImg.style.height = '40px';
                        previewImg.style.objectFit = 'cover';
                        previewImg.style.marginLeft = '10px';
                        previewImg.style.borderRadius = '4px';

                        // הוספת אירוע לחיצה על הצעה
                        suggestion.addEventListener('click', () => {
                            const urlParams = new URLSearchParams();
                            urlParams.append('category', product.category);
                            urlParams.append('id', product.id);
                            urlParams.append('name', product.name);
                            window.location.href = `../product page/Product Page.html?${urlParams.toString()}`; 
                        });

                        suggestion.appendChild(textDiv);
                        suggestion.appendChild(previewImg);
                        suggestionsBox.appendChild(suggestion);
                    });

                    // הוספת תיבת ההצעות מתחת לשדה החיפוש
                    const container = document.querySelector('.search_box');
                    if (container){
                        container.style.position = 'relative'; // וודא שהמכולה יחסית    
                        container.appendChild(suggestionsBox);
                        // הפעלת האנימציה לאחר הוספה לדום
                        requestAnimationFrame(() => {
                            suggestionsBox.style.opacity = '1'; // הופעה
                            suggestionsBox.style.transform = 'translateY(0)'; // למקום הנכון
                        });

                    }
                }
            }    
        });
    })
    .catch(error => console.error('error in json:', error));

 

// פונקציה ראשית המפעילה את כל הפונקציות לאחר קבלת נתונים מהשרת
function creator(product){
    const currentPath = window.location.pathname;
    
    // דף קטלוג
    if(currentPath.includes('catalog')){
        catalogProductCreator(product);
    }

    //  השמה של אירוע על האייקונים שבתוך כרטיסיית המוצר על מנת להוסיף למועדפים ולעגלה
    const allProducts = document.querySelectorAll('.catalog_product_box').forEach(product => {
    const heart = product.querySelector('.heart_icon');
    if(heart)
        heart.addEventListener('click', saveToWishlist);

    const cart = product.querySelector('.cart_icon');
    if(cart)
        cart.addEventListener('click', saveToCart);
    });

    // קריאה לפונקציות צבע אייקון בהתאם ללוקאלסטורג
    updateWishlistIcon();
    updateCartIcon();
}

// בניית כרטיסיית מוצר 
function productCreator(product){

    // יצירת קופסא ראשית למוצר
    const productBox = document.createElement('div');
    productBox.classList.add('product_box');
    productBox.id = product.id;
    productBox.setAttribute("data-stock", product.stock || 1);

    // יצירת תיבת התמונה
    const productImgBox = document.createElement('div');
    productImgBox.classList.add('product_img_box');

    const productImg = document.createElement('img');
    productImg.classList.add('product_img');
    productImg.src = product.img;

    productImgBox.appendChild(productImg);

    // יצירת הפס העליון (לוגו + אייקונים)
    const productTopBar = document.createElement('div');
    productTopBar.classList.add('product_top_bar');

    const productLogoImg = document.createElement('img');
    productLogoImg.classList.add('product_logo_img');
    productLogoImg.src = product.logo;

    const productAction = document.createElement('div');
    productAction.classList.add('product_action');

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-solid', 'fa-heart', 'heart_icon')

    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'cart_icon');

    productAction.appendChild(heartIcon);
    productAction.appendChild(cartIcon);

    productTopBar.appendChild(productLogoImg);
    productTopBar.appendChild(productAction);

    // יצירת תיבת מידע 
    const info = document.createElement('div');
    info.classList.add('info');

    // כותרת מוצר
    const h3Box = document.createElement('div');
    h3Box.classList.add('h3_box');

    const productName = document.createElement('h3');
    productName.classList.add('product_name')
    productName.textContent = product.name;
    h3Box.appendChild(productName);

    // תיאור ממוצר
    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('description_box');

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = product.description;

    descriptionBox.appendChild(description);

    // יצירת הפס התחתון (מחיר + כפתור)
    const productBottomBar = document.createElement('div');
    productBottomBar.classList.add('product_bottom_bar');

    // תיבת מחיר 
    const priceBox = document.createElement('div');
    priceBox.classList.add('price_box');

    const originalPriceBox = document.createElement('div');
    originalPriceBox.classList.add('original_price_box');

    const originalPrice = document.createElement('h4');
    originalPrice.classList.add('original_price');
    originalPrice.textContent = product.originalPrice;

    const discount = document.createElement('p');
    discount.classList.add('discount');
    discount.textContent = product.discount;

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('cost');
    finalPrice.textContent = product.finalPrice;

    priceBox.appendChild(originalPriceBox);
    priceBox.appendChild(finalPrice);

    // כפתור קניה
    const buyButton = document.createElement('button');
    buyButton.classList.add('buy');

    const buyLink = document.createElement('a');
    buyLink.href = `../product page/Product Page.html?category=${encodeURIComponent(product.category)}&id=${product.id}&name=${encodeURIComponent(product.name)}`;
    buyLink.textContent = 'Buy Now';

    buyButton.appendChild(buyLink);

    // חיבור החלקים 
    productBottomBar.appendChild(priceBox);
    productBottomBar.appendChild(buyButton);

    info.appendChild(h3Box);
    info.appendChild(descriptionBox);
    info.appendChild(productBottomBar);

    productBox.appendChild(productImgBox);
    productBox.appendChild(productTopBar);
    productBox.appendChild(info);

    // הכנסת כרטיס מוצר לדום
    const container = document.querySelector('#sale_products');
    if (container){
        container.appendChild(productBox);
    }
}

// בניית כרטיסיית מוצר לקטלוג
function catalogProductCreator(product){

    // יצירת קופסא ראשית למוצר
    const catalogProductBox = document.createElement('div');
    catalogProductBox.classList.add('catalog_product_box');
    catalogProductBox.id = product.id;
    catalogProductBox.setAttribute("data-stock", product.stock || 1);

    // יצירת תיבת התמונה
    const productImgBox = document.createElement('div');
    productImgBox.classList.add('product_img_box');

    const productImg = document.createElement('img');
    productImg.classList.add('product_img');
    productImg.src = product.img;

    productImgBox.appendChild(productImg);

    // יצירת הפס העליון (לוגו + אייקונים)
    const productTopBar = document.createElement('div');
    productTopBar.classList.add('product_top_bar');

    const productLogoImg = document.createElement('img');
    productLogoImg.classList.add('product_logo_img');
    productLogoImg.src = product.logo;

    const productAction = document.createElement('div');
    productAction.classList.add('product_action');

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-solid', 'fa-heart', 'heart_icon')

    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'cart_icon');

    productAction.appendChild(heartIcon);
    productAction.appendChild(cartIcon);

    productTopBar.appendChild(productLogoImg);
    productTopBar.appendChild(productAction);

    // יצירת תיבת מידע 
    const info = document.createElement('div');
    info.classList.add('info');

    // כותרת מוצר
    const h3Box = document.createElement('div');
    h3Box.classList.add('h3_box');

    const productName = document.createElement('h3');
    productName.classList.add('product_name')
    productName.textContent = product.name;
    h3Box.appendChild(productName);

    // תיאור ממוצר
    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('description_box');

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = product.description;

    descriptionBox.appendChild(description);

    // יצירת הפס התחתון (מחיר + כפתור)
    const productBottomBar = document.createElement('div');
    productBottomBar.classList.add('product_bottom_bar');

    // תיבת מחיר 
    const priceBox = document.createElement('div');
    priceBox.classList.add('price_box');

    const originalPriceBox = document.createElement('div');
    originalPriceBox.classList.add('original_price_box');

    const originalPrice = document.createElement('h4');
    originalPrice.classList.add('original_price');
    originalPrice.textContent = product.originalPrice;

    const discount = document.createElement('p');
    discount.classList.add('discount');
    discount.textContent = product.discount;

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('cost');
    finalPrice.textContent = product.finalPrice;

    priceBox.appendChild(originalPriceBox);
    priceBox.appendChild(finalPrice);

    // כפתור קניה
    const buyButton = document.createElement('button');
    buyButton.classList.add('buy');

    const buyLink = document.createElement('a');
    buyLink.href = `../product page/Product Page.html?category=${encodeURIComponent(product.category)}&id=${product.id}&name=${encodeURIComponent(product.name)}`;
    buyLink.textContent = 'Buy Now';

    buyButton.appendChild(buyLink);

    // חיבור החלקים 
    productBottomBar.appendChild(priceBox);
    productBottomBar.appendChild(buyButton);

    info.appendChild(h3Box);
    info.appendChild(descriptionBox);
    info.appendChild(productBottomBar);

    catalogProductBox.appendChild(productImgBox);
    catalogProductBox.appendChild(productTopBar);
    catalogProductBox.appendChild(info);

    // הכנסת כרטיס מוצר לדום
    if (window.location.href.includes('catalog.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category');

        if(product.category == urlCategory){
            document.querySelector('.sort_filter h1').textContent = urlCategory + ' catalog';
            const container = document.querySelector('#catalog');
            if (container){
                container.appendChild(catalogProductBox);
            }        
        }
       
    }
}

// השמה של ארוע שמרענן את הדפים
document.addEventListener('DOMContentLoaded', () => {
    getItemsFromWishlist();
    getItemsFromCart();

    // בדיקת כתובת אתר וקריאה לפונקצית בניית דף מוצר
    if(window.location.href.includes('Product%20Page.html')){
        const urlId = window.location.href.split('=')[2].split('&')[0];
        pdpCreator(product);
    }
});

// שמירת הנתונים של המוצר בלוקאלסטורג' למועדפים + צביעה של אייקון לב באדום
function saveToWishlist(event){
    const heartIconClick = event.currentTarget;
    if(heartIconClick.classList.contains('heart_icon_click')){
        heartIconClick.classList.remove('heart_icon_click');
    }
    else{
        heartIconClick.classList.add('heart_icon_click');
    }

    // מציאת כרטיס המוצר 
    const productBox = heartIconClick.closest('.catalog_product_box');

    // שליפת נתונים מתוך הכרטיס הנבחר 
    const productId = productBox.id;
    const name = productBox.querySelector('.product_name')?.textContent.trim();
    const description = productBox.querySelector('.description')?.textContent.trim();
    const image = productBox.querySelector('.product_img')?.src;
    const logo = productBox.querySelector('.product_logo_img')?.src;
    const originalPrice = productBox.querySelector('.original_price')?.textContent.trim();
    const discount = productBox.querySelector('.discount')?.textContent.trim();
    const finalPrice = productBox.querySelector('.cost')?.textContent.trim();
    const stock = parseInt(productBox.dataset.stock) || 1;
    const buyLink = productBox.querySelector('.buy')?.href;

    // מבנה נתונים לשמירה
    const wishlistProductData = {
        id: productId,
        name: name,
        description: description,
        image: image,
        logo: logo,
        originalPrice: originalPrice,
        discount: discount,
        finalPrice: finalPrice,
        stock: stock,
        buyLink: buyLink
    };


    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if(heartIconClick.classList.contains('heart_icon_click')){
        if(existingIndex === -1){
            wishlist.push(wishlistProductData);
        }
    }
    else{
        if(existingIndex !== -1){
            wishlist.splice(existingIndex, 1)
        }
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// עדכון צבע אייקון לב בהתאם ללוקאלסטורג לאחר רענון
function updateWishlistIcon() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.forEach(savedItem => {
        const productBox = document.getElementById(savedItem.id);
        if(productBox) {
            const heart = productBox.querySelector('.heart_icon');
            if(heart){
                heart.classList.add('heart_icon_click');
            }
        }
    });
}

// טעינת מוצרים מלוקלסטורג + זימון פונקציית בניה של כרטיס מועדפים
function getItemsFromWishlist() {
    const getWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.querySelector('#wishlist_ul');
    if(!container){
        console.warn('container is not found')
        return;
    }

    container.innerHTML = '';

    if (getWishlist.length === 0){
        return;
    }

    getWishlist.forEach(product => {
        wishlistCreator(product);
    });

    // קריאה לפונקציה שמזינה אירוע עבור מחיקת מוצר
    wishlistDeleteEvents();

    const qtyInWishlist = document.querySelector('.qty_in_wishlist');
    if(qtyInWishlist){
        qtyInWishlist.textContent = 'Total: ' + getWishlist.length + ' items in your Wishlist';
    }


    // זימון פונקציה של מחיר כולל של המוצרים 
    updateSubtotal('wishlist', '.wishlist_subtotal');
}

// בניית כרטיס מועדפים 
function wishlistCreator(wishlistProductData){
    // יצירת אלמנט ליסט
    const wishlistItem = document.createElement('li');
    wishlistItem.setAttribute('data-id', wishlistProductData.id)

    // תיבת מוצר מועדפים
    const wishlistBox = document.createElement('div');
    wishlistBox.classList.add('wishlist_product_box');

    // תמונת מוצר
    const imgBox  = document.createElement('div');
    imgBox .classList.add('wishlist_img');

    const img = document.createElement('img');
    img.src = wishlistProductData.image;
    img.alt = '';

    imgBox.appendChild(img);

    // תיאור מוצר
    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('wishlist_description');

    // תיבת מחיר
    const priceBox = document.createElement('div');
    priceBox.classList.add('wishlist_price_box');

    const originalPriceBox = document.createElement('div');
    originalPriceBox.classList.add('wishlist_original_price_box');

    const originalPrice = document.createElement('h4');
    originalPrice.textContent = wishlistProductData.originalPrice;

    const discount = document.createElement('p');
    discount.textContent = wishlistProductData.discount;

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('wishlist_cost');
    finalPrice.textContent = wishlistProductData.finalPrice;

    priceBox.appendChild(originalPriceBox);
    priceBox.appendChild(finalPrice);

    // שם המוצר (בתוספת לינק)
    const nameBox = document.createElement('div');
    nameBox.classList.add('wishlist_product_name');

    const nameH3 = document.createElement('h3');
    const nameLink = document.createElement('a');
    nameLink.href = wishlistProductData.buyLink;
    nameLink.textContent = wishlistProductData.name;

    nameH3.appendChild(nameLink);
    nameBox.appendChild(nameH3);

    // תיאור המוצר 
    const descTextBox = document.createElement('div');
    descTextBox.classList.add('wishlist_product_description');

    const descP = document.createElement('p');
    descP.textContent = wishlistProductData.description;
    descTextBox.appendChild(descP);

    // כפתור דחיפה לעגלה
    const moveBtn = document.createElement('button');

    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fa-solid', 'fa-cart-shopping');

    moveBtn.appendChild(cartIcon);
    moveBtn.append('Move to Cart');

    // אייקון מחיקה
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('delete_product', 'fa-solid', 'fa-xmark');

    // חיבור החלקים
    descriptionBox.appendChild(priceBox);
    descriptionBox.appendChild(nameBox);
    descriptionBox.appendChild(descTextBox);
    descriptionBox.appendChild(moveBtn);

    wishlistBox.appendChild(imgBox);
    wishlistBox.appendChild(descriptionBox);
    wishlistBox.appendChild(deleteIcon);

    wishlistItem.appendChild(wishlistBox);

    // הכנסת כרטיס מועדפים לדום
    document.querySelector('#wishlist_ul').appendChild(wishlistItem);
};

// בניית פונקציה שמזינה אירוע לכל הפריטים למחיקת המוצר בווישליסט
function wishlistDeleteEvents(){
    const deleteButtons = document.querySelectorAll('.delete_product');
    deleteButtons.forEach(button => {
        button.addEventListener('click', removeFromWishlist)
    });
}

// פונקציה למחיקת פריט ווישליסט מהדום ומהזיכרון
function removeFromWishlist(event){
    // מחיקת פריט מהדום
    const deleteBtn = event.currentTarget;
    const listItem = deleteBtn.closest('li');
    if(!listItem){
        return;
    }
    listItem.remove();

    const productId = listItem.getAttribute('data-id');
    
    // מחיקה פריט מהזיכרון
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    const qtyInWishlist = document.querySelector('.qty_in_wishlist');
    if(qtyInWishlist){
        qtyInWishlist.textContent = 'Total: ' + wishlist.length + ' items in your Wishlist';
    }

    updateSubtotal('wishlist', '.wishlist_subtotal');
}

// שמירת הנתונים של המוצר בלוקאלסטורג' לעגלה + צביעה של אייקון עגלה באדום
function saveToCart(event){
    const cartIconClick = event.currentTarget;
    if(cartIconClick.classList.contains('cart_icon_click')){
        cartIconClick.classList.remove('cart_icon_click');
    }
    else{
        cartIconClick.classList.add('cart_icon_click');
    }

    // מציאת כרטיס המוצר 
    const productBox = cartIconClick.closest('.catalog_product_box');

    // שליפת נתונים מתוך הכרטיס הנבחר 
    const productId = productBox.id;
    const name = productBox.querySelector('.product_name')?.textContent.trim();
    const description = productBox.querySelector('.description')?.textContent.trim();
    const image = productBox.querySelector('.product_img')?.src;
    const logo = productBox.querySelector('.product_logo_img')?.src;
    const originalPrice = productBox.querySelector('.original_price')?.textContent.trim();
    const discount = productBox.querySelector('.discount')?.textContent.trim();
    const finalPrice = productBox.querySelector('.cost')?.textContent.trim();
    const stock = parseInt(productBox.dataset.stock) || 1;
    const buyLink = productBox.querySelector('.buy')?.href;
    const qty = 1;

    // מבנה נתונים לשמירה
    const cartProductData = {
        id: productId,
        name: name,
        description: description,
        image: image,
        logo: logo,
        originalPrice: originalPrice,
        discount: discount,
        finalPrice: finalPrice,
        stock: stock,
        buyLink: buyLink,
        qty: qty
    };


    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id === productId);

    if(cartIconClick.classList.contains('cart_icon_click')){
        if(existingIndex === -1){
            cart.push(cartProductData);
        }
    }

    else{
        if(existingIndex !== -1){
            cart.splice(existingIndex, 1)
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// עדכון צבע אייקון עגלה בהתאם ללוקאלסטורג לאחר רענון
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(savedItem => {
        const productBox = document.getElementById(savedItem.id);
        if(productBox) {
            const cart = productBox.querySelector('.cart_icon');
            if(cart){
                cart.classList.add('cart_icon_click');
            }
        }
    });
}

// טעינת מוצרים מלוקלסטורג + זימון פונקציית בניה של כרטיס עגלה
function getItemsFromCart() {
    const getCart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('#cart_ul');
    if(!container){
        console.warn('container is not found')
        return;
    }

    container.innerHTML = '';

    if (getCart.length === 0){
        return;
    }

    getCart.forEach(product => {
        cartCreator(product);
    });

    // קריאה לפונקציה שמזינה אירוע עבור מחיקת מוצר
    cartDeleteEvents();

    const qtyInCart = document.querySelector('.qty_in_cart');
    if(qtyInCart){
        qtyInCart.textContent = 'Total: ' + getCart.length + ' items in your cart';
    }

    eventOnQty(); 
    updateSubtotal();
    updateSubtotal('cart', '.payment_subtotal');
}

// בניית כרטיס עגלה 
function cartCreator(cartProductData){

    // יצירת אלמנט עגלה
    const cartItem = document.createElement('li');
    cartItem.setAttribute('data-id', cartProductData.id);

    // תיבת מוצר עגלה 
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart_product_box');

    // תמונת מוצר
    const imgBox = document.createElement('div');
    imgBox.classList.add('cart_img');

    const img = document.createElement('img');
    img.src = cartProductData.image;

    imgBox.appendChild(img);

    // תיאור המוצר
    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('cart_description');

    // תיבת מחיר
    const priceBox = document.createElement('div');
    priceBox.classList.add('cart_price_box');

    const originalPriceBox = document.createElement('div');
    originalPriceBox.classList.add('cart_original_price_box');

    const originalPrice = document.createElement('h4');
    originalPrice.textContent = cartProductData.originalPrice;

    const discount = document.createElement('p');
    discount.textContent = cartProductData.discount || '';

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('cart_cost');

    const unitPrice = parsePrice(cartProductData.finalPrice);
    const qty = Number(cartProductData.qty) || 1;
    const totalPrice = unitPrice * qty;

    finalPrice.textContent = formatPrice(totalPrice); 
    priceBox.appendChild(originalPriceBox);
    priceBox.appendChild(finalPrice);

    // שם המוצר (בתוספת לינק)
    const nameBox = document.createElement('div');
    nameBox.classList.add('description_h3');

    const nameH3 = document.createElement('h3');
    const nameLink = document.createElement('a');
    nameLink.href = cartProductData.buyLink || '#';
    nameLink.textContent = cartProductData.name;

    nameH3.appendChild(nameLink);
    nameBox.appendChild(nameH3);

    // כמות
    const qtyBox = document.createElement('div');
    qtyBox.classList.add('qty');

    const qtyLabel = document.createElement('label');
    qtyLabel.setAttribute('for', 'Qty');
    qtyLabel.textContent = 'Qty';

    const qtyInput = document.createElement('input');
    qtyInput.classList.add('qty_input');
    qtyInput.type = 'number';
    qtyInput.value = cartProductData.qty || 1;
    qtyInput.min = 1;

    qtyBox.appendChild(qtyLabel);
    qtyBox.appendChild(qtyInput);

    // כפתור לדחיפה למועדפים
    const saveBtn = document.createElement('button');
    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-solid', 'fa-heart');

    saveBtn.appendChild(heartIcon);
    saveBtn.append('Save for later');

    // אייקון מחיקה
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('delete_product', 'fa-solid', 'fa-xmark');

    // חיבור החלקים
    descriptionBox.appendChild(priceBox);
    descriptionBox.appendChild(nameBox);
    descriptionBox.appendChild(qtyBox);
    descriptionBox.appendChild(saveBtn);

    cartBox.appendChild(imgBox);
    cartBox.appendChild(descriptionBox);
    cartBox.appendChild(deleteIcon);

    cartItem.appendChild(cartBox);

    // הכנסת כרטיס מועדפים לדום
    document.querySelector('#cart_ul').appendChild(cartItem);
}

// בניית פונקציה שמזינה אירוע לכל הפריטים למחיקת המוצר בעגלה
function cartDeleteEvents(){
    const deleteButtons = document.querySelectorAll('.delete_product');
    deleteButtons.forEach(button => {
        button.addEventListener('click', removeFromCart)
    });
}
// פונקציה למחיקת פריט עגלה מהדום ומהזיכרון
function removeFromCart(event){
    // מחיקת פריט מהדום
    const deleteBtn = event.currentTarget;
    const listItem = deleteBtn.closest('li');
    if(!listItem){
        return;
    }
    listItem.remove();

    const productId = listItem.getAttribute('data-id');
    
    // מחיקה פריט מהזיכרון
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));

    const qtyInCart = document.querySelector('.qty_in_cart');
    if(qtyInCart){
        qtyInCart.textContent = 'Total: ' + cart.length + ' items in your cart';
    }

    updateSubtotal();
    updateSubtotal('cart', '.payment_subtotal');
}

// הוספת אירוע על כמות מוצר לרכישה
function eventOnQty() {
    const qtyInputs = document.querySelectorAll('.qty_input');
    qtyInputs.forEach(input => {
        input.addEventListener('input', cartQty);
    });
}

// פונקציה לשינוי המחיר לפי כמות בעגלה
function cartQty(event) {
    const qtyInput =  event.currentTarget;
    const qtyValue = Number(qtyInput.value);
    const cartProductBox = qtyInput.closest('.cart_product_box');

    if(!cartProductBox){
        return;
    }

    // עדכון זיכרון לפי תעודת זהות
    const productId = cartProductBox.closest('li')?.getAttribute('data-id');
    if(!productId){
        return;
    }
    
    // עדכון כמות בזיכרון 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart[index].qty = qtyValue;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    //  עדכון המחיר בכרטיס מוצר לפי כמות
    const finalPriceEl = cartProductBox.querySelector('.cart_cost');
    if (finalPriceEl) {
        const pricePerItem = parsePrice(cart[index].finalPrice);
        const totalPrice = pricePerItem * qtyValue;
        finalPriceEl.textContent = totalPrice.toFixed(2) + ' $';
    }

    // עדכון מחיר סופי
    updateSubtotal();
    updateSubtotal('cart', '.payment_subtotal');
}

function updateSubtotal(storageKey = 'cart', selector = '.cart_subtotal') {
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];

    let total = 0;
    data.forEach(item => {
        const price = parsePrice(item.finalPrice);
        const qty = Number(item.qty) || 1;
        total += price * qty;
    });

    const priceDisplay = document.querySelector(selector); 
    if (priceDisplay) {
        priceDisplay.textContent = formatPrice(total);
    }
}

// המרה של מחרוזת עם פסיקים למספר תקני
function parsePrice(str) {
    return parseFloat(str.replace(/,/g, '').trim()) || 0;
}

// המרה של מספר למחרוזת עם פסיקים ו-2 ספרות אחרי נקודה
function formatPrice(num) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' $';
}

// יצירת דף מוצר
function pdpCreator(product){
    // תמונה ראשית לדף מוצר 
    const mainImage = document.createElement('img');
    mainImage.classList.add('product_preview_img');
    mainImage.src = product.img;
    document.querySelector('#product_preview').appendChild(mainImage);

    // תמונה ראשונה לדף מוצר 
    const firstImage = document.createElement('img');
    firstImage.classList.add('first_image');
    firstImage.src = product.images [0];
    document.querySelector('#first_gallery_item').appendChild(firstImage);

    // תמונה שניה לדף מוצר 
    const secondImage = document.createElement('img');
    secondImage.classList.add('second_image');
    secondImage.src = product.images[1];
    document.querySelector('#second_gallery_item').appendChild(secondImage);

    // תמונה שלישית לדף מוצר 
    const thirdImage = document.createElement('img');
    thirdImage.classList.add('third_image');
    thirdImage.src = product.images[2];
    document.querySelector('#third_gallery_item').appendChild(thirdImage);

    // תמונה רביעית לדף מוצר 
    const fourthImage = document.createElement('img');
    fourthImage.classList.add('fourth_image');
    fourthImage.src = product.images[3];
    document.querySelector('#fouth_gallery_item').appendChild(fourthImage);

    // תמונה חמישית לדף מוצר 
    const fifthImage = document.createElement('img');
    fifthImage.classList.add('fifth_image');
    fifthImage.src = product.images[4];
    document.querySelector('#fifth_gallery_item').appendChild(fifthImage);

    // שם מוצר
    const pdpName = document.querySelector('#pdp_name')
    pdpName.textContent = product.name;

    // מחיר מקורי
    const originalPrice = document.querySelector('#pdp_original_price');
    originalPrice.textContent = product.originalPrice;

    // הנחה
    const discount = document.querySelector('#pdp_discount');
    discount.textContent = product.discount;

    // מחיר סופי
    const finalPrice = document.querySelector('#final_price');
    finalPrice.textContent = product.finalPrice;

    // תיאור מוצר
    const description = document.querySelector('#pdp_description');
    description.textContent = product.description;
}

// החלפה בין רישום והתחברות משתמשים
const switchToLog = document.querySelector('.sign_in_link');
if(switchToLog){
    switchToLog.addEventListener('click', () => {
        document.querySelector('.cover_box').style.transform = 'translateX(25%)';
    });
}

const switchToReg = document.querySelector('.sign_up_link');
if(switchToReg){
    switchToReg.addEventListener('click', () => {
        document.querySelector('.cover_box').style.transform = 'translateX(-75%)';
    });
}

/*
// רישום משתמש חדש
const registerBtn = document.querySelector('#register_submit');
if(registerBtn){
    registerBtn.addEventListener('click', registerUser);
}
function registerUser(){
    const userName = document.querySelector('#regusername').value.trim();
    const userEmail = document.querySelector('#regemail').value.trim();
    const userPassword = document.querySelector('#regpassword').value.trim();
    if(!userName || !userEmail || !userPassword){
        alert('Please fill in all fields');
        return;
    }
    if(userPassword.length < 8){
        alert('Password must be at least 8 characters long');
        return;
    }
    if(userPassword.search(/[0-9]/) == -1){
        alert('Password must contain at least one number');
        return;
    }
    if(userPassword.search(/[A-Z]/) == -1){
        alert('Password must contain at least one uppercase letter');
        return;
    }
    if(userPassword.search(/[a-z]/) == -1){
        alert('Password must contain at least one lowercase letter');
        return;
    }
    if(userPassword.search(/[@$!%*?&]/) == -1){
        alert('Password must contain at least one special character (@, $, !, %, *, ?, &)');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({
        name: userName,
        email: userEmail,
        password: userPassword
    });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now log in.');
    window.location.href = '../profile.html';
}

// התחברות משתמש קיים
const loginBtn = document.querySelector('#login_submit');
if(loginBtn){
    loginBtn.addEventListener('click', loginUser);
    function loginUser(){
        const userName = document.querySelector('#logusername').value.trim();
        const userPassword = document.querySelector('#logpassword').value.trim();
        if(!userName || !userPassword){
            alert('Please fill in all fields');
            return;
        }

        // בדיקה אם יש משתמשים רשומים
        if(localStorage.getItem('users')){
            let users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(user => {
                return user.name === userName && user.password === userPassword;
            });
            if(user){
                alert('Login successful!');
                window.location.href = '../profile.html';
            }
            else{
                alert('Invalid username or password. Please try again.');
            }
        }
        else{
            alert('No registered user found. Please register first.');
            return;
        }
    }
}
*/

// התנתקות משתמש

// בדיקת סטטוס התחברות משתמש



// =====================
// סינון קטלוג מוצרים אינטראקטיבי לפי פילטרים ו-URL
// =====================

// פונקציה שמנרמלת ערכים להשוואה פשוטה (אותיות קטנות, בלי רווחים מיותרים)
function normalizeString(str){
    return (str ?? '').toString().trim().toLowerCase();
}
// פונקציה שמנרמלת ערכים להשוואה בלי תווים מיוחדים
function normalizeForCompare(str){
    return normalizeString(str).replace(/[^a-z0-9]/g, '');
}
// פונקציה שמתקנת טעויות כתיב נפוצות מה-JSON (למשל termolo -> tremolo)
function fixCommonTypos(str){
    let fixed = normalizeString(str);
    fixed = fixed.replace(/termolo/g, 'tremolo');
    return fixed;
}

// מסנן מוצרים לפי כל הפילטרים שנבחרו
function filterProducts(products, filters) {
    return products.filter(product => {
        // מנרמל ערכים מה-JSON
        let categoryProduct = normalizeString(product.category);
        let brandProduct = normalizeString(product.manufacturer || product.brand);
        let typeProduct = normalizeForCompare(product.type);
        let submodelProduct = normalizeString(product.submodel);
        let brandPlusSubmodel = `${brandProduct} ${submodelProduct}`.trim();
        let stringsProduct = normalizeString(product['number of strings']);
        let scaleProduct = normalizeForCompare(product['scale length']);
        let pickupsProduct = normalizeForCompare(product['Pickups']);
        let featuresProduct = fixCommonTypos(product['additional features']);

        // מסנן לפי קטגוריה
        if (filters.category && normalizeString(filters.category) !== categoryProduct) return false;

        // מסנן לפי מותג
        if (filters.brands?.length) {
            let foundBrand = filters.brands.some(brand => normalizeString(brand) === brandProduct);
            if (!foundBrand) return false;
        }

        // מסנן לפי סוג
        if (filters.types?.length) {
            let foundType = filters.types.some(type => normalizeForCompare(type) === typeProduct);
            if (!foundType) return false;
        }

        // מסנן לפי תת-דגם
        if (filters.submodels?.length) {
            let foundSubmodel = filters.submodels.some(submodel => {
                let submodelNorm = normalizeString(submodel);
                return submodelNorm === submodelProduct || submodelNorm === brandPlusSubmodel;
            });
            if (!foundSubmodel) return false;
        }

        // מסנן לפי מספר מיתרים
        if (filters.number_of_strings?.length) {
            let foundStrings = filters.number_of_strings.some(num => normalizeString(num) === stringsProduct);
            if (!foundStrings) return false;
        }

        // מסנן לפי סקייל
        if (filters.scale_length?.length) {
            let foundScale = filters.scale_length.some(scale => normalizeForCompare(scale) === scaleProduct);
            if (!foundScale) return false;
        }

        // מסנן לפי פיקאפים
        if (filters.pickups?.length) {
            let foundPickup = filters.pickups.some(pickup => normalizeForCompare(pickup) === pickupsProduct);
            if (!foundPickup) return false;
        }

        // מסנן לפי פיצ'רים נוספים
        if (filters.additional_features?.length) {
            let foundFeature = filters.additional_features.some(feature => {
                let featureNorm = fixCommonTypos(feature);
                return featureNorm === featuresProduct;
            });
            if (!foundFeature) return false;
        }

        // מסנן לפי מחיר מינימום ומקסימום
        if (filters.minPrice != null || filters.maxPrice != null) {
            let priceField = product.finalPrice || product.originalPrice || '0';
            let price = parsePrice(priceField);
            if (filters.minPrice != null && price < filters.minPrice) return false;
            if (filters.maxPrice != null && price > filters.maxPrice) return false;
        }

        return true;
    });
}

// קורא את הפילטרים מה-URL
function getFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const getListFromUrl = (key) => urlParams.get(key) ? urlParams.get(key).split(',') : [];
    const getNumberFromUrl = (key) => urlParams.get(key) ? parseFloat(urlParams.get(key)) : null;

    return {
        category: urlParams.get('category') || null,
        brands: getListFromUrl('brand'),
        statuses: getListFromUrl('status'), // לא קיים אצלי
        types: getListFromUrl('type'),
        submodels: getListFromUrl('submodel'),
        number_of_strings: getListFromUrl('number_of_strings'),
        scale_length: getListFromUrl('scale_length'),
        pickups: getListFromUrl('pickups'),
        additional_features: getListFromUrl('additional_features'),
        minPrice: getNumberFromUrl('minPrice'),
        maxPrice: getNumberFromUrl('maxPrice')
    };
}

// מעדכן את ה-URL עם הפילטרים (משאיר category אם יש)
function updateURLWithFilters(filters) {
    const params = new URLSearchParams(window.location.search);

    const setOrDelete = (key, val) => {
        if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) params.delete(key);
        else params.set(key, Array.isArray(val) ? val.join(',') : val);
    };

    if (filters.category) params.set('category', filters.category);

    setOrDelete('brand', filters.brands || []);
    setOrDelete('status', filters.statuses || []);
    setOrDelete('type', filters.types || []);
    setOrDelete('submodel', filters.submodels || []);
    setOrDelete('number_of_strings', filters.number_of_strings || []);
    setOrDelete('scale_length', filters.scale_length || []);
    setOrDelete('pickups', filters.pickups || []);
    setOrDelete('additional_features', filters.additional_features || []);
    setOrDelete('minPrice', filters.minPrice != null ? String(filters.minPrice) : null);
    setOrDelete('maxPrice', filters.maxPrice != null ? String(filters.maxPrice) : null);

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.pushState({}, '', newURL);
}

// אוסף את הפילטרים שנבחרו מהטופס (עובד גם לסייד וגם לרגיל)
function collectFilters() {
    // לוקח את כל הערכים המסומנים בכל הפילטרים
    const getCheckedValues = (selector) => Array.from(document.querySelectorAll(selector)).map(cb => cb.value);

    const brands = getCheckedValues('input[name="brand"]:checked');
    const statuses = getCheckedValues('input[name="status"]:checked'); // לא בשימוש
    const types = getCheckedValues('input[name="type"]:checked');
    const submodels = getCheckedValues('input[name="submodel"]:checked');
    const number_of_strings = getCheckedValues('input[name="number_of_strings"]:checked');
    const scale_length = getCheckedValues('input[name="scale_length"]:checked');
    const pickups = getCheckedValues('input[name="pickups"]:checked');
    const additional_features = getCheckedValues('input[name="additional_features"]:checked');

    // לוקח ערכי מחיר מכל תיבה קיימת (גם רגיל וגם צד)
    const priceBoxes = Array.from(document.querySelectorAll('.filter_price_box'));
    let minPrice = null, maxPrice = null;
    for (const box of priceBoxes){
        const inputs = box.querySelectorAll('input[type="number"]');
        const min = inputs[0]?.value?.trim();
        const max = inputs[1]?.value?.trim();
        if (min && minPrice == null) minPrice = parseFloat(min);
        if (max && maxPrice == null) maxPrice = parseFloat(max);
    }

    const urlCategory = new URLSearchParams(window.location.search).get('category');

    return {
        category: urlCategory,
        brands,
        statuses,
        types,
        submodels,
        number_of_strings,
        scale_length,
        pickups,
        additional_features,
        minPrice: Number.isFinite(minPrice) ? minPrice : null,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : null
    };
}

// מעדכן את הצ'קבוקסים לפי הערכים מה-URL (כולל כפילויות בראשי ובצד)
function updateFiltersFromURL(filters) {
    // עובר על כל פילטר ומעדכן את הצ'קבוקסים
    const checkAll = (name, values) => {
        values.forEach(val => {
            const inputs = document.querySelectorAll(`input[name="${name}"][value="${CSS.escape(val)}"]`);
            inputs.forEach(inp => inp.checked = true);
        });
    };

    checkAll('brand', filters.brands || []);
    checkAll('status', filters.statuses || []);
    checkAll('type', filters.types || []);
    checkAll('submodel', filters.submodels || []);
    checkAll('number_of_strings', filters.number_of_strings || []);
    checkAll('scale_length', filters.scale_length || []);
    checkAll('pickups', filters.pickups || []);
    checkAll('additional_features', filters.additional_features || []);

    // מעדכן את ערכי המחיר בכל התיבות
    document.querySelectorAll('.filter_price_box').forEach(box => {
        const inputs = box.querySelectorAll('input[type="number"]');
        if (inputs[0]) inputs[0].value = filters.minPrice != null ? filters.minPrice : '';
        if (inputs[1]) inputs[1].value = filters.maxPrice != null ? filters.maxPrice : '';
    });
}

// מפעיל את הסינון בכל שינוי ומרנדר את המוצרים אל #catalog
function applyFilters(allProducts) {
    const filters = collectFilters();
    updateURLWithFilters(filters);

    // מסנן לפי קטגוריה אם נבחרה
    const baseProducts = filters.category ? allProducts.filter(product => normalizeString(product.category) === normalizeString(filters.category)) : allProducts;
    const filteredProducts = filterProducts(baseProducts, filters);

    const container = document.querySelector('#catalog');
    if (!container) {
        console.error('Container #catalog not found!');
        return;
    }
    container.innerHTML = '';

    filteredProducts.forEach(product => {
        creator(product);
    });
}

// אתחול מאזינים וסנכרון ראשוני – עובד גם לרגיל וגם לרספונסיבי
function initCatalogFiltering(allProducts){
    // קורא את הפילטרים מה-URL ומעדכן את הצ'קבוקסים
    const urlFilters = getFiltersFromURL();
    updateFiltersFromURL(urlFilters);

    // מאזין לכל הצ'קבוקסים של הפילטרים
    const checkboxSelectors = [
        'input[name="brand"]',
        'input[name="type"]',
        'input[name="submodel"]',
        'input[name="number_of_strings"]',
        'input[name="scale_length"]',
        'input[name="pickups"]',
        'input[name="additional_features"]'
    ].join(',');
    document.querySelectorAll(checkboxSelectors).forEach(el => {
        el.addEventListener('change', () => applyFilters(allProducts));
    });

    // מאזין לכל שדות המחיר (גם רגיל וגם צד)
    document.querySelectorAll('.filter_price_box input[type="number"]').forEach(inp => {
        inp.addEventListener('input', () => applyFilters(allProducts));
        inp.addEventListener('change', () => applyFilters(allProducts));
    });

    // מאזין לטווח מחיר (אם תרצה להשתמש בו)
    document.querySelectorAll('.price_range').forEach(r => {
        r.addEventListener('input', () => applyFilters(allProducts));
    });

    // מאזין ל-back/forward בדפדפן
    window.addEventListener('popstate', () => {
        const f = getFiltersFromURL();
        updateFiltersFromURL(f);
        applyFilters(allProducts);
    });

    // רינדור ראשון של המוצרים
    applyFilters(allProducts);
}

