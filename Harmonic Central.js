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
    products.forEach(product => {
        creator(product);
    });
})
.catch(error => console.error('error in json:', error));

// פונקציה ראשית המפעילה את כל הפונקציות לאחר קבלת נתונים מהשרת
function creator(product){

    // קריאה לפונקציה של בניית כרטיס מוצר
    productCreator(product);

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
    buyLink.href = product.link;
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
    if (product.category == 'guitars') {
        const container = document.querySelector('#guitar_catalog');
        if (container){
            container.appendChild(catalogProductBox);
        }           
    }

    if (product.category == 'accessories') {
        const container = document.querySelector('#accessories_catalog');
        if (container){
            container.appendChild(catalogProductBox);
        }    
    }

}

// רענון המוצרים בווישליסט בעת רענון או טעינת הדף 
document.addEventListener('DOMContentLoaded', () => {
    getItemsFromWishlist();
    getItemsFromCart();
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
        buyLink: buyLink
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
    discount.textContent = cartProductData.discount;

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('cart_cost');
    finalPrice.textContent = cartProductData.finalPrice;

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
    qtyInput.type = 'number';
    qtyInput.value = cartProductData.quantity || 1;
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
}