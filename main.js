
  
// close links
const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links-container");
const links = document.querySelector(".links"); 

// side bar
const toggleBtn = document.querySelector(".sidebar-toggle");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");

//shopping cart
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


//--------- shopping cart----------//

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






//------------sidebar funtion-----------------//
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
 
import reviews from './reviews.js';

  const imgfile = document.getElementById("person-img");
  const author = document.getElementById("author");
  const job = document.getElementById("job");
  const info = document.getElementById("info");
  
  const prevBtn = document.querySelector('.prev-btn');
  const randomBtn = document.querySelector('.random-btn');
  const nextBtn = document.querySelector('.next-btn');
  const Container = document.querySelector('.reviews-container');




  Container.innerHTML = reviews.map( (person, sildeIndex) => {
    const {id, name, job, imgfile, text} = person;
    
    // set position
    let position = 'next';
    if(sildeIndex === 0){
      position = 'active';
    }
    if(sildeIndex === reviews.length - 1){
      position = 'last';
    }
    // display review
    return `
                <div class="review ${position}">
                    <div class="image-container">
                      <img class="img" src="${imgfile}" id="${id}" alt="${name}" >
                    </div>
                    <h4 id="author">${name}</h4>
                    <p id="job">${job}</p>
                    <p id="info">
                        ${text}
                    </p>
                    
                </div>`;
  }).join('');


  const startSlider = (type) => {
    console.log(type);
    const active = document.querySelector('.active');
    const last = document.querySelector('.last');
    let next = active.nextElementSibling;
    
    //when run out of next slide
    if(!next){
      next = Container.firstElementChild
    }

    //to remove class
    active.classList.remove(['active']);
    last.classList.remove(['last']);
    next.classList.remove(['next']);

    //previous button
    if(type === 'prev'){
        active.classList.add('next');
        last.classList.add('active');
        next = last.previousElementSibling;
        if(!next){
          next = Container.lastElementChild;
        }
        // set new 'next' class
        next.classList.remove(['next']);
        next.classList.add(['last']);
        return;

    }



    //to add class
    active.classList.add(['last']);
    last.classList.add(['next']);
    next.classList.add(['active']);
  }




nextBtn.addEventListener('click', () => {
    startSlider();
  })
  prevBtn.addEventListener('click',  () => {
    startSlider('prev');
  })

 


  
 
  

/*class Reviews{
 async getReviews(){
    try{
        let result = await fetch('reviews.json');
        let data = await result.json();

        let reviews = data.items;
        
        reviews  = reviews.map(item => {
            const {name = item.name;
            const id = item.id;
            const image = item.imgfile;
            return {name, id, imagefile}
            
        })
      
        return reviews
       
    }catch(error){
        console.log(error);
    }
  
  
  }
} 




// display person reviews
 class UserInterface{
 showPerson(reviews){
      let person = '';
      reviews.forEach(review => {
        person += `
               <div class="review">
                    <div class="img-container">
                    <img src="${review.imgfile}" id="${review.id}" alt="" >
                    </div>
                    <h4 id="${review.name}">sara jones</h4>
                    <p id="${review.job}">UX Designer</p>
                    <p id="${review.text}">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Maecenas convallis nibh erat, ac sollicitudin quam dictum ullamcorper. 
                        Vivamus ultricies, ex sit amet consequat iaculis, erat tellus maximus leo, 
                        ac faucibus purus sapien quis diam. Proin gravida, sapien scelerisque
                    </p>
                  
                </div>`;
                  
      })
      reviewsDOM.innerHTML = person;
     
    }
 
}

 console.log(reviewsDOM)

 /*
   // show prev person
  prevBtn.addEventListener('click', function(){
    currentItem--;
    if(currentItem < 0){
      currentItem = Reviews.length - 1;
    }
    showPerson(currentItem);
  });

  // show next person
  
  nextBtn.addEventListener('click', function(){
    currentItem++;
    if(currentItem > Reviews.length - 1){
      currentItem = 0;
    }
    showPerson(currentItem);
  });



 // show random person
  
  randomBtn.addEventListener('click', function(){
    currentItem = Math.floor(Math.random() * Reviews.length);
    if(currentItem > Reviews.length - 1){
      currentItem = 0;
    }
    showPerson(currentItem);
  });
  */


   

 

  // show person based on item
  /* document.addEventListener("DOMContentLoaded", () =>  {
     const ui =  new UserInterface();
    const reviews = new Reviews();

    reviews.getReviews().then(reviews => {
      ui.displayPerson(reviews);
    })
  }); */
   
