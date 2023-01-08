const incompleteBookshelfList = [];
const key = "z";
const event = "s";
const MyEvent = "r";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addSubmit();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addSubmit() {
  const textTittle = document.getElementById("Tittle").value;
  const textAuthor = document.getElementById("Author").value;
  const Timestamp = document.getElementById("Timestamp").value;

  const generatedID = generateId();
  const MyObject = generateObject(
    generatedID,
    textTittle,
    textAuthor,
    Timestamp,
    false
  );
  incompleteBookshelfList.push(MyObject);

  document.dispatchEvent(new Event(MyEvent));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateObject(id, Tittle, Author, Timestamp, isCompleted) {
  return {
    id,
    Tittle,
    Author,
    Timestamp,
    isCompleted,
  };
}

document.addEventListener(MyEvent, function () {
  const uncompletedMyList = document.getElementById("incompleteBookshelfList");
  uncompletedMyList.innerHTML = "";

  const listCompleted = document.getElementById("completeBookshelfList");
  listCompleted.innerHTML = "";

  for (const i of incompleteBookshelfList) {
    const MyElement = makeMy(i);
    if (i.isCompleted) {
      listCompleted.append(MyElement);
    } else {
      uncompletedMyList.append(MyElement);
    }
  }
});

function makeMy(MyObject) {
  const { id, Tittle, Author, Timestamp, isCompleted } = MyObject;

  const textTittle = document.createElement("h3");
  textTittle.innerText = Tittle;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author : " + Author;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = "Publish : " + Timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTittle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `My-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTittleFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTittleFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addTittleToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeTittleFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function f(a) {
  for (const i of incompleteBookshelfList) {
    if (i.id === a) {
      return i;
    }
  }
  return null;
}

function FindIndex(a) {
  for (const index in incompleteBookshelfList) {
    if (incompleteBookshelfList[index].id === a) {
      return index;
    }
  }
  return -1;
}

function addTittleToCompleted(a) {
  const MyTarget = f(a);

  if (MyTarget == null) return;

  MyTarget.isCompleted = true;
  document.dispatchEvent(new Event(MyEvent));
  saveData();
}

function undoTittleFromCompleted(a) {
  const MyTarget = f(a);
  if (MyTarget == null) return;

  MyTarget.isCompleted = false;
  document.dispatchEvent(new Event(MyEvent));
  saveData();
}

function removeTittleFromCompleted(a) {
  const MyTarget = FindIndex(a);

  if (MyTarget === -1) return;

  incompleteBookshelfList.splice(MyTarget, 1);
  document.dispatchEvent(new Event(MyEvent));
  saveData();
}

document.addEventListener(Event, () => {
  alert("Data saved successfully.");
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(incompleteBookshelfList);
    localStorage.setItem(key, parsed);
    document.dispatchEvent(new Event(Event));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(key);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const My of data) {
      incompleteBookshelfList.push(My);
    }
  }

  document.dispatchEvent(new Event(MyEvent));
}
