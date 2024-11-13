import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';

const ModalForm = ({
  isOpen,
  onClose,
  onSave,
  title = 'Form Modal',
  saveText = 'Save',
  cancelText = 'Cancel',
  children,
  isSaveDisabled = () => false
}) => {

  const [saveDisabled, setSaveDisabled] = useState(false);
  useEffect(() => {
    setSaveDisabled(isSaveDisabled());
  }, [isSaveDisabled]);

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          boxShadow: 24,
          maxWidth: '500px',
          width: '100%',
          borderRadius: 2,
          outline: 'none',
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
          {title}
        </Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {children}
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="contained" disabled={saveDisabled} onClick={onSave}>
            {saveText}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalForm;
