const base_url = "http://localhost:8080";

async function login() 
{
    const formUsername = document.getElementById("username");
    const formPassword = document.getElementById("password");

    const formData = new FormData();
    formData.append("username", formUsername.value);
    formData.append("password", formPassword.value);

    try 
    {
        const response = await fetch(`${base_url}/api/v1/auth/login`, 
        {
            method: "POST",
            body: formData,
        });

        if (!response.ok) 
        {
            console.error("Authentication failed");
            alert('Sai tên đăng nhập hoặc mật khẩu')
            return;
        }
        const responseBody = await response.json();
        const token = responseBody.token;

        localStorage.setItem("token", token);
        window.location.href = "../Home/index.html";
    } catch (error) 
    {
        console.error("Error during login:", error);
    }
}
