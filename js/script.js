const statusP = document.getElementById("statusP");
const moyenneT = document.getElementById("moyenneT");
const problemR = document.getElementById("problemR");
const familles = document.getElementById("familles");

const req = new XMLHttpRequest();
req.addEventListener("load", (evt) => {
  let results = JSON.parse(req.responseText);
  let infos = results[2].data;

  probStatus(infos);
  probResolus(infos);
  moyenneTimeSolved(infos);

  familleP(infos);

  //console.log(infos);
});
req.open("GET", "results.json");
req.send();

function probStatus(dataset) {
  let results = {
    SAT: 0,
    UNSAT: 0,
    UNKNOWN: 0,
    UNSUPPORTED: 0,
  };
  dataset.forEach((problem) => {
    results[problem.status]++;
  });

  console.log(Object.keys(results).map((k) => results[k]));

  new Chart(statusP, {
    type: "pie",
    label: 'Status de Résolution',
    data: {
      labels: ["SAT", "UNSAT", "UNKNOWN", "UNSUPPORTED"],
      datasets: [
        {
          labels: "Nombre de problèmes",
          data: Object.keys(results).map((k) => results[k]),
          backgroundColor: ["#8d6ba0", "#a489b3", "#c6b5d0", "#e8e1ec"],
          borderWidth: 1,
        },
      ],
    },
    options: {
        aspectRatio: 1,
    },
  });
}

function moyenneTimeSolved(dataset) {
  let list = new Array();
  dataset.forEach((problem) => {
    if (problem.status === "SAT" || problem.status === "UNSAT") {
      let nom = problem.name;
      if (list[problem.name] == null) {
        list[nom] = [problem.time];
      } else {
        list[nom].push(problem.time);
      }
    }
  });

  let data = new Array();
  for (var key in list) {
    data[key] = new Array();
    list[key].forEach((elt) => {
      data[key].push(parseInt(elt));
    });
  }

  //console.log(dataset);

  let moyennes = new Array();
  for (let key in data) {
    moyennes[key] = Math.round(moyenne(data[key]) * 100) / 100;
  }
  moyennes.sort();

  let tri = getSortedKeys(moyennes);
  tri = tri.reverse();

  console.log(tri);

  let valeurs = new Array();
  tri.forEach((elt) => {
    valeurs.push(moyennes[elt]);
  });

  new Chart(moyenneT, {
    type: "bar",
    data: {
      labels: tri,
      datasets: [
        {
          label: "Vitesse moyenne",
          data: valeurs,
          borderWidth: 1,
          backgroundColor: ["#8d6ba0", "#a489b3", "#c6b5d0", "#e8e1ec"],
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function probResolus(dataset) {
  let results = [];
  dataset.forEach((problem) => {
    if (problem.status == "SAT" && results[problem.name] == null) {
      results[problem.name] = 1;
    } else if (problem.status == "SAT" && results[problem.name] != null) {
      results[problem.name] += 1;
    }
  });

  // let tri = getSortedKeys(results);
  console.log(Object.values(results));
  console.log(getSortedValues(results));
  //console.log(tri);

  new Chart(problemR, {
    type: "bar",
    data: {
      labels: Object.keys(results),
      datasets: [
        {
          label: "Problèmes résolus",
          data: Object.keys(results).map((i) => results[i]),
          borderWidth: 1,
          backgroundColor: ["#8d6ba0", "#a489b3", "#c6b5d0", "#e8e1ec"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function familleP(dataset) {
  let results = {
    QuasiGroup: 0,
    Crossword: 0,
    Pb: 0,
    CarSequencing: 0,
    CostasArray: 0,
    Crypto1: 0,
    Eternity: 0,
    Hadamard: 0,
    KnightTour2: 0,
    Molnar: 0,
    NurseRostering: 0,
    Ortholatin: 0,
    NumberPartitioning: 0,
    SportsScheduling: 0,
    Hidato: 0,
    SolitaireBattleship: 0,
    BlockedQueens: 0,
    AztecDiamond: 0,
    DiamondFree: 0,
    RoomMate: 0,
    Superpermutation: 0,
  };

  dataset.forEach((problem) => {
    results[problem.family]++;
  });

  let names = new Array();
  for (var key in results) {
    names.push(key);
  }

  new Chart(familles, {
    type: "line",
    data: {
      labels: names,
      datasets: [
        {
          label: "Nombre de familles",
          data: results,
          backgroundColor: ["#8d6ba0", "#a489b3", "#c6b5d0", "#e8e1ec"],
          borderWidth: 0,
        },
      ],
    },
  });

  console.log(results);
}

function moyenne(tab) {
  let sum = 0;
  let moy = 0;
  tab.forEach(function (value) {
    sum += value;
  });
  moy = sum / tab.length;
  return moy;
}

function getSortedKeys(obj) {
  var keys = Object.keys(obj);
  return keys.sort(function (a, b) {
    return obj[b] - obj[a];
  });
}

function getSortedValues(obj) {
  let values = [];
  for (var solver in obj) {
    values.push([solver, obj[solver]]);
  }

  console.log(values);

  return values.sort(function (a, b) {
    return obj[b] - obj[a];
  });
}
