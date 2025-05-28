// Tạo hiệu ứng chữ rơi tự động
const phrases = [
    "Chúc bạn một ngày thật đẹp!",
    "Thêm tuổi mới, thêm yêu đời!",
    "Luôn mỉm cười nhé!",
    "Hạnh phúc và thành công!",
    "Chúc bạn luôn vui vẻ!",
    "Một năm tuyệt vời đang chờ đón!",
    "Tuổi mới thật rực rỡ nhé!",
];

const slots = Array.from({ length: 11 }, (_, i) => i * 5); // [0, 5, 10, ..., 50]
let lastUsedSlots = [];

function getFreeSlot() {
    const available = slots.filter(slot => !lastUsedSlots.includes(slot));
    const chosen = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : slots[Math.floor(Math.random() * slots.length)];

    lastUsedSlots.push(chosen);
    if (lastUsedSlots.length > 5) lastUsedSlots.shift(); // giữ lại 5 slot gần đây
    return chosen + Math.random() * 5 + "%"; // thêm lệch nhẹ để tự nhiên
}

setInterval(() => {
    const el = document.createElement("div");
    el.className = "falling-text";
    const text = phrases[Math.floor(Math.random() * phrases.length)];

    // Emoji ngẫu nhiên đầu và cuối
    const emojis = ["🎉", "🎂", "🎈", "🎁", "🥳", "🍰", "🎊", "✨"];
    const prefix = emojis[Math.floor(Math.random() * emojis.length)];
    const suffix = emojis[Math.floor(Math.random() * emojis.length)];
    el.innerHTML = `${prefix} ${text} ${suffix}`;

    el.style.left = getFreeSlot();
    el.style.fontSize = Math.random() * 6 + 14 + "px";

    // Nếu câu ngắn hơn 25 ký tự, không xuống dòng
    if (text.length <= 25) {
        el.classList.add("nowrap");
    } else {
        el.classList.add("wrap");
    }

    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 10000);
}, 500);

// Thử phát audio sau tương tác đầu tiên
window.addEventListener(
    "click",
    () => {
        const audio = document.querySelector("audio");
        if (audio.paused) {
            audio.play().catch((err) => {
                console.log("Tự động phát bị chặn:", err);
            });
        }
    },
    { once: true }
);