const canvas = document.getElementById('canvas');
const mode = document.getElementById('mode');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursor');
const download = document.getElementById('download');
const openBtn = document.getElementById('openBtn');

canvas.style.innerWidth = window.innerWidth;
canvas.width = 96;
canvas.height = 32;

let data = [];
for (let y = 0; y < canvas.height; y++) {
    data[y] = [];
    for (let x = 0; x < canvas.width; x++) {
        data[y][x] = 0;
    }
}
let base = {
    teleports: [],
    spawn: null,
    playerSpawn: null,
};

ctx.fillRect(0, 0, 96, 32);

let i = 0;
mode.addEventListener("input", () => {
  i = parseInt(mode.value);
});

function setItem(x, y, value) {
    if (data[y][x] !== value) {
        const curr = data[y][x];

        if (curr === 3) {
            ctx.fillRect(base['spawn'].x, base['spawn'].y, 1, 1);
            base["spawn"] = null;
        } else if (curr === 4) {
            ctx.fillRect(base['playerSpawn'].x, base['playerSpawn'].y, 1, 1);
            base["playerSpawn"] = null;
        } else if (curr === 5) {
            let i = base["teleports"].findIndex(t => t.x === x && t.y === y);
            ctx.fillRect(base['teleports'][i].x, base['teleports'][i].y, 1, 1);
            base["teleports"].splice(i, 1);
        }
    }

    if (value === 3) {
        if (base["spawn"]) {
            alert("Spawn already exists!");
            return false;
        }
        base["spawn"] = { x, y };
    } else if (value === 4) {
        if (base["playerSpawn"]) {
            alert("Player spawn already exists!");
            return false;
        }
        base["playerSpawn"] = { x, y };
    } else if (value === 5) {
        if (base["teleports"].includes([x, y])) {
            alert("Teleporter already exists!");
            return false;
        }
        if (base["teleports"].length === 2) {
            alert("Maximum number of teleporters reached!");
            return false;
        }
        base["teleports"].push({ x, y });
    }

    data[y][x] = value;
    return true;
}

let firstPos = null;
document.body.addEventListener("click", (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const virtX = Math.floor(x * (96 / window.innerWidth));
    const y = e.clientY - canvas.offsetTop;
    const virtY = Math.floor(y * (32 / canvas.clientHeight));
    if (virtY > 31) {
      return;
    }

    if (i === 0) {
        if (!firstPos) {
            firstPos = [virtX, virtY];
            ctx.fillStyle = "yellow";
            ctx.fillRect(virtX, virtY, 1, 1);
            return;
        }
        if (firstPos[0] !== virtX && firstPos[1] !== virtY) {
            ctx.fillStyle = "black";
            ctx.fillRect(firstPos[0], firstPos[1], 1, 1);
            firstPos = null;
            return alert("Please click on the same position");
        }

        ctx.fillStyle = "blue";
        let highestX = firstPos[0] > virtX ? firstPos[0] : virtX;
        let highestY = firstPos[1] > virtY ? firstPos[1] : virtY;
        let lowestX = firstPos[0] < virtX ? firstPos[0] : virtX;
        let lowestY = firstPos[1] < virtY ? firstPos[1] : virtY;
        for (let x = lowestX; x <= highestX; x++) {
            for (let y = lowestY; y <= highestY; y++) {
                if (setItem(x, y, 1)) ctx.fillRect(x, y, 1, 1);
            }
        }
        firstPos = null;
    } else if (i === 1) {
        ctx.fillStyle = "red";
        if (setItem(virtX, virtY, 2)) ctx.fillRect(virtX, virtY, 1, 1);
    } else if (i === 2) {
        ctx.fillStyle = "orange";
        if (setItem(virtX, virtY, 3)) ctx.fillRect(virtX, virtY, 1, 1);
    } else if (i === 3) {
        ctx.fillStyle = "green";
        if (setItem(virtX, virtY, 4)) ctx.fillRect(virtX, virtY, 1, 1);
    } else if (i === 4) {
        ctx.fillStyle = "purple";
        if (setItem(virtX, virtY, 5)) ctx.fillRect(virtX, virtY, 1, 1);
    } else if (i === 5) {
        ctx.fillStyle = "black";
        if (setItem(virtX, virtY, 0)) ctx.fillRect(virtX, virtY, 1, 1);
    } else if (i === 6) {
        if (!firstPos) {
            firstPos = [virtX, virtY];
            ctx.fillStyle = "yellow";
            ctx.fillRect(virtX, virtY, 1, 1);
            return;
        }

        ctx.fillStyle = "black";
        let highestX = firstPos[0] > virtX ? firstPos[0] : virtX;
        let highestY = firstPos[1] > virtY ? firstPos[1] : virtY;
        let lowestX = firstPos[0] < virtX ? firstPos[0] : virtX;
        let lowestY = firstPos[1] < virtY ? firstPos[1] : virtY;
        for (let x = lowestX; x <= highestX; x++) {
            for (let y = lowestY; y <= highestY; y++) {
                if (setItem(x, y, 0)) ctx.fillRect(x, y, 1, 1);
            }
        }
        firstPos = null;
    } else if (i === 7) {
        // food line
        if (!firstPos) {
            firstPos = [virtX, virtY];
            ctx.fillStyle = "yellow";
            ctx.fillRect(virtX, virtY, 1, 1);
            return;
        }
        if (firstPos[0] !== virtX && firstPos[1] !== virtY) {
            ctx.fillStyle = "black";
            ctx.fillRect(firstPos[0], firstPos[1], 1, 1);
            firstPos = null;
            return alert("Please click on the same position");
        }

        ctx.fillStyle = "black";
        ctx.fillRect(firstPos[0], firstPos[1], 1, 1);

        ctx.fillStyle = "red";
        let highestX = firstPos[0] > virtX ? firstPos[0] : virtX;
        let highestY = firstPos[1] > virtY ? firstPos[1] : virtY;
        let lowestX = firstPos[0] < virtX ? firstPos[0] : virtX;
        let lowestY = firstPos[1] < virtY ? firstPos[1] : virtY;
        for (let x = lowestX; x <= highestX; x++) {
            for (let y = lowestY; y <= highestY; y++) {
                if (firstPos[0] !== virtX) {
                    if (x % 2 === 0) continue;
                }
                if (firstPos[1] !== virtY) {
                    if (y % 2 === 0) continue;
                }
                if (setItem(x, y, 2)) ctx.fillRect(x, y, 1, 1);
            }
        }
        firstPos = null;
    } else if (i === 8) {
        ctx.fillStyle = "cyan";
        if (setItem(virtX, virtY, 6)) ctx.fillRect(virtX, virtY, 1, 1);
    }
})

canvas.addEventListener("mousemove", (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const virtX = Math.floor(x * (96 / window.innerWidth));
    const y = e.clientY - canvas.offsetTop;
    const virtY = Math.floor(y * (32 / canvas.clientHeight));

    cursor.style.width = (window.innerWidth / 96) + "px";
    cursor.style.height = (canvas.clientHeight / 32) + "px";
    cursor.style.left = `${virtX * (window.innerWidth / 96)}px`;
    cursor.style.top = `${virtY * (canvas.clientHeight / 32)}px`;
});

function json() {
    if (!base.playerSpawn) {
        alert("No player spawn");
        return false;
    }
    if (!base.spawn) {
        alert("No spawn");
        return false;
    }
    if (base.teleports.length === 1) {
        alert("Amount of teleports should be either 0 or 2");
        return false;
    }

    return {
        "data": base,
        "map": data
    };
}
download.addEventListener("click", () => {
    const data = json();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "map.json";
    a.click();
});

openBtn.addEventListener("change", (e) => {
    const file = e.target.files[0];
    open(file);
    console.log(file);
});

function open(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log(e);
        const b = JSON.parse(e.currentTarget.result);
        base = b.data;
        data = b.map;
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[y].length; x++) {
                if (data[y][x] === 0) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(x, y, 1, 1);
                }
                if (data[y][x] === 1) {
                    ctx.fillStyle = "blue";
                    ctx.fillRect(x, y, 1, 1);
                }
                if (data[y][x] === 2) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(x, y, 1, 1);
                }
                if (data[y][x] === 3) {
                    ctx.fillStyle = "orange";
                    ctx.fillRect(x, y, 1, 1);
                }
                if (data[y][x] === 4) {
                    ctx.fillStyle = "green";
                    ctx.fillRect(x, y, 1, 1);
                }
                if (data[y][x] === 5) {
                    ctx.fillStyle = "purple";
                    ctx.fillRect(x, y, 1, 1);
                }
                if (data[y][x] === 6) {
                    ctx.fillStyle = "cyan";
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
    reader.readAsText(file);
}