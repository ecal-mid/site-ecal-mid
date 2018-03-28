var closeIntro   = document.getElementById('closeIntro'),
    gotoProjects = document.getElementById('gotoProjects'),
    projects     = document.getElementById('projects'),
    gotoAbout    = document.getElementById('gotoAbout'),
    about        = document.getElementById('about');

closeIntro.addEventListener('click', function(e) {
    e.preventDefault();
    if(document.body.classList.contains('intro')) {
        document.body.classList.remove('intro');
        pause();
        gotoProjects.classList.add('active');
    }
});

gotoProjects.addEventListener('click', function(e) {
    e.preventDefault();
    if(document.body.classList.contains('intro')) {
        document.body.classList.remove('intro');
        pause();
    }
    this.classList.add('active');
    projects.classList.remove('inactive');
    gotoAbout.classList.remove('active');
    about.classList.remove('active');
}, false);

gotoAbout.addEventListener('click', function(e) {
    e.preventDefault();
    if(document.body.classList.contains('intro')) {
        document.body.classList.remove('intro');
        pause();
        projects.style.transitionDuration = "0s";
        setTimeout(function() {
            projects.style.transitionDuration = "";
        }, 1000);
    }
    this.classList.add('active');
    about.classList.add('active');
    gotoProjects.classList.remove('active');
    projects.classList.add('inactive');
}, false);

// KONAMI CODE
function openRomain() {
  if(!document.body.classList.contains('intro')) {
      document.body.classList.add('intro');
      play();
  }
}

//Haut, haut, bas, bas, gauche, droite, gauche, droite, B, A
var k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
n = 0;
document.body.addEventListener("keydown", function (e) {
    //alert("s");
    if (e.keyCode === k[n++]) {
        if (n === k.length) {
            openRomain();
            n = 0;
            return false;
        }
    }
    else {
        n = 0;
    }
}, false);

/* INTRO SKETCH PRESETS */
var sketch        = document.getElementById('intro-sketch'),
    canvas        = document.getElementById('intro-sketch-canvas'),
    ctx           = canvas.getContext('2d'), loop, frameCount,
    width         = canvas.clientWidth,
    height        = canvas.clientHeight,
    pointerX      = newPointerX = width/2,
    pointerY      = newPointerY = height/2;

canvas.width  = canvas.clientWidth * window.devicePixelRatio;
canvas.height = canvas.clientHeight * window.devicePixelRatio;

window.addEventListener('resize', function() {
    if(document.body.classList.contains('intro')) {
        pause();
        width         = canvas.clientWidth;
        height        = canvas.clientHeight;
        canvas.width  = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
        setup();
    }
}, false);

addMultipleEventListener('mousemove touchmove', sketch, function(e) {
    var pointer = getRelativePointerPos(e, this);
    pointerX = newPointerX = pointer.x;
    pointerY = newPointerY = pointer.y;
}, false);
