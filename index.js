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
          trHTML += "<td>" + object["Attribute"] + "</td>";
          trHTML += "<td>" + object["Description"] + "</td>";
          trHTML += "<td>" + object["Data_Type"] + "</td>";
          trHTML += "<td>" + object["Domain"] + "</td>";
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
    "http://localhost:3000/statlogs/attribute/" + encodeURIComponent(searchText)
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
            trHTML += "<td>" + object["Attribute"] + "</td>";
            trHTML += "<td>" + object["Description"] + "</td>";
            trHTML += "<td>" + object["Data_Type"] + "</td>";
            trHTML += "<td>" + object["Domain"] + "</td>";
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
  let Nominal = 0;
  let Binary = 0;
  let Numerical = 0;
  let DOther = 0;

  let Age = 0;
  let Sex = 0;
  let Chp = 0;
  let Bp = 0;
  let Sch = 0;
  let Fbs = 0;
  let Ecg = 0;
  let Mhrt = 0;
  let Exian = 0;
  let Opk = 0;
  let Slope = 0;
  let Vessel = 0;
  let Thal = 0;
  let Class = 0;
  let AOther = 0;

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
        countResponses(objects, "Data_Type", dataTypeCounts);
        Nominal = dataTypeCounts["Nominal"] || 0;
        Binary = dataTypeCounts["Binary"] || 0;
        Numerical = dataTypeCounts["Numerical"] || 0;
        DOther = dataTypeCounts["Other"] || 0;

        // นับแอตทริบิวต์
        const submittedViaCounts = {};
        countResponses(objects, "Attribute", submittedViaCounts);
        Age = submittedViaCounts["Age"] || 0;
        Sex = submittedViaCounts["Sex"] || 0;
        Chp = submittedViaCounts["Chp"] || 0;
        Bp = submittedViaCounts["Bp"] || 0;
        Sch = submittedViaCounts["Sch"] || 0;
        Fbs = submittedViaCounts["Fbs"] || 0;
        Ecg = submittedViaCounts["Ecg"] || 0;
        Mhrt = submittedViaCounts["Mhrt"] || 0;
        Exian = submittedViaCounts["Exian"] || 0;
        Opk = submittedViaCounts["Opk"] || 0;
        Slope = submittedViaCounts["Slope"] || 0;
        Vessel = submittedViaCounts["Vessel"] || 0;
        Thal = submittedViaCounts["Thal"] || 0;
        Class = submittedViaCounts["Class"] || 0;
        AOther = submittedViaCounts["Other"] || 0;

        // แสดงกราฟประเภทข้อมูล
        const TimelyResponseData = google.visualization.arrayToDataTable([
          ["Data Type", "Count"],
          ["Nominal", Nominal],
          ["Binary", Binary],
          ["Numerical", Numerical],
          ["Other", DOther],
        ]);

        const optionsTimelyResponse = {
          title: "Data Type Stats (Latest 10000 cases)",
        };
        const chartTimelyResponse = new google.visualization.PieChart(
          document.getElementById("piechartTimelyResponse")
        );
        chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);

        // เตรียมข้อมูลแอตทริบิวต์ทั้งหมด
        const attributes = [
          { name: "Age", count: Age },
          { name: "Sex", count: Sex },
          { name: "Chp", count: Chp },
          { name: "Bp", count: Bp },
          { name: "Sch", count: Sch },
          { name: "Fbs", count: Fbs },
          { name: "Ecg", count: Ecg },
          { name: "Mhrt", count: Mhrt },
          { name: "Exian", count: Exian },
          { name: "Opk", count: Opk },
          { name: "Slope", count: Slope },
          { name: "Vessel", count: Vessel },
          { name: "Thal", count: Thal },
          { name: "Class", count: Class },
          { name: "Other", count: AOther },
        ];

        // เรียงลำดับตามจำนวนและแยก 5 อันดับแรก
        attributes.sort((a, b) => b.count - a.count);
        const top5Attributes = attributes.slice(0, 5);
        const otherCount = attributes
          .slice(5)
          .reduce((acc, attr) => acc + attr.count, 0);

        // เตรียมข้อมูลสำหรับกราฟแท่ง
        const dataForBarChart = google.visualization.arrayToDataTable([
          ["Attribute", "Number", { role: "style" }, { role: "annotation" }],
          ...top5Attributes.map((attr) => [
            attr.name,
            attr.count,
            "color: #F65A83",
            attr.name,
          ]),
          ["Other", otherCount, "color: #1C3879", "Other"],
        ]);

        const optionSubmitted = {
          title: "Top 5 Attribute Stats (Latest 10000 cases)",
          legend: { position: "none" },
        };

        const chartSubmitted = new google.visualization.BarChart(
          document.getElementById("barchartSubmitted")
        );
        chartSubmitted.draw(dataForBarChart, optionSubmitted); // ใช้ข้อมูลจาก dataForBarChart
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
      '<div class="mb-3"><label for="Attribute" class="form-label">Attribute</label>' +
      '<input class="form-control" id="Attribute" placeholder="Attribute"></div>' +
      '<div class="mb-3"><label for="Description" class="form-label">Description</label>' +
      '<input class="form-control" id="Description" placeholder="Description"></div>' +
      '<div class="mb-3"><label for="Data_Type" class="form-label">Data Type</label>' +
      '<input class="form-control" id="Data_Type" placeholder="Data Type"></div>' +
      '<div class="mb-3"><label for="Domain" class="form-label">Domain</label>' +
      '<input class="form-control" id="Domain" placeholder="Domain"></div>',
    focusConfirm: false,
    preConfirm: () => {
      StatlogCreate();
    },
  });
}

function StatlogCreate() {
  const Attribute = document.getElementById("Attribute").value;
  const Description = document.getElementById("Description").value;
  const Data_Type = document.getElementById("Data_Type").value;
  const Domain = document.getElementById("Domain").value;

  console.log(
    JSON.stringify({
      Attribute: Attribute,
      Description: Description,
      Data_Type: Data_Type,
      Domain: Domain,
    })
  );

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/statlogs/create");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      Attribute: Attribute,
      Description: Description,
      Data_Type: Data_Type,
      Domain: Domain,
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
          '<div class="mb-3"><label for="Attribute" class="form-label">Attribute</label>' +
          '<input class="form-control" id="Attribute" placeholder="Attribute" value="' +
          object["Attribute"] +
          '"></div>' +
          '<div class="mb-3"><label for="Description" class="form-label">Description</label>' +
          '<input class="form-control" id="Description" placeholder="Description" value="' +
          object["Description"] +
          '"></div>' +
          '<div class="mb-3"><label for="Data_Type" class="form-label">Data_Type</label>' +
          '<input class="form-control" id="Data_Type" placeholder="Data_Type" value="' +
          object["Data_Type"] +
          '"></div>' +
          '<div class="mb-3"><label for="Domain" class="form-label">Domain</label>' +
          '<input class="form-control" id="Domain" placeholder="Domain" value="' +
          object["Domain"] +
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
  const Attribute = document.getElementById("Attribute").value;
  const Description = document.getElementById("Description").value;
  const Data_Type = document.getElementById("Data_Type").value;
  const Domain = document.getElementById("Domain").value;

  const data = {
    _id: id,
    Attribute: Attribute,
    Description: Description,
    Data_Type: Data_Type,
    Domain: Domain,
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
