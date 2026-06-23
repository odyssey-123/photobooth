const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const uploadBtn = document.getElementById("uploadBtn");

const loading = document.getElementById("loading");
const success = document.getElementById("success");

const ctx = canvas.getContext("2d");

let photoBlob = null;

// Start Camera
async function startCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        video.srcObject = stream;

    } catch (err) {

        alert("Could not access camera.");

        console.error(err);

    }

}

startCamera();

// Capture Photo
captureBtn.addEventListener("click", () => {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

   ctx.save();

ctx.scale(-1, 1);

ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

ctx.restore();

    canvas.style.display = "block";
    video.style.display = "none";

    captureBtn.style.display = "none";
    retakeBtn.style.display = "block";
    uploadBtn.style.display = "block";

});

// Retake
retakeBtn.addEventListener("click", () => {

    canvas.style.display = "none";
    video.style.display = "block";

    captureBtn.style.display = "block";
    retakeBtn.style.display = "none";
    uploadBtn.style.display = "none";

});

// Upload
uploadBtn.addEventListener("click", () => {

    loading.style.display = "block";

    canvas.toBlob(async function(blob){

        photoBlob = blob;

        const fileName = "photo_" + Date.now() + ".jpg";

        const { error } = await supabaseClient
            .storage
            .from("Photos")
            .upload(fileName, photoBlob);

        loading.style.display = "none";

        if(error){

            alert(error.message);
            console.log(error);

            return;

        }

        success.style.display = "block";

        captureBtn.style.display = "none";
        retakeBtn.style.display = "none";
        uploadBtn.style.display = "none";

    }, "image/jpeg", 0.95);

});
