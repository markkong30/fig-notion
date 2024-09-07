import { FC } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

type Props = {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label: string;
};

const AddButton: FC<Props> = ({ onClick, isLoading, disabled, label }) => {
  return (
    <Button
      className='flex gap-2'
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled}
    >
      <Plus size={15} />
      {label}
    </Button>
  );
};

export default AddButton;
