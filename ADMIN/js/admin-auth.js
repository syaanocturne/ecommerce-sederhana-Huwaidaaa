/**
 * admin-auth.js
 * Autentikasi admin sederhana (dummy) menggunakan sessionStorage.
 * CATATAN: Ini bukan sistem keamanan sungguhan (tidak ada backend/server).
 * Untuk produksi, autentikasi wajib dipindah ke server dengan hashing
 * password, session token, dan HTTPS. Kredensial di bawah ini HANYA untuk
 * keperluan demo/tugas.
 */

const ADMIN_SESSION_KEY = "mammalia_admin_session";
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "mammalia123",
};

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function adminLogin(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    sessionStorage.setItem("mammalia_admin_name", username);
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = "login.html";
}

function requireAdminAuth() {
  if (!isAdminLoggedIn()) {
    window.location.href = "login.html";
  }
}
