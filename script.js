// Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical', 
    gestureDirection: 'vertical', 
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Canvas Image Sequence Setup
const canvas = document.getElementById('hero-lightpass');
const context = canvas.getContext('2d');

// Frame config
const frameCount = 123;
// Format is ezgif-frame-001.jpg to ezgif-frame-123.jpg
const currentFrame = index => (
    `ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const imageLoader = { loaded: 0, total: frameCount };

// Preload images
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        imageLoader.loaded++;
        if(i === 1) { // Draw the first frame once loaded
            updateImage(1);
        }
    };
    images.push(img);
}

function updateImage(index) {
    if(!images[index-1]) return;
    
    // Use the image resolution for the canvas size
    if(canvas.width !== images[index-1].width || canvas.height !== images[index-1].height) {
        canvas.width = images[index-1].width || window.innerWidth;
        canvas.height = images[index-1].height || window.innerHeight;
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Fill background with black to cover edges if aspect ratio doesn't match perfectly
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    // You could calculate scaling here to perfectly cover if needed, but object-fit: cover in CSS usually handles canvas well
    context.drawImage(images[index-1], 0, 0);
}

// Scroll interaction
window.addEventListener('scroll', () => {
    // Calculate scroll progress (0 to 1)
    const html = document.documentElement;
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    
    // Map progress to frame index
    // Keep it slightly behind frameCount to ensure we don't go out of bounds
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    // requestAnimationFrame for smoother updates
    requestAnimationFrame(() => updateImage(frameIndex + 1));
});

// Resize handler
window.addEventListener('resize', () => {
    // Re-draw current frame to handle resize
    const html = document.documentElement;
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
    updateImage(frameIndex + 1);
});

// Variant Selector Logic
const variantBtns = document.querySelectorAll('.variant-btn');
const variantDesc = document.getElementById('variant-desc');

const descriptions = {
    classic: "The original precision formula.",
    active: "Enhanced for high-performance and endurance.",
    cool: "Infused with menthol derivatives for a chilling sensation.",
    intense: "Maximum strength odour neutralizers."
};

variantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        variantBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const variant = btn.getAttribute('data-variant');
        variantDesc.textContent = descriptions[variant] || descriptions['classic'];
    });
});

// Intersection Observer for fade-in animations
const sections = document.querySelectorAll('.section');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});
