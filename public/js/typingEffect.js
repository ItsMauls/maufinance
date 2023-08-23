// Ambil elemen H2 berdasarkan ID
const typingElement = document.getElementById('typing-effect');

// Tekst yang akan diberikan efek mengetik
const text = typingElement.textContent;

// Fungsi untuk memberikan efek mengetik
const typeEffect = () => {
    let index = 0;
    let speed = 15
    typingElement.textContent = '';
    const typingInterval = setInterval(() => {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, speed); // Waktu tunda antara setiap karakter (milidetik)
};

// Panggil fungsi efek mengetik
typeEffect();
