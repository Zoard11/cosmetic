import {useState} from 'react';
import {selectCategories} from './Database';

export const useShareableState = () => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [productIngredients, setProductIngredients] = useState([]);
  const [refresh, setRefresh] = useState(false);

  return {
    image,
    setImage,
    ingredients,
    setIngredients,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    products,
    setProducts,
    activeProduct,
    setActiveProduct,
    productIngredients,
    setProductIngredients,
    refresh,
    setRefresh,
  };
};
