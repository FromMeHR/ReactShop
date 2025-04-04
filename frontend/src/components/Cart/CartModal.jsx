import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import Modal from "react-bootstrap/Modal";
import css from "./CartModal.module.css";

const CartModal = ({ show, handleClose }) => {
  const { cart, outOfStockItems, inStockItems, totalPrice, 
    updateCartItem, deleteCartItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (cart.length === 0) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className={`${css["side-modal"]} ${css["fade"]} ${ isVisible ? css["show"] : ""}`}
      dialogClassName={`${css["modal-dialog"]}`} 
      contentClassName={css["modal-content"]}
    >
      <Modal.Header className={css["modal-header"]}>
        <Modal.Title className={css["modal-title"]}>
          Cart
          <span className={css["cart-products-count"]}>
            {cart.length} products
          </span>
          <img
            src={`${process.env.REACT_APP_PUBLIC_URL}/svg/delete.svg`}
            className={css["cart-close-button"]}
            alt="Close"
            onClick={handleClose}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={css["wrapper-cart"]}>
          <div className={css["custom-scroll"]}>
            {outOfStockItems.length > 0 && (
              <div className={css["checkout__delivery-msg_attention"]}>
                <img src={`${process.env.REACT_APP_PUBLIC_URL}/svg/warning.svg`} alt="Warning icon" />
                <p>
                  <strong>Pay attention!</strong>
                </p>
                {outOfStockItems.map((item) => (
                  <p key={item.id}>
                    Product <strong>{item.product_name}</strong> is out of stock.
                  </p>
                ))}
              </div>
            )}
            {cart.map((item) => (
              <div key={item.id} className={css["cart-page__product"]}>
                <div className={css["cart-page__product-row"]}>
                  <div className={css["cart-page__product-picture"]}>
                    <img
                      className="img-fluid"
                      src={`${process.env.REACT_APP_BASE_API_URL}${item.product_image}`}
                      alt={item.product_name}
                    />
                  </div>
                  <div className={css["cart-page__product-column"]}>
                    <a
                      href={`/product-detail/${item.product_slug}`}
                      className={css["cart-page__product-title"]}
                    >
                      {item.product_name}
                    </a>
                  </div>
                  <div className={css["product-counter"]}>
                    <img
                      src={`${process.env.REACT_APP_PUBLIC_URL}/svg/minus.svg`}
                      className={css["product-counter__btn_subtract"]}
                      alt="Minus"
                      onClick={() => {
                        updateCartItem(item.id, Math.max(item.quantity - 1, 1), item.quantity);
                      }}
                    />
                    <input
                      className="form-control text-center" type="text" readOnly
                      value={item.quantity}
                    />
                    <img
                      src={`${process.env.REACT_APP_PUBLIC_URL}/svg/plus.svg`}
                      className={css["product-counter__btn_add"]}
                      alt="Plus"
                      onClick={() => {
                        updateCartItem(item.id, item.quantity + 1);
                      }}
                    />
                  </div>
                  <div className={css["cart-page__product-price"]}>
                    <span>
                      {item.product_quantity > 0
                        ? `${item.product_price * item.quantity} ₴`
                        : "– ₴"}
                    </span>
                  </div>
                  <img
                    src={`${process.env.REACT_APP_PUBLIC_URL}/svg/delete.svg`}
                    className={css["cart-page__product-btn_delete"]}
                    alt="Delete"
                    onClick={() => deleteCartItem(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={css["cart-total"]}>
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className={css["cart-total__row"]}>
                <span className={css["cart-total__label"]}>Total:</span>
                <span className={css["cart-total__value"]}>
                  {totalPrice > 0 ? `${totalPrice} ₴` : "– ₴"}
                </span>
              </div>
            </div>
            {inStockItems.length > 0 && (
              <div className="col-12 col-md-6">
                <button className="btn btn-dark btn-md w-100">Complete the order</button>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CartModal;