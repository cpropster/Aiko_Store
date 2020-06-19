import React, { useState } from "react";
import { Image, Card } from "react-bootstrap";

const Product = ({ product, productVariant, addToCart }) => {
  console.log("product v in product ", productVariant);
  return (
    <li key={product.id}>
      <a href={`/#/product:${product.id}`}>
        <Card border="light" href={`/product:${product.id}`} className="mb-5">
          <Image src={productVariant.image} fluid />
          <span>{product.name}</span>
          <span>${Number(productVariant.price).toFixed(2)}</span>
        </Card>
      </a>
    </li>
  );
};

export default Product;
