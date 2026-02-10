document.addEventListener("DOMContentLoaded", () => {
    
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const textSpan = document.querySelector(".type-text");
    
    const phrases = ["Machine Learning", "Data Visualization", "Statistics"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    if (textSpan) setTimeout(type, 1000);
});
