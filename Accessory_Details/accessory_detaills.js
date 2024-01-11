const base_url = "http://localhost:8080"

const formId = document.getElementById("id")
const formProductCode = document.getElementById("productCode")
const formRepairDate = document.getElementById("repairDate")
const formName = document.getElementById("name")
const formPrice = document.getElementById("price")
const formStatusDamaged = document.getElementById("statusDamaged")
const formRepairStatus = document.getElementById("repairStatus")
const form = document.getElementById("Accessory form")
const tbody = document.getElementById("accessories")
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
    await createOrUpdate();
    findAll()
    this.reset()
})

findAll();

async function findAll()
{
    showLoading();
    const response = await fetch(`${base_url}/api/v1/accessories`, 
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
    showAllAccessories(body.content);
    hideLoading();
}

async function showAllAccessories(accessories)
{
    tbody.innerHTML = "";
    for(const accessory of accessories)
    {
        const row = tbody.insertRow();

        const id = document.createTextNode(accessory.id);
        row.insertCell().appendChild(id);

        const productCode = document.createTextNode(accessory.productCode);
        row.insertCell().appendChild(productCode)

        const repairDate = accessory.repairDate;
        row.insertCell().innerText = repairDate.map(num => num.toString().padStart(2, '0')).join('-');

        const name = accessory.name;
        row.insertCell().innerText = name;

        row.insertCell().innerText = accessory.price;

        row.insertCell().innerText = accessory.statusDamaged;

        row.insertCell().innerText = accessory.repairStatus;

        const btn = document.createElement("button")
        btn.innerText = "🖊️Edit"
        btn.addEventListener("click", function()
        {
            formId.value = accessory.id
            formProductCode.value = accessory.productCode
            formRepairDate.value = accessory.repairDate.map(num => num.toString().padStart(2, '0')).join('-');
            formName.value = accessory.name
            formPrice.value = accessory.price
            formStatusDamaged.value = accessory.statusDamaged
            formRepairStatus.value = accessory.repairStatus
        })
        const btndl = document.createElement("button")
        btndl.innerText = "❌Delete"
        btndl.addEventListener("click", async function()
        {
            const confirmed = confirm("Do you want to delete this accessory?")
            if(confirmed)
            {
                showLoading();
                await deleteById(accessory.id);
                tbody.removeChild(row);
                hideLoading();
            }
        })
        row.insertCell().append(btn, btndl)
    }
}

async function createOrUpdate()
{
    const id = formId.value;
    const url = id ? `${base_url}/api/v1/accessories/${id}` : `${base_url}/api/v1/accessories`
    const method = id ? "PUT" : "POST"
    const response = await fetch(url, 
    {
        method: method,
        headers: 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(
        {
            id: formId.value,
            productCode: formProductCode.value, 
            repairDate: formRepairDate.value,
            name: formName.value,
            price: formPrice.value,
            statusDamaged: formStatusDamaged.value,
            repairStatus: formRepairStatus.value
        })
    })
    const body = await response.json();
    console.log(body);
}

async function deleteById(id)
{
    const response = await fetch(`${base_url}/api/v1/accessories/${id}`, 
    {
        method: "DELETE",
        headers: 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
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