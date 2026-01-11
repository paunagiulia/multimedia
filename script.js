let albumsData = [];
const container = document.getElementById("albums");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

fetch("library.json")
  .then(r => r.json())
  .then(data => {
    albumsData = data;
    renderAlbums(data);
  });

function renderAlbums(list) {
  container.innerHTML = "";
  list.forEach((a, i) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    col.innerHTML = `
      <div class="card">
        <img src="assets/img/${a.thumbnail}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${a.artist}</h5>
          <p class="card-text">${a.album}</p>
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-primary viewBtn" data-index="${i}" data-bs-toggle="modal" data-bs-target="#trackModal">
            View Tracklist
          </button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

container.addEventListener("click", e => {
  if (!e.target.classList.contains("viewBtn")) return;

  const album = albumsData[e.target.dataset.index];
  document.getElementById("modalTitle").textContent = `${album.artist} - ${album.album}`;

  const list = document.getElementById("trackList");
  list.innerHTML = "";

  let totalSeconds = 0;
  let longest = album.tracks[0];
  let shortest = album.tracks[0];

  album.tracks.forEach(t => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `<a href="${t.url}" target="_blank">${t.title}</a> (${t.length})`;
    list.appendChild(li);

    const s = toSeconds(t.length);
    totalSeconds += s;
    if (s > toSeconds(longest.length)) longest = t;
    if (s < toSeconds(shortest.length)) shortest = t;
  });

  const avg = Math.round(totalSeconds / album.tracks.length);
  document.getElementById("stats").innerHTML = `
    <strong>Tracks:</strong> ${album.tracks.length}<br>
    <strong>Total:</strong> ${fromSeconds(totalSeconds)}<br>
    <strong>Average:</strong> ${fromSeconds(avg)}<br>
    <strong>Longest:</strong> ${longest.title}<br>
    <strong>Shortest:</strong> ${shortest.title}
  `;

  document.getElementById("spotifyBtn").href = album.tracks[0].url;
});

searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  renderAlbums(albumsData.filter(a =>
    a.artist.toLowerCase().includes(val) ||
    a.album.toLowerCase().includes(val)
  ));
});

sortSelect.addEventListener("change", () => {
  let sorted = [...albumsData];
  if (sortSelect.value === "artist")
    sorted.sort((a,b) => a.artist.localeCompare(b.artist));
  if (sortSelect.value === "album")
    sorted.sort((a,b) => a.album.localeCompare(b.album));
  if (sortSelect.value === "tracksAsc")
    sorted.sort((a,b) => a.tracks.length - b.tracks.length);
  if (sortSelect.value === "tracksDesc")
    sorted.sort((a,b) => b.tracks.length - a.tracks.length);
  renderAlbums(sorted);
});

function toSeconds(t) {
  const [m,s] = t.split(":").map(Number);
  return m * 60 + s;
}

function fromSeconds(sec) {
  return Math.floor(sec/60) + ":" + String(sec%60).padStart(2,"0");
}
