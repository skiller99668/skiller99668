// This runs on every page
console.log("JS is loaded");

// Page-specific code
if (document.body.classList.contains('home-page')) {
    const btn = document.getElementById('demoButton');
    btn.addEventListener('click', () => alert("Hello from Home Page!"));
}

if (document.body.classList.contains('shop-page')) {
    console.log("You are on the shop page");
    // You could load products dynamically here
}
