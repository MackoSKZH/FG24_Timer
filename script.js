import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDjkjvy72ut3gkRMY5wrUpoameW3Chtbv4",
    authDomain: "fgsvk-scorer.firebaseapp.com",
    databaseURL: "https://fgsvk-scorer-default-rtdb.firebaseio.com",
    projectId: "fgsvk-scorer",
    storageBucket: "fgsvk-scorer.appspot.com",
    messagingSenderId: "607415903265",
    appId: "1:607415903265:web:9e6c10f82571816869af60",
    measurementId: "G-L4LXS2SCRJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

let swapBtn = document.getElementById("button-switch");
let scene1 = document.getElementById("board");

function TeamChoice(choice) {
    return `<option value="${choice}">${choice.replace(/_/g, ' ')}</option>`;
}

function optionPreset() {
    const teamsRef = ref(db, 'Teams/');

    get(teamsRef).then(snapshot => {
        if (snapshot.exists()) {
            const teams = Object.keys(snapshot.val());
            const dropdowns = ['team-select-blue1', 'team-select-blue2', 'team-select-red1', 'team-select-red2'];

            dropdowns.forEach(dropdownId => {
                const dropdown = document.getElementById(dropdownId);
                dropdown.innerHTML = teams.map(TeamChoice).join('');
            });
        } else {
            console.log("No teams found in Firebase.");
        }
    }).catch(error => {
        console.error("Failed to load teams from Firebase:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.cursor = 'auto';

    let swapBtn = document.getElementById("button-switch");
    
    function swapScene() {
        document.body.style.cursor = 'none';

        const team1 = document.getElementById('team-select-blue1').value.replace(/_/g, ' ');
        const team2 = document.getElementById('team-select-blue2').value.replace(/_/g, ' ');
        const team3 = document.getElementById('team-select-red1').value.replace(/_/g, ' ');
        const team4 = document.getElementById('team-select-red2').value.replace(/_/g, ' ');

        document.getElementById('team1').textContent = team1;
        document.getElementById('team2').textContent = team2;
        document.getElementById('team3').textContent = team3;
        document.getElementById('team4').textContent = team4;

        const matchNumber = document.getElementById('match-number').value;
        document.getElementById('match-number-label').textContent = `MATCH: ${matchNumber}`;


        scene1.style.display = 'none';
    }

    swapBtn.onclick = swapScene;
});

document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let time = 150;

    // Function to update the time display
    function updateTimerDisplay() {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById('time-counter').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    function playSound(num) {
        const sounds = [
            'start_horn',
            'count_down'
        ];
        const audio = new Audio(`./tunes/${sounds[num]}.wav`);
        audio.play();
    }

    function decrementTimer() {
        if (time > 0) {
            time--;
            updateTimerDisplay();

            if (time === 30) {
                playSound(2);
            } else if (time <= 10 && time > 0) {
                playSound(1);
            }
        } else {
            clearInterval(timer);
            timer = null;
            playSound(0);
            // console.log('Timer ended!');
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            if (timer) {
                clearInterval(timer);
                timer = null;
                // console.log('Timer paused');
            } else {
                playSound(0);
                timer = setInterval(decrementTimer, 1000);
                // console.log('Timer started');
            }
        } else if (event.key === 'r') {
            clearInterval(timer);
            timer = null;
            time = 150;
            updateTimerDisplay();
            console.log('Timer reset');
        } else if (event.key == 'Escape') {
            clearInterval(timer);
            timer = null;
            time = 150;
            updateTimerDisplay();
            location.reload();
        }
    });

    updateTimerDisplay();
});

optionPreset();