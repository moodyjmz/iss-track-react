const html = String.raw;

interface ScramblerElement {
    value: string,
    oldValue: string,
    unit: string | null,
    isNumber: boolean,
    isScrambling: boolean,
    duration: string,
    spinner: HTMLElement,
    scrambleSource: number,
    charsetLength: number,
    charset: string[],
    scramblerPrefix: string,
    scramblerSuffix: string
}

class ScramblerElement extends HTMLElement implements ScramblerElement{
    static observedAttributes = ['value', 'duration', 'unit'];
    constructor() {
        super();
        this.style;
        this.value;
        this.oldValue;
        this.isNumber;
        this.duration;
        this.spinner;
        this.scrambleSource;
        this.charsetLength = 26;
        this.charset = [...Array(this.charsetLength).keys()].map(i => String.fromCharCode(i + 97));
        this.scramblerPrefix = '';
        this.scramblerSuffix = '';
        this.attachShadow({ mode: 'open' });

    }

    connectedCallback() {
        this.value = this.getAttribute('value') || '0';
        this.isNumber = false;
        this.duration = this.getAttribute('duration') || '1000';
        this.unit = this.getAttribute('unit') || '';
        this.setStyle();
        this.render();

    }

    attributeChangedCallback(name: string, oldValue: string|number|null, newValue: string|number|null) {
        if (name === 'value') {
            this.updateValue(oldValue, newValue);
        }
        if (name === 'duration') {
            this.updateDuration(newValue);
        }
    }

    setStyle() {
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(html`
            [data-scrambler-suffix]::after {
                display: inline-block;
                content: attr(data-scrambler-suffix);
                opacity: .6;
            }
        `);
        if(this.shadowRoot) {
            this.shadowRoot.adoptedStyleSheets = [stylesheet];
        }

    }

    render() {
        if (!this.shadowRoot) {
            return;
        }
        if (this.shadowRoot.innerHTML) {
            this.updateRender();
        } else {
            this.firstRender();
        }
    }

    firstRender() {
        if (!this.shadowRoot) {
            return;
        }
        this.shadowRoot.innerHTML = html`
            <span class="spinner">${this.value}</span>
        `;
    }

    updateRender() {
        this.startAnimation();
    }

    getSpinnerRef() {
        if (this.shadowRoot && !this.spinner) {
            const spinner = this.shadowRoot.querySelector('.spinner');
            if(spinner instanceof HTMLElement) {
                this.spinner = spinner;
            }
        }
        return this.spinner;
    }

    determineType() {
        return !isNaN(Number(this.value)) && !isNaN(Number(this.oldValue));
    }

    updateValue(oldValue: string | number | null, value: string | number | null) {
        console.log('UV', oldValue, value);
        this.oldValue = oldValue;
        this.value = value;
        this.isNumber = this.determineType();

        this.render();
    }

    updateDuration(duration: string | number | null) {
        this.duration = duration;
    }

    updateUnit(unit: string | null) {
        this.unit = unit;
    }



    randomChars(length: number) {
        let result = '';
        for (let i = 0; i < length; i += 1) {
            const randomIndex = Math.floor(Math.random() * this.charsetLength);
            result += `${this.charset[randomIndex]}`;
        }
        return result;
    }

    startScramble() {
        console.log('startScramble', this.value === this.oldValue);
        if (this.isScrambling) {
            this.stopScramble();
        }
        if(this.value === this.oldValue) {
            this.scramblerPrefix = this.value;
            this.applyScramblerPrefix();
            return;
        }
        this.isScrambling = true;
        this.scramblerPrefix = '';
        this.scrambleSource = this.value.length > this.oldValue.length ? this.value.length : this.oldValue.length;
        this.scramblerSuffix = this.randomChars(this.scrambleSource);
        this.applyScramblerPrefix();
        this.applyScramblerSuffix();
        this.animateValue();
    }
    stopScramble = () => {
        this.getSpinnerRef().textContent = this.value;
        this.scramblerSuffix = '';
        this.applyScramblerSuffix();
        this.isScrambling = false;
    }
    startAnimation() {
        console.log(this.value, this.oldValue);
        if(!this.oldValue) {
            return;
        }
        if(this.isNumber) {
            this.startNumberAnimation();
        } else {
            this.startScramble();
        }
    }
    startNumberAnimation() {
        let startTimestamp: number = 0;
        const duration = Number(this.duration);
        const spinner = this.getSpinnerRef();
        console.log('startNumberAnimation', this.oldValue);
        const start = Number(this.oldValue);
        const end = Number(this.value);
        const endSplit = this.value.split('.');
        const decimalPlaces = endSplit[1] ? endSplit[1].length : 0;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            spinner.textContent = (progress * (end - start) + start).toFixed(decimalPlaces);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    stopAnimation() {
        console.log('is this ever called');
        this.stopScramble();
    }

    animateValue() {
        let startTimestamp;
        const iterator = this.scrambleIteration;
        const stop = this.stopAnimation;
        const changeTime = this.duration / this.scrambleSource;
        let stepTime = this.duration;

        const step = (timestamp) => {
            if (!startTimestamp) {
                startTimestamp = timestamp;
            }
            const delta = timestamp - startTimestamp;
            if (delta > changeTime) {
                iterator();
                startTimestamp = timestamp;
                stepTime -= changeTime;
            }
            if (stepTime >= 0) {
                window.requestAnimationFrame(step);
            }
            else {
                stop;

            }
        };
        window.requestAnimationFrame(step);
    }

    scrambleIteration = () => {
        let nextChar = this.value.charAt(this.scramblerPrefix.length);
        if (nextChar === '') {
            this.stopScramble();
        } else {
            this.scramblerPrefix += nextChar;
            this.scramblerSuffix = this.randomChars(this.value.length - this.scramblerPrefix.length);
            this.applyScramblerPrefix();
            this.applyScramblerSuffix();
        }
    }
    applyScramblerPrefix() {
        this.getSpinnerRef().textContent = this.scramblerPrefix;
    }
    applyScramblerSuffix() {
        this.getSpinnerRef().setAttribute('data-scrambler-suffix', this.scramblerSuffix);
    }
}

window.customElements.define('scrambler-element', ScramblerElement);