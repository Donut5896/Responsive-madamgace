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

/* close links*/
const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links-container");
const links = document.querySelector(".links"); 

// side bar
const toggleBtn = document.querySelector(".sidebar-toggle");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");

//--------- shopping cart----------//
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.shop-items');

let cart = [];
let buttonsDOM = [];

//getting the products
class Products{
  async getProducts(){
    try{
      let result = await fetch('product.json');
      let data = await result.json();

      let products = data.items;
      products = products.map(item => {
        const {title,price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, id, image}
      })
      return products
    }catch(error){
      console.log(error);
    }
  }
}

//display the products

class UI{
  displayProducts(products){
    let result = '';
    products.forEach(product => {
      result += `
                <div class="shop-item">
                    <div class="img-container">
                    <img class="shop-item-image" 
                    src="${product.image}">
                     <button class="bag-btn" data-id="${product.id}">
                         <i class="fa fa-shopping-cart"></i>
                             add to cart
                     </button>
                    </div>
                        <h3>${product.title}</h3> 
                        <h4>฿${product.price}</h4>
                </div>  `;
    });
    productsDOM.innerHTML = result;
  }

  // get add to cart button
    getBagButtons(){
      const buttons = [...document.querySelectorAll(".bag-btn")];
      buttonsDOM = buttons;

      buttons.forEach(button => {
        //get data-id of products
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);

        //disable add to cart buttons from fore twice
        if(inCart){
          button.innerText = "In Cart";
          button.disabled = true;
        }
        button.addEventListener('click', event => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;




          //get matches product.id from local storage
          let cartItem = {...Storage.getProduct(id), amount:1};
          //add product to the cart
          cart = [...cart, cartItem];
          console.log(cart);
         //save cart in local storage
         Storage.saveCart(cart);
         //set cart value
         this.setCartValues(cart);
         //display cart item
         this.addCartItem(cartItem);
          //show cart list when add to cart
          this.showCart();
        });
      
      });
   
    }

   // set cart value
   setCartValues(cart){
     let tempTotal = 0;
     let itemsTotal = 0;
     cart.map(item => {
       tempTotal += item.price * item.amount;
       itemsTotal += item.amount;
     })
     cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
     cartItems.innerText = itemsTotal;
   }
   //display cart item
   addCartItem(item){
     const div = document.createElement('div');
     div.classList.add('cart-item');
     div.innerHTML = `
                        <img src=${item.image} alt="product">
                        <div>
                            <h4>${item.title}</h4>
                            <h5>$${item.price}</h5>
                            <span class="remove-item" data-id=${item.id}>remove</span>
                        </div>
                        <div>
                            <i class="fa fa-chevron-up" data-id=${item.id}></i>
                            <p class="item-amount">${item.amount}</p>
                            <i class="fa fa-chevron-down" data-id=${item.id}></i>
                        </div>   `;
                    
        //append to html
        cartContent.appendChild(div);
   }
   // show the cart lists when adding
   showCart(){
     cartOverlay.classList.add('transparentBcg');
     cartDOM.classList.add('showCart');
   }
   //setup app
   setupApp(){
     cart = Storage.getCart();
     //update cart value and items notification
     this.setCartValues(cart);
     //add old items to cart
     this.populateCart(cart);
     //show cart when loaded
     cartBtn.addEventListener('click', this.showCart);
     //close cart button
     closeCartBtn.addEventListener('click', this.hideCart);
   }
   populateCart(cart){
     cart.forEach(item => this.addCartItem(item));
   }
   hideCart(){
     cartOverlay.classList.remove('transparentBcg');
     cartDOM.classList.remove('showCart');
      
   }
 
   //cart logic setup
   cartLogic(){
      //clear cart
      clearCartBtn.addEventListener('click', () => {
        this.clearCart();
      });
      //18.cart functionality
      cartContent.addEventListener('click', event => {
         //remove button
         if(event.target.classList.contains('remove-item')){
           let removeItem = event.target;
           let id = removeItem.dataset.id

           cartContent.removeChild
           (removeItem.parentElement.parentElement);
           this.removeItem(id);
         }
         //increase and decrease buttons
         else if(event.target.classList.contains('fa-chevron-up')){
           let addAmount = event.target;
           let id = addAmount.dataset.id;
           let tempItem = cart.find(item => item.id === id);
           tempItem.amount = tempItem.amount + 1;
           Storage.saveCart(cart);
           this.setCartValues(cart);
           //update item amount
           addAmount.nextElementSibling.innerText = tempItem.amount;
         }
         else if(event.target.classList.contains('fa-chevron-down')){
           let lowerAmount = event.target;
           let id = lowerAmount.dataset.id;
           let tempItem = cart.find(item => item.id === id);
           tempItem.amount = tempItem.amount - 1;

           //remove item when decrease to zero
           if(tempItem.amount > 0){
             Storage.saveCart(cart);
             this.setCartValues(cart);
             lowerAmount.previousElementSibling.innerText = tempItem.amount;
           }else{
             cartContent.removeChild(lowerAmount.parentElement.parentElement);
             this.removeItem(id);
           }
         }

      })
   }
   //clearCart button
   clearCart(){
     let cartItems = cart.map(item => item.id);
     cartItems.forEach(id => this.removeItem(id))
     console.log(cartContent.children);

     while(cartContent.children.length > 0){
       cartContent.removeChild(cartContent.children[0])
     }
     this.hideCart();
   }
   removeItem(id){
     cart = cart.filter(item => item.id !== id);
     this.setCartValues(cart);
     Storage.saveCart(cart);

     //reset add to cart button
     let button = this.getSingleButton(id);
     button.disabled = false;
     button.innerHTML = `<i class="fa fa-shopping-cart"></i>add to cart`;
   }
   getSingleButton(id){
     return buttonsDOM.find(button => button.dataset.id === id);
   }
   
}
 


// local storage
class Storage{
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id)
  }
  //save cart in local Storage
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  //set up app
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse
    (localStorage.getItem('cart')): []
  }
}







document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();
    //setup app
    ui.setupApp();

    products.getProducts().then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products)
    })
    .then( () => {
      ui.getBagButtons();
      ui.cartLogic();
    })
});











//--------- shopping cart end----------//




//sidebar funtion
toggleBtn.addEventListener("click", function() {

  sidebar.classList.toggle("show-sidebar");
});

closeBtn.addEventListener("click", function() {
  sidebar.classList.remove("show-sidebar")
});


  //fixed nav
  window.addEventListener("scroll", function() {
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});


//-------------------Review-----------------------//
 
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












 /*
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
*/