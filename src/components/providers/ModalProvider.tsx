'use client';
import { User } from '@prisma/client';
import { createContext, useContext, useEffect, useState } from 'react';
import Spinner from '../global/Spinner';
import CustomModal from '../global/CustomModal';

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
};

type ModalMetaData = {
  title: string;
  subheading: string;
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateModalData: (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>,
  ) => void;
  setModalMeta: (meta: ModalMetaData) => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
  isLoading: false,
  setIsLoading: () => {},
  updateModalData: async () => {},
  setModalMeta: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSubheading, setModalSubheading] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>,
  ) => {
    if (modal) {
      updateModalData(modal, fetchData);
      setIsOpen(true);
    }
  };

  const updateModalData = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>,
  ) => {
    if (fetchData) {
      setData({ ...data, ...(await fetchData()) } || {});
    }
    setShowingModal(modal);
  };

  const setModalMeta = ({ title, subheading }: ModalMetaData) => {
    setModalTitle(title);
    setModalSubheading(subheading);
  };

  const setClose = () => {
    setIsOpen(false);
    setIsLoading(false);
    setData({});
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider
      value={{
        data,
        setOpen,
        setClose,
        isOpen,
        isLoading,
        setIsLoading,
        updateModalData,
        setModalMeta,
      }}
    >
      <CustomModal
        title={modalTitle}
        subheading={modalSubheading}
        isOpen={isOpen}
        onClose={setClose}
      >
        {showingModal}
        {isLoading && isOpen && <Spinner size={40} withMask />}
      </CustomModal>

      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within the modal provider');
  }
  return context;
};

export default ModalProvider;
