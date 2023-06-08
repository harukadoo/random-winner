const participants = [];

function renderList() {
    const table = document.getElementById('table');
    table.innerHTML = '';

    participants.forEach((person, index) => {
        const row = document.createElement('tr');

        const numberCell = document.createElement('td');
        row.appendChild(numberCell);
        numberCell.innerHTML = index + 1;

        const nameCell = document.createElement('td');
        row.appendChild(nameCell);
        nameCell.innerHTML = person;

        table.appendChild(row);
    });
} 

function addNewPerson() {
    const newPersonInput = document.getElementById('name');
    const name = newPersonInput.value;

    if (name !== '') {
        participants.push(name);
        renderList();
    }

    newPersonInput.value = '';
}

const addPersonBtn = document.getElementById('add-person');
addPersonBtn.addEventListener('click', addNewPerson);

const winnersOutput = document.getElementById('output');

const startbtn = document.getElementById('start-btn');
startbtn.addEventListener('click', addWinnersNum);


function requestRandomNumbers(count, maxNumber) {
    const requestUrl = `http://www.random.org/integers/?num=${count}&min=1&max=${maxNumber}&col=1&base=10&format=plain&rnd=yes`;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', requestUrl);

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = xhr.responseText; 
                const numData = response.trim().split('\n').map(Number); 
                resolve(numData);

             } else {
                reject('Error: ' + xhr.status);
            }
        };

        xhr.onerror = () => {
            reject('Request failed');
        };

        generateNumber(count, maxNumber, resolve);

        xhr.send();
    });
}


function generateNumber(count, maxValue, resolve) { 
    const winningNumbers = [];

    function generate() {
        const number = Math.floor(Math.random() * maxValue) + 1;

        if (!winningNumbers.includes(number)) {
            winningNumbers.push(number);
        }

        if (winningNumbers.length < count) {
            generate();
        } else {
            resolve(winningNumbers);
        }
    };

    generate();
}; 


function addWinnersNum() { 
    const winnersInput = document.getElementById('winners');
    const winnersNum = parseInt(winnersInput.value);
    const maxNumber = participants.length;

    requestRandomNumbers(winnersNum, maxNumber)
        .then(num => {
            winnersOutput.innerHTML = num.join(' ');

            setTimeout(() => {
                if (winnersNum > 1) {
                    const lastNumber = num.pop();
                    const combinedNumbers = num.join(', ');
                    const result = combinedNumbers + ' and ' + lastNumber;

                    alert('Congrats to ' + result);
                } else {
                    alert('Congrats to ' + num);
                }

            }, 500)

        })
        .catch(error => {
            console.log(error);
        });


    winnersInput.value = '';
}
