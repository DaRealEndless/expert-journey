alarm = "";
videoLoaded = false;
objects = [];
i = 0;
babyDetected = false;
percent = 0;

function preload() {
    alarm = loadSound("purge.mp3");
    alarm.setVolume(1);
    alarm.rate(1);
}

function setup() {
    canvas = createCanvas(497, 398);
    video = createCapture(VIDEO);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    videoLoaded = true;
    canvas.center();
}

function modelLoaded() {
    console.log("Model Loaded!");
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    }
    objects = results;
}

function draw() {
    image(video, 0, 0, 497, 398);
    if (videoLoaded == true) {
        console.log(objects);
        objectDetector.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            stroke('red');
            fill('red');
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x, objects[i].y);
            noFill();
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].length < 0) {
                alarm.play();
                document.getElementById("status").innerHTML = "Baby out of frame";
            }
            if (objects[i].label != "person") {
                alarm.play();
                document.getElementById("status").innerHTML = "Baby out of frame";
            }
            if (objects[i].label == "person") {
                alarm.stop();
                document.getElementById("status").innerHTML = "Baby in frame";
            }
        }
    }
}