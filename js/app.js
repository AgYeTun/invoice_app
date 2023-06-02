// Variables
const services = [
  {
    id: 1,
    title: "Domain Service",
    price: 15,
  },
  {
    id: 2,
    title: "Hosting Service",
    price: 30,
  },
  {
    id: 3,
    title: "Web Design Service",
    price: 150,
  },
  {
    id: 4,
    title: "Maintenance Service",
    price: 100,
  },
];

// Selectors
const app = document.querySelector("#app");
const invoiceForm = document.querySelector("#invoiceForm");
const listTable = document.querySelector("#listTable");
const selectService = document.querySelector("#selectService");
const quantity = document.querySelector("#quantity");
const lists = document.querySelector("#lists");
const subTotal = document.querySelector("#subTotal");
const tax = document.querySelector("#tax");
const total = document.querySelector("#total");
const addServiceOpenBtn = document.querySelector("#addServiceOpenBtn");
const addServiceModal = document.querySelector("#addServiceModal");
const closeServiceModalBtn = document.querySelector("#closeServiceModalBtn");
const addServiceForm = document.querySelector("#addServiceForm");
const sideBar = document.querySelector("#sideBar");
const menu = document.querySelectorAll(".menu");

// Functions

// transition after page load
const transitionAfterPageLoad = () => {
  app.classList.remove("no-transition");
};
document.addEventListener("load", transitionAfterPageLoad())

// create lists
const createTr = (service, quantity) => {
  const tr = document.createElement("tr");
  tr.classList.add("list");
  tr.setAttribute("service-id", service.id);
  const total = service.price * quantity;
  tr.innerHTML = `
              <td class=" d-flex justify-content-between">
                ${service.title}
                <i class=" bi bi-trash3 del-btn text-danger"></i>
              </td>
              <td class=" text-end list-quantity">${quantity}</td>
              <td class=" text-end">${service.price}</td>
              <td class=" text-end list-total">${total}</td>
            `;
  return tr;
};

const calTax = (amount, percentage = 5) => {
  return amount * (percentage / 100);
};

const calTotal = () => {
  const listTotal = document.querySelectorAll(".list-total");
  const calSubTotal = [...listTotal].reduce(
    (pv, cv) => pv + parseFloat(cv.innerText),
    0
  );

  subTotal.innerText = calSubTotal;
  tax.innerText = calTax(calSubTotal);
  total.innerText = calSubTotal + calTax(calSubTotal);
};

// table show/hide
const toggleTable = () => {
  if (lists.children.length) {
    listTable.classList.remove("d-none");
  } else {
    listTable.classList.add("d-none");
  }
};

// Process ( Tasks )
// service option loop
services.forEach(
  ({ title, id }) => selectService.append(new Option(title, id))
);



// data collect and create table
invoiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // console.log(
  //   selectService.options[selectService.selectedIndex].innerText
  // );

  // console.log(
  //   selectService.value,
  //   quantity.valueAsNumber,
  //   services.find((service) => {
  //     return service.id == selectService.value;
  //   })
  // );

  const selectedService = services.find(({ id }) => {
    return id == selectService.value;
  }); // return object
  // console.log(selectedService);

  // check duplicate
  const isExistedService = [...lists.children].find(
    (el) => el.getAttribute("service-id") == selectedService.id
  );

  if (isExistedService) {
    console.log(isExistedService);
    const updateQuantity = isExistedService.querySelector(".list-quantity");
    // update quantity
    updateQuantity.innerText =
      parseFloat(updateQuantity.innerText) + quantity.valueAsNumber;
    // update total
    isExistedService.querySelector(".list-total").innerText =
      updateQuantity.innerText * selectedService.price;
  } else {
    lists.append(createTr(selectedService, quantity.valueAsNumber));
  }

  calTotal();
  toggleTable();

  invoiceForm.reset(); // must be form element
});

// delete list
app.addEventListener("click", (event) => {
  const currentElement = event.target;
  if (currentElement.classList.contains("del-btn")) {
    // delete function here
    currentElement.closest("tr").remove();

    calTotal();
    toggleTable();
  }

  console.dir(currentElement);
});

// add new services
// open modal
addServiceOpenBtn.addEventListener("click", () => {
  addServiceModal.classList.remove("d-none");
});

// close modal
closeServiceModalBtn.addEventListener("click", () => {
  addServiceModal.classList.add("d-none");
});

// submit form
addServiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // get data from Form
  const formData = new FormData(event.target);
  // console.log(formData.get("serviceTitle"), formData.get("servicePrice"));

  // add data to obj
  const id = Date.now();
  services.push({
    id,
    title: formData.get("serviceTitle"),
    price: parseFloat(formData.get("servicePrice")),
  });
  // add to dom
  selectService.append(new Option(formData.get("serviceTitle"), id));

  event.target.reset();
  addServiceModal.classList.add("d-none");
});

// menu show / hide
menu.forEach((el) => {
  el.addEventListener("click", () => {
    sideBar.classList.toggle("active");
  });
});
