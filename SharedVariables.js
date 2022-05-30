import {useState} from 'react';
import {selectCategories} from './Database';

export const useShareableState = () => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [productIngredients, setProductIngredients] = useState([]);

  const handleRefresh = () => {
    setRefresh(() => !refresh);
  };

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
    refresh,
    setRefresh,
    handleRefresh,
    activeProduct,
    setActiveProduct,
    productIngredients,
    setProductIngredients,
  };
};
