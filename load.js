const BASE = "http://localhost:8000"; // change if needed

async function hit() {
    try {
        await fetch(`${BASE}/api/health`);
    } catch (e) {
        console.error(e.message);
    }
}

console.log("Sending requests...");

setInterval(hit, 1000);