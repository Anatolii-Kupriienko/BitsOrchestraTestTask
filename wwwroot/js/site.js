let currentData = [];


main();


// this looks bad but I don't have much experience with JS and I don't know how to make it better
async function main() {
    enableEdit();
    const deleteButtons = document.querySelectorAll(".text-danger");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.remove();
        });
    });
    const headerRow = document.querySelector("table tr");
    currentData = await getPeople();
    headerRow.addEventListener("click", headerRowClickHandle);
    const filterButton = document.getElementById("filterButton");
    filterButton.addEventListener("click", filterButtonHandle);
}

// Event handle functions
async function headerRowClickHandle(e) {
    const item = e.target;
    isSorted(item);
    switch (item.id) {
        case "id":
            currentData = sortById(currentData, item.classList.contains("desc"));
            break;
        case "name":
            currentData = sortByName(currentData, item.classList.contains("desc"));
            break;
        case "birthDate":
            currentData = sortByAge(currentData, item.classList.contains("desc"));
            break;
        case "isMarried":
            currentData = sortByMarriageStatus(currentData, item.classList.contains("desc"));
            break;
        case "phoneNumber":
            currentData = sortByPhoneNumber(currentData, item.classList.contains("desc"));
            break;
        case "salary":
            currentData = sortBySalary(currentData, item.classList.contains("desc"));
            break;
        case "resetSort":
            resetButtonHandle(); return;

    }
    removeRecords();
    showData(currentData);
    enableEdit();
}

async function filterButtonHandle() {
    const filters = document.querySelectorAll(".filter");
    currentData = await getPeople();
    filters.forEach(filter => {
        switch (filter.id) {
            case "idFilter":
                const minId = filter.querySelector("#minId").value;
                const maxId = filter.querySelector("#maxId").value;
                currentData = filterByid(currentData, minId, maxId);
                break;
            case "nameFilter":
                const name = filter.querySelector("#name").value;
                currentData = filterByName(currentData, name);
                break;
            case "birthDateFilter":
                const minBirthDate = filter.querySelector("#minBirthDate").value;
                const maxBirthDate = filter.querySelector("#maxBirthDate").value;
                currentData = filterByBirthDate(currentData, minBirthDate, maxBirthDate);
                break;
            case "isMarriedFilter":
                const isMarried = filter.querySelector("#isMarried").value;
                currentData = filterByIsMarried(currentData, isMarried);
                break;
            case "phoneNumberFilter":
                const phoneNumber = filter.querySelector("#phoneNumber").value;
                currentData = filterByPhoneNumber(currentData, phoneNumber);
                break;
            case "salaryFilter":
                const minSalary = filter.querySelector("#minSalary").value;
                const maxSalary = filter.querySelector("#maxSalary").value;
                currentData = filterBySalary(currentData, minSalary, maxSalary);
                break;
        }
    });
    removeRecords();
    showData(currentData);
    resetOrderClasses();
    enableEdit();
}

function enableEdit() {
    // selecting every column except for the first one, which is Id because it might cause problems if edited
    const recordFields = document.querySelectorAll(".record td:nth-child(n+2)");
    recordFields.forEach(field => {
        field.addEventListener("dblclick", (e) => {
            const cellElement = e.target;
            let value = cellElement.innerHTML;
            cellElement.innerHTML = "";
            const input = setupInputsForEdit(cellElement.cellIndex);
            cellElement.appendChild(input);
            input.focus();
            input.addEventListener("focusout", (e) => {
                const item = e.target;
                if (item.value != value && item.value != "") {
                    const recordFields = cellElement.parentElement.children;
                    const person = getPersonFromCells(recordFields);
                    editRecord(person);
                    value = item.value;
                }
                if (item.type == "date") {
                    value = getFormattedDateStringForShow(new Date(item.value));
                }
                cellElement.innerHTML = value;
            })
        });
    });
}

async function resetButtonHandle() {
    resetOrderClasses();
    removeRecords();
    filterButtonHandle();
    showData(currentData);
    enableEdit();
}


//Sorting functions
function sortByName(data, isDesc) {
    let sorted = data.sort((a, b) => a.Name.localeCompare(b.Name));
    return isDesc ? sorted : sorted.reverse();
}

function sortById(data, isDesc) {
    return data.sort((a, b) => isDesc ? b.Id - a.Id : a.Id - b.Id);
}

function sortByAge(data, isDesc) {
    return data.sort((a, b) => isDesc ? new Date(b.BirthDate) - new Date(a.BirthDate) : new Date(a.BirthDate) - new Date(b.BirthDate));
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


// Filtering functions
function filterByid(data, minId, maxId) {
    switch (true) {
        case minId.length > 0 && maxId.length > 0:
            return data.filter(person => person.Id >= minId && person.Id <= maxId);
        case minId.length > 0 && maxId.length == 0:
            return data.filter(person => person.Id >= minId);
        case minId.length == 0 && maxId.length > 0:
            return data.filter(person => person.Id <= maxId);
        default:
            return data;
    }
}

function filterByName(data, name) {
    if (name) {
        return data.filter(person => person.Name.toLowerCase() == name.toLowerCase());
    } else {
        return data;
    }
}

function filterByBirthDate(data, minBirthDate, maxBirthDate) {
    switch (true) {
        case isDateValid(minBirthDate) && isDateValid(maxBirthDate):
            return data.filter(person => person.BirthDate >= minBirthDate && person.BirthDate <= maxBirthDate);
        case isDateValid(minBirthDate) && !isDateValid(maxBirthDate):
            return data.filter(person => person.BirthDate >= minBirthDate);
        case !isDateValid(minBirthDate) && isDateValid(maxBirthDate):
            return data.filter(person => person.BirthDate <= maxBirthDate);
        default:
            return data;
    }
}

function filterByIsMarried(data, isMarried) {
    if (isMarried == "default") {
        return data;
    }
    isMarried = isMarried == "true" ? true : false;
    return data.filter(person => person.IsMarried === isMarried);
}

function filterByPhoneNumber(data, phoneNumber) {
    if (phoneNumber) {
        return data.filter(person => person.PhoneNumber.includes(phoneNumber));
    } else {
        return data;
    }
}

function filterBySalary(data, minSalary, maxSalary) {
    switch (true) {
        case minSalary.length > 0 && maxSalary.length > 0:
            return data.filter(person => person.Salary >= minSalary && person.Salary <= maxSalary);
        case minSalary.length > 0 && maxSalary.length == 0:
            return data.filter(person => person.Salary >= minSalary);
        case minSalary.length == 0 && maxSalary.length > 0:
            return data.filter(person => person.Salary <= maxSalary);
        default:
            return data;
    }
}


// helper functions
function isDateValid(dateFormatted) {
    return !isNaN(new Date(dateFormatted));
}

function getFormattedDateStringForShow(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${month}/${day}/${year}`;
}

function getFromShowFormatToApiFormat(dateStr) {
    const dateParts = dateStr.split("/");
    const date = new Date([dateParts[2], dateParts[0], dateParts[1]].join("-"));
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return `${year}-${month}-${day}`;
}

function showData(data) {
    const tbody = document.querySelector("tbody");
    data.forEach(person => {
        const row = document.createElement("tr");
        const dateFormatted = getFormattedDateStringForShow(new Date(person.BirthDate));
        row.classList.add("record");
        const idElement = document.createElement("td");
        idElement.innerHTML = person.Id;
        const nameElement = document.createElement("td");
        nameElement.innerHTML = person.Name;
        const birthDateElement = document.createElement("td");
        birthDateElement.innerHTML = dateFormatted;
        const isMarriedElement = document.createElement("td");
        isMarriedElement.innerHTML = person.IsMarried ? "Yes" : "No";
        const phoneNumberElement = document.createElement("td");
        phoneNumberElement.innerHTML = person.PhoneNumber;
        const salaryElement = document.createElement("td");
        salaryElement.innerHTML = person.Salary;
        const deleteButton = document.createElement("td");
        const deleteLink = document.createElement("a");
        deleteLink.innerHTML = "Delete";
        deleteLink.classList.add("text-danger");
        deleteLink.href = "/Home/Delete/" + person.Id;
        deleteButton.appendChild(deleteLink);
        row.appendChild(idElement);
        row.appendChild(nameElement);
        row.appendChild(birthDateElement);
        row.appendChild(isMarriedElement);
        row.appendChild(phoneNumberElement);
        row.appendChild(salaryElement);
        row.appendChild(deleteButton);
        tbody.appendChild(row);
    });
}

function editRecord(record) {
    const url = document.location.href + "api/people/" + record.Id;
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record)
    });
}

function resetOrderClasses() {
    const headerRowElements = document.querySelectorAll(".headerRow");
    headerRowElements.forEach(item => {
        item.classList.remove("sorted");
        item.classList.remove("desc");
    });

}

function isSorted(item) {
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

async function getPeople() {
    return await fetch(document.location.href + "api/people", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json());
}

function setupInputsForEdit(cellIndex) {
    let input;
    switch (cellIndex) {
        case 2:
            input = document.createElement("input");
            input.type = "date";
            break;
        case 3:
            input = document.createElement("select");
            const option1 = document.createElement("option");
            option1.value = "Yes";
            option1.text = "Yes";
            const option2 = document.createElement("option");
            option2.value = "No";
            option2.text = "No";
            input.appendChild(option1);
            input.appendChild(option2);
            break;
        case 5:
            input = document.createElement("input");
            input.type = "number";
            break;
        default:
            input = document.createElement("input");
            input.type = "text";
            break;
    }
    return input;
}

function getPersonFromCells(recordFields) {
    const name = recordFields[1].childElementCount > 0 ? recordFields[1].firstElementChild.value : recordFields[1].innerHTML;
    const birthDateString = recordFields[2].childElementCount > 0 ? recordFields[2].firstElementChild.value : recordFields[2].innerHTML;
    const isMarried = recordFields[3].childElementCount > 0 ? recordFields[3].firstElementChild.value : recordFields[3].innerHTML;
    const phoneNumber = recordFields[4].childElementCount > 0 ? recordFields[4].children[0].value : recordFields[4].innerHTML;
    const salary = recordFields[5].childElementCount > 0 ? recordFields[5].children[0].value : recordFields[5].innerHTML;
    const person = {
        Id: parseInt(recordFields[0].innerHTML),
        Name: name,
        BirthDate: getFromShowFormatToApiFormat(birthDateString),
        IsMarried: isMarried == "Yes" ? true : false,
        PhoneNumber: phoneNumber,
        Salary: salary,
    };
    return person;
}
