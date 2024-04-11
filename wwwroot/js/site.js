main();
// this looks bad but I don't have much experience with JS and I don't know how to make it better
async function main() {
    const headerRow = document.querySelector("table tr");
    let data = await getPeople();
    headerRow.addEventListener("click", async (e) => {
        const item = e.target;
        checkIfSorted(item);
        switch (item.id) {
            case "id":
                data = sortById(data, item.classList.contains("desc"));
                break;
            case "name":
                data = sortByName(data, item.classList.contains("desc"));
                break;
            case "birthDate":
                data = sortByAge(data, item.classList.contains("desc"));
                break;
            case "isMarried":
                data = sortByMarriageStatus(data, item.classList.contains("desc"));
                break;
            case "phoneNumber":
                data = sortByPhoneNumber(data, item.classList.contains("desc"));
                break;
            case "salary":
                data = sortBySalary(data, item.classList.contains("desc"));
                break;
            case "resetSort":
                resetButtonHandle();
                break;

        }
        removeRecords();
        showData(data);
    });
}

async function resetButtonHandle() {
    const headerRowElements = document.querySelectorAll(".headerRow");
    console.log(headerRowElements);
    headerRowElements.forEach(item => {
        item.classList.remove("sorted");
        item.classList.remove("desc");
    });
    const data = await getPeople();
    removeRecords();
    showData(data);
}

function checkIfSorted(item) {
    if (item.classList.contains("sorted")) {
        item.classList.toggle("desc");
    } else {
        item.classList.add("sorted");
    }

}

function removeRecords() {
    const rows = document.querySelectorAll(".record");
    rows.forEach(row => row.remove());
}

function showData(data) {
    const table = document.querySelector("table");
    data.forEach(person => {
        const row = document.createElement("tr");
        row.classList.add("record");
        row.innerHTML = `
            <td>${person.Id}</td>
            <td>${person.Name}</td>
            <td>${person.BirthDate}</td>
            <td>${person.IsMarried}</td>
            <td>${person.PhoneNumber}</td>
            <td>${person.Salary}</td>
            <td><a class="text-danger" href="/Home/Delete/${person.Id}">Delete</a></td>
        `;
        table.appendChild(row);
    });
}

async function getPeople() {
    return await fetch(document.location.href + "api/people", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json());
}

function sortByName(data, isDesc) {
    let sorted = data.sort();
    return isDesc ? sorted : sorted.reverse();
}

function sortById(data, isDesc) {
    return data.sort((a, b) => isDesc ? b.Id - a.Id : a.Id - b.Id);
}

function sortByAge(data, isDesc) {
    return data.sort((a, b) => isDesc ? b.BirthDate - a.BirthDate : a.BirthDate - b.BirthDate);
}

function sortByMarriageStatus(data, isDesc) {
    return data.sort((a, b) => isDesc ? b.IsMarried - a.IsMarried : a.IsMarried - b.IsMarried);
}

function sortByPhoneNumber(data, isDesc) {
    return data.sort((a, b) => isDesc ? b.PhoneNumber.length - a.PhoneNumber.length : a.PhoneNumber.length - b.PhoneNumber.length);
}

function sortBySalary(data, isDesc) {
    return data.sort((a, b) => isDesc ? b.Salary - a.Salary : a.Salary - b.Salary);
}