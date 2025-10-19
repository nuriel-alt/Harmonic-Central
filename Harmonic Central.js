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

        // במידה וזה לא דף מוצר - יצירת קטלוג
        else{
            products.forEach(product => {
                creator(product);
            });
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
                    if (filteredProducts.length > 0) {
                        // שמירת תוצאות החיפוש בלוקאלסטורג
                        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
                        // מעבר לעמוד תוצאות החיפוש
                        window.location.href = '../search results/search results.html';
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