const isMaintenance = true  

if (isMaintenance) {
  if (window.location.pathname !== '/maintenance') {
    window.location.href = "/maintenance";
  }
} else {
  if (window.location.pathname === '/maintenance') {
    window.location.href = "/";
  }
}
