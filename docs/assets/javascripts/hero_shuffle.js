"use strict";
// Purpose: Cycle through a collection of images with a parallax effect.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function delay(t, val) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}
const colors = {
    atomicOrange: "var(--atomic-tangerine)",
    aqua: "var(--aqua)",
    aquamarine: "var(--aquamarine)",
    blueBlue: "var(--blue-blue)",
    darkEmerald: "var(--dark-emerald)",
    dutchWhite: "var(--dutch-white)",
    ecru: "var(--ecru)",
    emerald: "var(--emerald)",
    mindaro: "var(--mindaro)",
    white: "white",
    zaffre: "var(--zaffre)",
};
const defaultSettings = {
    colors: { h1: colors.emerald, p: colors.emerald },
    scale: "1.1",
    objectFit: "scale-down",
    perspective: "50em",
    perspectiveOrigin: "center bottom",
    // TODO: get translated transforms to work
};
const imageSettings = {
    anime: {
        colors: { h1: colors.atomicOrange, p: colors.emerald },
    },
    artbrut: {
        colors: { h1: colors.atomicOrange, p: colors.aqua },
    },
    comic: {
        colors: { h1: colors.aquamarine, p: colors.white },
    },
    fanciful: {
        colors: { h1: colors.mindaro, p: colors.blueBlue },
        perspectiveOrigin: "30% 20%",
        scale: "1",
        objectPosition: "center bottom",
        translate: "0% -30%",
    },
    fantasy: {
        colors: { h1: colors.white, p: colors.mindaro },
        scale: "1",
        objectPosition: "center bottom",
        translate: "0% -20%",
    },
    farcical: {
        colors: { h1: colors.atomicOrange, p: colors.blueBlue },
        scale: "1",
        translate: "0% -35%",
    },
    fauvist: {
        colors: { h1: colors.mindaro, p: colors.white },
    },
    minimal: {
        colors: { h1: colors.atomicOrange, p: colors.mindaro },
        objectPosition: "center bottom",
        scale: "1",
        perspective: "50rem",
        translate: "0% -25%",
    },
    mystical: {
        colors: { h1: colors.blueBlue, p: colors.white },
        scale: "1",
        perspective: "40rem",
        objectPosition: "center bottom",
        translate: "0% -25%",
    },
    surreal: {
        colors: { h1: colors.white, p: colors.atomicOrange },
        scale: "1",
        translate: "0% -25%",
    },
};
const defaultPortraitSettings = {
    colors: { h1: colors.emerald, p: colors.emerald },
    scale: "1.4",
    objectFit: "cover",
    objectPosition: "center bottom",
};
const portraitImageSettings = {
    anime: {
        colors: { h1: colors.atomicOrange, p: colors.white },
        perspective: "-50rem",
        scale: "1.8",
        translate: "0% 40%",
    },
    artbrut: {
        colors: { h1: colors.atomicOrange, p: colors.aqua },
        translate: "0% 20%",
    },
    comic: {
        colors: { h1: colors.atomicOrange, p: colors.aqua },
        translate: "0% 20%",
    },
    fanciful: {
        colors: { h1: colors.mindaro, p: colors.aqua },
        translate: "0% 20%",
    },
    fantasy: {
        colors: { h1: colors.atomicOrange, p: colors.mindaro },
        translate: "0% 25%",
    },
    farcical: {
        colors: { h1: colors.mindaro, p: colors.aqua },
        translate: "0% 18%",
    },
    fauvist: {
        colors: { h1: colors.mindaro, p: colors.white },
        translate: "0% 20%",
    },
    minimal: {
        colors: { h1: colors.aquamarine, p: colors.white },
        translate: "0% 20%",
    },
    mystical: {
        colors: { h1: colors.white, p: colors.aquamarine },
        translate: "0% 20%",
    },
    surreal: {
        colors: { h1: colors.white, p: colors.atomicOrange },
        translate: "0% 20%",
    },
};
const getImageSettings = (imageName) => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const landscapeSettings = imageSettings[imageName] || {};
    const portraitSettings = portraitImageSettings[imageName] || {};
    if (isPortrait) {
        return Object.assign(Object.assign(Object.assign(Object.assign({}, defaultSettings), landscapeSettings), defaultPortraitSettings), portraitSettings);
    }
    return Object.assign(Object.assign({}, defaultSettings), landscapeSettings);
};
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
const generateImageDataType = (imageName, rootUrl) => {
    const settings = getImageSettings(imageName);
    const widths = ["1280", "1920", "2560", "3840"];
    const baseUrl = `${rootUrl}/${imageName}/${imageName}`;
    const url = `${baseUrl}_1280.webp`;
    const srcset = widths
        .map((imgWidth) => `${rootUrl}/${imageName}/${imageName}_${imgWidth}.webp ${imgWidth}w`)
        .join(", ");
    return {
        imageName,
        baseUrl,
        url,
        srcset,
        settings,
        colorSpace: "srgb",
        data: new Uint8ClampedArray(),
        imgWidth: "1280",
    };
};
const getImageData = () => __awaiter(void 0, void 0, void 0, function* () {
    const imageNames = Object.keys(imageSettings);
    const shuffledImages = shuffle(imageNames);
    const rootUrl = "assets/images/hero";
    const imageData = {};
    for (const imageName of shuffledImages) {
        imageData[imageName] = generateImageDataType(imageName, rootUrl);
    }
    return imageData;
});
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("ImageCacheDB", 1);
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore("images", { keyPath: "url" });
        };
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onerror = function (event) {
            reject("Database error: " + event.target.error);
        };
    });
};
const getImageFromCache = (db, optimalUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], "readonly");
        const objectStore = transaction.objectStore("images");
        const request = objectStore.get(optimalUrl);
        request.onsuccess = () => {
            if (request.result) {
                return resolve(request.result.image);
            }
            else {
                storeImageInCache(db, optimalUrl);
            }
            request.onerror = () => reject("Failed to retrieve image from cache");
            storeImageInCache(db, optimalUrl);
        };
    });
});
const storeImageInCache = (db, optimalUrl, blob) => __awaiter(void 0, void 0, void 0, function* () {
    blob = blob || (yield fetch(optimalUrl).then((response) => response.blob()));
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], "readwrite");
        const objectStore = transaction.objectStore("images");
        const request = objectStore.add({ url: optimalUrl, image: blob });
        const response = Promise.allSettled([request]);
        response.then((results) => {
            if (results[0].status === "fulfilled") {
                resolve();
            }
            else {
                console.error("Failed to store image in cache:", optimalUrl);
                reject();
            }
        });
    });
});
const determineOptimalWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1280) {
        return "1280";
    }
    if (screenWidth <= 1920) {
        return "1920";
    }
    if (screenWidth <= 2560) {
        return "2560";
    }
    return "3840";
};
function getTransformationSettings(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformationSettings = new Map();
        for (const [key, value] of Object.entries(settings)) {
            if (key.startsWith("transform") || key === "transition") {
                transformationSettings.set(key, value);
            }
        }
        return transformationSettings;
    });
}
;
function setStyles(img, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const [key, value] of Object.entries(settings)) {
            if ((value && key !== "colors") || key.startsWith("transform" || key === "transition")) {
                img.style.setProperty(key, value.toString());
            }
        }
        img.style.opacity = "0";
        img.style.transition = "opacity .5s ease-in";
        return img;
    });
}
function applyTransformation(img, transformationSettings) {
    return __awaiter(this, void 0, void 0, function* () {
        img.style.transform = "none";
        requestAnimationFrame(() => {
            img.style.transition += transformationSettings.get("transition");
            transformationSettings.forEach((value, key) => {
                if (key !== "transition") {
                    img.style.setProperty(key, value);
                }
            });
        });
    });
}
;
const createImageElement = (imageData, firstImage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Creating image element for:", imageData.imageName);
        const db = yield openDB();
        const optimalWidth = determineOptimalWidth();
        const optimalUrl = `${imageData.baseUrl}_${optimalWidth}.webp`;
        const result = getImageFromCache(db, optimalUrl);
        const imageBlob = (yield Promise.any([result, fetch(optimalUrl).then((response) => response.blob())]));
        if (!imageBlob || imageBlob.size === 0) {
            throw new Error("Failed to retrieve a valid image blob");
        }
        const img = new Image(Number(optimalWidth));
        const imageUrl = URL.createObjectURL(imageBlob);
        img.src = imageUrl;
        img.srcset = imageData.srcset;
        img.sizes =
            "(max-width: 1280px) 1280px, (max-width: 1920px) 1920px, (max-width: 2560px) 2560px, 3840px";
        img.alt = "";
        img.classList.add("hero-parallax__image");
        img.draggable = false;
        img.fetchPriority = firstImage ? "high" : "auto";
        img.loading = firstImage ? "eager" : "lazy";
        const styledImg = yield setStyles(img, imageData.settings);
        styledImg.onload = () => {
            setTimeout(() => URL.revokeObjectURL(imageUrl), 60000);
            requestAnimationFrame(() => {
                styledImg.style.transition = "opacity .5s ease-in";
                styledImg.style.opacity = "1";
            });
            return styledImg;
        };
        styledImg.onerror = (error) => {
            console.error("Image failed to load:", imageData.imageName, error);
        };
        return styledImg;
    }
    catch (error) {
        console.error("Error in createImageElement:", error);
    }
});
const updateColors = (colors) => __awaiter(void 0, void 0, void 0, function* () {
    const h1 = document.getElementById("CTA_header");
    const p = document.getElementById("CTA_paragraph");
    if (h1) {
        h1.style.transition = "color 0.5s ease-in";
        h1.style.color = colors.h1;
    }
    if (p) {
        p.style.transition = "color 0.5s ease-in";
        p.style.color = colors.p;
    }
});
function getFirstImage(imageDatum, parallaxLayer) {
    return __awaiter(this, void 0, void 0, function* () {
        updateColors(imageDatum.settings.colors);
        const results = createImageElement(imageDatum, true);
        const imageElement = (yield Promise.allSettled([results])).filter((p) => p.status === "fulfilled")[0].value;
        if (!imageElement) {
            console.error("Failed to create image element");
            console.error(results);
            return;
        }
        const transformationSettings = yield getTransformationSettings(imageDatum.settings);
        parallaxLayer.appendChild(imageElement);
        if (transformationSettings) {
            applyTransformation(imageElement, transformationSettings);
            imageElement.style.opacity = "1";
        }
    });
}
;
function transitionImages(lastImage, nextImage, transformationSettings) {
    return __awaiter(this, void 0, void 0, function* () {
        lastImage.style.transition = "opacity 1s ease-out";
        lastImage.style.opacity = "0";
        if (transformationSettings) {
            applyTransformation(nextImage, transformationSettings);
        }
        nextImage.style.opacity = "1";
        lastImage.addEventListener('transitionend', () => {
            lastImage.remove();
        });
    });
}
;
function cycleNextImage(imageDatum, parallaxLayer) {
    return __awaiter(this, void 0, void 0, function* () {
        const preLoad = yield createImageElement(imageDatum);
        if (!preLoad) {
            console.error("Failed to preload image:", imageDatum.imageName);
            return;
        }
        const lastImage = parallaxLayer.getElementsByTagName('img')[0];
        preLoad.style.opacity = "0";
        parallaxLayer.appendChild(preLoad);
        // Wait for the new image to load before starting the transition
        preLoad.onload = () => __awaiter(this, void 0, void 0, function* () {
            const transformationSettings = yield getTransformationSettings(imageDatum.settings);
            yield transitionImages(lastImage, preLoad, transformationSettings);
            updateColors(imageDatum.settings.colors);
        });
        preLoad.onerror = (error) => {
            console.error("Image failed to load:", imageDatum.imageName, error);
        };
    });
}
const cycleImages = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (firstImage = true) {
    const imageData = yield getImageData();
    const parallaxLayer = document.getElementsByClassName("hero-parallax__layer")[0];
    if (firstImage) {
        const firstLoad = imageData[Object.keys(imageData)[0]];
        yield getFirstImage(firstLoad, parallaxLayer);
        firstImage = false;
    }
    const remainingKeys = Object.keys(imageData).slice(1);
    const remainingImages = remainingKeys.map((key) => imageData[key]);
    const cycleNext = (index) => __awaiter(void 0, void 0, void 0, function* () {
        if (index >= remainingImages.length) {
            index = 0; // Restart the cycle
        }
        yield delay(1000 * 30);
        console.log("Cycling to next image:", remainingImages[index].imageName);
        yield cycleNextImage(remainingImages[index], parallaxLayer);
        cycleNext(index + 1);
    });
    cycleNext(0);
});
cycleImages();
const imageLayer = document.getElementsByClassName('hero-parallax__layer')[0];
const imageInserted = document.getElementsByTagName('img')[0];
const imageVisible = imageInserted && imageInserted.style.opacity === '1';
const imageResize = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        cycleImages();
    });
};
window.addEventListener('resize', imageResize);
window.addEventListener('orientationchange', imageResize);
window.addEventListener('pageshow', imageResize);
window.addEventListener('pagereveal', imageResize);
