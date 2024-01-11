const base_url = "http://localhost:8080"

const formProductCode = document.getElementById("productCode")
const formRepairDate = document.getElementById("repairDate")
const formCustomerName = document.getElementById("customerName")
const formCatalogs = document.getElementById("catalogs")
const formBrand = document.getElementById("brand")
const form = document.getElementById("computer form")
const tbody = document.getElementById("computers")
const loading = document.getElementById("loading")

const token = localStorage.getItem("token");

const formattedDate = formatDate(formRepairDate.value);

document.getElementById('logoutBtn').addEventListener('click', function() 
{
    localStorage.removeItem('token');
    window.location.href = '../Login/login.html';
});

form.addEventListener("submit", async function(e)
{
    e.preventDefault();
    await update();
    findAll()
    this.reset()
})

findAll();

async function findAll()
{
    showLoading();
    const response = await fetch(`${base_url}/api/v1/computers`, 
    {
        method: "GET",
        headers: 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const body = await response.json()
    console.log(body);
    showAllComputers(body.content);
    hideLoading();
}

async function showAllComputers(computers)
{
    tbody.innerHTML = "";
    for(const computer of computers)
    {
        const row = tbody.insertRow();
        const productCode = document.createTextNode(computer.productCode);
        row.insertCell().appendChild(productCode)
        const repairDate = computer.repairDate;
        row.insertCell().innerText = repairDate.map(num => num.toString().padStart(2, '0')).join('-');
        const customerName = computer.customerName;
        row.insertCell().innerText = customerName;
        const catalogs = computer.catalogs;
        row.insertCell().innerText = catalogs;
        const brand = computer.brand;
        row.insertCell().innerText = brand;
        const btn = document.createElement("button")
        btn.innerText = "🖊️Edit"
        btn.addEventListener("click", function()
        {
            formProductCode.value = computer.productCode
            formRepairDate.value = computer.repairDate.map(num => num.toString().padStart(2, '0')).join('-');
            formCustomerName.value = computer.customerName
            formCatalogs.value = computer.catalogs
            formBrand.value = computer.brand
        })
        const btndl = document.createElement("button")
        btndl.innerText = "❌Delete"
        btndl.addEventListener("click", async function()
        {
            const confirmed = confirm("Do you want to delete this computer?")
            if(confirmed)
            {
                showLoading();
                await deleteById(computer.productCode, computer.repairDate);
                tbody.removeChild(row);
                hideLoading();
            }
        })
        row.insertCell().append(btn, btndl)
    }
}

async function update()
{
    const response = await fetch(`${base_url}/api/v1/computers`, 
    {
        method: "PUT",
        headers: 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(
        {
            productCode: formProductCode.value, 
            repairDate: formRepairDate.value,
            customerName: formCustomerName.value,
            catalogs: formCatalogs.value,
            brand: formBrand.value
        })
    })
    const body = await response.json();
    console.log(body);
}

async function deleteById(productCode, repairDate)
{
    const response = await fetch(`${base_url}/api/v1/computers`, 
    {
        method: "DELETE",
        headers: 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(
            {
                productCode: productCode,
                repairDate: repairDate
            })
    })
}

function showLoading()
{
    loading.style.display = "flex"
}

function hideLoading()
{
    setTimeout(function()
    {
        loading.style.display = "none"
    }, Math.random() * 2000);
}

function formatDate(inputDate) {
    const dateArray = inputDate.split(',').map(Number);
    return dateArray.map(num => num.toString().padStart(2, '0')).join('-');
}
