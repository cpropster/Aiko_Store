/* eslint-disable max-statements */
import React, { useState, useEffect } from "react";
import {
  Container,
  Col,
  Row,
  Image,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Carousel,
} from "react-bootstrap";
import axios from "axios";
import Product from "./Product";

const ProductDetails = (props) => {
  const id = props.match.params.id;
  const { addToCart } = props;
  // const { toggleSearch } = props;
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [productVs, setProductVs] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [sizeVs, setSizeVs] = useState([]);
  const [colorVs, setColorVs] = useState([]);
  const [activePV, setActivePV] = useState({});
  const [activeColor, setActiveColor] = useState("");
  const [activeSize, setActiveSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [arrCarProds, setArrCarProds] = useState([]);
  const [arrCar, setArrCar] = useState([]);

  const pushArrCarr = () => {
    const arrCaro = [];
    const size = 3;
    const arrCaroTemp = [];
    arrCarProds.forEach((prod) => {
      if (prod.id !== product.id) {
        arrCaroTemp.push(prod);
      }
    });
    while (arrCaroTemp.length > 0) arrCaro.push(arrCaroTemp.splice(0, size));
    return arrCaro;
  };

  const _addToCart = async (ev) => {
    ev.preventDefault();
    // activePV.avail = activePV.avail - quantity;
    // await addToCart(activePV, quantity);
    // setQuantity(0);
    props.history.push("/contactUs");
  };

  const acSet = (ev) => {
    setActiveColor(ev.target.value);
    setActiveSize(sizeVs[0].size);
  };

  const asSet = (ev) => {
    setActiveSize(ev.target.value);
  };

  const createMarkup = () => {
    return { __html: product.description };
  };

  useEffect(() => {
    // if (
    //   !document.querySelector("#searchDisplay").classList.contains("hidden")
    // ) {
    //   toggleSearch();
    // }
    axios
      .get("/api/products")
      .then((products) =>
        setProduct(
          products.data.find((_product) => {
            return `:${_product.id}` === id;
          }) || {}
        )
      )
      .catch();
  }, []);

  useEffect(() => {
    if (product && product.id) {
      axios
        .get("/api/productVariants")
        .then((response) =>
          setProductVs(
            response.data.filter((productV) => {
              return productV.productId === product.id;
            }) || []
          )
        )
        .catch();
    }
  }, [product]);

  useEffect(() => {
    if (productVs.length && product.id) {
      axios
        .get("/api/productVariants")
        .then((response) =>
          setColorVs(
            response.data.reduce((acc, productV) => {
              if (
                !acc.find((colorV) => {
                  return productV.color === colorV.color;
                }) &&
                productV.productId === product.id
              ) {
                acc.push(productV);
                setActiveColor(acc[0].color);
              }
              return acc;
            }, []) || []
          )
        )
        .catch();
    }
  }, [productVs]);

  useEffect(() => {
    if (productVs.length && product.id) {
      axios
        .get("/api/productVariants")
        .then((response) =>
          setSizeVs(
            response.data.reduce((acc, productV) => {
              if (
                !acc.find((sizeV) => {
                  return productV.size === sizeV.size;
                }) &&
                productV.color === activeColor
              ) {
                acc.push(productV);
                setActiveSize(acc[0].size);
              }
              return acc;
            }, []) || []
          )
        )
        .catch();
    }
  }, [activeColor]);

  useEffect(() => {
    if (activeColor && activeSize) {
      axios
        .get("/api/productVariants")
        .then((response) =>
          setActivePV(
            response.data.find((pv) => {
              return (
                pv.color === activeColor &&
                pv.size === activeSize &&
                pv.productId === product.id
              );
            }) || {}
          )
        )
        .catch();
    }
  }, [activeSize && activeColor]);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((response) => setProducts(response.data || []));
  }, []);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((response) => setArrCarProds(response.data || []));
  }, [activeSize && activeColor]);

  useEffect(() => {
    if (arrCarProds.length) {
      axios
        .get("/api/products")
        .then((response) => setArrCar(pushArrCarr(response.data || [])));
    }
  }, [arrCarProds]);

  useEffect(() => {
    axios
      .get("/api/productVariants")
      .then((response) => setProductVariants(response.data || []));
  }, [products]);

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={6}>
          <div className="prod-det-cont">
            <Image src={activePV && activePV.image} fluid />
          </div>
        </Col>
        <Col md={6}>
          <Form>
            <h1>{product.name}</h1>
            {product.brand}
            <br />
            <hr />
            <div dangerouslySetInnerHTML={createMarkup()} />
            <br />
            {sizeVs.length && (
              <>
                <h5>Size</h5>
                <ToggleButtonGroup
                  type="radio"
                  name="sizes"
                  defaultValue={sizeVs[0].size}
                >
                  {sizeVs.map((sizeV) => {
                    return (
                      <ToggleButton
                        key={sizeV.id}
                        value={sizeV.size}
                        onClick={asSet}
                        className="product-toggles"
                      >
                        {sizeV.size}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              </>
            )}
            <br />
            <br />
            {colorVs.length && (
              <>
                <h5>Color: {activeColor} </h5>
                <ToggleButtonGroup
                  type="radio"
                  name="sizes"
                  defaultValue={colorVs[0].color}
                >
                  {colorVs.map((colorV) => {
                    return (
                      <ToggleButton
                        className="pdColorButton product-toggles"
                        key={colorV.id}
                        value={colorV.color}
                        onClick={acSet}
                      >
                        <Image src={colorV.image} thumbnail />
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              </>
            )}
            <br />
            <br />
            <Form.Label>Choose Quantity</Form.Label>
            <Form.Control
              placeholder="Quantity"
              key={product.id}
              value={quantity}
              onChange={(ev) => setQuantity(ev.target.value * 1)}
              id={product.id}
              type="number"
              name="quantity"
              min="0"
              max={product.avail}
            />

            <button type="button" disabled={!quantity} onClick={_addToCart}>
              Add to Cart
            </button>
          </Form>
        </Col>
      </Row>
      <Row>
        <h2>Related Products</h2>
      </Row>
      {arrCar.length && (
        <Carousel className="align-center" touch="true">
          {arrCar.map((prodArr, i) => {
            return (
              <Carousel.Item
                key={i}
                className="justify-content-center flex-md-row"
              >
                <Row className="d-flex justify-content-center">
                  {prodArr.map((prod) => {
                    if (prod.id !== product.id) {
                      return (
                        <Col
                          md={3}
                          className="list-unstyled rel-prod-cont d-flex justify-content-center"
                          key={prod.id}
                        >
                          <Product
                            product={prod}
                            productVariants={productVariants}
                            addToCart={addToCart}
                          />
                        </Col>
                      );
                    }
                  })}
                </Row>
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </Container>
  );
};

export default ProductDetails;
