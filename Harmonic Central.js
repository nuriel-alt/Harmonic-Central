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
changeSideCatalog.addEventListener('click', changeSideCatalogFunction);

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

// הכנסת מוצרים מג'ייסון לקטלוג גיטרות
fetch('../data/products.json')

.then(response => response.json())
.then(products => {
    products.forEach(product => {
        creator(product);
    });

    // קריאה לפונקציות צבע אייקון בהתאם ללוקאלסטורג
    updateWishlistHearts();
    updatecarts();
})
.catch(error => console.error('error in json:', error));


// עדכון צבע אייקון לב בהתאם ללוקאלסטורג
function updateWishlistHearts() {
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

// עדכון צבע אייקון עגלה בהתאם ללוקאלסטורג
function updatecarts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(savedItem => {
        const productBox = document.getElementById(savedItem.id);
        if(productBox) {
            const cart = productBox.querySelector('.cart_icon');
            if(heart){
                heart.classList.add('cart_icon_click');
            }
        }
    });
}

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
}

// בניית כרטיסיית מוצר 
function productCreator(product){

    // יצירת קופסא ראשית למוצר
    const catalogProductBox = document.createElement('div');
    catalogProductBox.classList.add('catalog_product_box');
    catalogProductBox.id = product.id;

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

// שמירת הנתונים של המוצר בלוקאלסטורג' למועדפים + צביעה של אייקון לב באדום
function saveToWishlist(event){
    const heartIconClick = event.currentTarget;
    heartIconClick.classList.toggle('heart_icon_click');

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
    const buyLink = productBox.querySelector('.buy')?.href;

    // מבנה נתונים לשמירה
    const productData = {
        id: productId,
        name: name,
        description: description,
        image: image,
        logo: logo,
        originalPrice: originalPrice,
        discount: discount,
        finalPrice: finalPrice,
        buyLink: buyLink
    };


    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if(heartIconClick.classList.contains('heart_icon_click')){
        if(existingIndex === -1){
            wishlist.push(productData);
        }
    }
    else{
        if(existingIndex !== -1){
            wishlist.splice(existingIndex, 1)
        }
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// שמירת הנתונים של המוצר בלוקאלסטורג' לעגלה + צביעה של אייקון עגלה באדום
function saveToCart(event){
    const cartIconClick = event.currentTarget;
    cartIconClick.classList.toggle('cart_icon_click');

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
    const buyLink = productBox.querySelector('.buy')?.href;

    // מבנה נתונים לשמירה
    const productData = {
        id: productId,
        name: name,
        description: description,
        image: image,
        logo: logo,
        originalPrice: originalPrice,
        discount: discount,
        finalPrice: finalPrice,
        buyLink: buyLink
    };


    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id === productId);

    if(cartIconClick.classList.contains('cart_icon_click')){
        if(existingIndex === -1){
            cart.push(productData);
        }
    }

    else{
        if(existingIndex !== -1){
            cart.splice(existingIndex, 1)
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}




// בניית כרטיס מועדפים 
function wishlistCreator(event){
    // יצירת אלמנט ליסט
    const wishlistItem = document.createElement('li');

    // תיבת מוצר מועדפים
    const wishlistBox = document.createElement('div');
    wishlistBox.classList.add('wishlist_product_box');

    // תמונת מוצר
    const imgBox  = document.createElement('div');
    imgBox .classList.add('wishlist_img');

    const img = document.createElement('img');
    img.src = '../images/products/guitars/Acoustic Guitars/PRS/PRS SE A50E Acoustic-Electric Guitar Fire Red Burst.png';
    img.alt = 'Sterling Guitar';

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
    originalPrice.textContent = '249.99 $';

    const discount = document.createElement('p');
    discount.textContent = '-10%';

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('wishlist_cost');
    finalPrice.textContent = '949.00 $';

    priceBox.appendChild(originalPriceBox);
    priceBox.appendChild(finalPrice);

    // שם המוצר (בתוספת לינק)
    const nameBox = document.createElement('div');
    nameBox.classList.add('wishlist_product_name');

    const nameH3 = document.createElement('h3');
    const nameLink = document.createElement('a');
    nameLink.href = '../guitar catalog/guitar catalog.html#3';
    nameLink.textContent = 'PRS SE A50E Acoustic-Electric Guitar Fire Red Burst';

    nameH3.appendChild(nameLink);
    nameBox.appendChild(nameH3);

    // תיאור המוצר 
    const descTextBox = document.createElement('div');
    descTextBox.classList.add('wishlist_product_description');

    const descP = document.createElement('p');
    descP.textContent = 'PRS SE A50E in Fire Red Burst – Rich tone, smooth playability, and elegant design for dynamic acoustic performance';
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


};

// בניית כרטיס עגלה 
function cartCreator(event){

    // יצירת אלמנט עגלה
    const cartItem = document.createElement('li');

    // תיבת מוצר עגלה 
    const cartBox = document.createElement('div');
    cartBox.classList.add('cart_product_box');

    // תמונת מוצר
    const imgBox = document.createElement('div');
    imgBox.classList.add('cart_img');

    const img = document.createElement('img');
    img.src = product.image;

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
    originalPrice.textContent = product.originalPrice;

    const discount = document.createElement('p');
    discount.textContent = product.discount;

    originalPriceBox.appendChild(originalPrice);
    originalPriceBox.appendChild(discount);

    const finalPrice = document.createElement('h2');
    finalPrice.classList.add('cart_cost');
    finalPrice.textContent = product.finalPrice;

    priceBox.appendChild(originalPriceBox);
    priceBox.appendChild(finalPrice);

    // שם המוצר (בתוספת לינק)
    const nameBox = document.createElement('div');
    nameBox.classList.add('description_h3');

    const nameH3 = document.createElement('h3');
    const nameLink = document.createElement('a');
    nameLink.href = product.buyLink || '#';
    nameLink.textContent = product.name;

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
    qtyInput.value = product.quantity || 1;
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

}
