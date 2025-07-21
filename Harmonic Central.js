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

