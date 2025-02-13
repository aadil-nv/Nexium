import { Modal, Button } from 'antd';

interface InfoModalProps {
  title?: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Information({ 
  title = 'Information', 
  content, 
  isOpen, 
  onClose 
}: InfoModalProps) {
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
}

