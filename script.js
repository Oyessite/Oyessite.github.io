document.addEventListener("DOMContentLoaded", () => {
    const animasi = document.getElementById("animasi");
    const countdown = document.getElementById("countdown");
    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");
    const btn1min = document.getElementById("btn1min");
    const btn2min = document.getElementById("btn2min");
    const btnRotate = document.getElementById("btnRotate");
    const btnZoom = document.getElementById("btnZoom");
    const btnPause = document.getElementById("btnPause");
    const btnStop = document.getElementById("btnStop");
    const animationControls = document.getElementById("animation-controls");
    const timeControls = document.getElementById("time-controls");
    const backgroundMusic = document.getElementById("backgroundMusic")

    let radius = 180; // Radius lingkaran untuk animasi berputar
    let centerX = window.innerWidth / 2 - 25;
    let centerY = window.innerHeight / 2 - 25; // Adjusted for animasi height
    let angle = 0;
    let duration;
    let animationFrameId;
    let intervalId;
    let selectedAnimation = null;
    let zoomDirection = 1; // 1 for zoom in, -1 for zoom out
    let zoomScale = 1; // Initial scale for zoom animation
    let isPaused = false;
    let remainingTime;

    function resetAnimasi() {
        animasi.style.left = `${centerX}px`;
        animasi.style.top = `${centerY}px`;
        animasi.style.transform = 'scale(1)';
    }

    function animateRotate() {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        animasi.style.left = `${x}px`;
        animasi.style.top = `${y}px`;

        angle += 0.03;
        animationFrameId = requestAnimationFrame(animateRotate);
    }

    function animateZoom() {
        const scaleStep = 0.05; // Amount to zoom in or out per frame
        zoomScale += zoomDirection * scaleStep;

        if (zoomScale > 5 || zoomScale < 1) {
            zoomDirection *= -1; // Reverse direction if out of bounds
        }

        animasi.style.transform = `scale(${zoomScale})`;
        animationFrameId = requestAnimationFrame(animateZoom);
    }

    function startAnimation() {
        animasi.style.display = 'block';
        countdown.style.display = 'block';
        text1.style.display = 'none';  // Sembunyikan text1 saat animasi dimulai
        text2.style.display = 'block';
        backgroundMusic.play();

        if (selectedAnimation === 'rotate') {
            countdown.classList.add('countdown-center');
            countdown.classList.remove('countdown-bottom');
            animateRotate();
        } else if (selectedAnimation === 'zoom') {
            countdown.classList.add('countdown-bottom');
            countdown.classList.remove('countdown-center');
            animateZoom();
        }
    }

    function stopAnimation() {
        cancelAnimationFrame(animationFrameId);
        animasi.style.display = 'none';
        countdown.style.display = 'none';
        text2.style.display = 'none';
        animationControls.style.display = 'block';
        timeControls.style.display = 'none';
        text1.style.display = 'block';  // Tampilkan kembali text1 saat animasi berhenti
        backgroundMusic.pause();  // Stop the music
        backgroundMusic.currentTime = 0;
        resetAnimasi(); // Kembalikan posisi dan ukuran objek ke awal
    }

    function pauseAnimation() {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
        clearInterval(intervalId);
        remainingTime = duration;
        btnPause.textContent = 'Resume';
    }

    function resumeAnimation() {
        isPaused = false;
        duration = remainingTime;
        startCountdown(duration / 60, true);  // Menambahkan parameter untuk melanjutkan countdown
        btnPause.textContent = 'Pause';
    }

    function countdownAnimation(callback) {
        let countdownText = ['3', '2', '1', 'Mulai!'];
        let index = 0;

        animationControls.style.display = 'none';
        timeControls.style.display = 'none';
        text1.style.display = 'none';
        text2.style.display = 'none';
        animasi.style.display = 'none';
        countdown.style.display = 'block';
        countdown.classList.add('countdown-center');

        function showNextCountdown() {
            if (index < countdownText.length) {
                countdown.textContent = countdownText[index];
                index++;
                setTimeout(showNextCountdown, 1000);
            } else {
                countdown.style.display = 'none';
                callback();
            }
        }

        showNextCountdown();
    }

    function startCountdown(minutes, resume = false) {
        if (!resume) {
            duration = minutes * 60;
        }
        countdown.textContent = `${Math.floor(duration / 60)}:${(duration % 60 < 10 ? '0' : '') + duration % 60}`;

        intervalId = setInterval(() => {
            let minutes = Math.floor(duration / 60);
            let seconds = duration % 60;

            countdown.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (duration > 0) {
                duration--;
            } else {
                clearInterval(intervalId);
                stopAnimation();
                countdown.textContent = "Waktu Habis!";
            }
        }, 1000);

        startAnimation();
    }

    btnRotate.addEventListener("click", () => {
        selectedAnimation = 'rotate';
        animationControls.style.display = 'none';
        timeControls.style.display = 'block';
    });

    btnZoom.addEventListener("click", () => {
        selectedAnimation = 'zoom';
        animationControls.style.display = 'none';
        timeControls.style.display = 'block';
    });

    btn1min.addEventListener("click", () => {
        countdownAnimation(() => startCountdown(1));
    });

    btn2min.addEventListener("click", () => {
        countdownAnimation(() => startCountdown(2));
    });

    btnPause.addEventListener("click", () => {
        if (isPaused) {
            resumeAnimation();
        } else {
            pauseAnimation();
        }
    });

    btnStop.addEventListener("click", () => {
        stopAnimation();
        clearInterval(intervalId);
    });
});
