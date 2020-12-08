// local reviews data
const reviews = [
    {
      id: 1,
      name: "influencer",
      job: "web developer",
      imgfile:
        "./image/person-1.jpg",
      text:
        "I'm baby meggings twee health goth +1. Bicycle rights tumeric chartreuse before they sold out chambray pop-up. Shaman humblebrag pickled coloring book salvia hoodie, cold-pressed four dollar toast everyday carry",
    },
    {
      id: 2,
      name: "anna johnson",
      job: "customer",
      imgfile:
        "./image/person-2.jpg",
      text:
        "Helvetica artisan kinfolk thundercats lumbersexual blue bottle. Disrupt glossier gastropub deep v vice franzen hell of brooklyn twee enamel pin fashion axe.photo booth jean shorts artisan narwhal.",
    },
    {
      id: 3,
      name: "peter jones",
      job: "customer",
      imgfile:
        " ./image/person-3.jpg",
      text:
        "Sriracha literally flexitarian irony, vape marfa unicorn. Glossier tattooed 8-bit, fixie waistcoat offal activated charcoal slow-carb marfa hell of pabst raclette post-ironic jianbing swag.",
    },
    {
      id: 4,
      name: "bill anderson",
      job: "customer",
      imgfile:
      "./image/person-4.jpg",
      text:
        "Edison bulb put a bird on it humblebrag, marfa pok pok heirloom fashion axe cray stumptown venmo actually seitan. VHS farm-to-table schlitz, edison bulb pop-up 3 wolf moon tote bag street art shabby chic. ",
    },
    {
      id: 5,
      name: "customer",
      job: "influencer",
      imgfile:
        "./image/person-5.jpg",
      text:
        "Edison bulb put a bird on it humblebrag, marfa pok pok heirloom fashion axe cray stumptown venmo actually seitan. VHS farm-to-table schlitz, edison bulb pop-up 3 wolf moon tote bag street art shabby chic. ",
    }
  ];

  
  
  // select item


  const imgfile = document.getElementById("person-img");
  const author = document.getElementById("author");
  const job = document.getElementById("job");
  const info = document.getElementById("info");
  
  const prevBtn = document.querySelector('.prev-btn');
  const randomBtn = document.querySelector('.random-btn');
  const nextBtn = document.querySelector('.next-btn');

// close links
const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links-container");
const links = document.querySelector(".links");



//**************add new links dinamically **********
navToggle.addEventListener("click", function () {
  // linksContainer.classList.toggle("show-links");

  const linksHeight = links.getBoundingClientRect().height;
  const containerHeight = linksContainer.getBoundingClientRect().height;
  if (containerHeight === 0) {
    linksContainer.style.height = `${linksHeight}px`;
  } else {
    linksContainer.style.height = 0;
  }
  
});

const navbar = document.getElementById('nav');
//smooth scrolling function
  const scrollLinks = document.querySelectorAll('.scroll-link');
  scrollLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();

        //naviagte to specific spot
        const id = event.currentTarget.getAttribute("href").slice(1);
        const element = document.getElementById(id);

        //calculate the height
        const navHeight = navbar.getBoundingClientRect().height;
        const containerHeight = linksContainer.getBoundingClientRect().height;
        const fixedNav = navbar.classList.contains("fixed-nav");
        let position = element.offsetTop - navHeight;

        if(!fixedNav){
          position = position - navHeight;
        }
        //calculate position for small screen
        if(navHeight > 82){
          position = position +  containerHeight ;
        }


        window.scrollTo({
           left: 0,
           top: position,
        });
        //to close navbar when naviagte to the spot
        linksContainer.getElementsByClassName.height = 0;
      });
  });



  //fixed nav
  window.addEventListener("scroll", function() {
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});
 
  // set starting item
  let currentItem = 0;
  
  //load initial item
  window.addEventListener("DOMContentLoaded", function() {
    showPerson(currentItem);
  });
  
  // show person based on item
  
  function showPerson(person){
    const item = reviews[person];
    imgfile.src = item.imgfile;
    author.textContent = item.name;
    job.textContent = item.job;
    info.textContent = item.text;
  }

  
  // show prev person
  prevBtn.addEventListener('click', function(){
    currentItem--;
    if(currentItem < 0){
      currentItem = reviews.length - 1;
    }
    showPerson(currentItem);
  });
  
  // show next person
  
  nextBtn.addEventListener('click', function(){
    currentItem++;
    if(currentItem > reviews.length - 1){
      currentItem = 0;
    }
    showPerson(currentItem);
  });
  
  // show random person
  
  randomBtn.addEventListener('click', function(){
    currentItem = Math.floor(Math.random() * reviews.length);
    if(currentItem > reviews.length - 1){
      currentItem = 0;
    }
    showPerson(currentItem);
  });
  
  
  /*----------------------store---------------------------*/

  if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready()  {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')

for (var i=0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)
       
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i=0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)

    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i=0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('thank you for your purchase / ขอบคุณที่มาอุดหนุดค่ะ ')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while(cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target 
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('this item is already added to the cart')
            return
        }
    }
    var cartRowContents =  ` 
        <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('฿', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '฿' + total
}











