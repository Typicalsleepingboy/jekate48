const isMaintenance = true;  

if (isMaintenance) {
  if (window.location.pathname !== '/middleware/maintenance.html') {
    window.location.href = "/middleware/maintenance.html";
  }
} else {
  if (window.location.pathname === '/middleware/maintenance.html') {
    window.location.href = "/";
  }
}
