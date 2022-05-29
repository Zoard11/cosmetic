import {useState} from 'react';

export const useShareableState = () => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState(['sampon1', 'kezkrem1']);
  const [selectedCategory, setSelectedCategory] = useState();
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeProductName, setActiveProductName] = useState(null);
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
    activeProductName,
    setActiveProductName,
    productIngredients,
    setProductIngredients,
  };
};
