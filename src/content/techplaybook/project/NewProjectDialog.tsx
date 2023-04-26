import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
  } from '@mui/material';
  import { useState } from 'react';
//   import api from '../services/api';
  
  interface NewProjectDialogProps {
    open: boolean;
    onClose: () => void;
  }
  
    export default function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
  
    const handleCreate = async () => {
      try {
        const response = await api.post('/projects', {
          name,
          description,
        });
  
        console.log('Project created:', response.data);
        setName('');
        setDescription('');
        onClose();
      } catch (error) {
        console.error('Error creating project:', error);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter project name and description</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Project Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  }