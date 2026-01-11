const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

let running = true;
let interval = 800;
let minVal = 10;
let maxVal = 100;
let showGrid = true;
let smooth = false;
let type = "line";

const maxPoints = 30;

let series = [
  { color: "red", data: [] },
  { color: "lime", data: [] },
  { color: "cyan", data: [] }
];

function randomVal() {
  return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}

function addData() {
  series.forEach(s => {
    if (s.data.length >= maxPoints) s.data.shift();
    s.data.push(randomVal());
  });
}

function drawGrid() {
  if (!showGrid) return;
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 40);
    ctx.lineTo(canvas.width, i * 40);
    ctx.stroke();
  }
}

function getAvg(data) {
  return data.reduce((a,b) => a+b,0) / data.length;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();

  series.forEach(s => {
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;

    if (type === "bar") {
      s.data.forEach((v,i) => {
        ctx.fillRect(i*25, canvas.height-v*3, 15, v*3);
      });
      return;
    }

    ctx.beginPath();
    s.data.forEach((v,i) => {
      let x = i * (canvas.width / maxPoints);
      let y = canvas.height - v * 3;
      if (i === 0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);

      if (type === "scatter") {
        ctx.beginPath();
        ctx.arc(x,y,4,0,Math.PI*2);
        ctx.fill();
      }
    });

    if (type === "area") {
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (type !== "scatter") ctx.stroke();
  });

  updateStats();
}

function updateStats() {
  const data = series[0].data;
  if (!data.length) return;

  document.getElementById("current").textContent = data[data.length-1];
  document.getElementById("min").textContent = Math.min(...data);
  document.getElementById("max").textContent = Math.max(...data);
  document.getElementById("avg").textContent = getAvg(data).toFixed(1);
  document.getElementById("trend").textContent =
    data[data.length-1] > data[0] ? "Rising" : "Falling";
}

canvas.addEventListener("mousemove", e => {
  const x = Math.floor(e.offsetX / (canvas.width / maxPoints));
  const v = series[0].data[x];
  if (v) {
    canvas.title = `Index: ${x}, Value: ${v}`;
  }
});

document.getElementById("toggleRun").onclick = () => {
  running = !running;
  document.getElementById("toggleRun").textContent = running ? "Pause" : "Start";
};

document.getElementById("reset").onclick = () => {
  series.forEach(s => s.data = []);
};

document.getElementById("speed").oninput = e => interval = +e.target.value;
document.getElementById("minVal").oninput = e => minVal = +e.target.value;
document.getElementById("maxVal").oninput = e => maxVal = +e.target.value;
document.getElementById("grid").onchange = e => showGrid = e.target.checked;
document.getElementById("smooth").onchange = e => smooth = e.target.checked;
document.getElementById("chartType").onchange = e => type = e.target.value;

document.getElementById("theme").onchange = e => {
  document.body.className = e.target.value;
};

document.getElementById("export").onclick = () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = "chart.png";
  a.click();
};

setInterval(() => {
  if (running) {
    addData();
    draw();
  }
}, interval);
