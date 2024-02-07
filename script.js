// Global variables

const themeToggle = document.querySelector(".theme-toggle");
const viewSelector = document.querySelector(".view-mode");
const openModalBtn = document.querySelector(".circle");
const openSortBoxButton = document.querySelector("#sort");
const sortButtonBox = document.querySelector(".sort-button-box");
const sortButtons = Array.from(document.querySelectorAll(".sort-button"));
const modal = document.querySelector("dialog");
const modalSubmitButton = document.querySelector("#submitButton");
const modalCancelButton = document.querySelector("#cancelButton");
const modalRatingField = document.querySelector(".rating-block");
let bookList = [
  // {
  //   author: "B",
  //   title: "a",
  //   pages: "7",
  //   status: false,
  //   rating: [false, false, false, false, false],
  // },
  // {
  //   author: "E",
  //   title: "d",
  //   pages: "5",
  //   status: true,
  //   rating: [false, false, true, false, false],
  // },
  // {
  //   author: "F",
  //   title: "c",
  //   pages: "1",
  //   status: false,
  //   rating: [false, true, false, false, false],
  // },
  // {
  //   author: "A",
  //   title: "f",
  //   pages: "2",
  //   status: true,
  //   rating: [false, false, false, true, false],
  // },
  // {
  //   author: "C",
  //   title: "b",
  //   pages: "4",
  //   status: false,
  //   rating: [false, false, false, false, false],
  // },
  // {
  //   author: "G",
  //   title: "g",
  //   pages: "3",
  //   status: false,
  //   rating: [false, false, false, false, true],
  // },
  // {
  //   author: "D",
  //   title: "e",
  //   pages: "6",
  //   status: true,
  //   rating: [true, false, false, false, false],
  // },
];
const isReadButton = document.querySelector("#status");

// Local storage
if (localStorage.books) {
  bookList = JSON.parse(localStorage.books);
  renderBooks();
} else {
  localStorage.setItem("books", JSON.stringify(bookList));
}

// View mode selector

themeToggle.addEventListener("click", () => {
  const blockInput = document.querySelector(".block-view");
  const rowInput = document.querySelector(".row-view");
  const bookIcons = document.querySelectorAll(".book-icon");
  if (document.querySelector("html").getAttribute("theme") === "dark") {
    document.querySelector("html").setAttribute("theme", "");
    blockInput.style.backgroundImage = "url(./image/block-view.svg)";
    rowInput.style.backgroundImage = "url(./image/row-view.svg)";
    openSortBoxButton.style.backgroundImage = "url(./image/swap-vertical.svg)";
    bookIcons.forEach((icon) => (icon.src = "./image/book.svg"));
  } else {
    document.querySelector("html").setAttribute("theme", "dark");
    blockInput.style.backgroundImage = "url(./image/block-view-dark.svg)";
    rowInput.style.backgroundImage = "url(./image/row-view-dark.svg)";
    openSortBoxButton.style.backgroundImage =
      "url(./image/swap-vertical-dark.svg)";
    bookIcons.forEach((icon) => (icon.src = "./image/book-dark.svg"));
  }
});

viewSelector.addEventListener("click", () => {
  if (document.querySelector(".block-view").checked) {
    document.querySelector("main").classList.add("block");
    Array.from(document.querySelectorAll(".card")).forEach((item) =>
      item.classList.add("block")
    );
  } else {
    document.querySelector("main").classList.remove("block");
    Array.from(document.querySelectorAll(".card")).forEach((item) =>
      item.classList.remove("block")
    );
  }
});

// Modal's handlers

openModalBtn.addEventListener("click", () => {
  resetModal();
  modal.showModal();
});

isReadButton.addEventListener("click", () => {
  modalRatingField.classList.toggle("show");
});

document.querySelector("#pages").addEventListener("keydown", (e) => {
  const regEx = /[0-9]/;
  const validKey = [
    "ArrowRight",
    "ArrowLeft",
    "Tab",
    "Backspace",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  if (validKey.every((key) => key != e.key)) {
    e.preventDefault();
  }
});

modalSubmitButton.addEventListener("click", function (e) {
  let bookAuthor = document.querySelector("#author").value;
  const bookTitle = document.querySelector("#title").value;
  let bookPages = document.querySelector("#pages").value;
  const bookStatus = document.querySelector("#status").checked;
  let ratingInputValue = Array.from(
    document.querySelectorAll("dialog .rating-label input")
  ).map((e) => e.checked);
  bookAuthor === "" ? (bookAuthor = "Unknown author") : bookAuthor;
  bookPages === "" ? (bookPages = "???") : bookPages;
  if (bookTitle !== "") {
    createBook(bookAuthor, bookTitle, bookPages, bookStatus, ratingInputValue);
    renderBooks();
  } else {
    e.preventDefault();
    alert("Missing Title");
  }
});

modalCancelButton.addEventListener("click", () => modal.close());

function resetModal() {
  document.querySelector("#author").value = "";
  document.querySelector("#title").value = "";
  document.querySelector("#pages").value = "";
  document.querySelector("#status").checked = false;
  Array.from(document.querySelectorAll("dialog .rating-label input")).map(
    (e) => (e.checked = false)
  );
  modalRatingField.classList.remove("show");
}

// Create book functions

function Book(author, title, pages, status, rating) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.status = status;
  this.rating = rating;
}

function createBook(
  bookAuthor,
  bookTitle,
  bookPages,
  bookStatus,
  ratingInputValue
) {
  const book = new Book(
    bookAuthor,
    bookTitle,
    bookPages,
    bookStatus,
    ratingInputValue
  );
  bookList.push(book);
}

function renderBooks() {
  document.querySelector("main").innerHTML = "";

  for (let book of bookList) {
    const bookIndex = bookList.indexOf(book);
    const card = document.createElement("div");
    card.classList.add("card");

    if (document.querySelector(".block-view").checked) {
      document.querySelector("main").classList.add("block");
      card.classList.add("block");
    } else {
      document.querySelector("main").classList.remove("block");
      card.classList.remove("block");
    }

    card.innerHTML += ` <img class="delete-icon bin-${bookIndex}" src="./image/bin.svg" alt=""><p class="book-author">${sanitizeInput(
      book.author
    )}</p>
        <p class="book-title">${sanitizeInput(book.title)}</p>
        <p class="book-pages">Pages: <span class="pages">${sanitizeInput(
          book.pages
        )}</span></p>
        <div class="rating">
          <label class="rating-label"
            ><input type="radio" name="rating-${bookIndex}" value="5" ${
      book.rating[0] ? "checked" : ""
    }/>☆</label
          >
          <label class="rating-label"
            ><input type="radio" name="rating-${bookIndex}" value="4" ${
      book.rating[1] ? "checked" : ""
    }/>☆</label
          >
          <label class="rating-label"
            ><input type="radio" name="rating-${bookIndex}" value="3" ${
      book.rating[2] ? "checked" : ""
    }/>☆</label
          >
          <label class="rating-label"
            ><input type="radio" name="rating-${bookIndex}" value="2" ${
      book.rating[3] ? "checked" : ""
    }/>☆</label
          >
          <label class="rating-label"
            ><input type="radio" name="rating-${bookIndex}" value="1" ${
      book.rating[4] ? "checked" : ""
    }/>☆</label
          >
        </div>
        <img class="book-icon" src="./image/book.svg" alt="" /><input
          class="book-status status-${bookIndex}"
          type="checkbox" ${book.status ? "checked" : ""}
        />`;
    document.querySelector("main").appendChild(card);
    const deleteBtn = document.querySelector(`.bin-${bookIndex}`);
    deleteBtn.addEventListener("click", function () {
      removeCard(card, bookIndex);
      localStorage.books = JSON.stringify(bookList);
    });

    const checkReadBtn = document.querySelector(
      `.book-status.status-${bookIndex}`
    );
    checkReadBtn.addEventListener("click", () => {
      if (bookList[bookIndex].status) {
        bookList[bookIndex].status = false;
      } else {
        bookList[bookIndex].status = true;
      }
      localStorage.books = JSON.stringify(bookList);
    });
    const checkRatingBtn = Array.from(
      document.querySelectorAll(`[name="rating-${bookIndex}"]`)
    );
    for (let input of checkRatingBtn) {
      input.addEventListener("click", function () {
        book.rating = [false, false, false, false, false];
        book.rating[5 - this.value] = true;
        localStorage.books = JSON.stringify(bookList);
      });
    }
  }
  localStorage.books = JSON.stringify(bookList);
}

// Sorting functions

openSortBoxButton.addEventListener("click", (e) => {
  sortButtonBox.classList.toggle("hide");
});

sortButtons.forEach((option) =>
  option.addEventListener("click", function (e) {
    e.stopPropagation();
    sortButtonBox.classList.add("hide");
    sortBookArray(this.value);
    renderBooks();
  })
);

function sortBookArray(value) {
  switch (value) {
    case "1":
      bookList.sort(sortRule("author", "incr"));
      break;
    case "2":
      bookList.sort(sortRule("author", "desc"));
      break;
    case "3":
      bookList.sort(sortRule("title", "incr"));
      break;
    case "4":
      bookList.sort(sortRule("title", "desc"));
      break;
    case "5":
      bookList.sort(sortRule("pages", "incr"));
      break;
    case "6":
      bookList.sort(sortRule("pages", "desc"));
      break;
    case "7":
      bookList.sort(sortRule("rating", "incr"));
      break;
    case "8":
      bookList.sort(sortRule("rating", "desc"));
      break;
    case "9":
      bookList.sort(sortRule("status", "incr"));
      break;
    case "10":
      bookList.sort(sortRule("status", "desc"));
      break;
    default:
      break;
  }
}

function sortRule(property, order = "incr") {
  return function innerSortlet(a, b) {
    let comparison = 0;
    let varA = a[property];
    let varB = b[property];
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    } else {
      comparison = 0;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

function removeCard(card, bookIndex) {
  card.remove();
  bookList.splice(bookIndex, 1);
  renderBooks();
}

function sanitizeInput(inputValue) {
  const div = document.createElement("div");
  div.textContent = inputValue;
  return div.innerHTML;
}
