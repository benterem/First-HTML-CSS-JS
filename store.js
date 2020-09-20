/** We need to make sure html document finished loading before we access elements */
if(document.readyState == 'loading'){
    /**if not done loading, run ready, also if done loading which is why it appear in if and else */
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}


/*
*Makes sure that the accessing the elements will work, even if page didn't load yet 
*As it waits for the event in the listener
*/
function ready(){
    var removeCartItemButton = document.getElementsByClassName("btn-danger") // returns all elements in 'btn-danger' class, in a list
/* we want to add right event listeners to them loop all buttons in our cart*/
    for(var i = 0; i < removeCartItemButton.length; i++){
        var button = removeCartItemButton[i] 
        /* 1) adds event listener - when event, do something... 
        2) in out case when 'click', call on function...
        3) event listener always returns event object, which has a property called target
            target: essentially the button that we clicked on (i.e. which specfic remove button)
        4) we saved event.target in variable buttonClicked. We want to get the cart row the button from HTML
        5) we add an invocation to the function that will update the total 
        */
        button.addEventListener('click', removeCartItem) 
    }

    /*
     * Now we want to add the functionality of quantity changing cart total
     * We also want to limit quantity to  > 0 , we need to access the quantity input
     * We loop over them
     */
    var quantityInputs = document.getElementsByClassName('cart-quantity-in')
    for(var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i]
        /* we add an event listener to each time we change the value, we call quantityChanged function */
        input.addEventListener('change', quantityChanged)
    }

    /*
    * ADD TO CART FUNCTIONALITY
     */

    var addToCartButtons = document.getElementsByClassName('shop-item-btn')
    for(var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}   

function purchaseClicked(){
    alert("Thanks for your purchase!")
    /*we want to clear cart (delete all items) */
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event){
    var input = event.target
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-img')[0].src
    console.log(title, price)
    addItemToCart(title, price, imageSrc)
    updateCartTotal()

}

function addItemToCart(title, price, imgSrc){
    var cartRow = document.createElement('div')
    /* We are building a new html code, so we need to give it the right class so it will be formatted correctly*/
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    /**We want to get all the items in cart, so we don't make duplicated and instead increment the value atribute */
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for(var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            /**Notify user that we are incrementing value  */
            alert('This item is already added to the cart')
            return //we stop executing here
        }
    }
    /* special ` ` makes multi line comments, also allows us to put variable directly into our code, 
     * we build html to put new row in cart, with the right format */
    var cartRowContents = ` 
    <div class="cart-item cart-col">
        <img class= "cart-item-img" src=${imgSrc} width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-col">${price}</span>
    <div class="cart-quantity cart-col">
        <input class="cart-quantity-in" type="number" value="1">
        <button class= "btn btn-danger" type="button">REMOVE</button>
    </div>
    `
    cartRow.innerHTML = cartRowContents
    /* appends our newly created cart row to out cart */
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-in')[0].addEventListener('change', quantityChanged)
}

//document object: object that js gives to the page
//everything in html file, has methods for quering diff objects and adding objects on page

/* updates the cart total, invoked after removal 
   1) in this function we want to go through each row in cart, and get quantity*price and add to total
   2) we create a variable cartItemContainer that holds the elements that have class name 'cart-items'
      as they wrap all the rows inside our cart
 */
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]    /* only need first one */
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')         /* we want to access the indiviual rows */  
    var total = 0
    for(var i = 0; i < cartRows.length; i++){        
        var cartRow = cartRows[i]                                               /*current row*/ 
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]      /** Returns a list with the elements of the specified class */
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-in')[0]
        console.log(priceElement, quantityElement) 
        /*
         * First we use .innerText to get the actual price, 
         * we use .replace to get the float w/o the '$' so we can do math
         * finally, we use parseFloat to make it a float
         **/
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        /** Since its an <input> we want to get value attribute */
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    /** Set the actual total in the html to be total variable with a  '$' */
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}