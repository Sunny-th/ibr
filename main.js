var appDiv = document.getElementById('app');
appDiv.innerHTML = `
    <h1>Insurance Quote Calculator</h1>
    <p>Enter your information to get an insurance quote:</p>
    <input type="text" id="age" placeholder="Enter your age" />
    <button id="calculate">Calculate Quote</button>
    <p id="quote"></p>
`;
var calculateQuote = function () {
    var ageInput = document.getElementById('age').value;
    var age = parseInt(ageInput);
    var quote = 0;
    if (!isNaN(age)) {
        if (age < 30) {
            quote = 100;
        }
        else if (age >= 30 && age <= 50) {
            quote = 150;
        }
        else {
            quote = 200;
        }
        document.getElementById('quote').innerText = "Your quote is $" + quote + ".";
    }
    else {
        alert("Please enter a valid age.");
    }
};
document.getElementById('calculate').addEventListener('click', calculateQuote);
