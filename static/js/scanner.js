let video;
let model;

async function startScanner() {
    const videoEl = document.getElementById("webcam");
    const resultBox = document.getElementById("resultBox");
    const predictionLabel = document.getElementById("predictionLabel");
    const productImage = document.getElementById("productImage");

    video = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
    });

    videoEl.srcObject = video;

    model = await mobilenet.load();
    console.log("✅ Model loaded");

    setInterval(async () => {
        const predictions = await model.classify(videoEl);
        if (predictions && predictions.length > 0) {
            const label = predictions[0].className;

            predictionLabel.innerText = label;

            // Fetch corresponding image from Flask
            fetch("/get-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    productImage.src = data.image_url;
                    resultBox.style.display = "block";
                }
            });
        }
    }, 3000); // Every 3 seconds
}
