const urls_imgs = [ 'imgs/mlb.jpg', 'imgs/mou.jpg', 'imgs/pacman.png', 'imgs/web.jpg', 'imgs/Wot.jpg', 'imgs/py.png'];
const main_node = document.getElementById('image-layout');
const screen = document.getElementById('image-screen');
let active_index = 0;

window.onload = function() {
    var i = 0;
    urls_imgs.forEach(function(img){
        new Image().src = img; 
        var image = document.createElement('img');
        image.src = img;
        image.classList.add('block');
        image.setAttribute('id', `img${i}`);
        main_node.appendChild(image);
        i++;
    });
    

    var start_image = document.createElement('img');
    start_image.src = urls_imgs[active_index];
    start_image.style.height = '563px';
    start_image.setAttribute('id', 'image');
    screen.insertBefore(start_image, screen.childNodes[4]);

    screen.addEventListener('mouseenter', event => {
        screen.childNodes[1].style.animationName = 'fadeIn';
        screen.childNodes[1].style.animationDuration = '350ms';
        screen.childNodes[1].style.visibility = 'visible'; 
    });

    screen.addEventListener('mouseleave', event => {
        screen.childNodes[1].style.animationName = 'fadeOut';
        screen.childNodes[1].style.animationDuration = '350ms';
        screen.childNodes[1].style.visibility = 'hidden';
    });
}

document.addEventListener('click', event => {
    for(var i = 0; i <= urls_imgs.length - 1; i++) {
        if (event.target.id === `img${i}`) {
            selectImage(i);
            active_index = i;
        }
    }

    if(event.target.id === 'arrow-left') {
        active_index--;
        if(active_index < 0) { active_index=urls_imgs.length - 1; }
        selectImage(active_index);
    }
    if(event.target.id === 'arrow-right') {
        active_index++;
        if(active_index > urls_imgs.length - 1) { active_index=0; }
        selectImage(active_index);
    }
});

function selectImage(index) {
    return screen.childNodes[4].src = urls_imgs[index];
}

function fullSize() {
    var full_image = document.getElementById('image');
    var url = full_image.getAttribute('src');
    window.open(url, '_blank');
}