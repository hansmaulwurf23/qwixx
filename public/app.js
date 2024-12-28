const { createApp } = Vue;

const vueapp = createApp({
    data() {
        return {
            numbers: [
                new Array(11).fill(false),
                new Array(11).fill(false),
                new Array(11).fill(false),
                new Array(11).fill(false)
            ],
            locks: new Array(4).fill(false),
            fails: 0,
            colors: [
                'danger', 'warning', 'success', 'primary'
            ],
            pointsMap: [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78],
        }
    },
    // TODO:
    // - error handling
    // - points are basically n(n+1)/2
    methods: {
        markNumber(color, number) {
            nos = this.numbers[color];
            right = nos.slice(number);
            if (right.some((x) => x === true)) {
                return alert('Es wurde bereits weiter rechts markiert!');
            }

            nos[number] = true;
        },
        markLock(color) {
            if (this.locks[color]) {
                return alert('Diese Farbe wurde bereits gelockt!');
            }
            if (this.getColorNumbers(color) < 5) {
                return alert('Es sind nicht mindestens 5 Zahlen eingelockt!');
            }
            if (!this.numbers[color].at(-1)) {
                return alert('Der letzte Kasten muss angekreuzt sein!');
            }
            if (this.locks.filter((l) => l === true).length === 2) {
                return alert('Es sind bereits zwei Reihen gelockt!');
            }
            this.locks[color] = true;
        },
        markFail() {
            if (this.fails === 4) {
                return alert('Es sind nur 4 Fehlversuche erlaubt!');
            }
            this.fails += 1;
        },
        getColorNumbers(color) {
            return this.numbers[color].filter(x => x === true).length;
        },
        getColorScore(color) {
            return this.pointsMap[this.getColorNumbers(color) + (this.locks[color] ? 1 : 0)];
        },
        getFailPoints() {
            return this.fails * 5;
        },
        getScore() {
            score = -this.getFailPoints();
            for (let i = 0; i < this.numbers.length; i++) {
                score += this.getColorScore(i);
            }
            return score;
        },
        getBgColor(idx) {
            return 'bg-' + this.colors[idx];
        },
        getBorderColor(idx) {
            return 'border-' + this.colors[idx];
        },
        getLock(idx) {
            return this.locks[idx] ? 'fa-lock' :'fa-lock-open';
        },

    }
}).mount('#app');