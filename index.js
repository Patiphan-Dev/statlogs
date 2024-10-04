google.charts.load("current", {
  packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);

function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/statlogs");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var trHTML = "";
        var num = 1;
        const objects = JSON.parse(this.responseText);
        for (let object of objects) {
          trHTML += "<tr>";
          trHTML += "<td>" + num + "</td>";
          trHTML += "<td>" + object["age"] + "</td>";
          trHTML += "<td>" + object["sex"] + "</td>";
          trHTML += "<td>" + object["cp"] + "</td>";
          trHTML += "<td>" + object["trestbps"] + "</td>";
          trHTML += "<td>" + object["chol"] + "</td>";
          trHTML += "<td>" + object["fbs"] + "</td>";
          trHTML += "<td>" + object["restecg"] + "</td>";
          trHTML += "<td>" + object["thalach"] + "</td>";
          trHTML += "<td>" + object["exang"] + "</td>";
          trHTML += "<td>" + object["oldpeak"] + "</td>";
          trHTML += "<td>" + object["slope"] + "</td>";
          trHTML += "<td>" + object["ca"] + "</td>";
          trHTML += "<td>" + object["thal"] + "</td>";
          trHTML += "<td>" + object["presence"] + "</td>";

          trHTML += "<td>";
          trHTML +=
            '<a type="button" class="btn btn-outline-secondary" onclick="showStatlogEditBox(\'' +
            object["_id"] +
            '\')"><i class="fas fa-edit"></i></a>';
          trHTML +=
            '<a type="button" class="btn btn-outline-danger" onclick="StatlogDelete(\'' +
            object["_id"] +
            '\')"><i class="fas fa-trash"></i></a></td>';
          trHTML += "</tr>";

          num++;
        }
        document.getElementById("mytable").innerHTML = trHTML;

        loadGraph(); // เรียกใช้งานฟังก์ชัน loadGraph()
      } else {
        console.error("Error fetching data:", this.statusText);
        document.getElementById("mytable").innerHTML =
          '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
      }
    }
  };
}

function loadQueryTable() {
  // แสดงข้อความ Loading
  document.getElementById("mytable").innerHTML =
    '<tr><th scope="row" colspan="5">Loading...</th></tr>';
  const searchText = document.getElementById("searchTextBox").value;

  // ตรวจสอบว่ามีข้อความค้นหาหรือไม่
  if (!searchText) {
    Swal.fire("Please enter a search term.");
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    "http://localhost:3000/statlogs/age/" + encodeURIComponent(searchText)
  );

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var trHTML = "";
        var num = 1;
        const objects = JSON.parse(this.responseText).Statlog;

        // เช็คว่ามีข้อมูลหรือไม่
        if (objects && objects.length > 0) {
          for (let object of objects) {
            trHTML += "<tr>";
            trHTML += "<td>" + num + "</td>";
            trHTML += "<td>" + object["age"] + "</td>";
            trHTML += "<td>" + object["sex"] + "</td>";
            trHTML += "<td>" + object["cp"] + "</td>";
            trHTML += "<td>" + object["trestbps"] + "</td>";
            trHTML += "<td>" + object["chol"] + "</td>";
            trHTML += "<td>" + object["fbs"] + "</td>";
            trHTML += "<td>" + object["restecg"] + "</td>";
            trHTML += "<td>" + object["thalach"] + "</td>";
            trHTML += "<td>" + object["exang"] + "</td>";
            trHTML += "<td>" + object["oldpeak"] + "</td>";
            trHTML += "<td>" + object["slope"] + "</td>";
            trHTML += "<td>" + object["ca"] + "</td>";
            trHTML += "<td>" + object["thal"] + "</td>";
            trHTML += "<td>" + object["presence"] + "</td>";
            trHTML += "<td>";
            trHTML +=
              '<a type="button" class="btn btn-outline-secondary" onclick="showStatlogEditBox(\'' +
              object["_id"] +
              '\')"><i class="fas fa-edit"></i></a>';
            trHTML +=
              '<a type="button" class="btn btn-outline-danger" onclick="StatlogDelete(\'' +
              object["_id"] +
              '\')"><i class="fas fa-trash"></i></a>';
            trHTML += "</td>";
            trHTML += "</tr>";
            num++;
          }
        } else {
          // แสดงข้อความเมื่อไม่มีข้อมูล
          trHTML = '<tr><td colspan="6">No results found.</td></tr>';
        }
        console.log(trHTML);
        document.getElementById("mytable").innerHTML = trHTML;
      } else {
        console.error("Error fetching data:", this.statusText);
        Swal.fire(
          "Oops!",
          "Something went wrong while fetching results.",
          "error"
        );
        document.getElementById("mytable").innerHTML =
          '<tr><td colspan="6">Error fetching data. Please try again later.</td></tr>';
      }
    }
  };
}

function loadGraph() {
  let Man = 0;
  let Woman = 0;
  let ageGroups = {
    "0-10": 0,
    "11-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-50": 0,
    "51-60": 0,
    "61-70": 0,
    "71-80": 0,
    "81-90": 0,
    "91-100": 0,
  };
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/statlogs/");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const objects = JSON.parse(this.responseText);

        // ฟังก์ชันนับประเภทข้อมูล
        function countResponses(array, key, counts) {
          for (let object of array) {
            const value = object[key];
            counts[value] = (counts[value] || 0) + 1;
          }
        }

        // นับประเภทข้อมูล
        const dataTypeCounts = {};
        countResponses(objects, "sex", dataTypeCounts);
        Man = dataTypeCounts["0"] || 0;
        Woman = dataTypeCounts["1"] || 0;

       // นับเพศ
       function countSex(array) {
        for (let object of array) {
          if (object["sex"] === "0") {
            Man++;
          } else if (object["sex"] === "1") {
            Woman++;
          }
        }
      }

      // นับช่วงอายุ
      function countAgeGroups(array) {
        for (let object of array) {
          const age = parseInt(object["age"]);
          if (age >= 0 && age <= 10) ageGroups["0-10"]++;
          else if (age >= 11 && age <= 20) ageGroups["11-20"]++;
          else if (age >= 21 && age <= 30) ageGroups["21-30"]++;
          else if (age >= 31 && age <= 40) ageGroups["31-40"]++;
          else if (age >= 41 && age <= 50) ageGroups["41-50"]++;
          else if (age >= 51 && age <= 60) ageGroups["51-60"]++;
          else if (age >= 61 && age <= 70) ageGroups["61-70"]++;
          else if (age >= 71 && age <= 80) ageGroups["71-80"]++;
          else if (age >= 81 && age <= 90) ageGroups["81-90"]++;
          else if (age >= 91 && age <= 100) ageGroups["91-100"]++;
        }
      }

      // เรียกฟังก์ชันนับ
      countSex(objects);
      countAgeGroups(objects);

      // แสดงกราฟพายสำหรับเพศ
      const TimelyResponseData = google.visualization.arrayToDataTable([
        ["Sex", "Count"],
        ["Man", Man],
        ["Woman", Woman],
      ]);

      const optionsTimelyResponse = {
        title: "Sex Stats (Latest 10000 cases)",
      };
      const chartTimelyResponse = new google.visualization.PieChart(
        document.getElementById("piechartTimelyResponse")
      );
      chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);

      // เตรียมข้อมูลสำหรับกราฟแท่งแสดงช่วงอายุ
      const dataForBarChart = google.visualization.arrayToDataTable([
        ["Age Group", "Number", { role: "style" }, { role: "annotation" }],
        ["0-10", ageGroups["0-10"], "color: #F65A83", "0-10"],
        ["11-20", ageGroups["11-20"], "color: #4682B4", "11-20"],
        ["21-30", ageGroups["21-30"], "color: #FFD700", "21-30"],
        ["31-40", ageGroups["31-40"], "color: #2E8B57", "31-40"],
        ["41-50", ageGroups["41-50"], "color: #FF4500", "41-50"],
        ["51-60", ageGroups["51-60"], "color: #8A2BE2", "51-60"],
        ["61-70", ageGroups["61-70"], "color: #5F9EA0", "61-70"],
        ["71-80", ageGroups["71-80"], "color: #7B68EE", "71-80"],
        ["81-90", ageGroups["81-90"], "color: #FF6347", "81-90"],
        ["91-100", ageGroups["91-100"], "color: #1C3879", "91-100"],
      ]);

      const optionSubmitted = {
        title: "Age Group Stats (Latest 10000 cases)",
        legend: { position: "none" },
      };

      const chartSubmitted = new google.visualization.BarChart(
        document.getElementById("barchartSubmitted")
      );
      chartSubmitted.draw(dataForBarChart, optionSubmitted);
      } else {
        console.error("Error fetching data:", this.statusText);
        Swal.fire(
          "Oops!",
          "Something went wrong while fetching the graph data.",
          "error"
        );
      }
    }
  };
}

function showStatlogCreateBox() {
  var d = new Date();
  const date = d.toISOString().split("T")[0];

  Swal.fire({
    title: "Create Statlog",
    html:
      '<div class="mb-3"><label for="age" class="form-label">age</label>' +
      '<input class="form-control" id="age" placeholder="age"></div>' +
      '<div class="mb-3"><label for="sex" class="form-label">sex</label>' +
      '<input class="form-control" id="sex" placeholder="sex"></div>' +
      '<div class="mb-3"><label for="cp" class="form-label">cp</label>' +
      '<input class="form-control" id="cp" placeholder="cp"></div>' +
      '<div class="mb-3"><label for="trestbps" class="form-label">trestbps</label>' +
      '<input class="form-control" id="trestbps" placeholder="trestbps"></div>' +
      '<div class="mb-3"><label for="chol" class="form-label">chol</label>' +
      '<input class="form-control" id="chol" placeholder="chol"></div>' +
      '<div class="mb-3"><label for="fbs" class="form-label">fbs</label>' +
      '<input class="form-control" id="fbs" placeholder="fbs"></div>' +
      '<div class="mb-3"><label for="restecg" class="form-label">restecg</label>' +
      '<input class="form-control" id="restecg" placeholder="restecg"></div>' +
      '<div class="mb-3"><label for="thalach" class="form-label">thalach</label>' +
      '<input class="form-control" id="thalach" placeholder="thalach"></div>' +
      '<div class="mb-3"><label for="exang" class="form-label">exang</label>' +
      '<input class="form-control" id="exang" placeholder="exang"></div>' +
      '<div class="mb-3"><label for="oldpeak" class="form-label">oldpeak</label>' +
      '<input class="form-control" id="oldpeak" placeholder="oldpeak"></div>' +
      '<div class="mb-3"><label for="slope" class="form-label">slope</label>' +
      '<input class="form-control" id="slope" placeholder="slope"></div>' +
      '<div class="mb-3"><label for="ca" class="form-label">ca</label>' +
      '<input class="form-control" id="ca" placeholder="ca"></div>' +
      '<div class="mb-3"><label for="thal" class="form-label">thal</label>' +
      '<input class="form-control" id="thal" placeholder="thal"></div>' +
      '<div class="mb-3"><label for="presence" class="form-label">presence</label>' +
      '<input class="form-control" id="presence" placeholder="presence"></div>',
    focusConfirm: false,
    preConfirm: () => {
      StatlogCreate();
    },
  });
}

function StatlogCreate() {
  const age = document.getElementById("age").value;
  const sex = document.getElementById("sex").value;
  const cp = document.getElementById("cp").value;
  const trestbps = document.getElementById("trestbps").value;
  const chol = document.getElementById("chol").value;
  const fbs = document.getElementById("fbs").value;
  const restecg = document.getElementById("restecg").value;
  const thalach = document.getElementById("thalach").value;
  const exang = document.getElementById("exang").value;
  const oldpeak = document.getElementById("oldpeak").value;
  const slope = document.getElementById("slope").value;
  const ca = document.getElementById("ca").value;
  const thal = document.getElementById("thal").value;
  const presence = document.getElementById("presence").value;

  console.log(
    JSON.stringify({
      age: age,
      sex: sex,
      cp: cp,
      trestbps: trestbps,
      chol: chol,
      fbs: fbs,
      restecg: restecg,
      thalach: thalach,
      exang: exang,
      oldpeak: oldpeak,
      slope: slope,
      ca: ca,
      thal: thal,
      presence: presence,
    })
  );

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/statlogs/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      age: age,
      sex: sex,
      cp: cp,
      trestbps: trestbps,
      chol: chol,
      fbs: fbs,
      restecg: restecg,
      thalach: thalach,
      exang: exang,
      oldpeak: oldpeak,
      slope: slope,
      ca: ca,
      thal: thal,
      presence: presence,
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire("Good job!", "Create Statlog Successfully!", "success");
      loadTable();
    }
  };
}

function StatlogDelete(id) {
  if (!id) {
    console.error("Invalid ID");
    return;
  }

  console.log("Delete: ", id);

  fetch("http://localhost:3000/statlogs/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ _id: id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire("Good job!", "Delete Statlog Successfully!", "success");
      loadTable();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      Swal.fire("Error!", "Failed to delete Statlog.", "error");
    });
}

function showStatlogEditBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/statlogs/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText).object;
      console.log("showStatlogEditBox", object);
      Swal.fire({
        title: "Edit Statlog",
        html:
          '<input id="id" class="swal2-input" type="hidden" value="' +
          object["_id"] +
          '">' +
          '<div class="mb-3"><label for="age" class="form-label">age</label>' +
          '<input class="form-control" id="age" placeholder="age" value="' +
          object["age"] +
          '"></div>' +
          '<div class="mb-3"><label for="sex" class="form-label">sex</label>' +
          '<input class="form-control" id="sex" placeholder="sex" value="' +
          object["sex"] +
          '"></div>' +
          '<div class="mb-3"><label for="cp" class="form-label">cp</label>' +
          '<input class="form-control" id="cp" placeholder="cp" value="' +
          object["cp"] +
          '"></div>' +
          '<div class="mb-3"><label for="trestbps" class="form-label">trestbps</label>' +
          '<input class="form-control" id="trestbps" placeholder="trestbps" value="' +
          object["trestbps"] +
          '"></div>' +
          '<div class="mb-3"><label for="chol" class="form-label">chol</label>' +
          '<input class="form-control" id="chol" placeholder="chol" value="' +
          object["chol"] +
          '"></div>' +
          '<div class="mb-3"><label for="fbs" class="form-label">fbs</label>' +
          '<input class="form-control" id="fbs" placeholder="fbs" value="' +
          object["fbs"] +
          '"></div>' +
          '<div class="mb-3"><label for="restecg" class="form-label">restecg</label>' +
          '<input class="form-control" id="restecg" placeholder="restecg" value="' +
          object["restecg"] +
          '"></div>' +
          '<div class="mb-3"><label for="thalach" class="form-label">thalach</label>' +
          '<input class="form-control" id="thalach" placeholder="thalach" value="' +
          object["thalach"] +
          '"></div>' +
          '<div class="mb-3"><label for="exang" class="form-label">exang</label>' +
          '<input class="form-control" id="exang" placeholder="exang" value="' +
          object["exang"] +
          '"></div>' +
          '<div class="mb-3"><label for="oldpeak" class="form-label">oldpeak</label>' +
          '<input class="form-control" id="oldpeak" placeholder="oldpeak" value="' +
          object["oldpeak"] +
          '"></div>' +
          '<div class="mb-3"><label for="slope" class="form-label">slope</label>' +
          '<input class="form-control" id="slope" placeholder="slope" value="' +
          object["slope"] +
          '"></div>' +
          '<div class="mb-3"><label for="ca" class="form-label">ca</label>' +
          '<input class="form-control" id="ca" placeholder="ca" value="' +
          object["ca"] +
          '"></div>' +
          '<div class="mb-3"><label for="thal" class="form-label">thal</label>' +
          '<input class="form-control" id="thal" placeholder="thal" value="' +
          object["thal"] +
          '"></div>' +
          '<div class="mb-3"><label for="presence" class="form-label">presence</label>' +
          '<input class="form-control" id="presence" placeholder="presence" value="' +
          object["presence"] +
          '"></div>',
        focusConfirm: false,
        preConfirm: () => {
          return userEdit(); // รอให้ userEdit คืนค่าก่อน
        },
      });
    }
  };
}

async function userEdit() {
  const id = document.getElementById("id").value;
  const age = document.getElementById("age").value;
  const sex = document.getElementById("sex").value;
  const cp = document.getElementById("cp").value;
  const trestbps = document.getElementById("trestbps").value;
  const chol = document.getElementById("chol").value;
  const fbs = document.getElementById("fbs").value;
  const restecg = document.getElementById("restecg").value;
  const thalach = document.getElementById("thalach").value;
  const exang = document.getElementById("exang").value;
  const oldpeak = document.getElementById("oldpeak").value;
  const slope = document.getElementById("slope").value;
  const ca = document.getElementById("ca").value;
  const thal = document.getElementById("thal").value;
  const presence = document.getElementById("presence").value;

  const data = {
    _id: id,
    age: age,
    sex: sex,
    cp: cp,
    trestbps: trestbps,
    chol: chol,
    fbs: fbs,
    restecg: restecg,
    thalach: thalach,
    exang: exang,
    oldpeak: oldpeak,
    slope: slope,
    ca: ca,
    thal: thal,
    presence: presence,
  };

  console.log(JSON.stringify(data));

  try {
    const response = await fetch("http://localhost:3000/statlogs/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const objects = await response.json();
    Swal.fire("Good job!", "Update Statlog Successfully!", "success");
    loadTable(); // รีเฟรชตารางหลังจากอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating statlog:", error);
    Swal.fire("Oops!", "Something went wrong!", "error");
  }
}
