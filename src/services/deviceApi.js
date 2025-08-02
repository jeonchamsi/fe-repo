// src/services/deviceApi.js
export async function getDeviceStatus(ip, port = 80) {
  const res = await fetch(`http://${ip}:${port}/api/status`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
