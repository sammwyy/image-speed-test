const samples = [
  {
    extension: "webp",
    size: "204",
    type: "lossy & lossless",
    alpha: "Yes",
  },
  {
    extension: "jpg",
    size: "480",
    type: "lossy",
    alpha: "Yes",
  },
  {
    extension: "png",
    size: "3375",
    type: "lossless",
    alpha: "No",
  },
];

function color(text) {
  const bads = ["no", "lossy"];
  let color = null;

  for (const bad of bads) {
    if (text.toLowerCase() == bad) {
      color = "danger";
    }
  }

  if (!color) {
    try {
      const int = parseInt(text);
      if (int < 225) {
        color = "success";
      } else if (int < 500) {
        color = "warning";
      } else if (!isNaN(int)) {
        color = "danger";
      }
    } catch (e) {}
  }

  if (!color) color = "success";
  return "<span class='text-" + color + "'>" + text + "<span/>";
}

function renderSample({ extension, size, type, alpha }) {
  return new Promise((resolve) => {
    const root = document.getElementById("test-results");
    const element = document.createElement("div");
    element.style.display = "none";
    element.innerHTML = `
    <div class="d-flex w-100 justify-content-evenly align-items-center mt-5">
        <div class="w-25 px-5">
        <h3>${extension.toUpperCase()}</h3>
        <div class="d-flex justify-content-between w-100">
            <b>Download time</b> <span id="dt-file-${extension}"></span>
        </div>
        <div class="d-flex justify-content-between w-100">
            <b>Alpha channel</b> ${color(alpha)}
        </div>
        <div class="d-flex justify-content-between w-100">
            <b>Size</b> ${color(size)}kB
        </div>
        <div class="d-flex justify-content-between w-100">
            <b>Type</b> ${color(type)}
        </div>
        </div>

        <div class="w-25">
            <img id="img-file-${extension}" alt="image" class="w-100" />
        </div>
    </div>
    `;
    root.appendChild(element);

    const img = document.getElementById("img-file-" + extension);
    const timeSpan = document.getElementById("dt-file-" + extension);
    const start = Date.now();

    img.onload = () => {
      const end = Date.now();
      const lapsed = end - start;

      timeSpan.innerHTML = color((lapsed + "").split(".")[0]) + "ms";
      element.style.display = "block";
      resolve();
    };

    img.src = "samples/image." + extension;
  });
}

async function runTest() {
  for (const sample of samples) {
    await renderSample(sample);
  }
}
