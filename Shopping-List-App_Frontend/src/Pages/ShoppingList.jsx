import React, { useState, useEffect } from 'react';
import './ShoppingList.css'; 
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://shopping-list-app-c801a-default-rtdb.firebaseio.com/lists.json');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const fetchedItems = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setItems(fetchedItems);
        }
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await fetch('https://shopping-list-app-c801a-default-rtdb.firebaseio.com/lists.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: inputValue, purchased: false, description, imageUrl }),
        });
        if (response.ok) {
          const data = await response.json();
          const newItem = { id: data.name, name: inputValue, purchased: false, description, imageUrl };
          setItems([...items, newItem]);
          setInputValue('');
          setDescription('');
          setImageUrl('');
          toast.success('Item added successfully!');
        } else {
          console.error('Failed to add item');
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const togglePurchased = async (id) => {
    try {
      const itemToToggle = items.find((item) => item.id === id);
      if (itemToToggle) {
        const updatedItem = { ...itemToToggle, purchased: !itemToToggle.purchased };
        await fetch(`https://shopping-list-app-c801a-default-rtdb.firebaseio.com/lists/${id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purchased: updatedItem.purchased }),
        });
        setItems(items.map((item) => (item.id === id ? updatedItem : item)));
        updatedItem.purchased ? toast.success(`Item "${updatedItem.name}" is selected!`) : toast.info(`Item "${updatedItem.name}" is not selected!`);
      }
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const editItemHandler = (id, name, description, imageUrl) => {
    setEditItem({ id, name, description, imageUrl });
    setInputValue(name);
    setDescription(description);
    setImageUrl(imageUrl);
  };

  const updateItem = async () => {
    if (editItem && inputValue.trim() !== '') {
      try {
        await fetch(`https://shopping-list-app-c801a-default-rtdb.firebaseio.com/lists/${editItem.id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: inputValue, description, imageUrl }),
        });
        setItems(items.map((item) => (item.id === editItem.id ? { ...item, name: inputValue, description, imageUrl } : item)));
        setInputValue('');
        setDescription('');
        setImageUrl('');
        setEditItem(null);
        toast.success('Item updated successfully!');
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditItem(null);
    setInputValue('');
    setDescription('');
    setImageUrl('');
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`https://shopping-list-app-c801a-default-rtdb.firebaseio.com/lists/${id}.json`, {
        method: 'DELETE',
      });
      setItems(items.filter((item) => item.id !== id));
      toast.error('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container">
      <div className="input-container">
        <h2>Shopping List</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter item"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
        />
        {editItem ? (
          <div>
            <button onClick={updateItem} className="update-button">
              <FaEdit /> Update
            </button>
            <button onClick={cancelEdit} className="cancel-button">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={addItem}>
            Add Item
          </button>
        )}
      </div>
      <div className="card-container">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.imageUrl} alt={item.name} />
            <div className="details">
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => togglePurchased(item.id)}
              />
              <span>{item.name}</span>
              <p>{item.description}</p>
            </div>
            {!item.purchased && (
              <div className="actions">
                <button className="edit" onClick={() => editItemHandler(item.id, item.name, item.description, item.imageUrl)}>
                  <FaEdit /> 
                </button>
                <button className="delete" onClick={() => deleteItem(item.id)}>
                  <MdDelete /> 
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>   
  );
};

export default ShoppingList;

