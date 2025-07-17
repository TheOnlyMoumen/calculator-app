"use strict";

const global = {
    root: document.getElementById("root"),
    themeBtn: document.querySelector(".theme-btn input")
}

function main() {
    changeTheme();
    const calculator = new Calculator();
    calculator._run(true);
}

function changeTheme() {
    global.themeBtn.addEventListener("change", () => {
        let currentTheme = (global.themeBtn.checked) ? "dark" : "light";
        global.root.setAttribute("data-theme", currentTheme);
    })
}

class Calculator {
    #display;
    #modes;
    #dropDown;
    #dropDownBtn;
    #dropDownBtnText;
    #clearBtn;
    #submitBtn;
    #displayBtns;

    constructor () {
        this.#display = document.getElementById("display");
        this.#modes = Array.from(document.querySelectorAll("input[name='mode']"));
        this.#modes[0].checked = true;

        this.#dropDown = document.getElementById("drop-down");
        this.#dropDownBtn = document.getElementById("drop-down-btn");
        this.#dropDownBtnText = document.querySelector("#drop-down-btn .text");
        this.#dropDownBtnText.innerText = this.#modes[0].value;

        this.#clearBtn = document.querySelector(".calc-btn-clear");
        this.#submitBtn = document.querySelector(".calc-btn-submit");
        this.#displayBtns = Array.from(document.querySelectorAll(".calc-btn-number, .calc-btn-period, .calc-btn-left-p, .calc-btn-right-p, .calc-btn-operator"));

        this.#dropDown.setAttribute("data-mode", this.#modes[0].value);
    }

    #handleEvents() {
        // display / hide the drop down
        let dropDownState = false;

        const hideDropDown = () => {
            dropDownState = false;
            this.#dropDown.style.display = "none";
            global.root.removeEventListener("click", hideDropDown);
        }

        this.#dropDownBtn.addEventListener("click", () => {
            dropDownState = !dropDownState;
            this.#dropDown.style.display = dropDownState ? "flex" : "none";
        })

        global.root.addEventListener("click", () => {
            if (dropDownState)
                global.root.addEventListener("click", hideDropDown);
        })

        for (const mode of this.#modes)
            mode.addEventListener("change", () => {
                if (mode.checked) {
                    this.#dropDownBtnText.innerText = mode.value;
                    this.#dropDown.setAttribute("data-mode", mode.value);
                }
            })

        // Clear the display if AC button is clicked
        this.#clearBtn.addEventListener("click", () => this.#display.value = "");

        // Display the value of the keys when pressed
        for (const btn of this.#displayBtns) {
            btn.addEventListener("click", () => {
                this.#display.value += btn.innerHTML;
            })
        }

    }

    _run(flag) {
        if (flag) {
            this.#handleEvents();
        }
    }
}

document.addEventListener("DOMContentLoaded", main);