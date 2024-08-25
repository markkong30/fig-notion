import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { UserRole } from '@prisma/client';
import { Eye, Pencil, ShieldCheck } from 'lucide-react';

type Props = {
  role: UserRole;
  hasRights: boolean;
  isAbsolute?: boolean;
  onRoleChange: (role: UserRole) => void;
};

const iconProps = {
  size: 16,
};

const userRoles = [
  {
    label: 'Admin',
    value: UserRole.ADMIN,
    icon: <ShieldCheck {...iconProps} />,
  },
  {
    label: 'Read & Write',
    value: UserRole.READ_WRITE,
    icon: <Pencil {...iconProps} />,
  },
  {
    label: 'Read Only',
    value: UserRole.READ,
    icon: <Eye {...iconProps} />,
  },
];

const RoleSelector = ({ role, hasRights, isAbsolute, onRoleChange }: Props) => {
  return (
    <div className={cn(isAbsolute && 'absolute right-0 z-50')}>
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger
          className='shad-select focus:ring-0'
          disabled={!hasRights}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='border-none'>
          {userRoles.map(({ label, value, icon }) => (
            <SelectItem
              key={value}
              value={value}
              className='shad-select-item boder-b-input'
            >
              <span className='flex items-center gap-2'>
                <span>{icon}</span>
                <span>{label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
