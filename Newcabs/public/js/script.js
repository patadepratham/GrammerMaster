function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

  
function goToHomepage() {
    window.location.href = "/"; // Navigate to the root URL
}

function goToAboutpage() {
    window.location.href = "/about"; // Navigate to the '/about' route
}

function goToQuestionpage() {
    window.location.href = "/Question"; // Navigate to the '/about' route
}

function goToLeaderpage() {
    window.location.href = "/leader"; // Navigate to the '/about' route
}

function Acceptedride() {
    window.location.href = "/acceptedride"; // Navigate to the '/about' route
}

function goTorideinfopage() {
    window.location.href = "/ride-info"; // Navigate to the '/about' route
}

function goToLoginpage() {
    window.location.href = "/Login"; // Navigate to the '/login' route
}

function goToContactpage() {
    window.location.href = "/contact"; // Navigate to the '/contact' route
}

function goToSignuppage() {
    window.location.href = "/signup"; 
}

function goToDriverLoginpage() {
    window.location.href = "/driverlogin"; 
}



function goToDriverSignuppage() {
    window.location.href = "/driversignup"; 
}

function goToProfilepage() {
    window.location.href = "/profile"; 
}

function goToExercisespage() {
    window.location.href = "/exercise"; 
}

function submitAnswers() {
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    const answers = Array.from(inputs).map(input => input.value);

    console.log(answers);
    fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
    }).then(response => response.json())
    .then(data => alert('Submitted successfully!'));
}

function openNav() {
    var sideNav = document.getElementById("mySidenav");
    sideNav.style.width = "250px";
    // Add a smooth slide-in animation
    sideNav.style.transition = "width 0.5s";
}

async function updateUserScore(userId, incrementBy = 1) {
    try {
        const user = await User.findById(userId);
        if (user) {
            user.score += incrementBy;  // Increase score by 1 (or a custom value)
            await user.save();  // Save the updated score
            return user.score;  // Return the new score
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error updating score:', error);
    }
}


async function showLeaderboard() {
    try {
        const response = await fetch('http://localhost:8000/api/leaderboard');
        const leaderboard = await response.json();
        
        let leaderboardHTML = '<h2>Leaderboard</h2><ol>';
        leaderboard.forEach(user => {
            leaderboardHTML += `<li>${user.uname}: ${user.score} points</li>`;
        });
        leaderboardHTML += '</ol>';
        
        document.getElementById('quiz-content').innerHTML = leaderboardHTML;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}


function closeNav() {
    var sideNav = document.getElementById("mySidenav");
    sideNav.style.width = "0";
    // Add a smooth slide-out animation
    sideNav.style.transition = "width 0.5s";
}

function gotoRecord() {
    window.location.href = "/records";
}

function gotodriverRecord() {
    window.location.href = "/driverRecord";
}