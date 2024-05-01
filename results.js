import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import {getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
const db = getDatabase();

document.addEventListener('keydown', (event) => {
    if (event.key == 'Escape') {
        location.href="index1.html";
    }
});

function fetchCurrentMatchNumberAndData() {
    const currentMatchNumberRef = ref(db, 'MATCHES/currentMatchNumber');
    
    onValue(currentMatchNumberRef, (snapshot) => {
        if (snapshot.exists()) {
            const currentMatchNumber = snapshot.val();
            fetchAndDisplayMatchData(currentMatchNumber);
        } else {
            console.log('No current match number available');
        }
    }, {
        onlyOnce: true
    });
}

function fetchAndDisplayMatchData(matchNumber) {
    const matchRef = ref(db, `MATCHES/match${matchNumber}`);
    onValue(matchRef, (snapshot) => {
        if (snapshot.exists()) {
            const matchData = snapshot.val();
            displayMatchData(matchData, matchNumber);
        } else {
            console.log('No match data available for match ' + matchNumber);
        }
    }, {
        onlyOnce: true
    });
}

function displayMatchData(matchData, matchNumber) {
    const getElement = id => document.getElementById(id);

    const setTextContent = (id, text) => {
        getElement(id).textContent = text.replace(/_/g, ' ');
    };

    setTextContent('team1', matchData.redAlliance.team1);
    setTextContent('team2', matchData.redAlliance.team2);
    setTextContent('team3', matchData.blueAlliance.team1);
    setTextContent('team4', matchData.blueAlliance.team2);

    const calculateBonus = (points, multiplier) => {
        return parseFloat(multiplier * points - points).toFixed(0);
    };

    ['red', 'blue'].forEach(color => {
        const teamData = matchData[`${color}Alliance`];
        const atoms = teamData.hydrogen_pts + teamData.oxygen_pts;
        const multiplier = parseFloat(teamData.alignment_mult).toFixed(1);

        setTextContent(`${color}-point-value1`, `+${teamData.hydrogen_pts}`);
        setTextContent(`${color}-point-value2`, `+${teamData.oxygen_pts}`);
        setTextContent(`${color}-point-value3`, `x${multiplier} (+${calculateBonus(atoms, multiplier)})`);
        setTextContent(`${color}-point-value4`, `+${teamData.proficiency_bns}`);
        setTextContent(`${color}-point-value5`, `+${teamData.coopertition_bns}`);
        setTextContent(`${color}-point-value6`, `${teamData.penalty}`);
        setTextContent(`${color}-total-score`, `${teamData.score}`);
    });

    setTextContent('match-number', `Ranking Match: ${matchNumber}`);
}

document.addEventListener('DOMContentLoaded', fetchCurrentMatchNumberAndData);
