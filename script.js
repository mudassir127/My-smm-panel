// ===============================
// RAJA SMM - SUPABASE CONNECTION
// ===============================

const SUPABASE_URL = "https://byoigzudykijswfmfgqv.supabase.co";
const SUPABASE_KEY = "sb_publishable_Bwf7lxv-Sz9sVzCnbPDjFg_wMhhm4H_";

// Open Login / Signup modal
function openModal(type) {
  const modal = document.getElementById("modal");
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("modalText");

  if (!modal) return;

  modal.dataset.mode = type;

  if (type === "login") {
    title.textContent = "Login";
    text.textContent = "Login to continue to your dashboard.";
  } else {
    title.textContent = "Create your account";
    text.textContent = "Sign up to start using the panel.";
  }

  const inputs = modal.querySelectorAll("input");

  if (inputs[0]) {
    inputs[0].value = "";
    inputs[0].type = "email";
    inputs[0].placeholder = "Email address";
  }

  if (inputs[1]) {
    inputs[1].value = "";
    inputs[1].type = "password";
    inputs[1].placeholder = "Password";
  }

  const button = modal.querySelector(".primary.full");

  if (button) {
    button.textContent = type === "login" ? "Login" : "Create Account";
    button.onclick = handleAuth;
  }

  modal.classList.add("show");
}

// Close modal
function closeModal(e) {
  if (
    !e ||
    e.target.id === "modal" ||
    e.target.classList.contains("close")
  ) {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("show");
  }
}

// Show message
function showMessage(message) {
  alert(message);
}

// Login / Signup
async function handleAuth() {
  const modal = document.getElementById("modal");

  if (!modal) return;

  const mode = modal.dataset.mode || "login";
  const inputs = modal.querySelectorAll("input");

  const email = inputs[0]?.value.trim();
  const password = inputs[1]?.value;

  if (!email || !password) {
    showMessage("Email aur password dono enter karo.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password kam az kam 6 characters ka hona chahiye.");
    return;
  }

  const button = modal.querySelector(".primary.full");

  if (button) {
    button.disabled = true;
    button.textContent = "Please wait...";
  }

  try {
    const endpoint =
      mode === "login"
        ? "/auth/v1/token?grant_type=password"
        : "/auth/v1/signup";

    const response = await fetch(SUPABASE_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error_description ||
        data.msg ||
        data.message ||
        "Authentication failed."
      );
    }

    if (mode === "login") {
      localStorage.setItem(
        "raja_smm_session",
        JSON.stringify(data)
      );

      modal.classList.remove("show");
window.location.href = "dashboard.html";
   
    } else {
      modal.classList.remove("show");

      showMessage(
        "Account create ho gaya. Agar email confirmation enabled hai to email verify karke Login karo."
      );
    }

  } catch (error) {
    console.error(error);
    showMessage(error.message || "Kuch error aa gaya.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent =
        mode === "login" ? "Login" : "Create Account";
    }
  }
}

// Logout
function logout() {
  localStorage.removeItem("raja_smm_session");
  location.reload();
}

// Check saved session
function getSession() {
  try {
    return JSON.parse(
      localStorage.getItem("raja_smm_session")
    );
  } catch {
    return null;
  }
}

// Page load
document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();

  if (session && session.access_token) {
    console.log("RAJA SMM user session found.");
  }
});
