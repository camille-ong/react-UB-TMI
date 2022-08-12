import React, { Component, useState, useEffect } from "react";
import "./styles.css";
import "./App.css";
import Feedback from "./Feedback";
import "bootstrap/dist/css/bootstrap.min.css";
import background from "./images/background-img.gif";
import bear from "../src/images/bear.jpg";
import bike from "../src/images/bike.jpg";
import boxing from "../src/images/boxing.jpg";
import fingerless from "../src/images/fingerless.jpg";
import leather from "../src/images/leather.jpg";
import medical from "../src/images/medical.jpg";
import mittens from "../src/images/mittens.jpg";

const startingValue = 0;
const productCatalogue = [
  {
    id: 1,
    name: "Bear",
    description: "Bear-y good",
    img: bear,
    price: 1
  },
  {
    id: 2,
    name: "Bike",
    description: "Wheelie good",
    img: bike,
    price: 6.9
  },
  {
    id: 3,
    name: "Boxing",
    description: "A big hit!",
    img: boxing,
    price: 1.5
  },
  {
    id: 4,
    name: "Fingerless",
    description: "Don't let it slip through your fingers",
    img: fingerless,
    price: 3
  },
  {
    id: 5,
    name: "Leather",
    description: "Made of real cow!",
    img: leather,
    price: 300
  },
  {
    id: 6,
    name: "Medical",
    description: "9/10 doctors recommend!",
    img: medical,
    price: 3
  },
  {
    id: 7,
    name: "Mittens",
    description: "They only work inter-mitten-ly.",
    img: mittens,
    price: 2
  }
];

var timer;
export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      basket: {},
      promotion: true
      // countdown: 60000,
    };
  }

  getBasketItems() {
    const uniqueIDs = Object.keys(this.state.basket);

    const items = uniqueIDs.map((id) => {
      const item = this.state.basket[id];
      return {
        id,
        name: this.getProductAttr(id, "name"),
        quantity: item.quantity,
        img: item.img,
        price: this.getProductAttr(id, "price")
      };
    });

    return items;
  }

  getProductAttr(id, attr) {
    for (var i = 0; i < productCatalogue.length; i++) {
      if (productCatalogue[i].id === parseInt(id, 10))
        return productCatalogue[i][attr];
    }
    return "Undefined";
  }

  getProductCatalogue() {
    return productCatalogue.map(({ id, name, description, img, price }) => {
      return (
        <ProductCard
          id={id}
          name={name}
          description={description}
          img={img}
          price={price}
          onBasketAdded={(basketItem) => {
            const newBasket = this.state.basket;
            newBasket[basketItem.id] = {
              quantity: basketItem.quantity,
              img: img,
              price: price
            };
            this.setState({ basket: newBasket });
          }}
        />
      );
    });
  }
  endPromotion() {
    this.setState({ promotion: false });
  }

  render() {
    return (
      <div style={{ backgroundImage: `url(${background})` }} className="App">
        <TitleBar />

        <div className="catalogue">{this.getProductCatalogue()}</div>
        <div className="timer"></div>
        <Basket
          items={this.getBasketItems()}
          isPromoted={this.state.promotion}
        />
        <Promotion onPromotionEnd={() => this.endPromotion()} />
        <Form />
      </div>
    );
  }
}

function Form() {
  return (
    <div className="App">
      <h1>Any questions?</h1>
      <Feedback />
    </div>
  );
}

export default Form;
function Basket(props) {
  let basket;
  let totalPrice = props.items.reduce((previousValue, currentValue) => {
    return currentValue.price * currentValue.quantity + previousValue;
  }, 0);

  if (props.items.length === 0) {
    basket = (
      <div className="basket">
        <strong>Your basket:</strong> <i>Empty</i>
      </div>
    );
  } else {
    let basketPrice;

    if (props.isPromoted) {
      let discountedPrice = totalPrice * 0.5;

      basketPrice = (
        <strong>
          Your basket (
          <MonetaryValue price={discountedPrice} />
          <strike>
            <MonetaryValue price={totalPrice} />
          </strike>
          ):
        </strong>
      );
    } else {
      basketPrice = (
        <strong>
          Your basket (<MonetaryValue price={totalPrice} />
          ):
        </strong>
      );
    }

    basket = (
      <div className="basket">
        {basketPrice}
        <ul>
          {props.items.map((item) => {
            if (item.quantity === 0) return "";
            return (
              <li>
                <div>
                  <strong>
                    Product: {item.name}, <br />${item.price} each,{" "}
                    {item.quantity} {item.quantity > 1 ? "pcs" : "pc"} <br />
                    Total Cost:{" "}
                    <MonetaryValue price={item.price * item.quantity} />
                    <br />
                    <br />
                    <img class="card-img" src={item.img} />
                  </strong>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return basket;
}

function TitleBar() {
  return (
    <header>
      <h1>Like a Glove</h1>
      <p className="page-desc">
        <i>Gloves for all your needs!</i>
      </p>
    </header>
  );
}
function formatTime(mills) {
  const minutes = Math.floor(mills / 60000);
  const seconds = (mills % 60000) / 1000;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
function Promotion() {
  const [countdown, setCountdown] = useState(600000);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown === 0) return;
      setCountdown(countdown - 1000);
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div className="promotion">
      Get 50% off when you check out within <b>{formatTime(countdown)}</b>
    </div>
  );
}

function MonetaryValue(props) {
  const numberFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP"
  });
  const displayPrice = numberFormatter.format(props.price);

  return <strong className="price">{displayPrice}</strong>;
}

export class QuantityBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuantity: props.initialValue
    };
  }

  changeQuantity(value) {
    this.setState({ currentQuantity: value }, () =>
      this.props.onQuantityUpdate(value)
    );
  }

  addQuantity() {
    this.changeQuantity(this.state.currentQuantity + 1);
  }

  removeQuantity() {
    if (this.state.currentQuantity > 0) {
      this.changeQuantity(this.state.currentQuantity - 1);
    }
  }

  editQuantity(value) {
    if (!isNaN(parseInt(value, 10))) {
      this.changeQuantity(parseInt(value, 10));
    }
  }

  render() {
    return (
      <div className="quantity-box">
        <button onClick={() => this.addQuantity()}>+</button>
        <input
          type="text"
          defaultValue={this.state.currentQuantity}
          value={this.state.currentQuantity}
          onChange={(event) => this.editQuantity(event.target.value)}
        />
        <button onClick={() => this.removeQuantity()}>-</button>
      </div>
    );
  }
}

export class ProductCard extends Component {
  constructor({ name, description, img, price }) {
    super({ name, description, img, price });

    this.state = {
      quantity: 0,
      price: 0
    };
  }

  updateQuantity(value) {
    const basketItem = { id: this.props.id, quantity: value };
    this.setState({ quantity: value }, () =>
      this.props.onBasketAdded(basketItem)
    );
  }

  render() {
    return (
      <div className="product-card">
        <h3>{this.props.name}</h3>
        <p>
          <i>{this.props.description}</i>
        </p>
        Price: <MonetaryValue price={this.props.price} />
        <p>
          <img class="card-img" src={this.props.img} />
        </p>
        <p>Items bought: {this.state.quantity}</p>
        <QuantityBox
          initialValue={startingValue}
          onQuantityUpdate={(value) => this.updateQuantity(value)}
        />
      </div>
    );
  }
}

/**
 
(event) => --

 */
