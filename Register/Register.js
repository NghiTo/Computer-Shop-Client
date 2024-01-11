const base_url = "http://localhost:8080";

const formFullname = document.getElementById("fullname");
const formUsername = document.getElementById("username");
const formEmail = document.getElementById("email");
const formNewPassword = document.getElementById("new-password");
const formConfirmPassword = document.getElementById("confirm-password");
const form = document.getElementById("register-form");

form.addEventListener("submit", async function (e) 
{
    e.preventDefault();
    if (!validateForm()) 
    {
        alert('Mật khẩu không khớp. Vui lòng xác nhận lại mật khẩu.');
        formConfirmPassword.focus(); 
        return;
    }
    await create();
    this.reset();
});

async function create() 
{
    const response = await fetch(`${base_url}/api/v1/users`, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: formFullname.value,
            username: formUsername.value,
            email: formEmail.value,
            password: formNewPassword.value
        })
    });

    const body = await response.json();
    alert('Đăng ký thành công');
    console.log(body);
    window.location.href = "../Login/Login.html";
}

function validateForm() 
{
    if (formNewPassword.value !== formConfirmPassword.value) 
    {
        return false;
    }
    return true;
}
