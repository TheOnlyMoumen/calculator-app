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
    #history;
    #modes;
    #dropDown;
    #dropDownBtn;
    #dropDownBtnText;
    #clearBtn;
    #submitBtn;
    #displayBtns;
    #operators;

    #result;
    #isNewExpression;
    #startEval;

    constructor () {
        this.#display = document.getElementById("display");
        this.#history = document.getElementById("history");
        this.#modes = Array.from(document.querySelectorAll("input[name='mode']"));
        this.#modes[0].checked = true;

        this.#dropDown = document.getElementById("drop-down");
        this.#dropDownBtn = document.getElementById("drop-down-btn");
        this.#dropDownBtnText = document.querySelector("#drop-down-btn .text");
        this.#dropDownBtnText.innerText = this.#modes[0].value;

        this.#clearBtn = document.querySelector(".calc-btn-clear");
        this.#submitBtn = document.querySelector(".calc-btn-submit");
        this.#operators = Array.from(document.querySelectorAll(".calc-btn-operator, .calc-btn-percent"));
        this.#displayBtns = Array.from(document.querySelectorAll(".calc-btn-number, .calc-btn-period," + 
            ".calc-btn-left-p, .calc-btn-right-p, .calc-btn-operator, .calc-btn-pi, .calc-btn-percent," +
            ".calc-btn-sqrt, .calc-btn-square"));

        this.#dropDown.setAttribute("data-mode", this.#modes[0].value);

        this.#result = 0;
        this.#isNewExpression = true;
        this.#startEval = false;

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
        
        // Prevent new lines from appearing in the display
        this.#display.addEventListener("keydown", (event) => {
            if (event.key === "Enter")
                event.preventDefault();
        })

        // Display the value of the keys when pressed
        const displayValue = (btn) => {
            if (this.#isNewExpression && this.#isValidResult() && this.#operators.includes(btn)) {
                this.#display.value += btn.innerText;
                this.#isNewExpression = false;
            } else if (this.#isNewExpression) {
                this.#display.value = (btn.innerText === "√") ? btn.innerText + "(" : btn.innerText;
                this.#isNewExpression = false;
            } else
                this.#display.value += (btn.innerText === "√") ? btn.innerText + "(" : btn.innerText;
        }

        for (const btn of this.#displayBtns) {
            btn.addEventListener("click", () => {
                displayValue(btn);
            })
        }

        // Handle keyboard events
        addEventListener("keydown", (event) => {
            if (event.key === "Enter" && this.#display.value !== ""){
                this.#display.value = this.#evaluate(this.#display.value);
                this.#isNewExpression = true;
            } else if (event.key === "Escape") {
                this.#display.value = "";
                this.#isNewExpression = true;
            } else {
                this.#display.focus();
                this.#isNewExpression = false;
            }
        })

        // Evaluate the expression when '=' is clicked
        this.#submitBtn.addEventListener("click", () => {
            if (this.#display.value !== "") {
                this.#display.value = this.#evaluate(this.#display.value);
                this.#isNewExpression = true;
            }
        })

        // Display history expression when clicked
        const observer = new MutationObserver(() => {
            this.#history.querySelectorAll("div").forEach(item => {
                item.addEventListener("click", () => {
                    this.#display.value = item.querySelector(".expression").getAttribute("value").toString();
                    this.#isNewExpression = false;
                })
            })
        })

        observer.observe(this.#history, {
            childList: true
        })
    }

    #isValidResult() {
        return (
            typeof this.#result === "number" &&
            isFinite(this.#result)
        );
    }

    #evaluate(expression) {
        let evalExpression = expression.replace(/[+−×÷π%√²]/g, match => {
            const replacements = {
                '+': '+',
                '−': '-',
                '×': '*',
                '÷': '/',
                'π': '(' + Math.PI.toString() + ')',
                '%': '*(0.01)',
                '√': 'sqrt',
                '²': '^(2)'
            };
            return replacements[match];
        });

        evalExpression = evalExpression.replace(/mod/g, '%');
        expression = expression.replace(/\s+/g, "");
        

        try {
            this.#result = math.evaluate(evalExpression);
            if (this.#isValidResult()) {
                let historyExpression = (expression.length > 10) ?
                expression.slice(0, 10) + "..." : expression;
                let historyResult = (this.#result.toString().length > 10) ?
                this.#result.toString().slice(0, 10) + "..." : this.#result.toString();

                this.#history.insertAdjacentHTML("afterbegin", 
                    "<div><span class='expression' value='" + expression + "'>" + 
                    historyExpression + "</span><span class='equal-sign'> = </span>" + 
                    "<span class='result'>" + historyResult + 
                    "</span></div>"
                );
                return this.#result;
            } else {
                this.#result = null;
                return "Math Error";
            }
        }

        catch (err) {
            this.#result = null;
            return "Syntax Error";
        }
    }

    _run(flag) {
        if (flag) {
            this.#handleEvents();
        }
    }
}

document.addEventListener("DOMContentLoaded", main);