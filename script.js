
function showAddForm() {
  document.getElementById("addForm").style.display = "block";
  document.getElementById("viewTasks").style.display = "none";
  document.getElementById("EditTasks").style.display = "none";
}

function showViewTasks() {
  document.getElementById("addForm").style.display = "none";
  document.getElementById("EditTasks").style.display = "none";
  document.getElementById("viewTasks").style.display = "block";
  
}
function showEditTasks(){
  document.getElementById("addForm").style.display = "none";
  document.getElementById("viewTasks").style.display = "none";
  document.getElementById("EditTasks").style.display = "block";
  
}
var priorityPIN ;

function addTask() {
  var title = document.getElementById("title").value;
  var priority = document.getElementById("priority").value;
  var assignee = document.getElementById("assignee").value;
  var description = document.getElementById("description").value;
  var deadline = document.getElementById("deadline").value;
  var outpriority;

  if (title.trim() === "" || priority.trim() === "" || assignee.trim() === "" || description.trim() === "") {
      alert("所有欄位皆為必填! 請重新輸入!");
      return;
  }

  if (priority == 1) {
      outpriority = "緊急";
  } else if (priority == 2) {
      outpriority = "中等";
  } else {
      outpriority = "一般";
  }
  addToDropdown(title);

  var searchArray = [];
  searchArray.push(title, priority, assignee, description, deadline);
  const regex = searchArray;

  var isExpired = checkIfExpired(deadline);

  if (isExpired) {
      alert("已過期的日期！");
      document.getElementById("deadline").value = "";
      return;
  }

  var taskList = document.getElementById("taskList");
  var newRow = taskList.insertRow(taskList.rows.length);
  var cell0 = newRow.insertCell(0);
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = "checkbox";
  cell0.appendChild(checkbox);

  checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
          var yes = confirm("是否確定完成？");
          if (yes) {
              var row = this.parentNode.parentNode; // 獲取父級的父級，即行
              row.parentNode.removeChild(row);
              var completedTitle = row.cells[0].innerHTML;
              removeFromDropdown(completedTitle);
          } else {
              checkbox.checked = false;
          }
      } else {
          // Do something if not checked
      }
  });

  var pinButtonCell = newRow.insertCell(1);
  var pinButton = document.createElement('button');
  pinButton.innerText = '刪除';
  pinButton.addEventListener('click', function () {
      var ok = confirm("確認刪除?");
      if (ok) {
          var row = this.parentNode.parentNode;
          row.parentNode.removeChild(row);
          var deletedTitle = row.cells[0].innerHTML;
          removeFromDropdown(deletedTitle);
      } else {
          return;
      }
      togglePin(newRow);
  });

  function removeFromDropdown(title) {
      var dropdown = document.getElementById("titleDropdown");
      var options = dropdown.options;
      for (var j = 0; j < options.length; j++) {
          if (options[j].text === title) {
              dropdown.remove(j);
              break;
          }
      }
  }

  pinButtonCell.appendChild(pinButton);

  var pinButtonCell = newRow.insertCell(1);
  var pinButton = document.createElement('button');
  pinButton.innerText = '釘選';
  pinButton.addEventListener('click', function () {
      priorityPIN = "1";
      togglePin(newRow);
  });

  pinButtonCell.appendChild(pinButton);

  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3);
  var cell5 = newRow.insertCell(4);
  var cell6 = newRow.insertCell(5);

  cell1.innerHTML = title;
  cell2.innerHTML = outpriority;
  cell3.innerHTML = assignee;
  cell4.innerHTML = description;
  cell5.innerHTML = deadline;
  var remainingDays = calculateRemainingDays(deadline);
  cell6.innerHTML = remainingDays;

  document.getElementById("title").value = "";
  document.getElementById("priority").value = "1";
  document.getElementById("assignee").value = "";
  document.getElementById("description").value = "";
  document.getElementById("deadline").value = "";

  if (document.getElementById("priority").value == "1") {
      pinPriority = 2;
      sort();
  } else if (document.getElementById("priority").value == "2") {
      pinPriority = 3;
      sort();
  } else {
      sort();
  }
}
function calculateRemainingDays(deadline) {

  var deadlineDate = new Date(deadline);
  
 
  var currentDate = new Date();

  
  var timeDifference = deadlineDate.getTime() - currentDate.getTime();

 
  var remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  if(remainingDays < 0){
    priorityPIN = "0";
    remainingDays = "已過期";
    return remainingDays;
  }else{
    return remainingDays + "天";
  }
 
  
}


//釘選功能
function togglePin(row) {
  var pinStatus = row.dataset.pinned;
  var pinButton = row.querySelector('button');
  var taskList = document.getElementById("taskList"); 
  var isExpired = checkIfExpired(row.cells[4].innerHTML);
  if (pinStatus === 'pinned') {
    unpinRow(row, pinButton); 
  } else {
    pinRow(row, pinButton, taskList);
    pinPriority = 1;
  }
  
}
function pinRow(row, pinButton, taskList) {
  row.dataset.pinned = 'pinned';
  row.classList.add('pinned');
  pinButton.innerText = "取消釘選";                
  
}

  function unpinRow(row, pinButton) {
    delete row.dataset.pinned;
    row.classList.remove('pinned');
    pinButton.innerText = "釘選";
    var taskList = document.getElementById("taskList");
    taskList.appendChild(row);
  }

function checkIfExpired(deadline) {
  var deadlineDate = new Date(deadline);
  var currentDate = new Date();
  return currentDate > deadlineDate;
}


function addToDropdown(title) {
  var dropdown = document.getElementById("titleDropdown");
  var option = document.createElement("option");
  option.text = title;
  dropdown.add(option);
}

document.getElementById("titleDropdown").addEventListener("change", function() {
var selectedTitle = this.value;
var taskList = document.getElementById("taskList");
var rows = taskList.getElementsByTagName("tr");

for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    if (cells[0].innerHTML === selectedTitle) {
        
        document.getElementById("editPriority").value = cells[1].innerHTML;
        document.getElementById("editAssignee").value = cells[2].innerHTML;
        document.getElementById("editDescription").value = cells[3].innerHTML;
        document.getElementById("editDeadline").value = cells[4].innerHTML;
        var priorityValue = cells[1].innerHTML;
          var prioritySelect = document.getElementById("editPriority");
          if (priorityValue === "緊急") {
              prioritySelect.value = "1";
          } else if (priorityValue === "中等") {
              prioritySelect.value = "2";
          } else {
              prioritySelect.value = "3";
          }
        document.getElementById("editTaskForm").style.display = "block";
        return; 
    }
}


document.getElementById("editTaskForm").style.display = "none";
});
document.getElementById("saveChanges").addEventListener("click", function() {
// 獲取編輯後的資訊
var editedPriority = document.getElementById("editPriority").value;
if (editedPriority == "1"){
  editedPriority = "緊急";
}
else if(editedPriority == "2"){
  editedPriority = "中等";
}
else{
  editedPriority = "一般";
}

var editedAssignee = document.getElementById("editAssignee").value;
var editedDescription = document.getElementById("editDescription").value;
var editedDeadline = document.getElementById("editDeadline").value;

// 獲取目前選取的標題
var selectedTitle = document.getElementById("titleDropdown").value;

// 獲取待辦事項列表
var taskList = document.getElementById("taskList");
var rows = taskList.getElementsByTagName("tr");

// 在待辦事項列表中找到目前編輯的標題對應的行
for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    if (cells[0].innerHTML === selectedTitle) {
        // 更新該行的內容
        cells[1].innerHTML = editedPriority;
        cells[2].innerHTML = editedAssignee;
        cells[3].innerHTML = editedDescription;
        cells[4].innerHTML = editedDeadline;
        break; 
    }
}


document.getElementById("editTaskForm").style.display = "none";
});
document.getElementById("submit").addEventListener("click", function(event) {
event.preventDefault(); // 防止表單提交刷新頁面

var searchContent = document.querySelector("[data-bookfinder-form] input[name='search']").value.trim().toLowerCase();

var taskList = document.getElementById("taskList").getElementsByTagName("tr");

for (var i = 0; i < taskList.length; i++) {
  var title = taskList[i].getElementsByTagName("td")[0].textContent.trim().toLowerCase();
  if (title.includes(searchContent)) {
    taskList[i].style.display = "table-row"; 
  } else {
    taskList[i].style.display = "none"; 
  }
}
});
//排序
function sort() {
  var taskList = document.getElementById("taskList");
  var rows = taskList.rows;
  var nonPinnedNonExpiredRows = [];

  // 將未釘選且未過期的行添加到陣列中
  for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row.dataset.pinned && !row.classList.contains('expired')) {
          nonPinnedNonExpiredRows.push(row);
      }
  }

  // 根據優先級進行排序
  nonPinnedNonExpiredRows.sort(function (a, b) {
      var priorityA = a.cells[1].innerHTML;
      var priorityB = b.cells[1].innerHTML;
      return priorityA.localeCompare(priorityB);
  });

  // 將排序後的行重新插入表格中
  nonPinnedNonExpiredRows.forEach(function (row) {
      taskList.appendChild(row);
  });

}
