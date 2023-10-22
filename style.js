const boxInput = document.querySelector(".boxInput");
const inputText = document.querySelector(".boxInput textarea");
const buttonAdd = document.querySelector("button");
const paragraph = document.querySelector("#paragraph");
const result = document.querySelector(".result");
const sound = document.querySelector(".sound");
let definitions, phontetics, clickWord, vnMean;
const arrWord = localStorage.getItem("LIST_WORD")
    ? JSON.parse(localStorage.getItem("LIST_WORD"))
    : [];
console.log(arrWord);
buttonAdd.addEventListener("click", function () {
    const words = inputText.value.split(" ");
    const arrWords = words.filter((item) => /[a-zA-Z]/.test(item));

    boxInput.style.display = "none";
    paragraph.style.display = "block";

    arrWords.forEach((word) => {
        const wordElement = document.createElement("span");
        wordElement.textContent = word + " ";
        wordElement.style.cursor = "pointer";

        paragraph.appendChild(wordElement);

        wordElement.addEventListener("click", async () => {
            const dataVN = await translatedVN(word);

            const dataEN = await showEnInfo(word);

            clickWord = word;

            vnMean = dataVN.responseData.translatedText;
            if (dataEN[0]) {
                definitions = dataEN[0].meanings[0].definitions[0];
                phontetics = `${dataEN[0].meanings[0].partOfSpeech}  /${dataEN[0].phonetic}/`;
                sound.setAttribute("src", `${dataEN[0].phonetics[0].audio}`);
                result.innerHTML = `<div class="word">
                <div class="details">
                    <p>${word} <i class="fas fa-volume-up" onclick="playSound()"></i></p>
                    <span>${phontetics}</span>
                </div>
                
                <i class="fa-solid fa-floppy-disk save" onclick="saveWord()"></i>
            </div>
            <div class="mean">${dataVN.responseData.translatedText}</div>
            <ul class="content">
                <li>
                    <div>
                        <p>Meaning</p>
                        <span
                            >${definitions.definition}</span
                        >
                    </div>
                </li>
                <li>
                    <div>
                        <p>Example</p>
                        <span>${definitions.example}</span>
                    </div>
                </li>
            </ul>`;
            } else {
                result.innerHTML = `<div class="word">
                <div class="details">
                    <p>${word}</p>
                </div>
                <i class="fa-solid fa-floppy-disk save" onclick="saveWord()"></i>
            </div>
            <div class="mean">${dataVN.responseData.translatedText}</div>`;
            }
        });
    });
});
async function translatedVN(word) {
    let apiUrl = `https://api.mymemory.translated.net/get?q=${word}&langpair=en-GB|vi-VN`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data;
}
async function showEnInfo(word) {
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data;
}
function playSound() {
    sound.play();
}
function saveWord() {
    const objWord = {
        word: clickWord,
        phontetics: phontetics,
        vnMean: vnMean,
    };
    arrWord.push(objWord);
    localStorage.setItem("LIST_WORD", JSON.stringify(arrWord));
    loadWord();
}

const openModalBtn = document.querySelector(".open-modal-btn");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body ul");
const closeIcon = document.querySelectorAll(".modal .close");
openModalBtn.addEventListener("click", function () {
    modal.classList.add("active");
});
closeIcon.forEach((element) => {
    element.addEventListener("click", function () {
        modal.classList.remove("active");
    });
});
modal.addEventListener("click", function (e) {
    if (e.target == e.currentTarget) {
        modal.classList.remove("active");
    }
});
function loadWord() {
    modalBody.innerHTML = "";
    arrWord.forEach((word) => {
        modalBody.innerHTML += `<li><span>${word.word}</span> - <span>(${word.phontetics})</span> - <span>${word.vnMean}</span></li>`;
    });
}
loadWord();
