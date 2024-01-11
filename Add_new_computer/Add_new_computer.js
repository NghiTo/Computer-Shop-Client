const base_url = "http://localhost:8080"

const formProductCode = document.getElementById("productCode")
const formRepairDate = document.getElementById("repairDate")
const formCustomerName = document.getElementById("customerName")
const formCatalogs = document.getElementById("catalogs")
const formBrand = document.getElementById("brand")
const form = document.getElementById("computer form")

const token = localStorage.getItem("token");

document.getElementById('logoutBtn').addEventListener('click', function() 
{
    localStorage.removeItem('token');
    window.location.href = '../Login/login.html';
});

form.addEventListener("submit", async function(e)
{
    e.preventDefault();
    await create();
    this.reset()
})

async function create()
{
    const response = await fetch(`${base_url}/api/v1/computers`, {
        method: "POST",
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
    alert("Tạo thành công");
    console.log(body);
}