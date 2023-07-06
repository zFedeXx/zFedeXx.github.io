var visibleNav = false;
var navWasOpen = false;
var appearedOnce = false;
var titleAppearedOnce = false;
var currentSection = 0; //la section della pagina sulla quale si ha il focus al momento
var sections;
var min;
var arrayDistances;

function init() {
    sections = document.getElementsByTagName("section");
    arrayDistances = Array(sections.length);
    scrollAnimations();
    img = document.querySelectorAll("section img")
    for(var i = 0; i<img.length; i++) {
        img[i].setAttribute("id","img" + i)
    }

    var call = document.getElementsByClassName("collapsible");
    for(var i = 0; i < call.length; i++) {
        call[i].setAttribute("onclick", "toggleContent(" + i + ")")
    }

    sizeMain()
}

function sizeMain() {
    var main = document.querySelector("main");
    var nav = document.querySelector("nav");
    var footer = document.querySelector("footer");
    main.style.minHeight = (window.innerHeight - nav.clientHeight - footer.clientHeight) + "px";
}

function hideWelcome(reference) {
    var elementsToHide = document.getElementsByClassName("to-hide");
    var calcOpacity = reference / window.innerHeight;
    for(var i = 0; i < elementsToHide.length; i++) { //cambio l'opacità del titolo scorrendo la pagina
        elementsToHide[i].style.opacity = calcOpacity;
    }
}

function scrollAnimations() {  
    var navTools = document.querySelectorAll("#navigation-toolbar div");
    var nav = document.getElementById("nav");
    var NavTopDistance = nav.getBoundingClientRect().top //prendo la distanza del'header dalla cima della viewport    
    
    hideWelcome(NavTopDistance);
    
     if(NavTopDistance > 0 && visibleNav == true) {
        navWasOpen = true;
        toggleNav("hide");
    }

    if(NavTopDistance == 0) { //gestisco la presenza o meno del menu e dei tools di navigazione
        appearedOnce = true;
        for(var i=0; i<navTools.length; i++) {
            navTools[i].classList.add("appear")
            navTools[i].classList.remove("disappear")
        }
        if(navWasOpen == true) {     
            toggleNav("show");
            navWasOpen = false;
        }
    } else {
        if(appearedOnce) { //faccio scomparire le frecce di navigazione solo se sono già apparse una volta
            for(var i=0; i<navTools.length; i++) {
                navTools[i].classList.remove("appear")
                navTools[i].classList.add("disappear")
            }
        }  
    }

    for(var i=0; i < sections.length ; i++) { //calcolo le distanze dei diversi section dalla cima della viewport
        arrayDistances[i] = sections[i].getBoundingClientRect().top
    }

    min = arrayDistances[0];
    currentSection = 0;
    for(var i=0; i<sections.length; i++) {
        if(arrayDistances[i] < min && arrayDistances[i] > 0 || min < 0) {
            min = arrayDistances[i];
            currentSection = i
        }
    }
    // console.log(currentSection)

    var title = document.querySelector("header");
    var hiddenTitle = document.querySelector("nav h1");
    var titleCovered;
    if(title.getBoundingClientRect().bottom - (window.innerHeight / 10) <= 0 ) {
        titleCovered = true;
        titleAppearedOnce = true;
    } else {
        titleCovered = false;
    }

    if(titleCovered) {
        hiddenTitle.classList.add("show");
        hiddenTitle.classList.remove("hide");
    } else {
        if(titleAppearedOnce == true) {
            hiddenTitle.classList.add("hide");
            hiddenTitle.classList.remove("show");
        }  
    }
}

/* function scrollToNav() {
    var referenceElement = document.querySelector(".welcome");
    welocomeBotDistance = referenceElement.getBoundingClientRect().bottom; //distanza dal bottom dell'header alla cime della viewport
    var distance; //distanza dell'header dalla cima della pagina web
    distance = welocomeBotDistance + window.scrollY; //sommo la distanza dalla viewport alla distanza "scrollata" per trovare la distanza dell'elemento reference dalla cima della pagina web
    window.scrollTo({
        top: distance,
        left: 0,
        behavior: "smooth"
    })
} */

function toggleNav(options) { 
    var navMenu = document.getElementById("nav-menu");
    var nav = document.getElementById("nav");
    navDistanceTop = nav.getBoundingClientRect().top;
    switch (options) {
        case "auto":
            if(visibleNav) {
                navMenu.classList.add("slideOut")
                navMenu.classList.remove("slideIn")
            } else {
                if(navDistanceTop > 0) { //se la nav non è fixata in cima NON mostro il nav menu
                    break;
                } else {
                    navMenu.classList.add("slideIn")
                    navMenu.classList.remove("slideOut")
                }
            }
            visibleNav = !visibleNav
            break;
        case "show":
            if(navDistanceTop = 0 || navWasOpen) {
                navMenu.classList.add("slideIn")
                navMenu.classList.remove("slideOut")
                visibleNav = true;
            }
            break;
        case "hide":
            navMenu.classList.add("slideOut")
            navMenu.classList.remove("slideIn")
            visibleNav = false;
            break;     
    }
}

// function scrollPage(event) {
//     console.log("wheel");
//     console.log(event.deltaY);
//     if (event.deltaY > 0); {

//     }
// }

function scrollToSection(direction) {
    var error = false;
    switch(direction) {
        case "up":
            if(currentSection != 0) {
                distanceToScroll = sections[currentSection - 1].getBoundingClientRect().top + window.scrollY - (window.innerHeight / 10);
            } else {
                error = true;
            } //window.innerHeight / 10 è l'altezza della navbar
            break;
        case "down":
            if(currentSection != sections.length - 1) {
                distanceToScroll = sections[currentSection + 1].getBoundingClientRect().top + window.scrollY  - (window.innerHeight / 10);
            } else {
                error = true;
            }
            break;  
        case "top":
            distanceToScroll = sections[0].getBoundingClientRect().top + window.scrollY - (window.innerHeight / 10); 
    }
    if(!error) {
        window.scrollTo(0, distanceToScroll);
    }
}

window.addEventListener("scroll", scrollAnimations);
window.addEventListener("resize", sizeMain)
// window.addEventListener("wheel", scrollPage);

function toggleContent(i) {
    arrows = document.querySelectorAll(".collapsible svg")
    coll = document.getElementsByClassName("collapsible");
    var dummy = coll[i].nextElementSibling;
    var content = dummy.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      arrows[i*2].style.display = "block";
      arrows[i*2+1].style.display = "none";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      arrows[i*2].style.display = "none";
      arrows[i*2+1].style.display = "block";
    //   scrollTo(0, (content.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 10)))
    }
}