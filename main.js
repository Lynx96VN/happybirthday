// Phát nhạc sau tương tác đầu tiên
["click", "touchstart"].forEach((evt) =>
    window.addEventListener(
        evt,
        () => {
            const audio = document.querySelector("audio");
            if (audio && audio.paused) {
                audio.play().catch((err) => console.warn("Không thể phát nhạc:", err));
            }
        },
        { once: true }
    )
);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
);
camera.position.z = 600;

const renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const phrases = [
    "Sinh nhật vui vẻ",
    "Cười nhiều lên nè",
    "Chúc bạn một ngày thật đẹp",
    "Thêm tuổi mới, thêm yêu đời",
    "Chúc bạn đạp đổ mọi chướng ngại",
    "Chúc bạn hạnh phúc và thành công",
    "Chúc bạn luôn vui vẻ",
    "Chúc bạn có một năm thật tuyệt vời",
    "Mình tin bạn, bạn cũng thế nha",
    "Chúc bạn khỏe mạnh, không thăm bác sĩ nữa nha",
    "Chúc bạn có thể hoàn thành mọi dự định",
    "Chúc bạn từ giờ đến khi ra riêng không có biến nữa"
];
const emojis = ["🎂", "🎉", "✨", "🎁", "💖", "🥳"];

// --- Shuffle logic ---
function shuffle(array) {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

let shuffledPhrases = [];
let phraseIndex = 0;
function getNextPhrase() {
    if (phraseIndex >= shuffledPhrases.length) {
        shuffledPhrases = shuffle(phrases);
        phraseIndex = 0;
    }
    return shuffledPhrases[phraseIndex++];
}

// Cũng áp dụng với emoji
function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

const minDistance = 800; // khoảng cách tối thiểu tới camera
const maxDistance = 2000;
const spread = 2000;

// Các phần tử bay sẵn
for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.className = "text3d";
    const prefix = getRandomEmoji();
    const suffix = getRandomEmoji();
    div.innerText = `${prefix} ${getNextPhrase()} ${suffix}`;

    const object = new THREE.CSS3DObject(div);

    let position, distance;
    // Lặp đến khi tìm được vị trí đủ xa
    do {
        position = new THREE.Vector3(
            Math.random() * spread - spread / 2,
            Math.random() * spread - spread / 2,
            Math.random() * spread - spread / 2
        );
        distance = position.distanceTo(camera.position);
    } while (distance < minDistance || distance > maxDistance);

    object.position.copy(position);
    scene.add(object);
}

// Animate
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Xử lý con quay hồi chuyển
window.addEventListener(
    "deviceorientation",
    (event) => {
        const beta = event.beta || 0;
        const gamma = event.gamma || 0;
        const x = THREE.MathUtils.degToRad(beta - 45);
        const y = THREE.MathUtils.degToRad(gamma);
        camera.rotation.x = x;
        camera.rotation.y = y;
    },
    true
);

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hiệu ứng rơi từng chữ mỗi 500ms
setInterval(() => {
    const div = document.createElement("div");
    div.className = "text3d";
    const text = getNextPhrase();
    const prefix = getRandomEmoji();
    const suffix = getRandomEmoji();
    div.innerText = `${prefix} ${text} ${suffix}`;

    const object = new THREE.CSS3DObject(div);
    const vector = new THREE.Vector3();
    camera.getWorldDirection(vector);

    const zOffset = 1000;
    const pos = camera.position.clone().add(vector.multiplyScalar(zOffset));
    const spread = 400;

    const startY = pos.y + 600;

    object.position.set(
        pos.x + (Math.random() - 0.5) * spread,
        startY,
        pos.z + (Math.random() - 0.5) * spread
    );

    // Bắt đầu với opacity = 1
    div.style.opacity = "1";
    div.style.transition = "opacity 0.2s linear"; // mượt

    scene.add(object);

    const speed = 0.9;

    function fall() {
        object.position.y -= speed;

        // 🔄 Xoay nhẹ quanh trục Y
        object.rotation.y += 0.01;

        // Tính phần trăm rơi (từ 1 → 0)
        const progress = (object.position.y + 1000) / (startY + 1000);
        const opacity = Math.max(0, Math.min(1, progress));
        div.style.opacity = opacity.toFixed(2);

        if (object.position.y < -1000) {
            scene.remove(object);
            return;
        }

        requestAnimationFrame(fall);
    }

    fall();
}, 800);
