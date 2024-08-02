'use client';

import { Box, Stack, Button, TextField, Typography, Modal, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Ensure this path is correct
import { Upload, Search, Delete } from '@mui/icons-material'; // Importing Material-UI icons

const capitalizeFirstLetter = (string) => {
  if (!string) return ''; 
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Home() {
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'pantry'));
      const itemsList = querySnapshot.docs.map((doc) => {
        const itemData = doc.data();
        return {
          id: doc.id,
          name: capitalizeFirstLetter(itemData.name),
          quantity: itemData.quantity,
          image: itemData.image
        };
      });
      setData(itemsList);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };



  

  const handleAddItem = async () => {
    if (itemName && itemQuantity) {
      try {
        const existingItem = data.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (existingItem) {
          const itemRef = doc(firestore, 'pantry', existingItem.id);
          await updateDoc(itemRef, { 
            quantity: existingItem.quantity + parseInt(itemQuantity),
            image: itemImage || existingItem.image
          });
        } else {
          await addDoc(collection(firestore, 'pantry'), { 
            name: itemName, 
            quantity: parseInt(itemQuantity),
            image: itemImage
          });
        }
        setItemName('');
        setItemQuantity('');
        setItemImage('');
        fetchItems();
        handleCloseAdd();
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const itemRef = doc(firestore, 'pantry', id);
      const item = data.find(item => item.id === id);
      if (item.quantity > 1) {
        await updateDoc(itemRef, { quantity: item.quantity - 1 });
      } else {
        await deleteDoc(itemRef);
      }
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setData(filteredData);
    } else {
      fetchItems();
    }
    handleCloseSearch();
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  
  const handleOpenSearch = () => setOpenSearch(true);
  const handleCloseSearch = () => setOpenSearch(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setItemImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#2c2c2c" // Dark grey background color
      padding="16px"
    >
      <Typography variant="h4" color="#fff" marginBottom="16px">Pantry Tracker</Typography>
      <Box
        width="800px"
        bgcolor="#3c3c3c" // Darker grey for the main box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="16px"
        borderRadius="8px"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
        marginBottom="24px"
      >
        <Typography variant="h5" color="white">Pantry Items</Typography>
        <Box>
          <IconButton 
            color="primary" 
            onClick={handleOpenAdd}
            sx={{ marginRight: '8px' }}
          >
            <Upload />
          </IconButton>
          <IconButton 
            color="primary"
            onClick={handleOpenSearch}
          >
            <Search />
          </IconButton>
        </Box>
      </Box>

      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center"
          bgcolor="white" 
          padding="32px" 
          borderRadius="8px" 
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          margin="auto"
          top="20%"
          maxWidth="400px"
          width="100%"
        >
          <Typography variant="h6" marginBottom="16px">Add New Item</Typography>
          <TextField 
            label="Item Name" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <TextField 
            label="Quantity" 
            type="number"
            value={itemQuantity} 
            onChange={(e) => setItemQuantity(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <Button variant="contained" color="primary" component="label" sx={{ marginTop: '16px' }}>
            Upload Image
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={handleImageUpload} 
            />
          </Button>
          {itemImage && (
            <Box
              component="img"
              src={itemImage}
              alt="Uploaded"
              sx={{ width: '100px', height: '100px', marginTop: '16px', borderRadius: '8px' }}
            />
          )}
          <Button variant="contained" color="primary" onClick={handleAddItem} sx={{ marginTop: '16px' }}>
            Add Item
          </Button>
        </Box>
      </Modal>

      <Modal open={openSearch} onClose={handleCloseSearch}>
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center"
          bgcolor="white" 
          padding="32px" 
          borderRadius="8px" 
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          margin="auto"
          top="20%"
          maxWidth="400px"
          width="100%"
        >
          <Typography variant="h6" marginBottom="16px">Search Item</Typography>
          <TextField 
            label="Search Query" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ marginTop: '16px' }}>
            Search
          </Button>
        </Box>
      </Modal>

      <Stack width="800px" spacing={2} marginTop="16px">
        {data.length > 0 ? (
          data.map((item, index) => (
            <Box
              key={index}
              width="100%"
              height="60px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#555" // Grey item color
              color="white"
              padding="0 16px"
              borderRadius="4px"
              boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            >
              <Typography>{item.name}</Typography>
              <Typography>Quantity: {item.quantity}</Typography>
              {item.image && (
                <Box
                  component="img"
                  src={item.image}
                  alt="Item"
                  sx={{ width: '50px', height: '50px', borderRadius: '4px' }}
                />
              )}
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => handleDeleteItem(item.id)}
                startIcon={<Delete />}
              >
                Delete
              </Button>
            </Box>
          ))
        ) : (
          <Box
            width="100%"
            height="60px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="#555"
            color="white"
            fontWeight="bold"
            textAlign="center"
            borderRadius="4px"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          >
            No items available
          </Box>
        )}
      </Stack>
    </Box>
  );
}